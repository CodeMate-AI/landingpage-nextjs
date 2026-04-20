import { useState } from 'react'
import { motion } from 'framer-motion'

interface MaxPlanCardProps {
  planInfo: {
    title: string
    description: string
    monthlyPrice: string
    yearlyPrice?: string
    ctaText: string
    monthlyCtaLink: string
    yearlyCtaLink: string
    features: string[]
  }
}

const MaxPlanCard = ({ planInfo }: MaxPlanCardProps) => {
  const [isAnnual, setIsAnnual] = useState(false)

  const currentPrice = isAnnual ? planInfo.yearlyPrice || '2500' : planInfo.monthlyPrice
  const currentCtaLink = isAnnual ? planInfo.yearlyCtaLink : planInfo.monthlyCtaLink
  const periodLabel = isAnnual ? '/ year' : '/ month'

  return (
    <div className="flex flex-col items-center w-full px-4 lg:px-[6vw] gap-6 pt-8 lg:pt-12">

      {/* ── Section heading ── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          All-in-one
        </p>
        <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
          One plan for{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            all
          </span>
        </h2>
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-[1200px]
                   bg-gradient-to-br from-zinc-900 to-zinc-950
                   rounded-3xl p-8 lg:p-12 shadow-2xl border border-zinc-800/50 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ── Left: content ── */}
        <div className="flex-1 flex flex-col gap-6 z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center p-2 shadow-inner">
              <img src="/favicon.ico" alt="CodeMate" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight">{planInfo.title}</h3>
              <p className="text-zinc-400 font-medium">Everything. Unlocked.</p>
            </div>
          </div>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            Get unrestricted access to every CodeMate product — CORA, BUILD, and C0.
            Powered by top-tier models and unmetered requests.
            This is the complete system, without constraints.
          </p>

          <div className="flex items-center gap-6 mt-2">
            <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Includes</span>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 hover:border-zinc-500 transition-all hover:scale-110">
                <img src="/Build_Logo.png" alt="Build" className="w-full h-full object-contain scale-[1.55]" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 hover:border-zinc-500 transition-all hover:scale-110">
                <img src="/Co_Logo.png" alt="C0" className="w-full h-full object-contain" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 hover:border-zinc-500 transition-all hover:scale-110">
                <img src="/CORA_Logo.png" alt="CORA" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: price + CTA ── */}
        <div className="flex flex-col items-baseline lg:items-center justify-center z-10 w-full lg:w-auto mt-10 lg:mt-0 gap-10">
          <div className="flex flex-row-reverse lg:flex-row items-center justify-between w-full lg:w-auto gap-4 lg:gap-0">

            {/* Billing toggle */}
            <div className="flex items-center gap-3 lg:absolute lg:top-8 lg:right-12 z-20">
              <div className="flex items-center gap-2">
                {isAnnual && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-500/30"
                  >
                    SAVE $500
                  </motion.span>
                )}
                <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-zinc-400'}`}>
                  Annual
                </span>
              </div>
              <motion.button
                onClick={() => setIsAnnual(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? 'bg-blue-600' : 'bg-zinc-600'}`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                  animate={{ x: isAnnual ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <motion.span
                key={currentPrice}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-3xl lg:text-4xl font-bold text-white"
              >
                ${currentPrice}
              </motion.span>
              <span className="text-zinc-400 text-base lg:text-lg">{periodLabel}</span>
            </div>
          </div>

          <a href={currentCtaLink} className="flex-shrink-0 w-fit lg:w-[200px] mx-auto lg:mx-0">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#f4f4f5' }}
              whileTap={{ scale: 0.95 }}
              className="w-fit px-8 lg:w-full bg-white text-black font-bold text-sm lg:text-lg py-2 lg:py-4 rounded-full
                         flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-white/10"
            >
              {planInfo.ctaText}
            </motion.button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default MaxPlanCard