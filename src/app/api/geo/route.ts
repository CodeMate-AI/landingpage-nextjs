import { NextRequest, NextResponse } from 'next/server';
import { getCurrencyByCountry } from '@/utils/currencyConfig';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const countryHeader =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');

  const country = countryHeader ? countryHeader.toUpperCase() : null;
  const currency = country ? getCurrencyByCountry(country) : null;

  return NextResponse.json(
    { country, currency },
    {
      headers: {
        'Cache-Control': 'private, no-store, no-cache, max-age=0, must-revalidate',
      },
    }
  );
}
