import { Recursiv } from '@recursiv/sdk';

const BASE_URL =
  process.env.EXPO_PUBLIC_RECURSIV_API_URL ||
  'https://api.recursiv.io/api/v1';

const API_KEY = process.env.EXPO_PUBLIC_RECURSIV_API_KEY || '';

let _sdk: Recursiv | null = null;

export function getSdk(): Recursiv {
  if (!_sdk) {
    _sdk = new Recursiv({
      apiKey: API_KEY,
      baseUrl: BASE_URL,
      timeout: 120_000,
    });
  }
  return _sdk;
}

// For backwards compat — will throw if no API key, but only when actually used
export const sdk = API_KEY
  ? new Recursiv({ apiKey: API_KEY, baseUrl: BASE_URL, timeout: 120_000 })
  : (null as unknown as Recursiv);
