'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencyCode, CURRENCY_CONFIGS } from '@/utils/currencyConfig';

export default function CurrencySelector({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [mounted, setMounted] = React.useState(false);
  const currencies: CurrencyCode[] = ['USD', 'INR', 'EUR'];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`flex items-center bg-zinc-900/80 border border-zinc-800 rounded-lg p-0.5 ${className}`}>
      {currencies.map((code) => {
        const cfg = CURRENCY_CONFIGS[code];
        const isActive = (mounted ? currency : 'USD') === code;
        return (
          <button
            key={code}
            type="button"
            suppressHydrationWarning
            onClick={() => setCurrency(code)}
            className={`relative px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {isActive && (
              <motion.div
                layoutId="currencyPill"
                className="absolute inset-0 bg-zinc-800 rounded-md shadow-sm border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-xs">{cfg.flag}</span>
            <span className="relative z-10">{cfg.code}</span>
          </button>
        );
      })}
    </div>
  );
}
