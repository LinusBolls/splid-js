import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { IsoTime } from '../types/primitives';
import { getInitials } from '../util';

export interface CreatePersonResponse {
  success: {
    createdAt: IsoTime;
    objectId: string;
  };
}

export function createPerson(
  config: RequestConfig,
  groupId: string,
  name: string,
  initials?: string
): RequestObject {
  return {
    id: 'createPerson',
    path: '/parse/classes/Person',
    method: 'POST',
    body: {
      GlobalId: config.randomUUID(),
      UpdateID: config.randomUUID(),
      isDeleted: false,
      createdGlobally: {
        __type: 'Date',
        iso: new Date().toISOString(),
      },
      UpdateInstallationID: config.installationId,
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
      name: name,
      initials: initials ?? getInitials(name),
    },
  } as const;
}
