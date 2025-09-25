'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Permanent_Marker } from 'next/font/google';
import { BackgroundGradient } from "./background-gradient";
import { InteractiveHoverButton } from "./intractiveHoverBtn";
import { useState } from "react";
import { RippleButton } from "./rippleBtn";

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  salary: string;
  link: string;
  companyLogo: string;
  title: string;
  description: string;
  bio: string;
  subtitle?: string;
  rotate?: "x" | "y";
}

const bangers = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
});

export default function FlipCard({
  image,
  link,
  bio,
  salary,
  title,
  companyLogo,
  description,
  subtitle,
  rotate = "y",
  className,
  ...props
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hover, setHover] = useState(false);

  const rotationClass = {
    x: isFlipped ? "[transform:rotateX(180deg)]" : "",
    y: isFlipped ? "[transform:rotateY(180deg)]" : "",
  };

  const self = rotationClass[rotate];

  function handleHover() {
    setHover(true)
  }

  function handleLeave() {
    setHover(false);
  }

  return (
    <BackgroundGradient>
      <div
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        className={cn("h-[30rem] w-[20rem]  lg:h-[30rem] lg:w-[24rem] [perspective:1000px]", className)}
        {...props}
      >
        <div
          className={cn(
            "relative h-full rounded-sm bg-[#EDEADE] transition-all duration-500 [transform-style:preserve-3d]",
            self
          )}
        >
          {/* Overlay with Flip Button */}
          <motion.div
            style={{ visibility: hover && !isFlipped ? "visible" : "hidden" }}
            className="bg-white hidden z-40 absolute h-full w-full lg:flex justify-center items-center"
          >
            <InteractiveHoverButton
              className="text-transparent bg-transparent "
              onClick={() => setIsFlipped(true)}
            >
              View
            </InteractiveHoverButton>
          </motion.div>

          {/* Front */}
          <motion.div
            // whileHover={{ filter: "blur(30px)"}}
            className="absolute p-5 [backface-visibility:hidden]"
          >
            <img
              src={image}
              alt="image"
              className="h-full w-full rounded-sm object-cover shadow-2xl shadow-black/70"
            />
            <div className="flex justify-center items-center mt-5 gap-10">
              <img
                src={companyLogo}
                width={60}
                className="relative left-0 object-cover"
                alt=""
              />
              <div
                className={`flex flex-col justify-center items-center 
                text-xl mt-4 md:mt-0  md:text-2xl text-black`}
              >
                <h1 className={`${bangers.className}`}>{title}</h1>
                <h4 className="text-sm">{bio}</h4>

              </div>
            </div>
              <RippleButton
              rippleColor="#ADD8E6"
              className="z-0 text-white lg:hidden font-mono w-full -bottom-3 text-[1rem] "
              onClick={() => setIsFlipped(true)}
            >
              View
            </RippleButton>
          </motion.div>

          {/* Back */}
          <div
            className={cn(
              "absolute  h-full w-full rounded-sm bg-black/80 p-4 text-slate-200 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            )}
          >
            <div className="flex min-h-full flex-col gap-2">
              <span className="flex justify-between items-center gap-3">
                <h1 className="text-xl font-bold text-white">{subtitle}</h1>
                <img className="size-16 object-cover" src={companyLogo} alt="" />
              </span>
              <p className="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                {description}
              </p>
              <span className="flex flex-col">
                <h1 className="bg-[#EDEADE] text-black p-1 rounded-sm mt-5 w-28 h-8 font-mono">
                  {salary}
                </h1>
                <motion.button
                  onClick={() => window.location.href = link}
                  whileHover={{ scale: 1.1 }}
                  className="mt-3 w-20 p-1 text-sm font-mono bg-[#0077B5] rounded-sm"
                >
                  LinkedIn
                </motion.button>
                <div className="absolute z-50 bottom-4 flex justify-center items-center">
                <InteractiveHoverButton
                  onClick={() => {setIsFlipped(state => !state)}}
                  className="mt-2  text-black w-25"
                >
                  Back
                </InteractiveHoverButton>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
}
