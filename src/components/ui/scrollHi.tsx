"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "framer-motion"

interface ScrollHighlightTextProps {
  text: string
  title?: string
  className?: string
  highlightColor?: string
  textSize?: string
  containerHeight?: string
}

export function ScrollHighlightText({
  text,
  title,
  className = "",
  highlightColor = "bg-yellow-200",
  textSize = "text-lg",
  containerHeight = "min-h-screen",
}: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [highlightProgress, setHighlightProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.3"],
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setHighlightProgress(Math.min(latest, 1))
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  const words = text.split(" ")
  const totalWords = words.length

  return (
    <div ref={containerRef} className={`${containerHeight} flex items-center justify-center px-8 ${className}`}>
      <div className="max-w-4xl">
        {title && (
          <motion.h2
            className="text-3xl font-bold text-slate-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}

        <p ref={textRef} className={`${textSize} leading-relaxed text-slate-700`}>
          {words.map((word, index) => {
            const wordProgress = index / totalWords
            const isHighlighted = highlightProgress > wordProgress

            return (
              <motion.span
                key={index}
                className={`inline-block mr-2 px-1 rounded transition-all duration-300 ${
                  isHighlighted ? `${highlightColor} text-slate-800 shadow-sm` : "text-slate-700"
                }`}
                initial={{ backgroundColor: "transparent" }}
                animate={{
                  backgroundColor: isHighlighted
                    ? highlightColor === "bg-yellow-200"
                      ? "#fef08a"
                      : "#fef08a"
                    : "transparent",
                  scale: isHighlighted ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            )
          })}
        </p>

        {/* Progress indicator */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Highlighting Progress</span>
            <span>{Math.round(highlightProgress * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-yellow-400 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${highlightProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
