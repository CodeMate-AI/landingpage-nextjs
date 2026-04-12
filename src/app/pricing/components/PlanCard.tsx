'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useLayoutEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import MostRecommendedBadge from './MostRecommendedBadge'

interface BillingPeriod {
  label: string
  price: string
  ctaText: string
  ctaLink: string
}

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
  billingPeriods?: BillingPeriod[]
}

const VISIBLE_FEATURES_COUNT = 3

const PlanCard = ({ planInfo }: { planInfo: any }) => {
  const [isAnnual, setIsAnnual] = useState(planInfo.isAnnual ?? (!planInfo.monthlyPrice ? true : false))
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0)
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const periodContainerRef = useRef<HTMLDivElement>(null)
  const periodButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [periodPill, setPeriodPill] = useState({ x: 0, width: 0 })

  const hasBillingPeriods = planInfo.billingPeriods && planInfo.billingPeriods.length > 0

  const activePeriod: BillingPeriod | null = hasBillingPeriods
    ? planInfo.billingPeriods[selectedPeriodIdx]
    : null

  const currentPrice = hasBillingPeriods
    ? activePeriod!.price
    : isAnnual ? planInfo.yearlyPrice : planInfo.monthlyPrice

  const currentCtaText = hasBillingPeriods
    ? activePeriod!.ctaText
    : isAnnual ? planInfo.yearlyCtaText : planInfo.monthlyCtaText

  const currentCtaLink = hasBillingPeriods
    ? activePeriod!.ctaLink
    : isAnnual ? planInfo.yearlyCtaLink : planInfo.monthlyCtaLink

  const isFree = !currentPrice || currentPrice === '' || currentPrice === '0'

  const visibleFeatures = showAllFeatures
    ? planInfo.features
    : planInfo?.features?.slice(0, VISIBLE_FEATURES_COUNT)

  const hiddenCount = planInfo?.features?.length - VISIBLE_FEATURES_COUNT

  // Dynamic spacer text for Free and Enterprise
  const getSpacerText = () => {
    if (planInfo.title === 'Enterprise') {
      return "Custom pricing & tailored solutions";
    }
    if (isFree) {
      return "No credit card required";
    }
    return "";
  };

  useLayoutEffect(() => {
    if (!hasBillingPeriods) return
    const container = periodContainerRef.current
    const activeBtn = periodButtonRefs.current[selectedPeriodIdx]
    if (container && activeBtn) {
      const cRect = container.getBoundingClientRect()
      const bRect = activeBtn.getBoundingClientRect()
      setPeriodPill({ x: bRect.left - cRect.left, width: bRect.width })
    }
  }, [selectedPeriodIdx, hasBillingPeriods])

  return (
    <div className="flex justify-center items-stretch py-10 w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative flex flex-col w-[90%] max-w-[600px] bg-gradient-to-br from-zinc-900 to-zinc-950 
                    rounded-3xl p-8 shadow-xl h-full ${planInfo.highlight
            ? 'rounded-tl-none ring-2 ring-orange-500 ring-offset-4 ring-offset-zinc-950'
            : ''
          }`}
      >
        {planInfo.highlight && <MostRecommendedBadge />}

        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">{planInfo.title}</h2>

          {hasBillingPeriods && (
            <div className="flex border border-zinc-700 rounded-full p-[3px] bg-white/5">
              <div ref={periodContainerRef} className="relative flex items-center">
                <motion.div
                  className="absolute inset-y-0 my-auto h-7 rounded-full bg-white pointer-events-none"
                  animate={{ x: periodPill.x, width: periodPill.width }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {planInfo.billingPeriods!.map((period: BillingPeriod, idx: number) => (
                  <button
                    key={period.label}
                    ref={(el) => { periodButtonRefs.current[idx] = el }}
                    onClick={() => setSelectedPeriodIdx(idx)}
                    className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors duration-150 focus:outline-none ${selectedPeriodIdx === idx ? 'text-black' : 'text-white'
                      }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasBillingPeriods && planInfo.monthlyPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-400">Annual</span>
              <motion.button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? 'bg-zinc-700' : 'bg-zinc-400'
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                  animate={{ x: isAnnual ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-base mb-6 flex-shrink-0">
          {planInfo.description}
        </p>

        {/* Price Section with smart spacer */}
        <div className="mb-8 flex-shrink-0 min-h-[52px]">
          {!isFree ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-1">
                <motion.span
                  key={currentPrice}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  <span className="font-[mulish] -mr-1.5">$</span> {currentPrice}
                </motion.span>
                <span className="text-zinc-400 text-lg">
                  {hasBillingPeriods ? `/ ${activePeriod!.label.toLowerCase()}` : isAnnual ? '/ year' : '/ month'}
                </span>
              </div>

              {!hasBillingPeriods && isAnnual && planInfo.monthlyPrice && (() => {
                const monthly = parseFloat(planInfo.monthlyPrice) * 12
                const yearly = parseFloat(planInfo.yearlyPrice)
                const savings = Math.round(monthly - yearly)
                return savings > 0 ? (
                  <div className="bg-white/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${savings}
                  </div>
                ) : null
              })()}
            </div>
          ) : (
            // Spacer for Free and Enterprise
            <div className="py-3">
              <p className="text-zinc-500 text-sm">{getSpacerText()}</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="flex-1 flex flex-col mb-8">
          <p className="text-zinc-400 text-sm font-medium mb-4 flex-shrink-0">
            Includes:
          </p>

          <div className="flex-1 space-y-3">
            <AnimatePresence initial={false}>
              {visibleFeatures?.map((feature: string, index: number) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-black flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-white text-sm leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="mt-4 flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium transition-colors flex-shrink-0"
            >
              <motion.span
                animate={{ rotate: showAllFeatures ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="inline-flex"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
              {showAllFeatures ? 'See less' : `See ${hiddenCount} more`}
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto flex-shrink-0">
          <a
            href={
              planInfo.title === 'Enterprise'
                ? 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4'
                : `https://app.codemate.ai/payments?plan_id=${currentCtaLink}`
            }
            className="block"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-bold text-lg py-3.5 rounded-full transition-all font-[mulish] hover:bg-zinc-100"
            >
              {currentCtaText}
            </motion.button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default PlanCard