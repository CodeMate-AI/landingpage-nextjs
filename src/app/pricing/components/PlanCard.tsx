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

const VISIBLE_FEATURES_COUNT = 4

const getPreviousPlanName = (planTitle: string): string | null => {
  const hierarchy: Record<string, string> = {
    'free': '',
    'pro': 'Free',
    'teams': 'Pro',
    'enterprise': 'Teams',
    'max': 'Pro',
  }
  return hierarchy[planTitle.toLowerCase()] ?? null
}

const PlanCard = ({
  planInfo,
  showAllFeatures = false,
  onToggleFeatures,
}: {
  planInfo: any
  showAllFeatures?: boolean
  onToggleFeatures?: () => void
}) => {
  const [isAnnual, setIsAnnual] = useState(planInfo.isAnnual ?? (!planInfo.monthlyPrice ? true : false))
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0)

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
  const isEnterprise = planInfo.title === 'Enterprise'

  const previousPlanName = getPreviousPlanName(planInfo.title)
  const isFreeOrFirstPlan = isFree || planInfo.title.toLowerCase() === 'free'

  const visibleFeatures = showAllFeatures
    ? planInfo.features
    : planInfo?.features?.slice(0, VISIBLE_FEATURES_COUNT)

  const hiddenCount = (planInfo?.features?.length ?? 0) - VISIBLE_FEATURES_COUNT

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
    <div className="flex justify-center items-stretch w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative flex flex-col w-full bg-zinc-900 rounded-2xl p-5 sm:p-6 h-full ${
          planInfo.highlight
            ? 'rounded-tl-none ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950'
            : 'border border-zinc-800'
        }`}
      >
        {planInfo.highlight && <MostRecommendedBadge />}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-white leading-none">{planInfo.title}</h2>
            {planInfo.isRecommended && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                Recommended
              </span>
            )}
          </div>

          {/* Billing period toggle */}
          {hasBillingPeriods && (
            <div className="flex border border-zinc-700 rounded-full p-[2px] bg-white/5 shrink-0">
              <div ref={periodContainerRef} className="relative flex items-center">
                <motion.div
                  className="absolute inset-y-0 my-auto h-6 rounded-full bg-white pointer-events-none"
                  animate={{ x: periodPill.x, width: periodPill.width }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {planInfo.billingPeriods!.map((period: BillingPeriod, idx: number) => (
                  <button
                    key={period.label}
                    ref={(el) => { periodButtonRefs.current[idx] = el }}
                    onClick={() => setSelectedPeriodIdx(idx)}
                    className={`relative z-10 px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize transition-colors duration-150 focus:outline-none ${
                      selectedPeriodIdx === idx ? 'text-black' : 'text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Annual toggle */}
          {!hasBillingPeriods && planInfo.monthlyPrice && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-medium text-zinc-400">Annual</span>
              <motion.button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-9 h-5 rounded-full transition-colors ${isAnnual ? 'bg-zinc-600' : 'bg-zinc-700'}`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isAnnual ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          )}
        </div>

        {/* ── Price ── */}
        <div className="mb-4">
          {isEnterprise ? (
            <div className="text-2xl font-semibold text-white">Custom</div>
          ) : isFreeOrFirstPlan ? (
            <div className="text-2xl font-semibold text-white">Free</div>
          ) : (
            <div className="flex items-baseline gap-1">
              <motion.span
                key={currentPrice}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-2xl font-semibold text-white"
              >
                <span className="font-sans">${currentPrice}</span>
              </motion.span>
              <span className="text-sm text-zinc-400">
                {hasBillingPeriods
                  ? `/ ${activePeriod!.label.toLowerCase()}`
                  : isAnnual ? '/ year' : '/ month'}
              </span>
              {/* Savings badge */}
              {!hasBillingPeriods && isAnnual && planInfo.monthlyPrice && (() => {
                const monthly = parseFloat(planInfo.monthlyPrice) * 12
                const yearly = parseFloat(planInfo.yearlyPrice)
                const savings = Math.round(monthly - yearly)
                return savings > 0 ? (
                  <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/20">
                    Save ${savings}
                  </span>
                ) : null
              })()}
            </div>
          )}
          {/* Description sits tight under price */}
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{planInfo.description}</p>
        </div>

        {/* ── CTA ── */}
        <a
          href={
            isEnterprise
              ? 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4'
              : planInfo.id === 'cora-free' ? 'https://app.codemate.ai'
              : `https://app.codemate.ai/payments?plan_id=${currentCtaLink}`
          }
          className="block mb-5"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
              planInfo.highlight || planInfo.isRecommended
                ? 'bg-white text-black hover:bg-zinc-100'
                : isFreeOrFirstPlan
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            {currentCtaText}
          </motion.button>
        </a>

        {/* ── Divider + Features ── */}
        <div className="border-t border-zinc-800 pt-4 flex-1 flex flex-col">

          {/* "Everything in X, plus" or "Includes" label */}
          {isFreeOrFirstPlan || !previousPlanName ? (
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-3">
              Includes
            </p>
          ) : (
            <p className="text-xs text-zinc-500 mb-3 leading-snug">
              Everything in{' '}
              <span className="text-zinc-300 font-medium">{previousPlanName}</span>, plus
            </p>
          )}

          {/* Feature list */}
          <div className="flex-1 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {visibleFeatures?.map((feature: string, index: number) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-start gap-2"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-zinc-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs text-zinc-300 leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show more / less toggle */}
          {hiddenCount > 0 && (
            <button
              onClick={onToggleFeatures}
              className="mt-3 flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors"
            >
              <motion.span
                animate={{ rotate: showAllFeatures ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="inline-flex"
              >
                <ChevronDown className="w-3 h-3" />
              </motion.span>
              {showAllFeatures ? 'Show less' : `${hiddenCount} more`}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PlanCard