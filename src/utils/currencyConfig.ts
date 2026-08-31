export type CurrencyCode = 'USD' | 'INR' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  rateVsUsd: number;
  flag: string;
  roi: {
    defaultSalary: number;
    minSalary: number;
    maxSalary: number;
    step: number;
    salaryLabel: string;
    formatSalary: (val: number) => string;
  };
}

export const EUR_DISPLAY_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES', 'HR',
  'GB', 'CH', 'NO', 'SE', 'DK', 'PL', 'CZ', 'HU', 'RO', 'BG', 'IS',
]);

export interface ExchangeRateStore {
  rates: Record<CurrencyCode, number>;
  lastUpdated: string;
  source: string;
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRateStore = {
  rates: {
    USD: 1,
    INR: 85,
    EUR: 0.92,
  },
  lastUpdated: '2026-08-30T00:00:00Z',
  source: 'baseline_market_rates',
};

export const EXCHANGE_RATE_STORE: ExchangeRateStore = DEFAULT_EXCHANGE_RATES;

export async function fetchLiveExchangeRates(): Promise<ExchangeRateStore> {
  return EXCHANGE_RATE_STORE;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'INR (₹)',
    locale: 'en-IN',
    rateVsUsd: EXCHANGE_RATE_STORE.rates.INR,
    flag: '🇮🇳',
    roi: {
      defaultSalary: 1200000,
      minSalary: 300000,
      maxSalary: 6000000,
      step: 50000,
      salaryLabel: 'Annual Salary (₹ LPA)',
      formatSalary: (val: number) => `₹${(val / 100000).toFixed(1)} LPA`,
    },
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'USD ($)',
    locale: 'en-US',
    rateVsUsd: EXCHANGE_RATE_STORE.rates.USD,
    flag: '🇺🇸',
    roi: {
      defaultSalary: 120000,
      minSalary: 40000,
      maxSalary: 300000,
      step: 5000,
      salaryLabel: 'Annual Salary ($/yr)',
      formatSalary: (val: number) => `$${(val / 1000).toFixed(0)}k/yr`,
    },
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'EUR (€)',
    locale: 'de-DE',
    rateVsUsd: EXCHANGE_RATE_STORE.rates.EUR,
    flag: '🇪🇺',
    roi: {
      defaultSalary: 65000,
      minSalary: 30000,
      maxSalary: 200000,
      step: 2500,
      salaryLabel: 'Annual Salary (€/yr)',
      formatSalary: (val: number) => `€${(val / 1000).toFixed(0)}k/yr`,
    },
  },
};

export function getCurrencyByCountry(countryCode?: string): CurrencyCode {
  if (!countryCode) return 'USD';
  const upper = countryCode.toUpperCase();
  if (upper === 'IN') return 'INR';
  if (EUR_DISPLAY_COUNTRIES.has(upper)) return 'EUR';
  return 'USD';
}

export function getCurrencyByTimeZone(timeZone?: string): CurrencyCode {
  if (!timeZone) {
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'USD';
    }
  }
  if (!timeZone) return 'USD';
  const tz = timeZone.toLowerCase();
  if (
    tz.includes('calcutta') ||
    tz.includes('kolkata') ||
    tz.includes('delhi') ||
    tz.includes('mumbai') ||
    tz.includes('chennai') ||
    tz.includes('india') ||
    tz === 'ist'
  ) {
    return 'INR';
  }
  if (tz.startsWith('europe/') || tz === 'atlantic/reykjavik') return 'EUR';
  return 'USD';
}

export function convertFromUsd(usdAmount: number, targetCurrency: CurrencyCode): number {
  if (Number.isNaN(usdAmount) || usdAmount === 0) return 0;
  return Math.round(usdAmount * CURRENCY_CONFIGS[targetCurrency].rateVsUsd);
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  options?: { compact?: boolean; maximumFractionDigits?: number }
): string {
  if (Number.isNaN(amount)) return `${CURRENCY_CONFIGS[currency].symbol}0`;
  const cfg = CURRENCY_CONFIGS[currency];

  if (options?.compact) {
    if (currency === 'INR') {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
      if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
    } else {
      if (amount >= 1000000) return `${cfg.symbol}${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `${cfg.symbol}${(amount / 1000).toFixed(0)}k`;
    }
  }

  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: cfg.code,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}
