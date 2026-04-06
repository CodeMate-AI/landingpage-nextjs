'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

const CompactCustomCredits = () => {
    const CREDIT_PRICE = 0.2
    const MIN_CREDITS = 100
    const MAX_CREDITS = 5000
    const CREDIT_STEP = 5

    const [credits, setCredits] = useState(MIN_CREDITS)
    const [inputValue, setInputValue] = useState(MIN_CREDITS.toString())
    const price = credits * CREDIT_PRICE

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        setCredits(value)
        setInputValue(value.toString())
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        setInputValue(value) // Allow direct typing without rounding

        // Update credits for price display (but don't round yet)
        const numValue = parseInt(value) || MIN_CREDITS
        const clampedValue = Math.max(MIN_CREDITS, Math.min(MAX_CREDITS, numValue))
        setCredits(clampedValue)
    }

    const handleInputBlur = () => {
        // Round to nearest 5 credits only when user finishes typing
        const numValue = parseInt(inputValue) || MIN_CREDITS
        const clampedValue = Math.max(MIN_CREDITS, Math.min(MAX_CREDITS, numValue))
        const rounded = Math.round(clampedValue / CREDIT_STEP) * CREDIT_STEP
        setCredits(rounded)
        setInputValue(rounded.toString())
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select() // Auto-select all text on focus
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-0 py-8">
            <div className="text-start mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Choose as per Requirement</h3>
                <p className="text-zinc-400 text-sm">
                    Choose exactly how many credits you need
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 border border-zinc-800"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Price Display & Slider */}
                    <div>
                        <div className="text-center mb-4">
                            <motion.div
                                key={price}
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="text-4xl font-bold text-white mb-1"
                            >
                                <span className="font-[mulish]">$</span>{price.toFixed(0)}
                            </motion.div>
                            <div className="text-zinc-400 text-sm">
                                {credits.toLocaleString()} Credits
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="mb-4">
                            <input
                                type="range"
                                min={MIN_CREDITS}
                                max={MAX_CREDITS}
                                step={CREDIT_STEP}
                                value={credits}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((credits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS)) * 100}%, #3f3f46 ${((credits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS)) * 100}%, #3f3f46 100%)`
                                }}
                            />
                            <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
                                <span>{MIN_CREDITS}</span>
                                <span>{MAX_CREDITS.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Input */}
                        <div>
                            <label className="text-zinc-400 text-xs font-medium mb-1 block">
                                Or enter exact credits:
                            </label>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter credits"
                            />
                        </div>
                    </div>

                    {/* Right: Info & CTA */}
                    <div className="flex flex-col justify-between">
                        <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30 mb-4">
                            <div className="grid grid-cols-2 gap-3 text-center text-xs">
                                <div>
                                    <div className="text-zinc-500 mb-1">Rate</div>
                                    <div className="text-white font-semibold">$1 = 5 Credits</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 mb-1">Expiry</div>
                                    <div className="text-white font-semibold">1 Year</div>
                                </div>
                            </div>
                        </div>
                        <div>

                            <a href={`https://app.codemate.ai/addon-cora?credits=${credits}`} className="block w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-500 text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    Purchase {credits.toLocaleString()} Credits
                                </motion.button>
                            </a>

                            {/* <p className="text-zinc-500 text-[10px] text-end mt-2">
                                Valid for 1 year
                            </p> */}
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default CompactCustomCredits
