"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

interface MouseEvent {
  preventDefault: () => void;
  clientX: number;
}

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { left, width: localWidth } =
        cardRef.current.getBoundingClientRect();
      setLeft(left);
      setLocalWidth(localWidth);
    }
  }, []);

  function mouseMoveHandler(event: MouseEvent) {
    event.preventDefault();

    const { clientX } = event;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }

  function mouseEnterHandler() {
    setIsMouseOver(true);
  }

  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    event.preventDefault();
    const clientX = event.touches[0]!.clientX;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;
  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "bg-transparent  max-w-[80rem] rounded-lg p-4 sm:p-8 relative overflow-hidden flex justify-center items-center",
        className
      )}
    >
      {children}

      <div className="h-40 relative flex items-center overflow-hidden">
        <motion.div
          style={{
            width: "100%",
          }}
          animate={
            isMouseOver
              ? {
                  opacity: widthPercentage > 0 ? 1 : 0,
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
          }
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute bg-black z-20 will-change-transform"
        >
          <p
            style={{
              textShadow: "4px 4px 15px rgba(0,0,0,0.5)",
            }}
            className="text-xl sm:text-[3rem] py-10 font-bold text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300 text-center px-4"
          >
            {revealText}
          </p>
        </motion.div>
        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            rotate: `${rotateDeg}deg`,
          }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.2 }}
          className="h-40 w-[7px] bg-black absolute z-50 will-change-transform [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]"
        ></motion.div>

        <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)] w-full">
          <p className="text-xl sm:text-[3rem] py-10 font-bold bg-clip-text text-transparent bg-slate-300 text-center px-4">
            {text}
          </p>
          <MemoizedStars />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={twMerge("text-white text-lg mb-2", className)}>
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>
  );
};

const Stars = () => {
  const [stars, setStars] = useState<Array<{
    top: number;
    left: number;
    opacity: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const randomMove = () => Math.random() * 4 - 2;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();

    const newStars = Array.from({ length: 80 }, () => ({
      top: random() * 100,
      left: random() * 100,
      opacity: randomOpacity(),
      duration: random() * 10 + 20,
    }));

    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${star.top}% + ${Math.random() * 4 - 2}px)`,
            left: `calc(${star.left}% + ${Math.random() * 4 - 2}px)`,
            opacity: star.opacity,
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: "2px",
            height: "2px",
            backgroundColor: "white",
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block"
        />
      ))}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
