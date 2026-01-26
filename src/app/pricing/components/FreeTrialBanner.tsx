'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Montserrat } from 'next/font/google'
import { ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
})

export default function FreeTrialBanner() {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <div className={`${montserrat.className} w-full px-6 lg:px-[6vw] mt-6 mb-8`}>
            {/* Badge Component - Absolute Top Right */}
            <div className="mx-auto w-fit mb-6">
                <Badge variant="blue" showPulse>
                    Launch Week Special
                </Badge>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gradient-to-br from-zinc-900/95 via-zinc-900 to-zinc-950 backdrop-blur-sm rounded-3xl border border-zinc-800/60 p-6 lg:p-8 shadow-2xl shadow-black/40"
            >

                {/* Minimalist Hero Section */}
                <div className="text-center max-w-3xl mx-auto">

                    {/* Main headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl lg:text-3xl font-semibold text-white mb-1 leading-tight text-gradient-gray"
                    >
                        Go From Idea to Deployed App — Faster Than Ever.
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-sm lg:text-base text-zinc-400 mb-6"
                    >
                        With our suite of AI Agents.
                    </motion.p>

                    {/* Products + Value Proposition - Horizontal Layout */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6 flex items-center justify-center gap-4 flex-wrap"
                    >
                        {/* Products - Simple Text Links */}
                        <div className="flex items-center gap-2">
                            <h3
                                className="text-base lg:text-lg font-semibold text-white"
                            >
                                Build
                            </h3>
                            <span className="text-zinc-600 text-sm">+</span>
                            <h3
                                className="text-base lg:text-lg font-semibold text-white"
                            >
                                CORA
                            </h3>
                            <span className="text-zinc-600 text-sm">+</span>
                            <h3
                                className="text-base lg:text-lg font-semibold text-white"
                            >
                                C <span className="font-[monospace] -ml-1 text-[1.1rem] sm:text-[1.3rem]">0</span>
                            </h3>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-6 bg-zinc-700/50"></div>

                        {/* Free Trial Badge - More Prominent */}
                        <div className="px-5 py-2 bg-gradient-to-r from-emerald-500/15 to-green-500/15 border border-emerald-500/30 rounded-full">
                            <span className="text-sm lg:text-base font-bold text-emerald-400">
                                60-Day Free Trial • Worth $500
                            </span>
                        </div>
                    </motion.div>

                    {/* Compact CTA Button */}
                    <motion.a
                        href="https://app.codemate.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block mb-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base px-8 py-3 rounded-full  transition-all duration-300"
                        >
                            Claim Now →
                        </motion.button>
                    </motion.a>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 mb-5"
                    >
                        <div className="flex items-center gap-1.5">
                            <span>No credit card required</span>
                        </div>
                    </motion.div>

                    {/* Progressive Disclosure Toggle */}
                    <motion.button
                        onClick={() => setShowDetails(!showDetails)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="group inline-flex items-center gap-2 text-zinc-400/70 hover:text-white transition-colors text-md font-medium"
                    >
                        <span>{showDetails ? 'Hide details' : "What's included?"}</span>
                        <motion.div
                            animate={{ rotate: showDetails ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                    </motion.button>
                </div>

                {/* Collapsible Product Details */}
                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 mt-8 border-t border-zinc-700/50">
                                {/* Build Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-700/30"
                                >

                                    <h3 className="text-xl font-bold text-white mb-2">

                                        Build

                                    </h3>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="text-sm text-zinc-500 line-through">Worth $40</span>
                                        <span className="text-md font-bold text-green-400 italic">FREE</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-zinc-300">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Full Pro Plan access</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Unlimited AI agents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Advanced code review</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Priority support</span>
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* CORA Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-700/30"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        CORA
                                    </h3>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="text-sm text-zinc-500 line-through">Worth $20</span>
                                        <span className="text-md font-bold text-green-400 italic">FREE</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-zinc-300">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>30 AI credits</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Context-aware suggestions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Multi-language support</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Code generation</span>
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* C0 Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-black/20 border border-zinc-700/30"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        C <span className="font-[monospace] -ml-1.5 text-[1.1rem] sm:text-[1.4rem]">0</span>
                                    </h3>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="text-sm text-zinc-500 line-through">Worth $20</span>
                                        <span className="text-md font-bold text-green-400 italic">FREE</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-zinc-300">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Code completion</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Smart suggestions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Real-time analysis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Performance optimization</span>
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
