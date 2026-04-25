'use client'
import React, { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import Footer from '@/components/footer'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import PlanCard from './components/PlanCard'
import MaxPlanCard from './components/MaxPlanCard'
import {
  fetchAndCategorizePlans,
  convertToPlanInfo,
  formatLimitValue,
  type CategorizedPlans,
  type Plan,
  type PlanLimits,
} from '@/utils/planUtils'

// ─── Font ─────────────────────────────────────────────────────────────────────

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTERPRISE_CTA = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4'

const ENTERPRISE_PLAN = {
  id: 'enterprise',
  title: 'Enterprise',
  description: 'For large teams and organizations',
  yearlyPrice: '',
  currency: 'USD',
  highlight: false,
  isAnnual: true,
  featuresHeader: 'INCLUDES_WITH_PARENT' as const,
  features: [
    'Dedicated Account Manager.',
    'On-premises Deployment.',
    'Custom fine-tuned models.',
    'Search & Chat with Documentation & Codebases.',
    'Priority Support.',
    'Custom LLM Models',
    'Rule based Code Review',
  ],
  monthlyCtaText: 'Contact Us',
  monthlyCtaLink: ENTERPRISE_CTA,
  yearlyCtaText: 'Contact Us',
  yearlyCtaLink: ENTERPRISE_CTA,
}

const CORA_FREE_FEATURES = [
  'Base Model access',
  'Architect mode',
  'Generate architectural and system diagrams with SVG Export',
  'Integration with file system, terminal and browser',
  'Access to Knowledge base',
  'Agentic Search',
  'Jetbrains and VS Code Plugins',
]

const CORA_PLANS = [
  {
    id: 'cora-free',
    title: 'Free',
    description: 'Get started with Cora at no cost',
    yearlyPrice: '',
    currency: 'USD',
    highlight: false,
    isAnnual: true,
    features: CORA_FREE_FEATURES,
    monthlyCtaText: 'Get Started',
    monthlyCtaLink: 'https://app.codemate.ai',
    yearlyCtaText: 'Get Started',
    yearlyCtaLink: 'https://app.codemate.ai',
  },
  {
    id: 'cora-pro',
    title: 'Pro',
    description: 'Pro Model with Generous Limits',
    yearlyPrice: '20',
    currency: 'USD',
    highlight: false,
    features: ['Pro Model (upgraded from Base)'],
    monthlyCtaText: 'Get Pro',
    monthlyCtaLink: '#',
    yearlyCtaText: 'Get Pro',
    yearlyCtaLink: '#',
    billingPeriods: [
      { label: 'Daily',   price: '1',   ctaText: 'Get Pro – $1/day',   ctaLink: '' },
      { label: 'Weekly',  price: '5',   ctaText: 'Get Pro – $5/week',  ctaLink: '' },
      { label: 'Monthly', price: '20',  ctaText: 'Get Pro – $20/mo',   ctaLink: '' },
    ],
  },
  {
    id: 'cora-max',
    title: 'Max',
    description: 'Advanced Model with Generous Limits',
    yearlyPrice: '100',
    currency: 'USD',
    highlight: false,
    features: ['Advanced Model (upgraded from Pro)'],
    monthlyCtaText: 'Get Max',
    monthlyCtaLink: '#',
    yearlyCtaText: 'Get Max',
    yearlyCtaLink: '#',
    billingPeriods: [
      { label: 'Daily',   price: '5',   ctaText: 'Get Max – $5/day',   ctaLink: '' },
      { label: 'Weekly',  price: '25',  ctaText: 'Get Max – $25/week', ctaLink: '' },
      { label: 'Monthly', price: '100', ctaText: 'Get Max – $100/mo',  ctaLink: '' },
    ],
  },
]

const MAX_PLAN_DATA = {
  title: 'CodeMate Max',
  description:
    'The command center for your entire local AI stack. Seamlessly manage IDE integrations, dynamically load edge modules (like speech-to-text), and enjoy zero-friction authentication across all CodeMate apps without endless redirects.',
  monthlyPrice: '250',
  yearlyPrice: '2500',
  ctaText: 'Buy Now',
  monthlyCtaLink: 'https://app.codemate.ai/payments?plan_id=max_all_in_one_monthly',
  yearlyCtaLink: 'https://app.codemate.ai/payments?plan_id=max_all_in_one_yearly',
  features: ['Cora Max', 'CO Agent Max', 'C0 Build Max'],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMaxPlanInfo(ultimatePlan: any) {
  if (!ultimatePlan) return MAX_PLAN_DATA
  return {
    ...MAX_PLAN_DATA,
    monthlyPrice: ultimatePlan.price.monthly.toString(),
    yearlyPrice: ultimatePlan.price.yearly.toString(),
    monthlyCtaLink: ultimatePlan.stripe_id?.monthly
      ? `https://app.codemate.ai/payments?plan_id=${ultimatePlan.stripe_id.monthly}`
      : '#',
    yearlyCtaLink: ultimatePlan.stripe_id?.yearly
      ? `https://app.codemate.ai/payments?plan_id=${ultimatePlan.stripe_id.yearly}`
      : '#',
  }
}

function PlanGrid({
  isLoading,
  error,
  children,
}: {
  isLoading: boolean
  error: string | null
  children: React.ReactNode
}) {
  if (isLoading) {
    return (
      <div className="col-span-full text-white text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>Loading plans...</p>
      </div>
    )
  }
  if (error) {
    return <div className="col-span-full text-red-400 text-center py-20"><p>{error}</p></div>
  }
  return <>{children}</>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Product = 'build' | 'cora' | 'c0'
const PRODUCTS: { key: Product; label: string }[] = [
  { key: 'build', label: 'Build' },
  { key: 'cora',  label: 'Cora'  },
  { key: 'c0',    label: 'C0'    },
]

function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageRef = useRef<HTMLDivElement>(null)

  // Read ?product= from URL on first render, fall back to 'build'
  const initialProduct = (): Product => {
    const param = searchParams.get('product')?.toLowerCase()
    return (param === 'build' || param === 'cora' || param === 'c0') ? param : 'build'
  }
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [categorizedPlans, setCategorizedPlans] = useState<CategorizedPlans | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plansError, setPlansError] = useState<string | null>(null)

  // Tab pill refs
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<Product, HTMLButtonElement | null>>({ build: null, cora: null, c0: null })
  const [pillPosition, setPillPosition] = useState({ x: 0, width: 0 })

  // Mascot scroll trigger (kept for feature parity)
  const [isMascot, setIsMascot] = useState(false)
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIsMascot(v >= 0.3))

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowAllFeatures(false)
    router.replace(`?product=${product}`, { scroll: false })
  }, [router])

  const toggleFeatures = useCallback(() => setShowAllFeatures((s) => !s), [])

  // Pill position
  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current
      const btn = tabRefs.current[selectedProduct]
      if (!container || !btn) return
      const cRect = container.getBoundingClientRect()
      const bRect = btn.getBoundingClientRect()
      setPillPosition({ x: bRect.left - cRect.left, width: bRect.width })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [selectedProduct])

  // Fetch plans
  useEffect(() => {
    fetchAndCategorizePlans()
      .then(setCategorizedPlans)
      .catch((err) => {
        console.error('Failed to load plans:', err)
        setPlansError('Failed to load pricing plans. Please try again later.')
      })
      .finally(() => setIsLoadingPlans(false))
  }, [])

  // Auto-scroll to FAQ after plans load (because plans dynamically expand page height)
  useEffect(() => {
    if (!isLoadingPlans && window.location.hash === '#faq') {
      const el = document.getElementById('faq')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLoadingPlans])

  const maxPlanInfo = buildMaxPlanInfo(categorizedPlans?.ultimatePlan)

  return (
    <div ref={pageRef} className={`${montserrat.className} w-full bg-zinc-950`}>

      {/* ── Desktop Navbar ── */}
      <div className="hidden lg:flex fixed top-0 justify-center items-center w-full" style={{ zIndex: 9999 }}>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-5 w-[90%] rounded-lg border-y border-gray-400/10"
          style={{
            background: 'rgba(15, 20, 20, 0.45)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            boxShadow: '0 4px 25px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex justify-between items-center w-full text-white px-4 py-2 h-10">
            <div className="w-56 flex justify-center overflow-hidden">
              <img onClick={() => router.push('/')} src="/codemateLogo.svg" alt="CodeMate" className="cursor-pointer" />
            </div>
            <div className="flex gap-5 items-center">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ opacity: 1 }}
                className="flex items-center gap-1 opacity-65"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" />
                </svg>
                Back
              </motion.button>
              <a href="https://app.codemate.ai" target="_blank" rel="noreferrer">
                <motion.button
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  className="px-2 py-1 bg-white text-black rounded-sm font-semibold opacity-85"
                >
                  Get Started
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Mobile Navbar ── */}
      <div className="lg:hidden fixed flex top-0 justify-center items-center w-full" style={{ zIndex: 9999 }}>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-5 w-[90%] rounded-lg border-y border-gray-400/10"
          style={{
            background: 'rgba(15, 20, 20, 0.45)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            boxShadow: '0 4px 25px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex justify-between items-center w-full text-white px-2 py-2">
            <div className="w-[30vw] flex justify-start overflow-hidden">
              <img src="/codemateLogo.svg" alt="CodeMate" />
            </div>
            <a href="https://app.codemate.ai" target="_blank" rel="noreferrer">
              <button className="px-1.5 py-0.5 bg-white text-black text-sm rounded-lg font-semibold opacity-85 mr-1">
                Get Started
              </button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Hero ── */}
      <div className="flex flex-col pt-32 pb-1 text-center">
        <h1 className="text-xl lg:text-4xl font-semibold text-primary">Pricing</h1>
        <p className="text-lg lg:text-4xl mt-1 opacity-60">Choose a plan which feels right for you.</p>
      </div>

      {/* ── Product tab selector ── */}
      <div className="flex justify-center mt-10 mb-10">
        <div className="border border-zinc-500 rounded-full p-1 bg-white/5">
          <div
            ref={containerRef}
            role="tablist"
            aria-label="Pricing plans"
            className="relative flex gap-4 items-center rounded-full"
          >
            <motion.div
              animate={{ x: pillPosition.x, width: pillPosition.width }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 my-auto h-9 rounded-full bg-white"
            />
            {PRODUCTS.map(({ key, label }) => (
              <button
                key={key}
                ref={(el) => { tabRefs.current[key] = el }}
                onClick={() => handleSelectProduct(key)}
                role="tab"
                aria-selected={selectedProduct === key}
                className={`relative z-20 font-semibold transition-colors duration-200 px-4 py-1 rounded-full focus:outline-none ${
                  selectedProduct === key ? 'text-black' : 'text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Build plans ── */}
      {selectedProduct === 'build' && (
        <>
          <div className="flex flex-col gap-4 w-full">
            <div className="px-4 lg:px-[6vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full max-w-[1400px] mx-auto">
              <PlanGrid isLoading={isLoadingPlans} error={plansError}>
                {categorizedPlans?.build.map((plan) =>
                  plan.display_name.toLowerCase() === 'codemate max' ? null : (
                    <PlanCard
                      key={plan._id}
                      planInfo={convertToPlanInfo(plan)}
                      showAllFeatures={showAllFeatures}
                      onToggleFeatures={toggleFeatures}
                    />
                  )
                )}
                <PlanCard planInfo={ENTERPRISE_PLAN} showAllFeatures={showAllFeatures} onToggleFeatures={toggleFeatures} />
              </PlanGrid>
            </div>
            <MaxPlanCard planInfo={maxPlanInfo} />
          </div>
          {categorizedPlans && categorizedPlans.build.length > 0 && (
            <ComparePlans plans={categorizedPlans.build} selectedProduct="build" />
          )}
        </>
      )}

      {/* ── Cora plans ── */}
      {selectedProduct === 'cora' && (
        <div className="flex flex-col gap-4 w-full">
          <div className="px-4 lg:px-[6vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full max-w-[1400px] mx-auto">
            {CORA_PLANS.map((plan) => {
              const backendPlan = categorizedPlans?.cora?.find(
                (p) => p.display_name.toLowerCase() === plan.title.toLowerCase()
              )
              const billingPeriods = plan.billingPeriods?.map((period) => {
                const stripeId = (backendPlan as any)?.stripe_id?.[period.label.toLowerCase()]
                return stripeId ? { ...period, ctaLink: stripeId } : period
              })
              return (
                <PlanCard
                  key={plan.id}
                  planInfo={{ ...plan, ...(billingPeriods && { billingPeriods }) }}
                  showAllFeatures={showAllFeatures}
                  onToggleFeatures={toggleFeatures}
                />
              )
            })}
          </div>
          <MaxPlanCard planInfo={maxPlanInfo} />
        </div>
      )}

      {/* ── C0 plans ── */}
      {selectedProduct === 'c0' && (
        <>
          <div className="flex flex-col gap-4 w-full">
            <div className="px-4 lg:px-[6vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full max-w-[1400px] mx-auto">
              <PlanGrid isLoading={isLoadingPlans} error={plansError}>
                {categorizedPlans?.c0.map((plan) =>
                  plan.display_name.toLowerCase() === 'codemate max' ? null : (
                    <PlanCard
                      key={plan._id}
                      planInfo={convertToPlanInfo(plan)}
                      showAllFeatures={showAllFeatures}
                      onToggleFeatures={toggleFeatures}
                    />
                  )
                )}
                <PlanCard planInfo={ENTERPRISE_PLAN} showAllFeatures={showAllFeatures} onToggleFeatures={toggleFeatures} />
              </PlanGrid>
            </div>
            <MaxPlanCard planInfo={maxPlanInfo} />
          </div>
          {categorizedPlans && categorizedPlans.c0.length > 0 && (
            <ComparePlans plans={categorizedPlans.c0} selectedProduct="c0" />
          )}
        </>
      )}

      <FAQ />
      <Footer />
    </div>
  )
}

// ─── Compare Plans ────────────────────────────────────────────────────────────

const ENTERPRISE_COMPARE = {
  display_name: 'Enterprise',
  price: { monthly: 0, yearly: 0 },
  limits: {
    cloud_kb: -1, image: -1, autocomplete: -1, local_kb: -1,
    internet_search: -1, rpm: -1, cepm: -1, rpd: -1, rot: -1,
    access: {
      chat: true,
      context: { git: true, commits: true, docs: true, codebase: { local: true, cloud: true, current: true } },
      modes: { eco: true, normal: true, pro: true },
      internet_search: true, byok: true, access_tokens: true, code_evaluation: true,
    },
  },
}

const BUILD_COMPARE_FEATURES = ['rpd', 'image', 'seats', 'cloud_kb', 'internet_search']
const C0_COMPARE_FEATURES    = ['rpm', 'cepm', 'seats', 'cloud_kb', 'internet_search', 'autocomplete', 'image', 'local_kb']

function buildFeatureConfig(mobile: boolean): Record<string, { label: string; render: (plan: any) => React.ReactNode }> {
  const val = (v: string) => mobile
    ? <p className="opacity-80">{v}</p>
    : <span>{v}</span>

  const tick = (ok: boolean) => mobile
    ? <p className="opacity-80">{ok ? '✓ Available' : '✗ Not Available'}</p>
    : ok
      ? <img src="/tick.svg" className="object-fit size-[48%]" alt="Yes" />
      : <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>

  return {
    rpd:             { label: 'Requests Per Day',            render: (p) => val(formatLimitValue(p.limits?.rpd)) },
    rot:             { label: 'Rate of Tokens',              render: (p) => val(formatLimitValue(p.limits?.rot)) },
    rpm:             { label: 'Requests Per Month',          render: (p) => val(formatLimitValue(p.limits?.rpm)) },
    cepm:            { label: 'Code Evaluations Per Month',  render: (p) => val(formatLimitValue(p.limits?.cepm)) },
    seats:           { label: 'Seats',                       render: (p) => val(p.display_name === 'Enterprise' ? 'Unlimited' : '1 Seat') },
    cloud_kb:        { label: 'Knowledge Bases',             render: (p) => val(formatLimitValue(p.limits?.cloud_kb, ' Total')) },
    internet_search: { label: 'Internet Searches',           render: (p) => val(formatLimitValue(p.limits?.internet_search)) },
    autocomplete:    { label: 'Autocomplete',                render: (p) => val(formatLimitValue(p.limits?.autocomplete)) },
    byok:            { label: 'Own API Key',                 render: (p) => tick(p.limits?.access?.byok) },
    chat:            { label: 'Chat Access',                 render: (p) => tick(p.limits?.access?.chat) },
    code_evaluation: { label: 'Code Evaluation',             render: (p) => tick(p.limits?.access?.code_evaluation) },
    image:           { label: 'Image Support',               render: (p) => val(formatLimitValue(p.limits?.image)) },
    local_kb:        { label: 'Local Knowledge Base',        render: (p) => val(formatLimitValue(p.limits?.local_kb)) },
  }
}

function ComparePlans({ plans, selectedProduct }: { plans: Plan[]; selectedProduct: string }) {
  const proPlan   = plans.find((p) => p.display_name.toLowerCase() === 'pro')
  const teamsPlan = plans.find((p) => p.display_name.toLowerCase() === 'teams')
  const allPlans  = [proPlan, teamsPlan, ENTERPRISE_COMPARE].filter(Boolean)
  const features  = selectedProduct === 'build' ? BUILD_COMPARE_FEATURES : C0_COMPARE_FEATURES
  const config    = buildFeatureConfig(false)
  const configMob = buildFeatureConfig(true)

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex pb-10 w-full flex-col items-center">
        <div className="w-full flex justify-between border-b border-gray-500/35 h-32 px-10 py-10">
          <h1 className="text-5xl font-semibold">
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">Compare</span> Plans
          </h1>
          <div className="flex gap-[5.7rem] text-2xl">
            {allPlans.map((plan: any, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="font-semibold">{plan.display_name}</span>
                <span className="text-xl opacity-35">
                  {plan.display_name === 'Enterprise' ? 'Custom' : `$${plan.price.monthly}/mo`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full">
          {features.map((key) => {
            const f = config[key]
            if (!f) return null
            return (
              <div key={key} className="w-full flex justify-between border-b border-gray-500/35 px-10 py-3 items-center">
                <span className="text-xl font-semibold pl-8">{f.label}</span>
                <div className="flex gap-16 text-lg">
                  {allPlans.map((plan, i) => (
                    <div key={i} className="flex justify-center items-center w-[7.7rem]">
                      {f.render(plan)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="pb-10 w-full lg:hidden flex flex-col items-center">
        <h1 className="text-[10vw] font-semibold text-center w-full mb-4">
          <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">Compare</span> Plans
        </h1>
        <Accordion className="flex w-[90%] flex-col gap-3" transition={{ duration: 0.2, ease: 'easeInOut' }}>
          {features.map((key) => {
            const f = configMob[key]
            if (!f) return null
            return (
              <AccordionItem key={key} value={key} className="border-b pb-3">
                <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold">
                  {f.label}
                </AccordionTrigger>
                <AccordionContent className="mt-4 pb-5">
                  <div className="flex flex-col w-full gap-8">
                    {allPlans.map((plan: any, i) => (
                      <div key={i} className={`flex w-full justify-between ${i < allPlans.length - 1 ? 'border-b pb-3' : ''}`}>
                        <span className="text-xl">{plan.display_name}</span>
                        {f.render(plan)}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'What kind of coding errors does your tool help fix?',
    a: 'Our tool can help fix a variety of coding errors, including syntax errors, logical errors, performance issues and even run-time errors. We use advanced algorithms and machine learning techniques to analyze your code and provide suggestions for improvement.',
  },
  {
    q: 'How does your tool perform code reviews?',
    a: "CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.",
  },
  {
    q: 'Can your tool optimize code automatically?',
    a: "CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.",
  },
  {
    q: 'Is my code kept private and secure?',
    a: "Our tool supports all programming languages and frameworks including but not limited to Python, JavaScript, Java, C++, C#, PHP, TypeScript, Ruby, Swift, Go, Kotlin, Rust, R, MATLAB, Perl, Shell scripting, SQL, Objective-C, Scala, Haskell, Dart, Elixir, Erlang, Fortran and Prolog. We're constantly adding support for new languages, so if you don't see your language working with CodeMate, please contact us and let us know.",
  },
  {
    q: 'How do I get started with your tool?',
    a: 'CodeMate offers a quick and easy way to fix your coding errors, without the need for switching your existing environment. If you are working in Visual Studio Code, you can simply install CodeMate extension there and start using. Or else, you can use our own IDE to code and fix your errors.',
  },
  {
    q: 'How accurate are results generated by CodeMate?',
    a: "The accuracy of the results generated by CodeMate depends on several factors, including the quality and specificity of the code description provided by the user. Our models are trained on the latest data available from sources such as Stack Overflow and open-source repositories, but it's important to note that they may not always produce perfect results. However, users can edit and refine the results as needed to ensure they meet their specific requirements.",
  },
]

function FAQ() {
  return (
    <div className="pb-10 w-full flex flex-col items-center mt-32 mb-10">
      <h1 id="faq" className="scroll-mt-32 text-3xl lg:text-5xl font-semibold text-center mb-8 px-10">
        Frequently
        <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent"> Asked</span> Questions
      </h1>
      <Accordion className="flex w-[90%] lg:w-[50%] flex-col gap-3" transition={{ duration: 0.2, ease: 'easeInOut' }}>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.q} value={item.q} className="border-b pb-3">
            <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold">
              {item.q}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-5">
                <p className="text-zinc-500">{item.a}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function PricingPage() {
  return (
    <React.Suspense fallback={<div className="w-full h-screen bg-zinc-950" />}>
      <Page />
    </React.Suspense>
  )
}

export default PricingPage