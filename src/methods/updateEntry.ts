import { sanitizeParseObject } from '../parse';
import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { Entry } from '../types/entry';
import { IsoTime } from '../types/primitives';

export interface UpdateEntryResponse {
  success: {
    updatedAt: IsoTime;
  };
}

export function updateEntry(config: RequestConfig, data: Entry): RequestObject {
  const sanitized = sanitizeParseObject(data);

  sanitized.UpdateID = config.randomUUID();

  return {
    id: 'updateEntry',
    path: '/parse/classes/Entry/' + data.objectId,
    method: 'PUT',
    body: sanitized,
  };
}
