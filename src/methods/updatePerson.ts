import { sanitizeParseObject } from '../parse';
import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { Person } from '../types/person';
import { IsoTime } from '../types/primitives';

export interface UpdatePersonResponse {
  success: {
    updatedAt: IsoTime;
  };
}

export function updatePerson(config: RequestConfig, data: Person) {
  const sanitized = sanitizeParseObject(data);

  sanitized.UpdateID = config.randomUUID();

  return {
    id: 'updatePerson',
    path: '/parse/classes/Person/' + data.objectId,
    method: 'PUT',
    body: sanitized,
  } as const;
}
