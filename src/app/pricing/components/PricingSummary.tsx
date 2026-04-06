'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PricingResult } from '../types/planBuilder'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PricingSummaryProps {
    pricing: PricingResult
    onBillingPeriodChange: (period: 'monthly' | 'yearly') => void
}

const PricingSummary = ({ pricing, onBillingPeriodChange }: PricingSummaryProps) => {
    const [showBreakdown, setShowBreakdown] = useState(false)

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 border border-zinc-800 sticky top-4">
            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <button
                    onClick={() => onBillingPeriodChange('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pricing.billingPeriod === 'monthly'
                        ? 'bg-zinc-700 text-white'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                        }`}
                >
                    Monthly
                </button>
                {/* <button
                    onClick={() => onBillingPeriodChange('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pricing.billingPeriod === 'yearly'
                        ? 'bg-zinc-700 text-white'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                        }`}
                >
                    Yearly
                </button> */}
            </div>

            {/* Savings Badge */}
            {pricing.billingPeriod === 'yearly' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mb-4 text-center"
                >
                    <p className="text-green-400 text-xs font-semibold">
                        Save 33% with yearly billing!
                    </p>
                    <p className="text-green-300 text-[10px] mt-0.5">
                        ${pricing.yearlyDiscount?.toFixed(2)} saved per year
                    </p>
                </motion.div>
            )}

            {/* Total Price */}
            <div className="text-center mb-6">
                <motion.div
                    key={pricing.total}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold text-white mb-2"
                >
                    <span className="font-[mulish]">$</span>
                    {pricing.total.toFixed(2)}
                </motion.div>
                <div className="text-zinc-400 text-sm">
                    {pricing.billingPeriod === 'monthly' ? 'per month' : 'per year'}
                </div>
            </div>

            {/* Breakdown Toggle */}
            <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-zinc-400 hover:text-white transition-colors mb-4 text-sm"
            >
                <span>View Breakdown</span>
                {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Breakdown Details */}
            <AnimatePresence>
                {showBreakdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="bg-zinc-800/30 rounded-lg p-4 space-y-3">
                            {pricing.products.map((product) => (
                                <div key={product.productName} className="border-b border-zinc-700/50 last:border-0 pb-3 last:pb-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-semibold text-sm">{product.productName}</span>
                                        <span className="text-white font-semibold text-sm">
                                            ${product.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {product.features
                                            .filter((f) => f.price > 0)
                                            .map((feature) => (
                                                <div key={feature.featureKey} className="flex justify-between items-center text-xs">
                                                    <span className="text-zinc-400">
                                                        {feature.featureTitle}
                                                        {typeof feature.value === 'number' && ` (${feature.value})`}
                                                    </span>
                                                    <span className="text-zinc-400">${feature.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Features Selected Count */}
            <div className="text-center mb-4">
                {/* <p className="text-zinc-400 text-xs">
                    {pricing.products.reduce(
                        (sum, product) => sum + product.features.filter((f) => f.price > 0).length,
                        0
                    )}{' '}
                    features selected
                </p> */}
            </div>

            {/* CTA Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-500 text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
            >
                Start Your Subscription
            </motion.button>

            <p className="text-zinc-500 text-[10px] text-center mt-3">
                Cancel anytime • No hidden fees
            </p>
        </div>
    )
}

export default PricingSummary
