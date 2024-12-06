import { sanitizeParseObject, WithoutParseKeys } from '../parse';
import { RequestConfig } from '../requestConfig';
import { Entry } from '../types/entry';
import { IsoTime } from '../types/primitives';

export interface UpdateEntryResponse {
  success: {
    updatedAt: IsoTime;
  };
}
type Input = Omit<WithoutParseKeys<Entry>, 'UpdateID'>;

export function updateEntry(config: RequestConfig, data: Input | Input[]) {
  const arr = Array.isArray(data) ? data : [data];

  return arr.map((i: Entry) => {
    const sanitized = sanitizeParseObject(i);

    sanitized.UpdateID = config.randomUUID();

    return {
      id: 'updateEntry',
      path: '/parse/classes/Entry/' + i.objectId,
      method: 'PUT',
      body: sanitized,
    } as const;
  });
}
