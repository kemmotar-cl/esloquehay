import { useState, useEffect } from 'react';
import type { Country } from '../types/preferences';
import type { SpanishVariant } from '../data/phrases';

interface CountryInfo {
  country: Country;
  countryName: string;
  spanishVariant: SpanishVariant;
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
};

const COUNTRY_NAMES: Record<Country, string> = {
  chile: 'Chile',
  argentina: 'Argentina',
  mexico: 'México',
  colombia: 'Colombia',
  peru: 'Perú',
  espana: 'España',
  venezuela: 'Venezuela',
  ecuador: 'Ecuador',
  bolivia: 'Bolivia',
  uruguay: 'Uruguay',
  paraguay: 'Paraguay',
  costa_rica: 'Costa Rica',
  panama: 'Panamá',
  guatemala: 'Guatemala',
};

const SPANISH_VARIANTS: Record<Country, SpanishVariant> = {
  chile: 'es_cl',
  argentina: 'es_ar',
  mexico: 'es_mx',
  colombia: 'es_co',
  peru: 'es_pe',
  espana: 'es_es',
  venezuela: 'es_generic',
  ecuador: 'es_generic',
  bolivia: 'es_generic',
  uruguay: 'es_ar',
  paraguay: 'es_generic',
  costa_rica: 'es_generic',
  panama: 'es_generic',
  guatemala: 'es_generic',
};

async function detectByCloudflare(): Promise<string | null> {
  try {
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
    const text = await response.text();
    const match = /loc=(\w+)/.exec(text);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

interface IpApiResponse {
  country_code?: string;
}

async function detectByIpApi(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = (await response.json()) as IpApiResponse;
    return data.country_code ?? null;
  } catch {
    return null;
  }
}

export function useCountryDetection() {
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    country: 'chile',
    countryName: 'Chile',
    spanishVariant: 'es_cl',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      let countryCode = await detectByCloudflare();
      countryCode ??= await detectByIpApi();
      const country = COUNTRY_MAP[countryCode ?? ''] ?? 'chile';

      setCountryInfo({
        country,
        countryName: COUNTRY_NAMES[country],
        spanishVariant: SPANISH_VARIANTS[country],
      });
      setLoading(false);
    }
    void detect();
  }, []);

  return { ...countryInfo, loading };
}
