'use client'
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Footer from '@/components/footer';
import { Montserrat } from 'next/font/google';
import { ShineBorder } from '@/components/ui/shainingBoader';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ChevronUp } from 'lucide-react';
import PlanCard from './components/PlanCard';
import QuickPresetsGrid from './components/QuickPresetsGrid';
import CompactCustomCredits from './components/CompactCustomCredits';
import { fetchAndCategorizePlans, convertToPlanInfo, formatLimitValue, type CategorizedPlans, type Plan, type PlanLimits } from '@/utils/planUtils';
import CustomPlanBuilder from './components/CustomPlanBuilder';
import FreeTrialBanner from './components/FreeTrialBanner';
import EventOffer from './components/EventOffer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

// ─── Static Cora plan definitions ────────────────────────────────────────────
const CORA_SHARED_FEATURES = [
  "Uninterrupted Access to SOTA proprietary Models",
  "Architect mode",
  "Generate architectural and system diagrams with SVG Export",
  "Integration with file system, terminal and browser",
  "Access to Knowledge base",
  "Agentic Search",
  "Jetbrains and VS Code Plugins",
]

// Cora plans now use billingPeriods inside each card
const CORA_PLANS = [
  {
    id: 'cora-free',
    name: 'Free',
    title: "Free",
    description: 'Get started with Cora at no cost',
    yearlyPrice: '',
    currency: 'USD',
    highlight: false,
    isAnnual: true,
    features: ["B0 Unlimited requests", ...CORA_SHARED_FEATURES],
    monthlyCtaText: 'Get Started',
    monthlyCtaLink: '#',
    yearlyCtaText: 'Get Started',
    yearlyCtaLink: '#',
  },
  {
    id: 'cora-pro',
    name: 'Pro',
    title: 'Pro',
    description: 'Unlimited access — B0 + classifier-based X2',
    yearlyPrice: '20',
    currency: 'USD',
    highlight: false,
    features: [
      "B0 Unlimited requests",
      "X2 Classifier-based access",
      ...CORA_SHARED_FEATURES,
    ],
    monthlyCtaText: 'Get Pro',
    monthlyCtaLink: '#',
    yearlyCtaText: 'Get Pro',
    yearlyCtaLink: '#',
    billingPeriods: [
      { label: 'Daily', price: '1', ctaText: 'Get Pro – $1/day', ctaLink: '' },
      { label: 'Weekly', price: '5', ctaText: 'Get Pro – $5/week', ctaLink: '' },
      { label: 'Monthly', price: '20', ctaText: 'Get Pro – $20/mo', ctaLink: '' },
    ],
  },
  {
    id: 'cora-pro-plus',
    name: 'Pro Plus',
    title: 'Pro Plus',
    description: 'Unlimited access — X2 only',
    yearlyPrice: '100',
    currency: 'USD',
    highlight: false,
    features: [
      "X2 Unlimited requests",
      ...CORA_SHARED_FEATURES,
    ],
    monthlyCtaText: 'Get Pro Plus',
    monthlyCtaLink: '#',
    yearlyCtaText: 'Get Pro Plus',
    yearlyCtaLink: '#',
    billingPeriods: [
      { label: 'Daily', price: '5', ctaText: 'Get Pro Plus – $5/day', ctaLink: '' },
      { label: 'Weekly', price: '25', ctaText: 'Get Pro Plus – $25/week', ctaLink: '' },
      { label: 'Monthly', price: '100', ctaText: 'Get Pro Plus – $100/mo', ctaLink: '' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────

function Page() {
  const router = useRouter();
  const ref = useRef(null);
  const [oneTimePlan, setOneTimePlan] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('build');
  const [isPlan1, setIsPlan1] = useState(true);
  const [isPlan2, setIsPlan2] = useState(false);
  const [isPlan3, setIsPlan3] = useState(false);
  const [IsMascot, setIsMascot] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(true);

  // State for API plans
  const [categorizedPlans, setCategorizedPlans] = useState<CategorizedPlans | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  // Refs for dynamic pill positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const plan1Ref = useRef<HTMLButtonElement>(null);
  const plan2Ref = useRef<HTMLButtonElement>(null);
  const plan3Ref = useRef<HTMLButtonElement>(null);
  const [pillPosition, setPillPosition] = useState({ x: 0, width: 0 });

  function handleCurrPlan(e: number) {
    if (e === 1) setSelectedProduct('build');
    if (e === 2) setSelectedProduct('cora');
    if (e === 3) setSelectedProduct('c0');
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  useMotionValueEvent(scrollYProgress, 'change', e => {
    if (e >= 0.3) setIsMascot(true);
    if (e <= 0.3) setIsMascot(false);
  });

  // Calculate product pill position dynamically
  useLayoutEffect(() => {
    const updatePillPosition = () => {
      const container = containerRef.current;
      const activeRef = selectedProduct === 'build' ? plan1Ref : selectedProduct === 'cora' ? plan2Ref : plan3Ref;

      if (container && activeRef.current) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeRef.current.getBoundingClientRect();
        setPillPosition({
          x: (buttonRect.left - containerRect.left),
          width: buttonRect.width,
        });
      }
    };

    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [selectedProduct]);

  // Fetch plans from API
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoadingPlans(true);
        setPlansError(null);
        const plans = await fetchAndCategorizePlans();
        setCategorizedPlans(plans);
      } catch (error) {
        console.error('Failed to load plans:', error);
        setPlansError('Failed to load pricing plans. Please try again later.');
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadPlans();
  }, []);

  const enterprisePlan = {
    id: 5,
    name: "Enterprise",
    title: "Enterprise",
    description: "For large teams and organizations",
    yearlyPrice: "",
    currency: "USD",
    highlight: false,
    isAnnual: true,
    features: [
      "Dedicated Account Manager.",
      "On-premises Deployment.",
      "Custom fine-tuned models.",
      "Search & Chat with Documentation & Codebases.",
      "Priority Support.",
      "Custom LLM Models",
      "Rule based Code Review",
    ],
    monthlyCtaText: "Contact Us",
    monthlyCtaLink: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4",
    yearlyCtaText: "Contact Us",
    yearlyCtaLink: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3dPhmeb8CJ8hq68i5_SFuSkbhhRpHTpQMrki9A0QN5pf2cqwgJgbkWsFrxe1jbH_LZCH-8V2H4",
  }

  return (
    <div ref={ref} className={`${montserrat.className} w-full bg-zinc-950`}>
      {/* navbar */}
      <div
        style={{ zIndex: 999999999999, }}
        className='hidden lg:flex  fixed  top-0 justify-center items-center w-full'>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            background: 'rgba(15, 20, 20, 0.45)',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 999999999999,
          }}
          className={`mt-5 w-[90%]  bg-opacity-65 z-[9999999999] rounded-lg border-y-[1px]   border-gray-400 border-opacity-10`}>
          <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
            <div className='flex   justify-between items-center w-full h-10'>
              <div className="h-fit w-[14rem] flex justify-center overflow-hidden">
                <img onClick={() => router.push('/')} src="/codemateLogo.svg" alt="" className="cursor-pointer" />
              </div>
              <div className={`flex gap-5 text-md  justify-center items-center cursor-pointer text-right `}>
                <motion.h1 onClick={() => router.push("/")} whileHover={{ opacity: 1 }} className='flex text-center justify-center items-center opacity-65 gap-1'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
                <a href="https://app.codemate.ai" target='_blank'>
                  <motion.button whileHover={{ opacity: 1, scale: 1.05 }} className={`${montserrat.className} px-2 py-1  bg-[#FFFFFF] text-black  rounded-sm font-semibold opacity-85`}>Get Started</motion.button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* navbar */}

      {/* mobile Navbar */}
      <div
        style={{ zIndex: 999999999999, }}
        className='lg:hidden fixed flex top-0 justify-center items-center w-full'>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            background: 'rgba(15, 20, 20, 0.45)',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 999999999999,
          }}
          className={`mt-5 w-[90%]  bg-opacity-65 z-[9999999999] rounded-lg border-y-[1px]   border-gray-400 border-opacity-10`}>
          <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
            <div className='flex   justify-between items-center w-full h-fit'>
              <div className="h-fit w-[30vw] flex justify-center overflow-hidden">
                <img src="/codemateLogo.svg" alt="" />
              </div>
              <div className={`flex gap-5 text-md  justify-center items-center cursor-pointer text-right `}>
                <motion.h1 onClick={() => router.push("/")} whileHover={{ opacity: 1 }} className='flex text-center justify-center items-center opacity-65 gap-1'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
                <button className={` px-2 py-1  bg-[#FFFFFF] text-black text-sm rounded-sm font-semibold opacity-85`}>Get Started</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* mobile responsivess */}

      <div className='flex flex-col'>
        <h1 className='text-4xl font-semibold text-center pt-32 pb-1 text-primary'>Pricing</h1>
        <p className='text-center text-4xl mt-1 opacity-60'>Choose a plan which feels right for you.</p>
      </div>

      {/* Product selector pill */}
      <div className='flex justify-center mt-10 mb-10 border border-zinc-500 w-fit mx-auto rounded-full p-1 bg-white/5'>
        <div
          ref={containerRef}
          role="tablist"
          aria-label="Pricing plans"
          className='relative text-xl py-0 rounded-full flex gap-4 items-center'
        >
          {/* Animated background pill */}
          <motion.div
            initial={{
              x: pillPosition.x,
              width: pillPosition.width,
            }}
            animate={{
              x: pillPosition.x,
              width: pillPosition.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className='absolute inset-y-0 my-auto h-9 rounded-full bg-white'
          />

          {/* Plan buttons */}
          <button
            ref={plan1Ref}
            onClick={() => handleCurrPlan(1)}
            onKeyDown={(e) => e.key === 'Enter' && handleCurrPlan(1)}
            role="tab"
            aria-selected={selectedProduct === 'build'}
            aria-controls="plan-content"
            className={`${selectedProduct === 'build' ? 'text-black' : 'text-white'
              } font-semibold z-20 cursor-pointer transition-colors duration-200 px-4 py-1 focus:outline-none rounded-full text-md`}
          >
            Build
          </button>

          <button
            ref={plan2Ref}
            onClick={() => handleCurrPlan(2)}
            onKeyDown={(e) => e.key === 'Enter' && handleCurrPlan(2)}
            role="tab"
            aria-selected={selectedProduct === 'cora'}
            aria-controls="plan-content"
            className={`${selectedProduct === 'cora' ? 'text-black' : 'text-white'
              } font-semibold z-20 cursor-pointer transition-colors duration-200 px-4 py-1 focus:outline-none rounded-full text-md`}
          >
            Cora
          </button>

          <button
            ref={plan3Ref}
            onClick={() => handleCurrPlan(3)}
            onKeyDown={(e) => e.key === 'Enter' && handleCurrPlan(3)}
            role="tab"
            aria-selected={selectedProduct === 'c0'}
            aria-controls="plan-content"
            className={`${selectedProduct === 'c0' ? 'text-black' : 'text-white'
              } font-semibold z-20 cursor-pointer transition-colors duration-200 px-4 py-1 focus:outline-none rounded-full text-md`}
          >
            C0
          </button>
        </div>
      </div>


      {/* ── Build plans ─────────────────────────────────────────────────────── */}
      {selectedProduct === 'build' && (
        <div className='flex flex-col lg:flex-row flex-wrap lg:flex-nowrap justify-center items-center lg:items-start gap-6 px-4 lg:px-[6vw]'>
          {isLoadingPlans ? (
            <div className="text-white text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading plans...</p>
            </div>
          ) : plansError ? (
            <div className="text-red-400 text-center py-20">
              <p>{plansError}</p>
            </div>
          ) : categorizedPlans && categorizedPlans.build.length > 0 && (
            <>
              {categorizedPlans.build.map((plan, index) => {
                const isRecommended = false;
                return (
                  <PlanCard
                    key={plan._id}
                    planInfo={convertToPlanInfo(plan, isRecommended)}
                  />
                );
              })}
              {/* Enterprise Plan */}
              <PlanCard planInfo={enterprisePlan} />
            </>
          )}
        </div>
      )}

      {/* Comparison Table for Build */}
      {selectedProduct === 'build' && categorizedPlans && categorizedPlans.build.length > 0 && (
        <div>
          <ComparePlans plans={categorizedPlans.build} selectedProduct="build" />
          <ComparePlansMobile plans={categorizedPlans.build} selectedProduct="build" />
        </div>
      )}


      {/* ── Cora plans ──────────────────────────────────────────────────────── */}
      {selectedProduct === 'cora' && (
        <div className='flex flex-col lg:flex-row flex-wrap lg:flex-nowrap justify-center items-center lg:items-start gap-6 px-4 lg:px-[6vw] w-full'>
          {CORA_PLANS.map((plan) => {
            // Find matching backend plan by display_name (case-insensitive)
            const backendPlan = categorizedPlans?.cora?.find(
              (p) => p.display_name.toLowerCase() === plan.name.toLowerCase()
            )

            // Hydrate billingPeriods ctaLink from backend stripe_id if available
            const hydratedBillingPeriods = plan.billingPeriods?.map((period) => {
              const key = period.label.toLowerCase() as 'daily' | 'weekly' | 'monthly'
              const stripeId = (backendPlan as any)?.stripe_id?.[key]
              return stripeId ? { ...period, ctaLink: stripeId } : period
            })

            return (
              <PlanCard
                key={plan.id}
                planInfo={{
                  ...plan,
                  _id: plan.id,
                  isCustom: false,
                  stripe_plan_id: plan.id,
                  ...(hydratedBillingPeriods && { billingPeriods: hydratedBillingPeriods }),
                }}
              />
            )
          })}
        </div>
      )}


      {/* ── C0 plans ────────────────────────────────────────────────────────── */}
      
      {selectedProduct === 'c0' &&
        <div className='flex flex-col lg:flex-row flex-wrap lg:flex-nowrap justify-center items-center lg:items-start gap-6 px-4 lg:px-[6vw]'>
          {isLoadingPlans ? (
            <div className="text-white text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading plans...</p>
            </div>
          ) : plansError ? (
            <div className="text-red-400 text-center py-20">
              <p>{plansError}</p>
            </div>
          ) : categorizedPlans && categorizedPlans.c0.length > 0 && (
            <>
              {categorizedPlans.c0.map((plan, index) => {
                const isRecommended = false;
                return (
                  <PlanCard
                    key={plan._id}
                    planInfo={convertToPlanInfo(plan, isRecommended)}
                  />
                );
              })}
              {/* Enterprise Plan */}
              <PlanCard planInfo={enterprisePlan} />
            </>
          )}
        </div>}

      {/* Comparison Table for C0 */}
      {selectedProduct === 'c0' && categorizedPlans && categorizedPlans.c0.length > 0 && (
        <div>
          <ComparePlans plans={categorizedPlans.c0} selectedProduct="c0" />
          <ComparePlansMobile plans={categorizedPlans.c0} selectedProduct="c0" />
        </div>
      )}

      <FAQ />
      <Footer />

    </div>
  )
}

export default Page




function ComparePlans({ plans, selectedProduct }: { plans: Plan[], selectedProduct: string }) {
  const proPlan = plans.find(p => p.display_name.toLowerCase() === 'pro')
  const teamsPlan = plans.find(p => p.display_name.toLowerCase() === 'teams')

  type FeatureKey = keyof PlanLimits | 'seats' | 'byok' | 'chat' | 'code_evaluation'

  const buildFeatures = [
    'rpd',
    'image',
    'seats',
    'cloud_kb',
    'internet_search',
  ]

  const c0Features = [
    'rpm',
    'cepm',
    'seats',
    'cloud_kb',
    'internet_search',
    'autocomplete',
    'image',
    'local_kb',
  ]

  const featuresToShow = selectedProduct === 'build' ? buildFeatures : c0Features

  const enterprisePlan = {
    display_name: 'Enterprise',
    price: { monthly: 0, yearly: 0 },
    limits: {
      cloud_kb: -1,
      image: -1,
      autocomplete: -1,
      local_kb: -1,
      internet_search: -1,
      rpm: -1,
      cepm: -1,
      rpd: -1,
      rot: -1,
      access: {
        chat: true,
        context: { git: true, commits: true, docs: true, codebase: { local: true, cloud: true, current: true } },
        modes: { eco: true, normal: true, pro: true },
        internet_search: true,
        byok: true,
        access_tokens: true,
        code_evaluation: true
      }
    }
  }

  const allPlans = [proPlan, teamsPlan, enterprisePlan].filter(Boolean)

  const featureConfig: Record<any, {
    label: string
    render: (plan: any) => React.ReactNode
  }> = {
    rpd: {
      label: 'Requests Per Day',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.rpd)}</h1>
    },
    rot: {
      label: 'Rate of Tokens',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.rot)}</h1>
    },
    rpm: {
      label: 'Requests Per Month',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.rpm)}</h1>
    },
    cepm: {
      label: 'Code Evaluations Per Month',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.cepm)}</h1>
    },
    seats: {
      label: 'Seats',
      render: (plan) => <h1>{plan.display_name === 'Enterprise' ? 'Unlimited' : '1 Seat'}</h1>
    },
    cloud_kb: {
      label: 'Knowledge bases',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.cloud_kb, ' Total')}</h1>
    },
    internet_search: {
      label: 'Internet Searches',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.internet_search)}</h1>
    },
    autocomplete: {
      label: 'Autocomplete',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.autocomplete)}</h1>
    },
    byok: {
      label: 'Own API Key',
      render: (plan) => plan.limits?.access?.byok ? (
        <img src='/tick.svg' className='object-fit size-[48%]' alt="Available" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      )
    },
    chat: {
      label: 'Chat Access',
      render: (plan) => plan.limits?.access?.chat ? (
        <img src='/tick.svg' className='object-fit size-[48%]' alt="Available" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
      )
    },
    code_evaluation: {
      label: 'Code Evaluation',
      render: (plan) => plan.limits?.access?.code_evaluation ? (
        <img src='/tick.svg' className='object-fit size-[48%]' alt="Available" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
      )
    },
    image: {
      label: 'Image Support',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.image)}</h1>
    },
    local_kb: {
      label: 'Local Knowledge Base',
      render: (plan) => <h1>{formatLimitValue(plan.limits?.local_kb)}</h1>
    }
  }

  return (
    <div className='hidden lg:flex pb-10 w-full flex-col items-center'>
      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 h-[8rem] px-10 py-10'>
        <h1 className='text-5xl font-semibold mb-2'>
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans
        </h1>

        <div className='flex gap-[5.7rem] text-2xl'>
          {allPlans.map((plan: any, idx: number) => (
            <div key={idx} className='flex flex-col justify-center items-center gap-2'>
              <h1 className='font-semibold'>{plan.display_name}</h1>
              {plan.display_name === 'Enterprise' ? (
                <p className='text-xl opacity-35'>Custom</p>
              ) : (
                <p className='text-xl opacity-35'>${plan.price.monthly}/mo</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='w-full'>
        {featuresToShow.map((featureKey) => {
          const feature = featureConfig[featureKey]
          if (!feature) return null

          return (
            <div key={featureKey} className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10 py-3 items-center'>
              <h1 className='text-xl font-semibold text-left pl-[2rem]'>{feature.label}</h1>
              <div className='flex gap-16 text-lg'>
                {allPlans.map((plan, idx) => (
                  <div key={idx} className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                    {feature.render(plan)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


function ComparePlansMobile({ plans, selectedProduct }: { plans: Plan[], selectedProduct: string }) {
  const proPlan = plans.find(p => p.display_name.toLowerCase() === 'pro')
  const teamsPlan = plans.find(p => p.display_name.toLowerCase() === 'teams')

  type FeatureKey = keyof PlanLimits | 'seats' | 'byok' | 'chat' | 'code_evaluation'

  const buildFeatures = [
    'rpd',
    'image',
    'seats',
    'cloud_kb',
    'internet_search',
  ]

  const c0Features = [
    'rpm',
    'cepm',
    'seats',
    'cloud_kb',
    'internet_search',
    'autocomplete',
    'image',
    'local_kb',
  ]

  const featuresToShow = selectedProduct === 'build' ? buildFeatures : c0Features

  const enterprisePlan = {
    display_name: 'Enterprise',
    price: { monthly: 0, yearly: 0 },
    limits: {
      cloud_kb: -1,
      image: -1,
      autocomplete: -1,
      local_kb: -1,
      internet_search: -1,
      rpm: -1,
      cepm: -1,
      rpd: -1,
      rot: -1,
      access: {
        chat: true,
        context: { git: true, commits: true, docs: true, codebase: { local: true, cloud: true, current: true } },
        modes: { eco: true, normal: true, pro: true },
        internet_search: true,
        byok: true,
        access_tokens: true,
        code_evaluation: true
      }
    }
  }

  const allPlans = [proPlan, teamsPlan, enterprisePlan].filter(Boolean)

  const featureConfig: Record<any, {
    label: string
    render: (plan: any) => React.ReactNode
  }> = {
    rpd: {
      label: 'Requests Per Day',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.rpd)}</p>
    },
    rot: {
      label: 'Rate of Tokens',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.rot)}</p>
    },
    rpm: {
      label: 'Requests Per Month',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.rpm)}</p>
    },
    cepm: {
      label: 'Code Evaluations Per Month',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.cepm)}</p>
    },
    seats: {
      label: 'Seats',
      render: (plan) => <p className='opacity-80'>{plan.display_name === 'Enterprise' ? 'Unlimited' : '1 Seat'}</p>
    },
    cloud_kb: {
      label: 'Knowledge bases',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.cloud_kb, ' Total')}</p>
    },
    internet_search: {
      label: 'Internet Searches',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.internet_search)}</p>
    },
    autocomplete: {
      label: 'Autocomplete',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.autocomplete)}</p>
    },
    byok: {
      label: 'Own API Key',
      render: (plan) => plan.limits?.access?.byok ? (
        <p className='opacity-80'>✓ Available</p>
      ) : (
        <p className='opacity-80'>✗ Not Available</p>
      )
    },
    chat: {
      label: 'Chat Access',
      render: (plan) => plan.limits?.access?.chat ? (
        <p className='opacity-80'>✓ Available</p>
      ) : (
        <p className='opacity-80'>✗ Not Available</p>
      )
    },
    code_evaluation: {
      label: 'Code Evaluation',
      render: (plan) => plan.limits?.access?.code_evaluation ? (
        <p className='opacity-80'>✓ Available</p>
      ) : (
        <p className='opacity-80'>✗ Not Available</p>
      )
    },
    image: {
      label: 'Image Support',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.image)}</p>
    },
    local_kb: {
      label: 'Local Knowledge Base',
      render: (plan) => <p className='opacity-80'>{formatLimitValue(plan.limits?.local_kb)}</p>
    }
  }

  return (
    <div className='pb-10 w-full lg:hidden flex flex-col items-center'>
      <div className='w-full flex justify-between mb-4'>
        <h1 className='text-[10vw] font-semibold text-center w-full'>
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans
        </h1>
      </div>

      <Accordion className='flex w-[90%] flex-col gap-3' transition={{ duration: 0.2, ease: 'easeInOut' }}>
        {featuresToShow.map((featureKey) => {
          const feature = featureConfig[featureKey]
          if (!feature) return null

          return (
            <AccordionItem key={featureKey} value={featureKey} className='border-b-[1px] pb-3'>
              <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
                {feature.label}
              </AccordionTrigger>
              <AccordionContent className='mt-4 pb-5'>
                <div className='flex flex-col w-full justify-between gap-8'>
                  {allPlans.map((plan: any, idx: number) => (
                    <div key={idx} className={`flex w-full justify-between ${idx < allPlans.length - 1 ? 'border-b-[1px] pb-3' : ''}`}>
                      <h1 className='text-xl'>{plan.display_name}</h1>
                      {feature.render(plan)}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}


function FAQ() {
  return (
    <div className='pb-10 w-full  flex flex-col items-center mt-32 mb-10'>
      <div className='w-fullflex justify-between  h-[8rem] px-10'>
        <h1 className='text-3xl lg:text-5xl font-semibold text-center'>
          Frequently
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Asked</span> Questions</h1>
      </div>

      <Accordion className='flex w-[90%] lg:w-[50%] flex-col  gap-3'
        transition={{ duration: 0.2, ease: 'easeInOut' }}>

        <AccordionItem value='Seats' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            What kind of coding errors does your tool help fix?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>Our tool can help fix a variety of coding errors, including syntax errors, logical errors, performance issues and even run-time errors. We use advanced algorithms and machine learning techniques to analyze your code and provide suggestions for improvement.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='Tokens' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            How does your tool perform code reviews?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='Knowledge bases' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            Can your tool optimize code automatically?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='Storage space' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            Is my code kept private and secure?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>Our tool supports all programming languages and frameworks including but not limited to Python, JavaScript, Java, C++, C#, PHP, TypeScript, Ruby, Swift, Go, Kotlin, Rust, R, MATLAB, Perl, Shell scripting, SQL, Objective-C, Scala, Haskell, Dart, Elixir, Erlang, Fortran and Prolog. and many more. We're constantly adding support for new languages, so if you don't see your language working with CodeMate, please contact us and let us know. Moreover, you can also add the documentation of any new language/framework in your Knowledge base and refer it while asking questions to get up-to-date information.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='Debug, Review and Refactor Code' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            How do I get started with your tool?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>CodeMate offers a quick and easy way to fix your coding errors, without the need for switching your existing environment. If you are working in Visual Studio Code, you can simply install CodeMate extension there and start using. Or else, you can use our own IDE to code and fix your errors.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='Integrations' className='border-b-[1px] pb-3'>
          <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
            How accurate is results generated by CodeMate?
          </AccordionTrigger>
          <AccordionContent className='mt-4 pb-5'>
            <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
              <p>The accuracy of the results generated by CodeMate depends on several factors, including the quality and specificity of the code description provided by the user. Our models are trained on the latest data available from sources such as Stack Overflow and open-source repositories, but it's important to note that they may not always produce perfect results. However, users can edit and refine the results as needed to ensure that they meet their specific requirements. Overall, we strive to provide the most accurate and useful results possible to help developers improve their code</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}