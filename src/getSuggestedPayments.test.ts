import { describe, expect, it } from 'vitest';
import { getSuggestedPayments } from './getSuggestedPayments';
import { toFixed } from './toFixed';

const balance = (balance: number) => ({
  payedFor: balance,
  payedBy: 0,
  balance: toFixed(balance),
});

const payment = (from: string, to: string, amount: string) => ({
  from,
  to,
  amount,
});

describe('getSuggestedPayments', () => {
  it('handles basic cases', () => {
    expect(
      getSuggestedPayments({
        linus: balance(10),
        laurin: balance(-10),
      })
    ).toEqual([payment('laurin', 'linus', '10.00')]);

    expect(
      getSuggestedPayments({
        linus: balance(10),
        laurin: balance(10),
        leonard: balance(-20),
      })
    ).toEqual([
      payment('leonard', 'linus', '10.00'),
      payment('leonard', 'laurin', '10.00'),
    ]);
  });

  it('rounds down', () => {
    expect(
      getSuggestedPayments({
        lukas: balance(-2.0433555991541823),
        institut: balance(3.178355599154145),
        jannis: balance(-0.3749999999999716),
        linus: balance(-0.7550000000000239),
      })
    ).toEqual([
      payment('lukas', 'institut', '2.04'),
      payment('jannis', 'institut', '0.37'),
      payment('linus', 'institut', '0.76'),
    ]);
  });

  it("doesn't generate payments with amount 0", () => {
    expect(
      getSuggestedPayments({
        lukas: balance(0.004),
        florian: balance(-0.004),
      })
    ).toEqual([]);
  });

  return;

  it('passes advanced cases (porto)', () => {
    expect(
      getSuggestedPayments({
        bolls: {
          payedFor: 695,
          payedBy: 542.0364395604396,
          balance: '152.96',
        },
        josi: {
          payedFor: 333.51,
          payedBy: 194.92747252747253,
          balance: '138.58',
        },
        robert: {
          payedFor: 161.6,
          payedBy: 230.6006391941392,
          balance: '-69.00',
        },
        fiona: {
          payedFor: 50.33,
          payedBy: 169.38461538461536,
          balance: '-119.05',
        },
        moritz: {
          payedFor: 153.81939377289376,
          payedBy: 163.8473058608058,
          balance: '-10.03',
        },
        schicke: {
          payedFor: 80,
          payedBy: 163.36747252747253,
          balance: '-83.37',
        },
        jannis: {
          payedFor: 199.6396758241758,
          payedBy: 199.6466391941392,
          balance: '-0.01',
        },
        ole: {
          payedFor: 209.3,
          payedBy: 219.39544871794874,
          balance: '-10.10',
        },
      }).sort()
    ).toEqual(
      [
        {
          from: 'fiona',
          to: 'josi',
          amount: '119.05',
        },
        {
          from: 'moritz',
          to: 'josi',
          amount: '10.03',
        },
        {
          from: 'schicke',
          to: 'josi',
          amount: '9.50',
        },
        {
          from: 'schicke',
          to: 'bolls',
          amount: '73.87',
        },
        {
          from: 'ole',
          to: 'bolls',
          amount: '10.10',
        },
        {
          from: 'robert',
          to: 'bolls',
          amount: '69.00',
        },
      ].sort()
    );
  });
});
