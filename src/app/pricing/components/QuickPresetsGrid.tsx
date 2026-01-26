'use client'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface QuickPresetProps {
    price: number
    credits: number
    isPopular?: boolean
}

const QuickPreset = ({ price, credits, isPopular = false }: QuickPresetProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className={`bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 rounded-xl p-4 border ${isPopular ? 'border-blue-500/50' : 'border-zinc-700/50'
                } hover:border-zinc-600 transition-all cursor-pointer relative`}
        >
            {isPopular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Popular
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-zinc-700/50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" fill="currentColor" />
                </div>
            </div>

            <div className="text-center mb-1">
                <div className="text-2xl font-bold text-white">
                    <span className="font-[mulish]">$</span>{price}
                </div>
            </div>

            <div className="text-center mb-3">
                <div className="text-zinc-400 text-xs">
                    {credits >= 1000 ? `${(credits / 1000).toFixed(0)}K` : credits} Credits
                </div>
            </div>

            <a href={`https://app.codemate.ai/addon-cora?credits=${credits}`} className="block w-full">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-1.5 rounded-lg font-semibold text-xs transition-all ${isPopular
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-zinc-700 text-white hover:bg-zinc-600'
                        }`}
                >
                    Buy Now
                </motion.button>
            </a>
        </motion.div>
    )
}

const QuickPresetsGrid = () => {
    const presets = [
        { price: 20, credits: 100 },
        { price: 50, credits: 250 },
        { price: 100, credits: 500, isPopular: true },
        { price: 200, credits: 1000 },
    ]

    return (
        <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-white mb-4">Quick Add Credits</h3>
            <div className="grid grid-cols-2 gap-3">
                {presets.map((preset, index) => (
                    <QuickPreset
                        key={index}
                        price={preset.price}
                        credits={preset.credits}
                        isPopular={preset.isPopular}
                    />
                ))}
            </div>
        </div>
    )
}

export default QuickPresetsGrid
