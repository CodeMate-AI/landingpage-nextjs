'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  CurrencyCode,
  CURRENCY_CONFIGS,
  convertFromUsd,
  formatCurrency,
  getCurrencyByTimeZone,
} from '@/utils/currencyConfig';

interface CurrencyContextType {
  currency: CurrencyCode;
  country: string;
  isLoading: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (usdAmount: number | string) => number;
  formatPrice: (usdAmount: number | string, options?: { compact?: boolean }) => string;
  config: (typeof CURRENCY_CONFIGS)[CurrencyCode];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [country, setCountry] = useState<string>('US');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const saved = localStorage.getItem('cm_user_currency') as CurrencyCode | null;
    if (saved === 'INR' || saved === 'USD' || saved === 'EUR') {
      setCurrencyState(saved);
      setIsLoading(false);
      return;
    }

    // Zero-latency client fallback via Timezone
    const tzCurrency = getCurrencyByTimeZone();
    setCurrencyState(tzCurrency);

    // Edge Geo IP lookup with private no-store cache
    fetch('/api/geo', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.currency && !localStorage.getItem('cm_user_currency')) {
          setCurrencyState(data.currency);
          setCountry(data.country || 'US');
        }
      })
      .catch((err) => console.warn('Geo IP fallback to timezone:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const setCurrency = useCallback((newCurr: CurrencyCode) => {
    setCurrencyState(newCurr);
    localStorage.setItem('cm_user_currency', newCurr);
  }, []);

  const convertPrice = useCallback((usdAmount: number | string): number => {
    const num = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    if (Number.isNaN(num)) return 0;
    return convertFromUsd(num, currency);
  }, [currency]);

  const formatPrice = useCallback((usdAmount: number | string, options?: { compact?: boolean }): string => {
    const num = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    if (Number.isNaN(num)) return `${CURRENCY_CONFIGS[currency].symbol}0`;
    const converted = convertFromUsd(num, currency);
    return formatCurrency(converted, currency, options);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      country,
      isLoading,
      setCurrency,
      convertPrice,
      formatPrice,
      config: CURRENCY_CONFIGS[currency],
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
}
