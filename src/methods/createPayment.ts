import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { IsoTime } from '../types/primitives';

export interface CreatePaymentResponse {
  success: {
    createdAt: IsoTime;
    objectId: string;
  };
}

type Options = {
  groupId: string;

  payer: string;
  amount: number;
  profiteer: string;

  date?: Date;
  currencyCode?: string;
};

export function createPayment(config: RequestConfig, options: Options) {
  const primaryPayer = options.payer;

  const requestObj = {
    id: 'createPayment',
    path: '/parse/classes/Entry',
    method: 'POST',
    body: {
      category: {
        __op: 'Delete',
      },
      UpdateInstallationID: config.installationId,
      GlobalId: config.randomUUID(),
      title: {
        __op: 'Delete',
      },
      secondaryPayers: {
        __op: 'Delete',
      },
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
      items: [
        {
          T: '',
          AM: options.amount,
          P: {
            PT: 0,
            P: { [options.profiteer]: 1 },
          },
        },
      ],
      isPayment: true,
      UpdateID: config.randomUUID(),
      currencyCode: options.currencyCode ?? 'EUR',
    },
  } as const;
  return requestObj;
}
