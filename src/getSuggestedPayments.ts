import { roundToNDigits } from './toFixed';

type Account = {
  payedFor: number;
  payedBy: number;
};

type SuggestedPayment = {
  from: string;
  to: string;
  amount: number;
};

export function getSuggestedPayments(
  accounts: Record<string, Account>
): SuggestedPayment[] {
  // Separate positive and negative balances
  const positiveBalances: { id: string; balance: number }[] = [];
  const negativeBalances: { id: string; balance: number }[] = [];

  // Sort accounts by balance
  for (const [id, { payedFor, payedBy }] of Object.entries(accounts)) {
    const balance = payedFor - payedBy;

    if (balance > 0) {
      positiveBalances.push({ id, balance });
    } else if (balance < 0) {
      negativeBalances.push({ id, balance: -balance }); // convert to positive for easy processing
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

    // Record the payment
    if (roundToNDigits(amount, 2) > 0) {
      payments.push({
        from: negative.id,
        to: positive.id,
        amount: roundToNDigits(amount, 2),
      });
    }

    // Adjust balances
    positive.balance -= amount;
    negative.balance -= amount;

    // Move to the next account if balance is settled
    if (positive.balance === 0) posIndex++;
    if (negative.balance === 0) negIndex++;
  }

  return payments;
}
