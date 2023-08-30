import currencyExchangeRates from '../data/currencyExchangeRates.data';
import { dateToIso } from '../dateToIso';
import { RequestConfig } from '../requestConfig';
import { EntryCategory, EntryItem } from '../types/entry';
import { CurrencyCode, IsoTime, Uuid } from '../types/primitives';
import { v4 as generateUuid } from 'uuid';

export type CreateEntryResponse = {
  objectId: '9fg6Cxa6Ox';
  createdAt: IsoTime;
};

const createEntry =
  (isPayment: boolean) =>
  async (
    config: RequestConfig,
    groupId: string,
    entry: {
      title: string;
      category: EntryCategory;
      currencyCode: 'EUR';
      date: IsoTime;
      items: EntryItem[];
      primaryPayerId: Uuid;
    }
  ) => {
    const url = config.baseUrl + '/parse/classes/Entry';

    const body = {
      date: {
        __type: 'Date',
        iso: entry.date,
      },
      secondaryPayers: {
        __op: 'Delete',
      },
      primaryPayer: entry.primaryPayerId,
      title: entry.title,
      isPayment,
      category: entry.category,
      items: entry.items,
      currencyCode: entry.currencyCode,

      UpdateInstallationID: config.installationId,
      UpdateID: generateUuid(),
      createdGlobally: {
        __type: 'Date',
        iso: dateToIso(new Date()),
      },
      GlobalId: generateUuid(),
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
    };
    const options = { headers: config.getHeaders() };

    const res = await config.httpClient.post<CreateEntryResponse>(
      url,
      body,
      options
    );
    return res.data;
  };
export const createExpense = createEntry(false);
export const createPayment = createEntry(true);

type BaseEntryInput = {
  title: string;
  category: EntryCategory;
  currencyCode: CurrencyCode;
  date: IsoTime;
  items: EntryItem[];
  primaryPayerId: Uuid;
};
type CreateEntryInput = BaseEntryInput;
type UpdateEntryInput = BaseEntryInput & {
  createdGlobally: Date | string;
  globalId: string;
  objectId: string;
};

export const getCreateEntry =
  (isPayment: boolean) =>
  (config: RequestConfig, groupId: string, entry: CreateEntryInput) => {
    return {
      method: 'POST',
      path: '/parse/classes/Entry',
      body: {
        date: {
          __type: 'Date',
          iso: entry.date,
        },
        secondaryPayers: {
          __op: 'Delete',
        },
        primaryPayer: entry.primaryPayerId,
        title: entry.title,
        isPayment,
        category: entry.category,
        items: entry.items,
        currencyCode: entry.currencyCode,

        UpdateInstallationID: config.installationId,
        UpdateID: generateUuid(),
        createdGlobally: {
          __type: 'Date',
          iso: dateToIso(new Date()),
        },
        GlobalId: generateUuid(),
        group: {
          __type: 'Pointer',
          className: '_User',
          objectId: groupId,
        },
      },
    };
  };
export const getUpdateEntry =
  (isPayment: boolean) =>
  (
    config: RequestConfig,
    groupId: string,
    entryId: string,
    entry: UpdateEntryInput
  ) => {
    return {
      method: 'PUT',
      path: '/parse/classes/Entry/' + entryId,
      body: {
        date: {
          __type: 'Date',
          iso: entry.date,
        },
        secondaryPayers: {
          __op: 'Delete',
        },
        primaryPayer: entry.primaryPayerId,
        title: entry.title,
        isPayment,
        category: entry.category,
        items: entry.items,
        currencyCode: entry.currencyCode,

        UpdateInstallationID: config.installationId,
        UpdateID: generateUuid(),
        createdGlobally: {
          __type: 'Date',
          iso: dateToIso(new Date()),
        },
        GlobalId: generateUuid(),
        group: {
          __type: 'Pointer',
          className: '_User',
          objectId: groupId,
        },
      },
    };
  };
