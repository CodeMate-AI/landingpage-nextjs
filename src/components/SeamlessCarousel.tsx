'use client'
import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Montserrat } from 'next/font/google'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AutoCodeEditor from '@/components/motion-components/aEditor'
import SmartGif from '@/components/ui/SmartGif'

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
})

interface CarouselSlide {
    title: string
    media?: string
    fallbackSrc?: string
    description: string
    type: 'gif' | 'mp4' | 'component'
    overlay?: {
        text: string
        buttonText?: string
    }
}

const AutoCompleteComponent = [
    { code: "import { useState } from 'react'" },
    { code: "" },
    { code: "export default function ThemeToggle() {" },
    { code: "  const [dark, setDark] = useState(false)" },
    { code: "  return (" },
    { code: "    <div className={dark ? 'bg-black' : 'bg-white'}>" },
    { code: "      <p>{dark ? 'Dark 🌙' : 'Light ☀️'}</p>" },
    { code: "      <button onClick={() => setDark(!dark)}>Toggle</button>" },
    { code: "    </div>" },
    { code: "  )" },
    { code: "}" },
]

const slides: CarouselSlide[] = [
    {
        title: 'Codemaps',
        media: '/CodeMaps_Static.png',
        fallbackSrc: '/CodeMaps_Static.png',
        type: 'gif',
        description:
            'Navigate your entire codebase visually with intelligent code maps that reveal structure, dependencies, and relationships at a glance.',
    },
    {
        title: 'Deepwiki',
        media: '/DeepWiki_static.png',
        fallbackSrc: '/DeepWiki_static.png',
        type: 'gif',
        description:
            'Query deep contextual knowledge from your codebase wiki, instantly getting answers about architecture, patterns, and implementation details.',
    },
    {
        title: 'MCP',
        media: '/MCP-static.png',
        fallbackSrc: '/MCP-static.png',
        type: 'gif',
        description:
            'Connect and manage external tools and contexts via Model Context Protocol, supercharging your Build agent with seamless integrations.',
    },
    {
        title: 'Debug',
        media: 'https://drive.codemate.ai/Debug.mp4',
        type: 'mp4',
        overlay: { text: 'Debug this code', buttonText: 'Debug this code' },
        description:
            'An AI-Powered Debugger that quickly identifies errors, explains their causes, and suggests precise fixes—making it easier to resolve issues and keep development moving smoothly.',
    },
    {
        title: 'Review',
        media: 'https://drive.codemate.ai/CodeReview.mp4',
        type: 'mp4',
        overlay: { text: 'Review this code', buttonText: 'Review this code' },
        description:
            'An AI-Powered Code Reviewer that scans your code in real time, detects bugs and vulnerabilities, and suggests improvements for readability, performance, and best practices—helping you write cleaner, more reliable code faster.',
    },
    {
        title: 'Auto-Complete',
        type: 'component',
        overlay: { text: 'Auto complete this code', buttonText: 'Auto complete this code' },
        description:
            'An Intelligent Auto-Completer tool that predicts your next lines of code, reduces repetitive typing, and speeds up development by suggesting accurate, context-aware completions in real time.',
    },
]

export default function SeamlessCarousel() {
    const [current, setCurrent] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isAutoFix, setIsAutoFix] = useState(false)
    const [direction, setDirection] = useState(1)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Reset states on slide change
    useEffect(() => {
        setIsPlaying(false)
        setIsAutoFix(false)
        if (videoRef.current) {
            videoRef.current.currentTime = 0
        }
    }, [current])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const slide = slides[current]

            if (slide.title === 'Auto-Complete' && e.key === 'Tab') {
                e.preventDefault()
                setIsAutoFix(true)
                setIsPlaying(true)
            } else if (slide.type === 'mp4') {
                if (slide.title === 'Debug' && (e.key === 'd' || e.key === 'D')) {
                    handleMediaClick()
                } else if (slide.title === 'Review' && (e.key === 'r' || e.key === 'R')) {
                    handleMediaClick()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [current])

    const handleNext = () => {
        if (current < slides.length - 1) {
            setDirection(1)
            setCurrent((prev) => prev + 1)
        }
    }

    const handlePrev = () => {
        if (current > 0) {
            setDirection(-1)
            setCurrent((prev) => prev - 1)
        }
    }

    const handleMediaClick = () => {
        const slide = slides[current]
        if (slide.type === 'mp4' && videoRef.current) {
            const playPromise = videoRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Playback was interrupted — safe to ignore
                })
            }
            setIsPlaying(true)
        } else if (slide.type === 'component' && slide.title === 'Auto-Complete') {
            setIsAutoFix(true)
            setIsPlaying(true)
        }
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -20 : 20,
            opacity: 0,
        }),
    }

    const slideTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.375,
    }

    // direction is now tracked as state — set by handleNext/handlePrev/dot clicks
    const currentSlide = slides[current]

    return (
        <section className="w-full bg-black pt-2 pb-2 lg:pt-12 lg:pb-6 px-2 lg:px-8 overflow-hidden">
            <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[60%_40%] gap-8 items-center">
                {/* Left Side: Media Player */}
                <div className="flex items-center justify-center min-h-[280px] lg:min-h-[500px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={slideTransition}
                            className="w-full"
                            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                        >
                            {currentSlide.type === 'gif' ? (
                                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl w-full aspect-[1.5] lg:aspect-video flex items-center justify-center">
                                    {currentSlide.fallbackSrc ? (
                                        <SmartGif
                                            src={currentSlide.media!}
                                            fallbackSrc={currentSlide.fallbackSrc}
                                            alt={currentSlide.title}
                                            className="w-full h-full object-cover"
                                            isActive={true}
                                        />
                                    ) : (
                                        <img
                                            src={currentSlide.media}
                                            alt={currentSlide.title}
                                            className="w-full h-full object-cover"
                                            loading="eager"
                                        />
                                    )}
                                </div>
                            ) : currentSlide.type === 'mp4' ? (
                                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl w-full aspect-[1.5] lg:aspect-video relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay={false}
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                        src={currentSlide.media}
                                    />
                                    {/* MP4 Overlay */}
                                    {!isPlaying && currentSlide.overlay && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: isPlaying ? 0 : 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                                            onClick={handleMediaClick}
                                        >
                                            {currentSlide.overlay.buttonText ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-8 py-3 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white font-semibold rounded-lg shadow-lg text-lg"
                                                >
                                                    {currentSlide.overlay.buttonText}
                                                </motion.button>
                                            ) : (
                                                <p className="text-white text-xl font-semibold bg-black/60 px-6 py-3 rounded-lg">
                                                    {currentSlide.overlay.text}
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                /* Component type — Auto-Complete interactive editor */
                                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl w-full aspect-[1.5] lg:aspect-video relative">
                                    <AutoCodeEditor
                                        comp1={AutoCompleteComponent}
                                        isFix={isAutoFix}
                                        setIsFix={setIsAutoFix}
                                    />
                                    {/* Button overlay — same design as Debug/Review */}
                                    {!isPlaying && currentSlide.overlay && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: isPlaying ? 0 : 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                                            onClick={handleMediaClick}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-3 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white font-semibold rounded-lg shadow-lg text-lg"
                                            >
                                                {currentSlide.overlay.buttonText}
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Feature Title + Description */}
                <div className="relative pl-6 lg:pl-10">
                    {/* Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]" />

                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`text-${current}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={slideTransition}
                        >
                            <h2
                                className={`${montserrat.className} text-3xl lg:text-4xl font-bold text-white mb-6`}
                            >
                                {currentSlide.title}
                            </h2>
                            <p className="text-[#999] text-lg lg:text-xl leading-relaxed">
                                {currentSlide.description}
                            </p>

                            {/* Show keyboard hint for interactive slides */}
                            {currentSlide.type !== 'gif' && !isPlaying && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    className="mt-6 flex items-center gap-2 text-sm text-[#00BFFF]/70"
                                >
                                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono border border-white/20">
                                        {currentSlide.title === 'Auto-Complete' ? 'TAB' :
                                            currentSlide.title === 'Debug' ? 'D' :
                                                currentSlide.title === 'Review' ? 'R' : ''}
                                    </kbd>
                                    <span>or click to trigger</span>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-6 lg:mt-8">
                {/* Left Arrow */}
                <motion.button
                    whileHover={current !== 0 ? { scale: 1.05, backgroundColor: "rgba(0, 191, 255, 0.1)" } : {}}
                    whileTap={current !== 0 ? { scale: 0.95 } : {}}
                    onClick={handlePrev}
                    disabled={current === 0}
                    className={`w-12 h-12 rounded-full bg-zinc-900/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${current === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-[#00BFFF]/40 shadow-[0_0_20px_rgba(0,191,255,0.05)]'
                        }`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="text-[#00BFFF]" size={24} />
                </motion.button>

                {/* Slide Indicators */}
                <div className="flex items-center gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx) }}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === current
                                ? 'w-8 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] shadow-[0_0_10px_rgba(0,191,255,0.3)]'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <motion.button
                    whileHover={current !== slides.length - 1 ? { scale: 1.05, backgroundColor: "rgba(0, 191, 255, 0.1)" } : {}}
                    whileTap={current !== slides.length - 1 ? { scale: 0.95 } : {}}
                    onClick={handleNext}
                    disabled={current === slides.length - 1}
                    className={`w-12 h-12 rounded-full bg-zinc-900/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${current === slides.length - 1
                        ? 'opacity-20 cursor-not-allowed'
                        : 'opacity-100 cursor-pointer hover:border-[#00BFFF]/40 shadow-[0_0_20px_rgba(0,191,255,0.05)]'
                        }`}
                    aria-label="Next slide"
                >
                    <ChevronRight className="text-[#00BFFF]" size={24} />
                </motion.button>
            </div>
        </section>
    )
}