import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { IsoTime } from '../types/primitives';

export interface CreateExpenseResponse {
  success: {
    createdAt: IsoTime;
    objectId: string;
  };
}

const toItem = (item: Item) => {
  return {
    T: item.title ?? '',
    AM: item.amount,
    P: {
      PT: 0,
      P: item.profiteers,
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
  payers: Record<string, number>;
  currencyCode?: string;
};

type Item = {
  title?: string;
  amount: number;
  profiteers: Record<string, number>;
};

export function createExpense(
  config: RequestConfig,
  options: Options,
  items: Omit<Item, 'title'> | Item[]
): RequestObject {
  const itemsInput = Array.isArray(items)
    ? items.map(toItem)
    : [items].map(toItem);

  if (Object.entries(options.payers).length < 1) {
    throw new Error('expense has to have at least one payer');
  }

  const primaryPayer = Object.entries(options.payers)[0][0];

  const secondaryPayers = Object.entries(options.payers)
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
