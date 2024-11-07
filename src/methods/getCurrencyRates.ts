import { RequestConfig } from '../requestConfig';

export interface GetCurrencyRatesResponse {
  success: {
    result: Record<string, number>;
  };
}

export function getCurrencyRates(config: RequestConfig) {
  return {
    id: 'getCurrencyRates',
    path: '/parse/functions/getCurrencyRates',
    method: 'POST',
    body: {},
  } as const;
}
