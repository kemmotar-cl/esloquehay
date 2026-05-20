import { useState, useEffect } from 'react';
import type { Country } from '../types/preferences';
interface CountryInfo {
  country: Country;
}

const COUNTRY_MAP: Record<string, Country> = {
  CL: 'chile',
  AR: 'argentina',
  MX: 'mexico',
  CO: 'colombia',
  PE: 'peru',
  ES: 'espana',
  VE: 'venezuela',
  EC: 'ecuador',
  BO: 'bolivia',
  UY: 'uruguay',
  PY: 'paraguay',
  CR: 'costa_rica',
  PA: 'panama',
  GT: 'guatemala',
  NI: 'nicaragua',
  HN: 'honduras',
  SV: 'el_salvador',
  CU: 'cuba',
  DO: 'republica_dominicana',
  PR: 'puerto_rico',
};

async function detectByCloudflare(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000);
  try {
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const text = await response.text();
    const match = /loc=(\w+)/.exec(text);
    return match ? match[1] : null;
  } catch (e) {
    clearTimeout(timeoutId);
    console.error('[useCountry] Cloudflare detection failed', e);
    return null;
  }
}

interface IpApiResponse {
  country_code?: string;
}

async function detectByIpApi(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000);
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = (await response.json()) as IpApiResponse;
    return data.country_code ?? null;
  } catch (e) {
    clearTimeout(timeoutId);
    console.error('[useCountry] ipapi detection failed', e);
    return null;
  }
}

export function useCountryDetection() {
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    country: 'chile',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      let countryCode = await detectByCloudflare();
      countryCode ??= await detectByIpApi();
      const country = COUNTRY_MAP[countryCode ?? ''] ?? 'chile';

      setCountryInfo({
        country,
      });
      setLoading(false);
    }
    void detect();
  }, []);

  return { ...countryInfo, loading };
}
