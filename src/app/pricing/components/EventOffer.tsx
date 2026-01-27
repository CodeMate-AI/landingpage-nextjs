'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Montserrat } from 'next/font/google'
import { ChevronDown, CheckCircle2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
})

interface EventOfferProps {
    badgeText?: string;
    offerText: string;
    discountLabel?: string;
    description?: string;
    imageSrc?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function EventOffer({
    badgeText = "Special Offer",
    offerText,
    discountLabel = "FREE",
    description = "With our suite of AI Agents.",
    imageSrc,
    isOpen,
    onClose
}: EventOfferProps) {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-[999999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${montserrat.className}`}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-gradient-to-br from-zinc-900/95 via-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800/60 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col lg:flex-row">
                            {/* Optional Image Section */}
                            {imageSrc && (
                                <div className="hidden lg:block lg:w-2/5 relative h-48 lg:h-auto min-h-[200px]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 lg:bg-gradient-to-r lg:from-transparent lg:to-zinc-900/50 z-10" />
                                    <img
                                        src={imageSrc}
                                        alt="Event Special"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Content Section */}
                            <div className={`p-6 lg:p-10 ${imageSrc ? 'lg:w-3/5' : 'w-full'} flex flex-col justify-center`}>
                                {/* Badge */}
                                <div className="mx-auto lg:mx-0 w-fit mb-6">
                                    <Badge variant="blue" showPulse>
                                        {badgeText}
                                    </Badge>
                                </div>

                                <div className="text-center lg:text-left">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                                        Go From Idea to Deployed App.<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Faster Than Ever.</span>
                                    </h2>

                                    <p className="text-zinc-400 mb-6 text-sm lg:text-lg">
                                        {description}
                                    </p>

                                    {/* Products Row */}
                                    <div className="mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                        <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700/50">
                                            <span className="font-semibold text-white">Build</span>
                                            <span className="text-zinc-500">+</span>
                                            <span className="font-semibold text-white">CORA</span>
                                            <span className="text-zinc-500">+</span>
                                            <span className="font-semibold text-white">C <span className='font-[monospace] text-lg -ml-1'>0</span></span>
                                        </div>

                                        <div className="px-5 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <span className="text-emerald-400 font-bold tracking-wide">
                                                {offerText}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA & Toggle Row */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                                        <motion.a
                                            href="https://app.codemate.ai"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto bg-white text-black font-bold text-base px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 text-center"
                                        >
                                            Claim Offer →
                                        </motion.a>

                                        <button
                                            onClick={() => setShowDetails(!showDetails)}
                                            className="group hidden inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                                        >
                                            <span>{showDetails ? 'Hide details' : "What's included?"}</span>
                                            <motion.div
                                                animate={{ rotate: showDetails ? 180 : 0 }}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </motion.div>
                                        </button>
                                    </div>

                                    {/* Trust Badge */}
                                    {/* <div className="mt-4 text-xs text-zinc-600 font-medium">
                                        No credit card required
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Details */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-zinc-800 bg-black/20"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 text-left">
                                        {[
                                            { name: 'Build', features: ['Full Pro Plan', 'Unlimited Agents'] },
                                            { name: 'CORA', features: ['30 AI Credits', 'Context-aware'] },
                                            { name: 'C0', features: ['Smart Completion', 'Real-time Analysis'] }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-white">{item.name}</h4>
                                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{discountLabel}</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {item.features.map((feat, fIdx) => (
                                                        <li key={fIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
