'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

const CustomCreditsCard = () => {
    // 1 credit = $0.2, so 5 credits = $1
    // Minimum: $20 = 100 credits
    // Maximum: $1000 = 5000 credits (reasonable upper limit)
    const CREDIT_PRICE = 0.2
    const MIN_CREDITS = 100
    const MAX_CREDITS = 5000
    const CREDIT_STEP = 5

    const [credits, setCredits] = useState(MIN_CREDITS)
    const price = credits * CREDIT_PRICE

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        setCredits(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '') // Only numbers
        const numValue = parseInt(value) || MIN_CREDITS

        // Clamp between min and max
        const clampedValue = Math.max(MIN_CREDITS, Math.min(MAX_CREDITS, numValue))

        // Round to nearest multiple of CREDIT_STEP
        const rounded = Math.round(clampedValue / CREDIT_STEP) * CREDIT_STEP
        setCredits(rounded)
    }

    const handleInputBlur = () => {
        // Ensure value is valid on blur
        if (credits < MIN_CREDITS) {
            setCredits(MIN_CREDITS)
        } else if (credits > MAX_CREDITS) {
            setCredits(MAX_CREDITS)
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Custom Amount</h3>
                <p className="text-zinc-400">
                    Choose exactly how many credits you need
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-3xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 shadow-xl border border-zinc-800"
            >
                {/* Price Display */}
                <div className="text-center mb-8">
                    <motion.div
                        key={price}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="text-6xl font-bold text-white mb-2"
                    >
                        <span className="font-[mulish]">$</span>{price.toFixed(0)}
                    </motion.div>
                    <div className="text-zinc-400 text-lg">
                        <motion.span
                            key={credits}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {credits.toLocaleString()} Credits
                        </motion.span>
                    </div>
                </div>

                {/* Slider */}
                <div className="mb-6">
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
                    <div className="flex justify-between mt-2 text-xs text-zinc-500">
                        <span>{MIN_CREDITS} credits</span>
                        <span>{MAX_CREDITS.toLocaleString()} credits</span>
                    </div>
                </div>

                {/* Input Box */}
                <div className="mb-8">
                    <label className="text-zinc-400 text-sm font-medium mb-2 block">
                        Or enter exact amount:
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={credits}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter credits"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                            credits
                        </div>
                    </div>
                    <p className="text-zinc-500 text-xs mt-2">
                        Minimum: {MIN_CREDITS} credits • Maximum: {MAX_CREDITS.toLocaleString()} credits • Increments of {CREDIT_STEP}
                    </p>
                </div>

                {/* Info Box */}
                <div className="mb-6 bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-zinc-500 text-xs mb-1">Rate</div>
                            <div className="text-white font-semibold">$1 = 5 Credits</div>
                        </div>
                        <div>
                            <div className="text-zinc-500 text-xs mb-1">Expiration</div>
                            <div className="text-white font-semibold">Never</div>
                        </div>
                        <div>
                            <div className="text-zinc-500 text-xs mb-1">Type</div>
                            <div className="text-white font-semibold">One-time</div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-full transition-all font-[mulish] hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                >
                    Purchase {credits.toLocaleString()} Credits for ${price.toFixed(0)}
                </motion.button>

                {/* Fine Print */}
                <p className="text-zinc-500 text-xs text-center mt-4">
                    Credits will be added to your account immediately after payment
                </p>
            </motion.div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
                <p className="text-zinc-500 text-sm">
                    💡 <span className="text-zinc-400">Tip:</span> Buy in bulk to save time on future purchases
                </p>
            </div>
        </div>
    )
}

export default CustomCreditsCard
