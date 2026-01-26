'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const CoraCreditsCard = () => {
    // 1 credit = $0.2, so 5 credits = $1
    // Minimum: $20 = 100 credits
    const CREDIT_PRICE = 0.2
    const MIN_CREDITS = 100
    const CREDIT_STEP = 5

    const [credits, setCredits] = useState(MIN_CREDITS)
    const price = credits * CREDIT_PRICE

    const handleIncrement = () => {
        setCredits(prev => prev + CREDIT_STEP)
    }

    const handleDecrement = () => {
        if (credits > MIN_CREDITS) {
            setCredits(prev => prev - CREDIT_STEP)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || MIN_CREDITS
        // Round to nearest multiple of CREDIT_STEP
        const rounded = Math.max(MIN_CREDITS, Math.round(value / CREDIT_STEP) * CREDIT_STEP)
        setCredits(rounded)
    }

    return (
        <div className="flex justify-center items-center py-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-[90%] max-w-[600px] bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 shadow-xl"
            >
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Cora Add-on</h2>
                    <p className="text-zinc-400 text-base">
                        Supercharge your workflow with Cora credits — pay only for what you need.
                    </p>
                </div>

                {/* Credit Selector */}
                <div className="mb-8">
                    <label className="text-zinc-400 text-sm font-medium mb-3 block">
                        Add credits:
                    </label>

                    <div className="flex items-center justify-between bg-zinc-800/50 rounded-2xl p-4 mb-4">
                        {/* Decrement Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDecrement}
                            disabled={credits <= MIN_CREDITS}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${credits <= MIN_CREDITS
                                ? 'bg-zinc-700/50 text-zinc-600 cursor-not-allowed'
                                : 'bg-zinc-700 text-white hover:bg-zinc-600'
                                }`}
                        >
                            <Minus className="w-5 h-5" />
                        </motion.button>

                        {/* Price Display */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                key={price}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "tween", duration: 0.2 }}
                                className="text-4xl font-bold text-white"
                            >
                                <span className="font-[mulish]">$</span>{price.toFixed(0)}
                            </motion.div>
                            <span className="text-zinc-500 text-sm mt-1">per year</span>
                        </div>

                        {/* Increment Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleIncrement}
                            className="w-10 h-10 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Credits Display */}
                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-zinc-400 text-sm">You'll receive</span>
                            <div className="flex items-baseline gap-2">
                                <motion.span
                                    key={credits}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "tween", duration: 0.2 }}
                                    className="text-2xl font-bold text-white"
                                >
                                    {credits}
                                </motion.span>
                                <span className="text-zinc-400 text-sm">Credits</span>
                            </div>
                        </div>
                        <p className="text-zinc-500 text-xs text-center">
                            1 USD = 5 Credits
                        </p>
                    </div>
                </div>

                {/* Features/Info */}
                <div className="mb-6 bg-zinc-800/20 rounded-xl p-4 border border-zinc-700/30">
                    <p className="text-zinc-400 text-sm mb-3 font-medium">What you get:</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Flexible credit usage</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>No expiration on credits</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Pay only for what you use</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <a href={`https://app.codemate.ai/addon-cora?credits=${credits}`} className="block w-full">
                    <motion.button
                        whileHover={{
                            scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-black font-bold text-lg py-3 rounded-full transition-all font-[mulish] hover:bg-zinc-100"
                    >
                        Continue to Payment
                    </motion.button>
                </a>

                {/* Fine Print */}
                <p className="text-zinc-500 text-xs text-center mt-4">
                    Credits will be added to your account immediately after payment
                </p>
            </motion.div>
        </div>
    )
}

export default CoraCreditsCard
