import { RequestConfig } from '../requestConfig';
import { EntryItem } from '../types/entry';
import { IsoTime } from '../types/primitives';

export interface CreateExpenseResponse {
  success: {
    createdAt: IsoTime;
    objectId: string;
  };
}

const toItem = (item: Item): EntryItem => {
  const profiteersObj = getProfiteersObj(item.profiteers);

  return {
    T: item.title ?? '',
    AM: item.amount,
    P: {
      PT: 0,
      P: profiteersObj,
    },
  };
};

type Options = {
  groupId: string;

  title?: string;
  date?: Date;
  category?: {
    type: any;
    originalName: any;
  };
  payers: Record<string, number> | (string | { id: string; amount: number })[];
  currencyCode?: string;
};

type Item = {
  title?: string;
  amount: number;
  profiteers:
    | Record<string, number>
    | (string | { id: string; share: number })[];
};

const getPayersObj = (payers: Options['payers'], amount: number) => {
  if (!Array.isArray(payers)) return payers;

  const staticPayers = payers.filter((i) => typeof i !== 'string');
  const dynamicPayers = payers.filter((i) => typeof i == 'string');

  const staticAmount = staticPayers.reduce((sum, i) => sum + i.amount, 0);
  const dynamicAmount = amount - staticAmount;

  let obj = {};

  for (const payer of staticPayers) {
    obj[payer.id] = payer.amount;
  }
  for (const payer of dynamicPayers) {
    obj[payer] = dynamicAmount / staticPayers.length;
  }
  return obj;
};

const getProfiteersObj = (profiteers: Item['profiteers']) => {
  if (!Array.isArray(profiteers)) return profiteers;

  const staticPayers = profiteers.filter((i) => typeof i !== 'string');
  const dynamicPayers = profiteers.filter((i) => typeof i == 'string');

  const staticShare = staticPayers.reduce((sum, i) => sum + i.share, 0);
  const dynamicShare = 1 - staticShare;

  let obj = {};

  for (const payer of staticPayers) {
    obj[payer.id] = payer.share;
  }
  for (const payer of dynamicPayers) {
    obj[payer] = dynamicShare / dynamicPayers.length;
  }
  return obj;
};

export function createExpense(
  config: RequestConfig,
  options: Options,
  items: Omit<Item, 'title'> | Item[]
) {
  const itemsInput = Array.isArray(items)
    ? items.map(toItem)
    : [items].map(toItem);

  if (Object.entries(options.payers).length < 1) {
    throw new Error('expense has to have at least one payer');
  }

  const totalAmount = Array.isArray(items)
    ? items.reduce((sum, i) => sum + i.amount, 0)
    : items.amount;

  const payersObj = getPayersObj(options.payers, totalAmount);

  const primaryPayer = Object.entries(payersObj)[0][0];

  const secondaryPayers = Object.entries(payersObj)
    .slice(1)
    .reduce((obj, i) => ({ ...obj, [i[0]]: i[1] }), {});

  const requestObj = {
    id: 'createExpense',
    path: '/parse/classes/Entry',
    method: 'POST',
    body: {
      category: options.category,
      UpdateInstallationID: config.installationId,
      GlobalId: config.randomUUID(),
      title: options.title,
      secondaryPayers,
      notes: {
        __op: 'Delete',
      },
      primaryPayer,
      date: options.date
        ? {
            __type: 'Date',
            iso: options.date.toISOString(),
          }
        : undefined,
      createdGlobally: {
        __type: 'Date',
        iso: new Date().toISOString(),
      },
      isDeleted: false,
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: options.groupId,
      },
      items: itemsInput,
      isPayment: false,
      UpdateID: config.randomUUID(),
      currencyCode: options.currencyCode ?? 'EUR',
    },
  } as const;
  return requestObj;
}
