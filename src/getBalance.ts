import { toFixed } from './toFixed';
import { Entry } from './types/entry';
import { Person } from './types/person';
import { dedupeByGlobalId } from './util';

export type BalanceItem = {
  balance: string;
  payedFor: number;
  payedBy: number;
};

export type Balance = Record<string, BalanceItem>;

/**
 * might be off of the results of the Splid App by a single digit in some cases (single cent), because we haven't quite figured out their arcane rounding rules yet.
 *
 * not tested for currencies other than `EUR`.
 */
export const getBalance = (people: Person[], entries: Entry[]): Balance => {
  const uniquePeople = dedupeByGlobalId(people);
  const uniqueEntries = dedupeByGlobalId(entries);

  let balance = uniquePeople.reduce<Balance>((obj, i) => {
    obj[i.GlobalId] = {
      payedFor: 0,
      payedBy: 0,
      balance: '',
    };
    return obj;
  }, {});

  for (const entry of uniqueEntries) {
    if (entry.isDeleted) continue;

    // payments work the same as expenses and don't need special treatment

    if (!balance[entry.primaryPayer])
      throw new Error(
        `SplidClient.getBalance: failed to resolve primary payer with id "${entry.primaryPayer}"`
      );

    for (const [id, amount] of Object.entries(entry.secondaryPayers ?? {})) {
      if (!balance[id])
        throw new Error(
          `SplidClient.getBalance: failed to resolve secondary payer with id "${id}"`
        );

      balance[id].payedFor += amount;
      balance[entry.primaryPayer].payedFor -= amount;
    }
    for (const item of entry.items) {
      balance[entry.primaryPayer].payedFor += item.AM;

      for (const [id2, percOrShare] of Object.entries(item.P.P)) {
        if (!balance[id2])
          throw new Error(
            `SplidClient.getBalance: failed to resolve profiteer with id "${id2}"`
          );

        balance[id2].payedBy += item.AM * percOrShare;
      }
    }
  }

  for (const person of Object.values(balance)) {
    person.balance = toFixed(person.payedBy - person.payedFor);
  }
  return balance;
};
