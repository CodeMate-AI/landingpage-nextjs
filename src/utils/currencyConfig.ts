export type CurrencyCode =
  | 'USD'
  | 'INR'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'SGD'
  | 'AED';

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
  'CH', 'NO', 'SE', 'DK', 'PL', 'CZ', 'HU', 'RO', 'BG', 'IS',
]);

export interface ExchangeRateStore {
  rates: Record<CurrencyCode, number>;
  lastUpdated: string;
  source: string;
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRateStore = {
  rates: {
    USD: 1,
    INR: 94.50,
    EUR: 0.86,
    GBP: 0.74,
    CAD: 1.38,
    AUD: 1.39,
    JPY: 156.25,
    SGD: 1.27,
    AED: 3.67,
  },
  lastUpdated: '2026-09-06T00:00:00Z',
  source: 'live_market_rates',
};

export const EXCHANGE_RATE_STORE: ExchangeRateStore = DEFAULT_EXCHANGE_RATES;

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'USD ($)',
    locale: 'en-US',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.USD,
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
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'INR (₹)',
    locale: 'en-IN',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.INR,
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
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'EUR (€)',
    locale: 'de-DE',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.EUR,
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
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'GBP (£)',
    locale: 'en-GB',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.GBP,
    flag: '🇬🇧',
    roi: {
      defaultSalary: 70000,
      minSalary: 30000,
      maxSalary: 220000,
      step: 2500,
      salaryLabel: 'Annual Salary (£/yr)',
      formatSalary: (val: number) => `£${(val / 1000).toFixed(0)}k/yr`,
    },
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'CAD ($)',
    locale: 'en-CA',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.CAD,
    flag: '🇨🇦',
    roi: {
      defaultSalary: 110000,
      minSalary: 50000,
      maxSalary: 250000,
      step: 5000,
      salaryLabel: 'Annual Salary (CA$/yr)',
      formatSalary: (val: number) => `CA$${(val / 1000).toFixed(0)}k/yr`,
    },
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'AUD ($)',
    locale: 'en-AU',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.AUD,
    flag: '🇦🇺',
    roi: {
      defaultSalary: 130000,
      minSalary: 55000,
      maxSalary: 280000,
      step: 5000,
      salaryLabel: 'Annual Salary (A$/yr)',
      formatSalary: (val: number) => `A$${(val / 1000).toFixed(0)}k/yr`,
    },
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'JPY (¥)',
    locale: 'ja-JP',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.JPY,
    flag: '🇯🇵',
    roi: {
      defaultSalary: 8500000,
      minSalary: 3500000,
      maxSalary: 25000000,
      step: 250000,
      salaryLabel: 'Annual Salary (¥/yr)',
      formatSalary: (val: number) => `¥${(val / 10000).toFixed(0)}万/yr`,
    },
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'SGD (S$)',
    locale: 'en-SG',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.SGD,
    flag: '🇸🇬',
    roi: {
      defaultSalary: 95000,
      minSalary: 45000,
      maxSalary: 250000,
      step: 5000,
      salaryLabel: 'Annual Salary (S$/yr)',
      formatSalary: (val: number) => `S$${(val / 1000).toFixed(0)}k/yr`,
    },
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'AED (AED)',
    locale: 'en-AE',
    rateVsUsd: DEFAULT_EXCHANGE_RATES.rates.AED,
    flag: '🇦🇪',
    roi: {
      defaultSalary: 240000,
      minSalary: 80000,
      maxSalary: 600000,
      step: 10000,
      salaryLabel: 'Annual Salary (AED/yr)',
      formatSalary: (val: number) => `AED ${(val / 1000).toFixed(0)}k/yr`,
    },
  },
};

export function getCurrencyByCountry(countryCode?: string): CurrencyCode {
  if (!countryCode) return 'USD';
  const upper = countryCode.toUpperCase();
  if (upper === 'IN') return 'INR';
  if (upper === 'GB' || upper === 'UK') return 'GBP';
  if (upper === 'CA') return 'CAD';
  if (upper === 'AU' || upper === 'NZ') return 'AUD';
  if (upper === 'JP') return 'JPY';
  if (upper === 'SG') return 'SGD';
  if (upper === 'AE') return 'AED';
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

  if (tz.includes('london') || tz.includes('belfast') || tz.includes('gibraltar')) {
    return 'GBP';
  }

  if (
    tz.includes('toronto') ||
    tz.includes('vancouver') ||
    tz.includes('montreal') ||
    tz.includes('edmonton') ||
    tz.includes('winnipeg') ||
    tz.includes('halifax')
  ) {
    return 'CAD';
  }

  if (
    tz.includes('sydney') ||
    tz.includes('melbourne') ||
    tz.includes('brisbane') ||
    tz.includes('perth') ||
    tz.includes('adelaide') ||
    tz.includes('auckland')
  ) {
    return 'AUD';
  }

  if (tz.includes('tokyo') || tz.includes('japan') || tz.includes('jst')) {
    return 'JPY';
  }

  if (tz.includes('singapore')) {
    return 'SGD';
  }

  if (tz.includes('dubai') || tz.includes('abu_dhabi')) {
    return 'AED';
  }

  if (tz.startsWith('europe/') || tz === 'atlantic/reykjavik') {
    return 'EUR';
  }

  return 'USD';
}

export function convertFromUsd(
  usdAmount: number,
  targetCurrency: CurrencyCode,
  customRate?: number
): number {
  if (Number.isNaN(usdAmount) || usdAmount === 0) return 0;
  const rate = customRate ?? CURRENCY_CONFIGS[targetCurrency].rateVsUsd;
  const converted = usdAmount * rate;
  return targetCurrency === 'JPY' ? Math.round(converted) : Math.round(converted);
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
    } else if (currency === 'JPY') {
      if (amount >= 100000000) return `¥${(amount / 100000000).toFixed(1)}億`;
      if (amount >= 10000) return `¥${(amount / 10000).toFixed(0)}万`;
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
