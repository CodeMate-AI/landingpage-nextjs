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

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, '').trim();
  return (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean) ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fe80:')
  );
}

function extractNetlifyCountry(request: NextRequest): string | null {
  const xCountry = request.headers.get('x-country');
  if (xCountry && xCountry.trim().length === 2) {
    return xCountry.trim().toUpperCase();
  }

  const nfGeo = request.headers.get('x-nf-geo');
  if (nfGeo) {
    try {
      if (nfGeo.startsWith('{')) {
        const parsed = JSON.parse(nfGeo);
        const code = parsed?.country?.code || parsed?.country_code || parsed?.country;
        if (code && typeof code === 'string' && code.length === 2) return code.toUpperCase();
      } else {
        const decoded = typeof atob === 'function' ? atob(nfGeo) : Buffer.from(nfGeo, 'base64').toString('utf-8');
        if (decoded.startsWith('{')) {
          const parsed = JSON.parse(decoded);
          const code = parsed?.country?.code || parsed?.country_code || parsed?.country;
          if (code && typeof code === 'string' && code.length === 2) return code.toUpperCase();
        }
      }
    } catch {
      // Ignore header parsing errors
    }
  }
  return null;
}

function extractClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp && !isPrivateIp(firstIp)) return firstIp;
  }
  const headers = [
    'x-nf-client-connection-ip',
    'cf-connecting-ip',
    'x-real-ip',
    'x-client-ip',
    'fastly-client-ip',
    'true-client-ip',
  ];
  for (const h of headers) {
    const ip = request.headers.get(h);
    if (ip && !isPrivateIp(ip.trim())) return ip.trim();
  }
  return null;
}

async function resolveCountry(request: NextRequest): Promise<string | null> {
  // 1. URL Query Override (for instant testing in staging / dev / QA)
  const queryCountry = request.nextUrl.searchParams.get('country') || request.nextUrl.searchParams.get('geo');
  if (queryCountry && queryCountry.trim().length === 2) {
    return queryCountry.trim().toUpperCase();
  }

  // 2. Netlify Geolocation
  const netlifyCountry = extractNetlifyCountry(request);
  if (netlifyCountry) return netlifyCountry;

  // 3. Multi-CDN Edge Headers
  const directHeaderCountry =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('cloudfront-viewer-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('x-real-ip-country') ||
    request.headers.get('x-forwarded-country');

  if (directHeaderCountry && directHeaderCountry.trim().length === 2) {
    return directHeaderCountry.trim().toUpperCase();
  }

  // 4. Fallback IP Geolocation via Public API
  const clientIp = extractClientIp(request);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const lookupUrl = clientIp ? `https://api.country.is/${clientIp}` : 'https://api.country.is';
    const res = await fetch(lookupUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.country && typeof data.country === 'string' && data.country.length === 2) {
        return data.country.toUpperCase();
      }
    }
  } catch (err) {
    console.warn('IP-based country fallback lookup failed:', err);
  }

  return null;
}

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
  const country = await resolveCountry(request);
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

