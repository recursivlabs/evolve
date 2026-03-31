import { Recursiv } from '@recursiv/sdk';

const BASE_URL =
  process.env.EXPO_PUBLIC_RECURSIV_API_URL ||
  'https://api.recursiv.io/api/v1';

const API_KEY = process.env.EXPO_PUBLIC_RECURSIV_API_KEY || '';

export const sdk = new Recursiv({
  apiKey: API_KEY,
  baseUrl: BASE_URL,
  timeout: 120_000,
});
