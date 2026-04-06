'use client'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface PresetCardProps {
    price: number
    credits: number
    isPopular?: boolean
}

const PresetCard = ({ price, credits, isPopular = false }: PresetCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-2xl p-6 border ${isPopular ? 'border-blue-500/50' : 'border-zinc-700/50'
                } hover:border-zinc-600 transition-all cursor-pointer`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                    </div>
                </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-zinc-700/50 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-400" fill="currentColor" />
                </div>
            </div>

            {/* Price */}
            <div className="text-center mb-2">
                <div className="text-3xl font-bold text-white">
                    <span className="font-[mulish]">$</span>{price}
                </div>
            </div>

            {/* Credits */}
            <div className="text-center mb-4">
                <div className="text-zinc-400 text-sm">
                    {credits >= 1000 ? `${(credits / 1000).toFixed(0)}K` : credits} Credits
                </div>
            </div>

            {/* Buy Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${isPopular
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-zinc-700 text-white hover:bg-zinc-600'
                    }`}
            >
                Buy Now
            </motion.button>
        </motion.div>
    )
}

const PresetCreditCards = () => {
    const presets = [
        { price: 20, credits: 100 },
        { price: 50, credits: 250 },
        { price: 100, credits: 500, isPopular: true },
        { price: 200, credits: 1000 },
        { price: 500, credits: 2500 },
    ]

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-3">Need Extra Credits?</h2>
                <p className="text-zinc-400 text-lg">
                    Add credits to your existing plan instantly. Perfect for handling peak usage or special projects.
                </p>
            </div>

            {/* Preset Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {presets.map((preset, index) => (
                    <PresetCard
                        key={index}
                        price={preset.price}
                        credits={preset.credits}
                        isPopular={preset.isPopular}
                    />
                ))}
            </div>

            {/* Info Text */}
            <p className="text-center text-zinc-500 text-sm">
                Credits are added instantly to your account • One-time payment • No subscription required
            </p>
        </div>
    )
}

export default PresetCreditCards
