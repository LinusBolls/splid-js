import { sanitizeParseObject } from '../parse';
import { RequestConfig } from '../requestConfig';
import { Entry } from '../types/entry';
import { IsoTime } from '../types/primitives';

export interface UpdateEntryResponse {
  success: {
    updatedAt: IsoTime;
  };
}

export function updateEntry(config: RequestConfig, data: Entry | Entry[]) {
  const arr = Array.isArray(data) ? data : [data];

  return arr.map((i) => {
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
