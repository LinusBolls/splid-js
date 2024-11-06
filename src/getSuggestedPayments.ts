import { Balance } from './getBalance';
import { roundToNDigits } from './toFixed';

export type SuggestedPayment = {
  from: string;
  to: string;
  amount: string;
};

export type SuggestedPayments = SuggestedPayment[];

/**
 * not tested for currencies other than `EUR`.
 */
export const getSuggestedPayments = (balance: Balance): SuggestedPayment[] => {
  const positiveBalances: { id: string; balance: number }[] = [];
  const negativeBalances: { id: string; balance: number }[] = [];

  // sort accounts into negative and positive balances
  for (const [id, { payedFor, payedBy }] of Object.entries(balance)) {
    const balance = payedFor - payedBy;

    if (balance > 0) {
      positiveBalances.push({ id, balance });
    } else if (balance < 0) {
      // convert to positive for easy processing
      negativeBalances.push({ id, balance: -balance });
    }
  }
  const payments: SuggestedPayment[] = [];

  let posIndex = 0;
  let negIndex = 0;

  while (
    posIndex < positiveBalances.length &&
    negIndex < negativeBalances.length
  ) {
    const positive = positiveBalances[posIndex];
    const negative = negativeBalances[negIndex];
    const amount = Math.min(positive.balance, negative.balance);

    const isLargerThanZero = roundToNDigits(amount, 2) > 0;

    if (isLargerThanZero) {
      payments.push({
        from: negative.id,
        to: positive.id,
        amount: amount.toFixed(2),
      });
    }
    positive.balance -= amount;
    negative.balance -= amount;

    if (positive.balance === 0) posIndex++;
    if (negative.balance === 0) negIndex++;
  }
  return payments;
};
