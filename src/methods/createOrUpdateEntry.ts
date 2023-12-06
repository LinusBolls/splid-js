import { dateToIso } from '../dateToIso';
import { RequestDetails, defineRequest } from '../defineRequest';
import { RequestConfig } from '../requestConfig';
import { EntryCategory, EntryItem } from '../types/entry';
import { CurrencyCode, IsoTime, Uuid } from '../types/primitives';
import { v4 as generateUuid } from 'uuid';

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

export type CreateOrUpdateEntryResponse = {
  objectId: '9fg6Cxa6Ox';
  createdAt: IsoTime;
};

export const createEntryRequest = (isPayment: boolean) =>
  defineRequest(
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
        options: { headers: config.getHeaders() },
      } as RequestDetails<Promise<CreateOrUpdateEntryResponse>>;
    }
  );

export const updateEntryRequest = (isPayment: boolean) =>
  defineRequest(
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
        options: { headers: config.getHeaders() },
      } as RequestDetails<Promise<CreateOrUpdateEntryResponse>>;
    }
  );

export const createExpense = createEntryRequest(false);
export const createPayment = createEntryRequest(true);

export const updateExpense = updateEntryRequest(false);
export const updatePayment = updateEntryRequest(true);
