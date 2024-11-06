import { sanitizeParseObject } from '../parse';
import { RequestConfig } from '../requestConfig';
import { Person } from '../types/person';
import { IsoTime } from '../types/primitives';

export interface UpdatePersonResponse {
  success: {
    updatedAt: IsoTime;
  };
}

export function updatePerson(config: RequestConfig, data: Person | Person[]) {
  const arr = Array.isArray(data) ? data : [data];

  return arr.map((i) => {
    const sanitized = sanitizeParseObject(i);

    sanitized.UpdateID = config.randomUUID();

    return {
      id: 'updatePerson',
      path: '/parse/classes/Person/' + i.objectId,
      method: 'PUT',
      body: sanitized,
    } as const;
  });
}
