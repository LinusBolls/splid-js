import { RequestConfig } from '../requestConfig';
import { EntryCategory, EntryItem } from '../types/entry';
import { IsoTime } from '../types/primitives';

export type CreateEntryResponse = {
  objectId: '9fg6Cxa6Ox';
  createdAt: IsoTime;
};

const createEntry =
  (isPayment: boolean) =>
  async (
    config: RequestConfig,
    entry: {
      title: string;
      category: EntryCategory;
      currencyCode: 'EUR';
      date: IsoTime;
      items: EntryItem[];
    }
  ) => {
    const url = config.baseUrl + '/parse/classes/Entry';

    const body = {
      date: {
        __type: 'Date',
        iso: entry.date,
      },
      UpdateInstallationID: '736a96e9-25f5-4522-98ae-d4b3629bf109',
      secondaryPayers: {
        __op: 'Delete',
      },
      primaryPayer: '0f16f9da-1ad2-4c55-8036-c4e20fedf9b9',
      UpdateID: 'e359fabd-fddd-4d72-ac82-3433f148da22',
      title: entry.title,
      GlobalId: 'b6e8f193-344f-47f7-b34c-f42c0de9a5c0',
      isPayment,
      category: entry.category,
      items: entry.items,
      currencyCode: entry.currencyCode,
      createdGlobally: {
        __type: 'Date',
        iso: '2023-08-28T15:13:04.448Z',
      },
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: 'QfQhx0XSSc',
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
