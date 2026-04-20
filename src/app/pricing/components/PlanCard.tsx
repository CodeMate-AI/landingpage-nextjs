'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import MostRecommendedBadge from './MostRecommendedBadge'
import type { FeaturesHeader } from '@/utils/planUtils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillingPeriod {
  label: string
  price: string
  ctaText: string
  ctaLink: string
}

interface PlanInfo {
  id: string | number
  title: string
  description: string
  monthlyPrice?: string
  yearlyPrice: string
  currency: string
  highlight?: boolean
  isRecommended?: boolean
  isAnnual?: boolean
  features: string[]
  featuresHeader?: FeaturesHeader
  monthlyCtaText: string
  monthlyCtaLink: string
  yearlyCtaText: string
  yearlyCtaLink: string
  billingPeriods?: BillingPeriod[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DESKTOP_FEATURES = 4
const MOBILE_FEATURES = 2

const ENTERPRISE_CTA = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4'

// Plan hierarchy for the default "Everything in X, plus" fallback
const PLAN_PARENT: Record<string, string> = {
  pro: 'Free',
  teams: 'Pro',
  max: 'Pro',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturesHeader({ header, title }: { header: FeaturesHeader; title: string }) {
  // Explicit INCLUDES_WITH_PARENT → "Everything in Teams, plus"
  if (header === 'INCLUDES_WITH_PARENT') {
    return (
      <p className="text-xs text-zinc-500 mb-3 leading-snug">
        Everything in <span className="text-zinc-300 font-medium">Teams</span>, plus
      </p>
    )
  }

  // Explicit INCLUDES or base/free tiers → "INCLUDES" label
  const parent = PLAN_PARENT[title.toLowerCase()]
  if (header === 'INCLUDES' || !parent) {
    return (
      <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-3">
        Includes
      </p>
    )
  }

  // Default → "Everything in <parent>, plus"
  return (
    <p className="text-xs text-zinc-500 mb-3 leading-snug">
      Everything in <span className="text-zinc-300 font-medium">{parent}</span>, plus
    </p>
  )
}

function AnnualToggle({ isAnnual, onToggle }: { isAnnual: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-[11px] font-medium text-zinc-400">Annual</span>
      <motion.button
        onClick={onToggle}
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
  )
}

function BillingPeriodToggle({
  periods,
  selectedIdx,
  onSelect,
}: {
  periods: BillingPeriod[]
  selectedIdx: number
  onSelect: (idx: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState({ x: 0, width: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    const btn = btnRefs.current[selectedIdx]
    if (container && btn) {
      const cRect = container.getBoundingClientRect()
      const bRect = btn.getBoundingClientRect()
      setPill({ x: bRect.left - cRect.left, width: bRect.width })
    }
  }, [selectedIdx])

  return (
    <div className="flex border border-zinc-700 rounded-full p-[2px] bg-white/5 shrink-0">
      <div ref={containerRef} className="relative flex items-center">
        <motion.div
          className="absolute inset-y-0 my-auto h-6 rounded-full bg-white pointer-events-none"
          animate={{ x: pill.x, width: pill.width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {periods.map((period, idx) => (
          <button
            key={period.label}
            ref={(el) => { btnRefs.current[idx] = el }}
            onClick={() => onSelect(idx)}
            className={`relative z-10 px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize transition-colors duration-150 focus:outline-none ${
              selectedIdx === idx ? 'text-black' : 'text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const PlanCard = ({
  planInfo,
  showAllFeatures = false,
  onToggleFeatures,
}: {
  planInfo: PlanInfo
  showAllFeatures?: boolean
  onToggleFeatures?: () => void
}) => {
  const [isAnnual, setIsAnnual] = useState(planInfo.isAnnual ?? !planInfo.monthlyPrice)
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const hasBillingPeriods = !!planInfo.billingPeriods?.length
  const activePeriod = hasBillingPeriods ? planInfo.billingPeriods![selectedPeriodIdx] : null

  const currentPrice   = activePeriod?.price   ?? (isAnnual ? planInfo.yearlyPrice   : planInfo.monthlyPrice)
  const currentCtaText = activePeriod?.ctaText ?? (isAnnual ? planInfo.yearlyCtaText : planInfo.monthlyCtaText)
  const currentCtaLink = activePeriod?.ctaLink ?? (isAnnual ? planInfo.yearlyCtaLink : planInfo.monthlyCtaLink)

  const isFree       = !currentPrice || currentPrice === '0'
  const isEnterprise = planInfo.title === 'Enterprise'
  const isBase       = isFree || planInfo.title.toLowerCase() === 'free'

  // Enterprise without an explicit featuresHeader always gets INCLUDES_WITH_PARENT
  const featuresHeader: FeaturesHeader =
    planInfo.featuresHeader !== undefined
      ? planInfo.featuresHeader
      : isEnterprise ? 'INCLUDES_WITH_PARENT' : null

  const visibleCount   = isMobile ? MOBILE_FEATURES : DESKTOP_FEATURES
  const visibleFeatures = showAllFeatures ? planInfo.features : planInfo.features?.slice(0, visibleCount)
  const hiddenCount    = (planInfo.features?.length ?? 0) - visibleCount

  const ctaHref = isEnterprise
    ? ENTERPRISE_CTA
    : planInfo.id === 'cora-free'
    ? 'https://app.codemate.ai'
    : `https://app.codemate.ai/payments?plan_id=${currentCtaLink}`

  const ctaClass = `py-2 rounded-lg text-sm font-semibold transition-all ${
    planInfo.highlight || planInfo.isRecommended
      ? 'bg-white text-black hover:bg-zinc-100'
      : isBase
      ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
      : 'bg-white text-black hover:bg-zinc-100'
  }`

  const savings = (() => {
    if (hasBillingPeriods || !isAnnual || !planInfo.monthlyPrice) return 0
    return Math.round(parseFloat(planInfo.monthlyPrice) * 12 - parseFloat(planInfo.yearlyPrice))
  })()

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

        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-white leading-none">{planInfo.title}</h2>
            {planInfo.isRecommended && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                Recommended
              </span>
            )}
          </div>
          {hasBillingPeriods ? (
            <BillingPeriodToggle
              periods={planInfo.billingPeriods!}
              selectedIdx={selectedPeriodIdx}
              onSelect={setSelectedPeriodIdx}
            />
          ) : planInfo.monthlyPrice ? (
            <AnnualToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(v => !v)} />
          ) : null}
        </div>

        {/* ── Price ── */}
        <div className="mb-4">
          {isEnterprise ? (
            <div className="text-2xl font-semibold text-white">Custom</div>
          ) : isBase ? (
            <div className="text-2xl font-semibold text-white">Free</div>
          ) : (
            <div className="flex items-baseline gap-1">
              <motion.span
                key={currentPrice}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-2xl font-semibold text-white font-sans"
              >
                ${currentPrice}
              </motion.span>
              <span className="text-sm text-zinc-400">
                {activePeriod ? `/ ${activePeriod.label.toLowerCase()}` : isAnnual ? '/ year' : '/ month'}
              </span>
              {savings > 0 && (
                <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/20">
                  Save ${savings}
                </span>
              )}
            </div>
          )}
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{planInfo.description}</p>
        </div>

        {/* ── CTA (desktop) ── */}
        <a href={ctaHref} className="mb-5 hidden sm:block">
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className={`w-full ${ctaClass}`}>
            {currentCtaText}
          </motion.button>
        </a>

        {/* ── Features ── */}
        <div className="border-t border-zinc-800 pt-4 flex-1 flex flex-col">
          <FeaturesHeader header={featuresHeader} title={planInfo.title} />

          <div className="flex-1 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {visibleFeatures?.map((feature, index) => (
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

          {/* ── CTA (mobile) ── */}
          <a href={ctaHref} className="mt-4 block sm:hidden">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className={`w-fit px-6 ${ctaClass}`}>
              {currentCtaText}
            </motion.button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default PlanCard