import { NextRequest, NextResponse } from 'next/server';
import {
  CurrencyCode,
  DEFAULT_EXCHANGE_RATES,
  getCurrencyByCountry,
} from '@/utils/currencyConfig';

export const runtime = 'edge';

const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  'USD',
  'INR',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'SGD',
  'AED',
];

async function getLiveRates(): Promise<Record<CurrencyCode, number>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.rates) {
        const rates = { ...DEFAULT_EXCHANGE_RATES.rates };
        for (const code of SUPPORTED_CURRENCIES) {
          if (typeof data.rates[code] === 'number') {
            rates[code] = data.rates[code];
          }
        }
        return rates;
      }
    }
  } catch (err) {
    console.warn('Live exchange rate fetch failed, using fallback rates:', err);
  }
  return DEFAULT_EXCHANGE_RATES.rates;
}

export async function GET(request: NextRequest) {
  const countryHeader =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');

  const country = countryHeader ? countryHeader.toUpperCase() : null;
  const currency = country ? getCurrencyByCountry(country) : null;
  const rates = await getLiveRates();

  return NextResponse.json(
    { country, currency, rates },
    {
      headers: {
        'Cache-Control': 'private, no-store, no-cache, max-age=0, must-revalidate',
      },
    }
  );
}
