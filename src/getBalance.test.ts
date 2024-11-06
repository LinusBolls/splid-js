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

  it('handles basic examples', () => {
    expect(
      getBalance(
        [{ GlobalId: 'linus' }, { GlobalId: 'laurin' }],
        [
          {
            GlobalId: '#',
            isDeleted: false,
            primaryPayer: 'linus',
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
});
