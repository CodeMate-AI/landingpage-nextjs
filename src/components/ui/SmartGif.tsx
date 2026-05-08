'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SmartGifProps {
  src: string
  alt: string
  className?: string
}

/**
 * SmartGif – plays a GIF only when the element is near the vertical
 * centre of the viewport; freezes on the last-visible frame otherwise.
 *
 * For non-GIF sources it renders a plain <motion.img>.
 */
const SmartGif: React.FC<SmartGifProps> = ({ src, alt, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)

  const isGif = src.toLowerCase().endsWith('.gif')

  /* ---- capture whatever frame the <img> is currently showing ---- */
  const captureFrame = useCallback(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !img.naturalWidth || !img.naturalHeight) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(img, 0, 0)
      setHasFrame(true)
    }
  }, [])

  /* ---- IntersectionObserver: centre-of-viewport detection ---- */
  useEffect(() => {
    if (!isGif || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          // freeze the current frame before hiding the GIF
          captureFrame()
          setIsInView(false)
        }
      },
      {
        // only the middle ~30 % of the viewport counts as "in view"
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0.05,
      },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isGif, captureFrame])

  /* ---- non-GIF: pass-through ---- */
  if (!isGif) {
    return (
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={src}
        className={className}
        alt={alt}
      />
    )
  }

  /* ---- GIF: canvas freeze / img play ---- */
  return (
    <motion.div 
      ref={containerRef} 
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="relative inline-flex items-center justify-center w-full h-full cursor-pointer"
    >
      {/* Frozen frame (canvas) – visible when GIF is NOT playing */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          display: !isInView && hasFrame ? 'block' : 'none',
          maxWidth: '100%',
          height: 'auto'
        }}
      />

      {/* Live GIF – visible when in viewport centre */}
      <img
        ref={imgRef}
        src={src}
        className={className}
        alt={alt}
        onLoad={() => {
          // grab first frame so we always have a fallback
          // Delaying slightly to ensure the GIF engine has rendered at least one frame
          setTimeout(captureFrame, 250)
        }}
        style={{
          display: isInView || !hasFrame ? 'block' : 'none',
        }}
      />
    </motion.div>
  )
}

export default SmartGif
