'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Montserrat } from 'next/font/google'
import { Check, ChevronDown, Send, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import Footer from '@/components/footer'
import { FlagIndia, FlagUSA } from '@/components/flags'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

// Helper to render flag (SVG vector for all countries across Windows/Mac/iOS/Android)
function CountryFlag({ code, className = 'w-5 h-3.5' }: { code: string; fallback?: string; className?: string }) {
  if (code === 'IN') return <FlagIndia className={className} />
  if (code === 'US') return <FlagUSA className={className} />
  return (
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt={`${code} flag`}
      className={`inline-block rounded-sm shadow-sm overflow-hidden shrink-0 object-cover ${className}`}
      loading="lazy"
    />
  )
}

// ==========================================
// COUNTRY CODES DATA
// ==========================================
const COUNTRIES = [
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
]

// Timezone → country code mapping for auto-detection
const TZ_TO_COUNTRY: Record<string, string> = {
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'Europe/London': 'GB',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Asia/Tokyo': 'JP',
  'Asia/Singapore': 'SG',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Seoul': 'KR',
  'America/Sao_Paulo': 'BR',
  'Europe/Amsterdam': 'NL',
  'Europe/Stockholm': 'SE',
  'Asia/Jerusalem': 'IL',
  'Asia/Jakarta': 'ID',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Manila': 'PH',
  'Africa/Lagos': 'NG',
}

const TEAM_SIZES = ['Just me', '2–10', '11–50', '51–200', '201–1000', '1000+']

// ==========================================
// COMPONENT: Country Code Selector
// ==========================================
function CountryCodeSelector({
  selected,
  onChange,
}: {
  selected: typeof COUNTRIES[0]
  onChange: (c: typeof COUNTRIES[0]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-3 h-full border-r border-zinc-800 hover:bg-zinc-800/50 transition-colors rounded-l-lg min-w-[95px]"
      >
        <CountryFlag code={selected.code} fallback={selected.flag} className="w-5 h-3.5" />
        <span className="text-sm text-zinc-300 font-medium">{selected.dial}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50"
        >
          {COUNTRIES.map((c) => (
            <button
              suppressHydrationWarning
              key={c.code}
              type="button"
              onClick={() => {
                onChange(c)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800 transition-colors text-sm ${selected.code === c.code ? 'bg-zinc-800/60 text-white' : 'text-zinc-300'
                }`}
            >
              <CountryFlag code={c.code} fallback={c.flag} className="w-5 h-3.5" />
              <span className="flex-1">{c.name}</span>
              <span className="text-zinc-500 text-xs">{c.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


// ==========================================
// COMPONENT: Custom Team Size Selector
// ==========================================
function TeamSizeSelector({
  selected,
  onChange,
}: {
  selected: string
  onChange: (s: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-left text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00BFFF]/50 focus:ring-1 focus:ring-[#00BFFF]/20 transition-all duration-200 flex items-center justify-between"
      >
        <span className={selected ? 'text-white' : 'text-zinc-600'}>
          {selected || 'Select team size'}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 py-1.5">
          {TEAM_SIZES.map((size) => (
            <button
              suppressHydrationWarning
              key={size}
              type="button"
              onClick={() => {
                onChange(size)
                setOpen(false)
              }}
              className={`w-full flex items-center px-4 py-2.5 text-left hover:bg-zinc-800 transition-colors text-sm ${selected === size ? 'bg-zinc-800/60 text-white font-medium' : 'text-zinc-300'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ContactPage() {
  // Form state
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Country code
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]) // default India

  // Auto-detect country on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const countryCode = TZ_TO_COUNTRY[tz]
      if (countryCode) {
        const found = COUNTRIES.find((c) => c.code === countryCode)
        if (found) setSelectedCountry(found)
      }
    } catch {
      // fallback: India
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    // Form validations for required fields
    if (!name.trim()) {
      setErrorMsg('Full name is required.')
      setIsSubmitting(false)
      return
    }
    if (!company.trim()) {
      setErrorMsg('Company name is required.')
      setIsSubmitting(false)
      return
    }
    if (!teamSize) {
      setErrorMsg('Please select a team size.')
      setIsSubmitting(false)
      return
    }
    if (!email.trim()) {
      setErrorMsg('Email address is required.')
      setIsSubmitting(false)
      return
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number is required.')
      setIsSubmitting(false)
      return
    }
    if (!message.trim()) {
      setErrorMsg('Message is required.')
      setIsSubmitting(false)
      return
    }

    // Map team size option text to numerical value required by API
    const getTeamSizeNumber = (size: string): number => {
      if (size === 'Just me') return 1
      if (size === '2–10') return 10
      if (size === '11–50') return 50
      if (size === '51–200') return 200
      if (size === '201–1000') return 1000
      if (size === '1000+') return 1000
      return 1
    }

    const payload = {
      fullname: name.trim(),
      company_name: company.trim(),
      team_size: getTeamSizeNumber(teamSize),
      phone_number: `${selectedCountry.dial} ${phone.trim()}`,
      email: email.trim(),
      message: message.trim(),
    }

    const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL
    if (!apiUrl) {
      console.error('Error: NEXT_PUBLIC_CONTACT_API_URL is not configured.')
      setErrorMsg('Contact service is temporarily unavailable. Please try again later.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        // Reset form fields
        setName('')
        setCompany('')
        setTeamSize('')
        setEmail('')
        setPhone('')
        setMessage('')
      } else {
        const errorText = data.message || data.error || 'Something went wrong. Please try again.'
        setErrorMsg(errorText)
      }
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMsg('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---- Shared input styles ----
  const inputClass =
    'w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00BFFF]/50 focus:ring-1 focus:ring-[#00BFFF]/20 transition-all duration-200'
  const labelClass = 'block text-zinc-400 text-sm font-medium mb-1.5'

  return (
    <div className={`${montserrat.className} bg-zinc-950 min-h-screen text-white`}>
      {/* ========== PAGE HEADER ========== */}
      <div className="pt-16 lg:pt-20 pb-10 px-6 max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start mb-6"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </a>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent"
        >
          <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">Contact</span> Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl mx-auto"
        >
          Send us a message.
          <span className="block mt-2 text-zinc-500 text-sm md:text-base font-normal">
            We&apos;ll get back to you within one business day.
          </span>
        </motion.p>
      </div>

      {/* ========== 2-COLUMN LAYOUT ========== */}
      <div className="max-w-[1100px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Contact Details & Offices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-3"
          >
            {/* Email Card */}
            <a
              href="mailto:contact@codemate.ai"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3.5 shadow-lg"
            >
              <div className="size-9 rounded-lg bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-zinc-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">Email</span>
                <span className="font-medium text-white text-sm truncate">
                  contact@codemate.ai
                </span>
              </div>
            </a>

            {/* India Card (Location + Phone) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5 shadow-lg">
              <div className="flex items-center gap-2">
                <FlagIndia className="w-5 h-3.5" />
                <span className="text-xs sm:text-sm text-white font-medium tracking-wide">India</span>
              </div>
              <div className="flex flex-col gap-2 pt-1.5 border-t border-zinc-800/70">
                <a
                  href="https://maps.google.com/?q=Berger+Tower%2C+C-001%2FA2+Sector+16B%2C+Noida%2C+Uttar+Pradesh%2C+201301%2C+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed"
                >
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>Berger Tower, C-001/A2 Sector 16B, Noida, Uttar Pradesh, 201301, India</span>
                </a>
                <a
                  href="tel:+918766330253"
                  className="flex items-center gap-2.5 text-xs text-zinc-400 leading-relaxed"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>+91 8766330253</span>
                </a>
              </div>
            </div>

            {/* United States Card (Location + Phone) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5 shadow-lg">
              <div className="flex items-center gap-2">
                <FlagUSA className="w-5 h-3.5" />
                <span className="text-xs sm:text-sm text-white font-medium tracking-wide">United States</span>
              </div>
              <div className="flex flex-col gap-2 pt-1.5 border-t border-zinc-800/70">
                <a
                  href="https://maps.google.com/?q=2290%2C+3rd+Street%2C+San+Francisco%2C+California%2C+94107%2C+USA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed"
                >
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>2290, 3rd Street, San Francisco, California, 94107, USA</span>
                </a>
                <a
                  href="tel:+16283095625"
                  className="flex items-center gap-2.5 text-xs text-zinc-400 leading-relaxed"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>+1 (628) 309-5625</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent">
                Get in Touch
              </h2>

              <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex-1 flex flex-col items-center justify-center gap-4 py-20"
                    >
                      <div className="size-16 rounded-full bg-[#00BFFF]/15 border border-[#00BFFF]/30 flex items-center justify-center">
                        <Check className="w-8 h-8 text-[#00BFFF]" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                      <p className="text-zinc-400 text-sm text-center max-w-xs">
                        Thank you for reaching out. We&apos;ll get back to you within one business day.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5 flex-1"
                    >
                      {/* Name */}
                      <div>
                        <label className={labelClass}>Name</label>
                        <input
                          suppressHydrationWarning
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className={inputClass}
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label className={labelClass}>Company Name</label>
                        <input
                          suppressHydrationWarning
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your company"
                          className={inputClass}
                        />
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Team Size</label>
                        <TeamSizeSelector selected={teamSize} onChange={setTeamSize} />
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          suppressHydrationWarning
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className={inputClass}
                        />
                      </div>

                      {/* Phone with Country Code */}
                      <div>
                        <label className={labelClass}>Phone</label>
                        <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-[#00BFFF]/50 focus-within:ring-1 focus-within:ring-[#00BFFF]/20 transition-all duration-200">
                          <CountryCodeSelector
                            selected={selectedCountry}
                            onChange={setSelectedCountry}
                          />
                          <input
                            suppressHydrationWarning
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Phone number"
                            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className={labelClass}>Message</label>
                        <textarea
                          suppressHydrationWarning
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about your needs..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      {/* Error Alert */}
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm font-medium bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-center"
                        >
                          {errorMsg}
                        </motion.div>
                      )}

                      {/* Spacer to push CTA to bottom */}
                      <div className="flex-1" />

                      {/* Submit */}
                      <motion.button
                        suppressHydrationWarning
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ opacity: isSubmitting ? 0.5 : 0.9 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className={`w-full bg-white text-black font-semibold rounded-lg py-3 mt-1 flex items-center justify-center gap-2 transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
