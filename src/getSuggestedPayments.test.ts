import { describe, expect, it } from 'vitest';
import { getSuggestedPayments } from './getSuggestedPayments';

const balance = (balance: number) => ({ payedFor: balance, payedBy: 0 });

const payment = (from: string, to: string, amount: number) => ({
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
    ).toEqual([payment('laurin', 'linus', 10)]);

    expect(
      getSuggestedPayments({
        linus: balance(10),
        laurin: balance(10),
        leonard: balance(-20),
      })
    ).toEqual([
      payment('leonard', 'linus', 10),
      payment('leonard', 'laurin', 10),
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
      payment('lukas', 'institut', 2.04),
      payment('jannis', 'institut', 0.37),
      payment('linus', 'institut', 0.76),
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
});
