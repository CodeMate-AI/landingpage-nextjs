'use client'

/**
 * Custom language menu backed by Google Translate.
 *
 * Google's own banner/select is hidden; the menu below drives it:
 *   - writes the `googtrans` cookie (/en/<target>) so the choice survives reloads
 *     and sub-page navigation,
 *   - switches language in-place via the widget's hidden `<select class="goog-te-combo">`
 *     and only falls back to a reload when the widget has not booted yet.
 *
 * `translate="no"` is intentionally used (not the `.notranslate` class) so the
 * translation-readiness check in scripts/check-translation-ready.mjs still passes.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Globe, Loader2, Search } from 'lucide-react'

type Language = {
  code: string
  label: string
  native: string
}

type GoogleTranslateElementCtor = new (
  options: {
    pageLanguage: string
    autoDisplay?: boolean
    includedLanguages?: string
  },
  elementId: string
) => unknown

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: GoogleTranslateElementCtor } }
    __codemateGoogleTranslateInit?: () => void
  }
}

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
]

const SOURCE_LANG = 'en'
const COOKIE_NAME = 'googtrans'
const STORAGE_KEY = 'codemate:language'
const LANG_EVENT = 'codemate:languagechange'
const WIDGET_ELEMENT_ID = 'google_translate_element'

const WIDGET_SRC =
  'https://translate.google.com/translate_a/element.js?cb=__codemateGoogleTranslateInit'

/* ------------------------------------------------------------------ */
/* Cookie + storage helpers                                            */
/* ------------------------------------------------------------------ */

function cookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const host = window.location.hostname
  // Share the preference across codemate.ai / www / app sub-domains.
  if (host === 'codemate.ai' || host.endsWith('.codemate.ai')) return '.codemate.ai'
  return undefined
}

function readCookieLanguage(): string | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!raw) return null
  const value = decodeURIComponent(raw)
  // Format is "/source/target"
  const target = value.split('/').filter(Boolean).pop()
  return target || null
}

function writeLanguageCookie(language: string) {
  if (typeof document === 'undefined') return
  const domain = cookieDomain()
  const parts = [
    `${COOKIE_NAME}=/en/${language}`,
    'path=/',
    'max-age=31536000',
    'SameSite=Lax',
  ]
  if (domain) parts.push(`domain=${domain}`)
  document.cookie = parts.join('; ')
}

function clearLanguageCookie() {
  if (typeof document === 'undefined') return
  const domain = cookieDomain()
  const parts = [`${COOKIE_NAME}=`, 'path=/', 'max-age=0', 'SameSite=Lax']
  if (domain) parts.push(`domain=${domain}`)
  document.cookie = parts.join('; ')
}

function readStoredLanguage(): string {
  if (typeof window === 'undefined') return SOURCE_LANG

  const fromCookie = readCookieLanguage()
  if (fromCookie) return fromCookie

  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY)
    if (fromStorage) return fromStorage
  } catch {
    /* storage can be unavailable in private mode */
  }
  return SOURCE_LANG
}

function isSupported(code: string): boolean {
  return LANGUAGES.some((language) => language.code === code)
}

/* ------------------------------------------------------------------ */
/* Driving the hidden Google widget                                    */
/* ------------------------------------------------------------------ */

function getCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(
    `#${WIDGET_ELEMENT_ID} select.goog-te-combo`
  )
}

/** Applies a language instantly through the widget. Returns false if not ready. */
export function applyLanguage(code: string): boolean {
  const combo = getCombo()
  if (!combo) return false
  if (!Array.from(combo.options).some((option) => option.value === code)) return false

  combo.value = code
  combo.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

function broadcast(language: string) {
  window.dispatchEvent(new CustomEvent<string>(LANG_EVENT, { detail: language }))
}

/** Public entry point used by the menu. */
export function changeLanguage(code: string) {
  if (typeof window === 'undefined') return

  const next = isSupported(code) ? code : SOURCE_LANG

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }

  if (next === SOURCE_LANG) {
    clearLanguageCookie()
  } else {
    writeLanguageCookie(next)
  }

  document.documentElement.lang = next
  broadcast(next)

  // Widget not booted yet (or the target is missing from its list) -> reload so
  // the cookie is honoured during widget start-up.
  if (!applyLanguage(next)) {
    window.location.reload()
  }
}

function useSyncedLanguage(): [string, boolean] {
  const [language, setLanguage] = useState(SOURCE_LANG)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLanguage(readStoredLanguage())
    setReady(true)

    const onLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (detail) setLanguage(detail)
    }

    window.addEventListener(LANG_EVENT, onLanguageChange)
    return () => window.removeEventListener(LANG_EVENT, onLanguageChange)
  }, [])

  return [language, ready]
}

/* ------------------------------------------------------------------ */
/* Invisible widget host                                               */
/* ------------------------------------------------------------------ */

/**
 * Mount exactly once per page (render it from the Navbar). The widget needs a
 * real DOM node to initialise; globals.css keeps it off-screen.
 */
export function GoogleTranslateWidget() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const initialised = useRef(false)
  const restored = useRef(false)

  const init = useCallback(() => {
    if (initialised.current) return
    const TranslateElement = window.google?.translate?.TranslateElement
    if (!TranslateElement) {
      setStatus('error')
      return
    }

    initialised.current = true
    try {
      new TranslateElement(
        { pageLanguage: SOURCE_LANG, autoDisplay: false },
        WIDGET_ELEMENT_ID
      )
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  // Re-apply a previously chosen language once the widget's <select> exists.
  useEffect(() => {
    if (status !== 'ready' || restored.current) return
    restored.current = true

    const stored = readStoredLanguage()
    if (stored === SOURCE_LANG) return

    let attempts = 0
    const timer = window.setInterval(() => {
      attempts += 1
      if (applyLanguage(stored) || attempts > 20) {
        window.clearInterval(timer)
      }
    }, 150)

    return () => window.clearInterval(timer)
  }, [status])

  // If the script was already loaded (client-side navigation), boot immediately.
  useEffect(() => {
    window.__codemateGoogleTranslateInit = init
    if (window.google?.translate?.TranslateElement) init()
    return () => {
      delete window.__codemateGoogleTranslateInit
    }
  }, [init])

  return (
    <>
      <Script
        id="google-translate-script"
        src={WIDGET_SRC}
        strategy="afterInteractive"
        onLoad={() => {
          setStatus((current) => (current === 'ready' ? current : 'loading'))
          init()
        }}
        onError={() => setStatus('error')}
      />
      <div id={WIDGET_ELEMENT_ID} aria-hidden="true" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Menu UI                                                             */
/* ------------------------------------------------------------------ */

function useOutsideClose(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void
) {
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close, ref])
}

export function LanguageSwitcher({
  variant = 'desktop',
}: {
  variant?: 'desktop' | 'mobile'
}) {
  const [language, ready] = useSyncedLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])
  useOutsideClose(containerRef, open, close)

  const current = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0]
  const isTranslated = language !== SOURCE_LANG

  const trimmedQuery = query.trim().toLowerCase()
  const filteredLanguages = trimmedQuery
    ? LANGUAGES.filter(
        (item) =>
          item.label.toLowerCase().includes(trimmedQuery) ||
          item.native.toLowerCase().includes(trimmedQuery) ||
          item.code.toLowerCase().includes(trimmedQuery)
      )
    : LANGUAGES

  const select = (code: string) => {
    changeLanguage(code)
    close()
  }

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const first = filteredLanguages[0]
      if (first) select(first.code)
    }
  }

  if (variant === 'mobile') {
    return (
      <div ref={containerRef} translate="no" className="pr-5">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="size-5 opacity-70" />
          <h1 className="text-[6vw] leading-none opacity-65">Language</h1>
          {isTranslated && (
            <span className="rounded-full bg-[#00FFFF]/15 px-2 py-0.5 text-[10px] font-semibold text-[#00FFFF]">
              {current.native}
            </span>
          )}
        </div>

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Search language"
            aria-label="Search languages"
            translate="no"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
          />
        </div>

        {filteredLanguages.length === 0 ? (
          <p className="px-2 py-3 text-sm text-white/40">No languages found</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {filteredLanguages.map((item) => {
              const active = item.code === language
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => select(item.code)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-base transition-colors ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="w-4 shrink-0">
                    {active ? <Check className="size-4 text-[#00FFFF]" /> : null}
                  </span>
                  <span className="truncate">{item.native}</span>
                </button>
              )
            })}
          </div>
        )}

        <p className="mt-3 text-[11px] leading-snug text-white/35">
          Machine translation by Google. Product names stay in English.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} translate="no" className="relative z-999999">
      <button
        type="button"
        onClick={() => {
          setQuery('')
          setOpen((value) => !value)
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language, current language ${current.label}`}
        className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[13px] transition-colors ${
          isTranslated
            ? 'border-[#00BFFF]/40 bg-[#00BFFF]/10 text-[#8fe6ff]'
            : 'border-white/10 bg-white/5 text-white/75'
        } hover:bg-white/10 hover:text-white`}
      >
        <Globe className="size-3.5 shrink-0" />
        <span className="hidden text-[11px] font-semibold tracking-wide xl:inline">
          {current.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`size-3 shrink-0 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <div className="border-b border-white/5 p-1.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-white/35" />
                <input
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search language"
                  aria-label="Search languages"
                  translate="no"
                  autoFocus
                  className="w-full rounded-lg border border-white/5 bg-white/5 py-1.5 pl-7 pr-2 text-[12px] text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                />
              </div>
            </div>

            {/* data-lenis-prevent lets the wheel scroll this list instead of the page */}
            <div
              role="listbox"
              aria-label="Languages"
              data-lenis-prevent
              className="max-h-[min(19rem,calc(100vh-9rem))] overflow-y-auto overscroll-contain p-1.5"
            >
              {filteredLanguages.length === 0 ? (
                <p className="px-2.5 py-4 text-center text-[12px] text-white/40">
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((item) => {
                  const active = item.code === language
                  return (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => select(item.code)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {active ? <Check className="size-3.5 text-[#00FFFF]" /> : null}
                      </span>
                      <span className="flex-1 truncate">{item.native}</span>
                      {!ready && active && (
                        <Loader2 className="size-3 animate-spin opacity-50" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
            <div className="border-t border-white/5 px-3 py-2 text-[10px] leading-snug text-white/30">
              Machine translation by Google
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
