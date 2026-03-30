'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check } from 'lucide-react'
import MostRecommendedBadge from './MostRecommendedBadge'

interface PlanInfo {
    id: number
    name: string
    title: string
    displayName: string
    description: string
    monthlyPrice?: string
    yearlyPrice: string
    currency: string
    highlight: boolean
    isRecommended?: boolean
    isAnnual?: boolean
    features: string[]
    monthlyCtaText: string
    monthlyCtaLink: string
    yearlyCtaText: string
    yearlyCtaLink: string
    // For Cora-style multi-period plans
    billingPeriods?: {
        label: string
        price: string
        ctaText: string
        ctaLink: string
    }[]
}

const PlanCard = ({ planInfo }: any) => {
    const [isAnnual, setIsAnnual] = useState(planInfo.isAnnual ?? (!planInfo.monthlyPrice ? true : false))
    const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0)

    const hasBillingPeriods = planInfo.billingPeriods && planInfo.billingPeriods.length > 0

    // Multi-period (Cora-style) resolved values
    const activePeriod = hasBillingPeriods ? planInfo.billingPeriods[selectedPeriodIdx] : null

    const currentPrice = hasBillingPeriods
        ? activePeriod.price
        : isAnnual ? planInfo.yearlyPrice : planInfo.monthlyPrice

    const currentCtaText = hasBillingPeriods
        ? activePeriod.ctaText
        : isAnnual ? planInfo.yearlyCtaText : planInfo.monthlyCtaText

    const currentCtaLink = hasBillingPeriods
        ? activePeriod.ctaLink
        : isAnnual ? planInfo.yearlyCtaLink : planInfo.monthlyCtaLink

    const isFree = !currentPrice || currentPrice === '' || currentPrice === '0'

    return (
        <div className="flex justify-center items-center py-10 w-full z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative w-[90%] max-w-[600px] bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 shadow-xl ${planInfo.highlight
                    ? 'rounded-tl-none ring-2 ring-orange-500 ring-offset-4 ring-offset-zinc-950'
                    : ''
                    }`}
            >
                {planInfo.highlight && <MostRecommendedBadge />}

                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <h2 className="text-2xl font-bold text-white">{planInfo.title}</h2>

                    {/* Standard annual/monthly toggle — only when no billingPeriods and monthlyPrice exists */}
                    {!hasBillingPeriods && planInfo.monthlyPrice && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-zinc-400">Annual</span>
                            <motion.button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? 'bg-zinc-700' : 'bg-zinc-400'}`}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    animate={{ x: isAnnual ? 28 : 4 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-base mb-5">{planInfo.description}</p>

                {/* ── Billing period pill toggle (Cora-style, inside card) ── */}
                {hasBillingPeriods && (
                    <div className="flex mb-6 border border-zinc-700 w-fit rounded-full p-1 bg-white/5">
                        <div className="relative flex items-center">
                            {/* Animated background pill — matches each button exactly */}
                            <motion.div
                                className="absolute inset-y-0 my-auto h-7 rounded-full bg-white"
                                animate={{
                                    x: `calc(${selectedPeriodIdx} * 100%)`,
                                    width: `calc(100% / ${planInfo.billingPeriods.length})`,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                            {planInfo.billingPeriods.map((period: any, idx: number) => (
                                <button
                                    key={period.label}
                                    onClick={() => setSelectedPeriodIdx(idx)}
                                    className={`relative z-10 w-20 py-1 text-sm font-semibold rounded-full text-center capitalize transition-colors duration-150 focus:outline-none ${
                                        selectedPeriodIdx === idx ? 'text-black' : 'text-white'
                                    }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price — hidden entirely for free plans */}
                {!isFree && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-baseline gap-1">
                                <motion.span
                                    key={currentPrice}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "tween", duration: 0.2 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    <span className="font-[mulish] -mr-1.5">$</span> {currentPrice}
                                </motion.span>
                                {hasBillingPeriods ? (
                                    <span className="text-zinc-400 text-lg font-normal">
                                        / {activePeriod.label}
                                    </span>
                                ) : (
                                    <span className="text-zinc-400 text-lg font-normal">
                                        {isAnnual ? '/ year' : '/ month'}
                                    </span>
                                )}
                            </div>

                            {/* Savings badge */}
                            {!hasBillingPeriods && isAnnual && planInfo.monthlyPrice && (() => {
                                const monthlyCost = parseFloat(planInfo.monthlyPrice) * 12
                                const yearlyCost = parseFloat(planInfo.yearlyPrice)
                                const savings = Math.round(monthlyCost - yearlyCost)
                                return savings > 0 ? (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "tween", duration: 0.2, delay: 0.1 }}
                                        className="bg-white/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold"
                                    >
                                        Save ${savings}
                                    </motion.div>
                                ) : null
                            })()}
                        </div>
                    </div>
                )}

                {/* Features */}
                <div className="mb-6">
                    <p className="text-zinc-400 text-sm font-medium mb-4">Everything in Free, plus:</p>
                    <div className="space-y-3">
                        {planInfo.features.map((feature: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-white text-sm font-normal">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <a
                    href={
                        planInfo.title === "Enterprise"
                            ? "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4"
                            : planInfo.title === "Cora Credits"
                                ? "https://app.codemate.ai/addon-cora?credits=100"
                                : `https://app.codemate.ai/payments?plan_id=${currentCtaLink}`
                    }
                    className="block"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-black font-bold text-lg py-3 rounded-full transition-all font-[mulish] hover:bg-zinc-100"
                    >
                        {currentCtaText}
                    </motion.button>
                </a>
            </motion.div>
        </div>
    )
}

export default PlanCard