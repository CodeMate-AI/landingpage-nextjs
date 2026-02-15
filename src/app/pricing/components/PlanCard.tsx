


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
    monthlyPrice?: string // Optional for enterprise plans
    yearlyPrice: string
    currency: string
    highlight: boolean
    isRecommended?: boolean
    isAnnual?: boolean // Force annual view for enterprise
    features: string[]
    monthlyCtaText: string
    monthlyCtaLink: string
    yearlyCtaText: string
    yearlyCtaLink: string
}

const PlanCard = ({ planInfo }: any) => {
    const [isAnnual, setIsAnnual] = useState(planInfo.isAnnual ?? (!planInfo.monthlyPrice ? true : false))

    const currentPrice = isAnnual ? planInfo.yearlyPrice : planInfo.monthlyPrice
    const currentCtaText = isAnnual ? planInfo.yearlyCtaText : planInfo.monthlyCtaText
    const currentCtaLink = isAnnual ? planInfo.yearlyCtaLink : planInfo.monthlyCtaLink
    // const isProMonthly = planInfo.name === 'PRO' && !isAnnual && planInfo.monthlyPrice;

    const isProMonthly = (planInfo.name === 'Enterprise' || planInfo.name === 'Cora Addons') ? false : false;


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
                {/* Most Recommended Badge */}
                {planInfo.highlight && <MostRecommendedBadge />}

                {/* Header with Title and Toggle */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white">{planInfo.title}</h2>
                        {/* Info Icon */}
                        {/* <motion.div
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center cursor-pointer"
                        >
                            <span className="text-xs font-bold text-white">?</span>
                        </motion.div> */}
                    </div>

                    {/* Annual Toggle */}
                    {
                        !planInfo.monthlyPrice ? null :
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-zinc-400' : 'text-zinc-400'}`}>
                                    Annual
                                </span>
                                <motion.button
                                    onClick={() => setIsAnnual(!isAnnual)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? 'bg-zinc-700' : 'bg-zinc-400'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                        animate={{
                                            x: isAnnual ? 28 : 4
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30
                                        }}
                                    />
                                </motion.button>
                            </div>
                    }

                </div>

                {/* Description */}
                <p className="text-zinc-400 text-base mb-6">{planInfo.description}</p>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        {currentPrice ? (
                            <div className="flex items-baseline gap-1">

                                {isProMonthly ? (
                                    <>
                                        <span className="text-zinc-400 text-lg line-through mr-2">
                                            ${currentPrice}
                                        </span>
                                        <motion.span
                                            key="discounted-price"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "tween", stiffness: 100, duration: 0.2 }}
                                            className="text-3xl font-bold text-white"
                                        >
                                            <span className="font-[mulish] mr-0.5">$</span>
                                            {isAnnual ?
                                                planInfo.yearlyPrice ? (parseFloat(planInfo.yearlyPrice) * 0.23).toFixed(2) : 0
                                                : planInfo.monthlyPrice ? (parseFloat(planInfo.monthlyPrice) * 0.23).toFixed(2) : 0}

                                        </motion.span>
                                    </>
                                ) : (
                                    <motion.span
                                        key={currentPrice}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "tween", stiffness: 100, duration: 0.2 }}
                                        className="text-3xl font-bold text-white"
                                    >
                                        <span className="font-[mulish] -mr-1.5">$</span> {currentPrice}
                                    </motion.span>
                                )}
                                {isAnnual ?
                                    <span className="text-zinc-400 text-lg font-normal">/ year</span>
                                    : <span className="text-zinc-400 text-lg font-normal">/ month</span>
                                }

                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="text-3xl font-bold text-white"> {planInfo.title == "Cora" ? "Pay-as you go" : "Let's Talk"}</div>
                            </div>
                        )}

                        {/* Savings Badge - Only show when annual is selected or Pro Monthly */}
                        {((isAnnual && planInfo.monthlyPrice) || isProMonthly) && (() => {
                            if (isProMonthly) {
                                return (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "tween", stiffness: 100, duration: 0.2, delay: 0.1 }}
                                        className="bg-white/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold"
                                    >
                                        77% OFF
                                    </motion.div>
                                )
                            }
                            const monthlyCost = parseFloat(planInfo.monthlyPrice!) * 12
                            const yearlyCost = parseFloat(planInfo.yearlyPrice)
                            const savings = Math.round(monthlyCost - yearlyCost)

                            return savings > 0 ? (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "tween", stiffness: 100, duration: 0.2, delay: 0.1 }}
                                    className="bg-white/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold"
                                >
                                    Save ${savings}
                                </motion.div>
                            ) : null
                        })()}
                    </div>
                </div>

                {/* Features Section */}
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
                                <motion.div
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </motion.div>
                                <span className="text-white text-sm text-base font-normal">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                {/* <a href={currentCtaLink} className="block"> */}
                <a href={planInfo.title == "Enterprise" ? "https://cal.com/ayushsinghal/book-a-demo" : planInfo.title == "Cora Credits" ? "https://app.codemate.ai/addon-cora?credits=100" : `https://app.codemate.ai/payments?plan_id=${currentCtaLink}`} className="block">
                    <motion.button
                        whileHover={{
                            scale: 1.02,
                        }}
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