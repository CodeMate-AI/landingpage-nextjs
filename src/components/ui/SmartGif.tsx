'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SmartGifProps {
  src: string
  alt: string
  className?: string
  /** When provided, overrides the built-in IntersectionObserver.
   *  true = play the GIF, false = freeze it. */
  isActive?: boolean
  fallbackSrc?: string
}

const SmartGif: React.FC<SmartGifProps> = ({ src, alt, className, isActive: externalActive, fallbackSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Sync internal state if src changes
  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  const isGif = src.toLowerCase().endsWith('.gif')
  const isExternallyControlled = externalActive !== undefined
  const shouldPlay = isExternallyControlled ? !!externalActive : isInView

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

  // Fix for cached images not firing onLoad
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
      if (!hasFrame) setTimeout(captureFrame, 250)
    }
  }, [currentSrc, captureFrame, hasFrame])

  /* ---- IntersectionObserver: only when NOT externally controlled ---- */
  useEffect(() => {
    if (isExternallyControlled || !isGif || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          captureFrame()
          setIsInView(false)
        }
      },
      {
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0.05,
      },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isGif, captureFrame, isExternallyControlled])

  /* ---- External control: capture frame when going inactive ---- */
  useEffect(() => {
    if (!isExternallyControlled || !isGif) return
    if (!externalActive) {
      captureFrame()
    }
  }, [externalActive, isExternallyControlled, isGif, captureFrame])

  /* ---- non-GIF: pass-through ---- */
  if (!isGif) {
    return (
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={currentSrc}
        className={className}
        alt={alt}
        onError={() => {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
          }
        }}
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
          display: !shouldPlay && hasFrame ? 'block' : 'none',
          maxWidth: '100%',
          height: 'auto'
        }}
      />

      {/* Live GIF – visible when in viewport centre */}
      <img
        ref={imgRef}
        src={currentSrc}
        className={className}
        alt={alt}
        onLoad={() => {
          setIsLoaded(true)
          setTimeout(captureFrame, 250)
        }}
        onError={() => {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
          }
        }}
        style={{
          display: (shouldPlay || !hasFrame) && isLoaded ? 'block' : 'none',
        }}
      />

      {/* Fallback Static Image - visible ONLY when GIF is loading or failed */}
      {!isLoaded && fallbackSrc && (
        <img
          src={fallbackSrc}
          className={className}
          alt={alt}
          style={{ display: 'block' }}
        />
      )}
    </motion.div>
  )
}

export default SmartGif
