import { Recursiv } from '@recursiv/sdk';

const BASE_URL =
  process.env.EXPO_PUBLIC_RECURSIV_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.recursiv.io/api/v1';

const API_KEY = process.env.EXPO_PUBLIC_RECURSIV_API_KEY || '';

/**
 * SDK instance — lazy-initialized so the app doesn't crash without an API key.
 * Auth methods (signUp/signIn) bypass the API key internally.
 * Data methods (posts, databases, agents, etc.) use the API key automatically.
 */
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

export const sdk = API_KEY
  ? new Recursiv({ apiKey: API_KEY, baseUrl: BASE_URL, timeout: 120_000 })
  : (null as unknown as Recursiv);
