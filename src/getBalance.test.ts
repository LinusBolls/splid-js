import { describe, expect, it } from 'vitest';

import { getBalance } from './getBalance';
import { toFixed } from './toFixed';

const balance = (payedFor: number, payedBy: number) => ({
  payedFor,
  payedBy,
  balance: toFixed(payedFor - payedBy),
});

describe('getBalance', () => {
  it('handles empty input', () => {
    expect(getBalance([], [])).toEqual({});
    expect(
      getBalance([{ GlobalId: 'linus' }, { GlobalId: 'laurin' }], [])
    ).toEqual({
      linus: balance(0, 0),
      laurin: balance(0, 0),
    });
  });

  it('de-duplicates expenses with the same GlobalId', () => {
    expect(
      getBalance(
        [{ GlobalId: 'linus' }, { GlobalId: 'laurin' }],
        [
          {
            GlobalId: '#1',
            isDeleted: false,
            primaryPayer: 'linus',
            currencyCode: 'EUR',
            items: [
              {
                AM: 10,
                P: {
                  PT: 0,
                  P: {
                    laurin: 1,
                  },
                },
              },
            ],
          },
          {
            GlobalId: '#1',
            isDeleted: false,
            primaryPayer: 'linus',
            currencyCode: 'EUR',
            items: [
              {
                AM: 10,
                P: {
                  PT: 0,
                  P: {
                    laurin: 1,
                  },
                },
              },
            ],
          },
        ]
      )
    ).toEqual({
      linus: balance(10, 0),
      laurin: balance(0, 10),
    });
  });

  it('ignores deleted expenses', () => {
    expect(
      getBalance(
        [{ GlobalId: 'linus' }, { GlobalId: 'laurin' }],
        [
          {
            GlobalId: '#1',
            isDeleted: true,
            primaryPayer: 'linus',
            currencyCode: 'EUR',
            items: [
              {
                AM: 10,
                P: {
                  PT: 0,
                  P: {
                    laurin: 1,
                  },
                },
              },
            ],
          },
        ]
      )
    ).toEqual({
      linus: balance(0, 0),
      laurin: balance(0, 0),
    });
  });

  it('handles basic examples', () => {
    expect(
      getBalance(
        [{ GlobalId: 'linus' }, { GlobalId: 'laurin' }],
        [
          {
            GlobalId: '#1',
            isDeleted: false,
            primaryPayer: 'linus',
            currencyCode: 'EUR',
            items: [
              {
                AM: 10,
                P: {
                  PT: 0,
                  P: {
                    laurin: 1,
                  },
                },
              },
            ],
          },
        ]
      )
    ).toEqual({
      linus: balance(10, 0),
      laurin: balance(0, 10),
    });
  });

  it('handles currency conversion', () => {
    const expenses = [
      {
        GlobalId: '#1',
        isDeleted: false,
        primaryPayer: 'linus',
        currencyCode: 'EUR',
        items: [
          {
            AM: 10,
            P: {
              PT: 0 as const,
              P: {
                laurin: 1,
              },
            },
          },
        ],
      },
      {
        GlobalId: '#2',
        isDeleted: false,
        primaryPayer: 'linus',
        currencyCode: 'USD',
        items: [
          {
            AM: 10,
            P: {
              PT: 0 as const,
              P: {
                laurin: 1,
              },
            },
          },
        ],
      },
    ];

    expect(
      getBalance([{ GlobalId: 'linus' }, { GlobalId: 'laurin' }], expenses, {
        currencyRates: { EUR: 1.1, USD: 1 },
        defaultCurrencyCode: 'USD',
      })
    ).toEqual({
      linus: balance(21, 0),
      laurin: balance(0, 21),
    });

    expect(
      getBalance([{ GlobalId: 'linus' }, { GlobalId: 'laurin' }], expenses, {
        currencyRates: { EUR: 1.1, USD: 1 },
        defaultCurrencyCode: 'EUR',
      })
    ).toEqual({
      linus: balance(19.09090909090909, 0),
      laurin: balance(0, 19.09090909090909),
    });
  });
});
