"use client"

import { useState, useEffect } from "react"
import { Play, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedVariant = animationVariants[animationStyle]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVideoOpen(false)
    }
    if (isVideoOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [isVideoOpen])

  return (
    <div className={cn("relative w-full aspect-video rounded-xl ring-2 ring-neutral-700 shadow-2xl group", className)}>
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-50 blur transition duration-500 pointer-events-none"></div>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <button
          type="button"
          aria-label="Play video"
          className="absolute inset-0 w-full h-full cursor-pointer flex justify-center items-center p-0 border-0 bg-transparent z-10"
          onClick={() => setIsVideoOpen(true)}
        >
          <img
            src={thumbnailSrc}
            alt={thumbnailAlt}
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out group-hover:brightness-[0.8]"
          />
          <div className="absolute inset-0 flex scale-[0.9] items-center justify-center transition-all duration-300 ease-out group-hover:scale-100">
            <div className="bg-white/10 flex size-20 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300">
              <div
                className={`from-white/20 to-white/5 relative flex size-14 scale-100 items-center justify-center rounded-full bg-gradient-to-tr shadow-xl transition-all duration-300 ease-out group-hover:scale-[1.1]`}
              >
                <Play
                  className="size-6 scale-100 fill-white text-white transition-transform duration-300 ease-out group-hover:scale-110"
                  style={{
                    filter:
                      "drop-shadow(0 4px 3px rgb(0 0 0 / 0.3)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.2))",
                  }}
                />
              </div>
            </div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 md:p-10"
            onClick={() => setIsVideoOpen(false)}
          >
            <div className="relative w-full max-w-4xl aspect-video mx-4 md:mx-0">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-16 right-0 p-2 bg-neutral-900/50 hover:bg-neutral-900/80 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md border border-white/10 z-[10000]"
              >
                <XIcon className="size-6" />
              </button>
              <motion.div
                {...selectedVariant}
                onClick={(e) => e.stopPropagation()}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-full h-full rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden"
              >
                <iframe
                  src={`${videoSrc}${videoSrc.includes('?') ? '&' : '?'}autoplay=1`}
                  title="Hero Video player"
                  className="w-full h-full"
                  style={{ border: '0' }}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
