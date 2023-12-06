import { v4 as generateUuid } from 'uuid';

import { RequestDetails, defineRequest } from '../defineRequest';
import { RequestConfig } from '../requestConfig';
import { dateToIso } from '../dateToIso';
import { IsoTime } from '../types/primitives';

type BasePersonInput = {
  name: string;
  initials: string;
};
type CreatePersonInput = BasePersonInput;
type UpdatePersonInput = BasePersonInput & {
  createdGlobally: Date | string;
  globalId: string;
  objectId: string;
};

export type CreateOrUpdatePersonResponse = {
  objectId: 'QjisA7kjLi';
  createdAt: IsoTime;
};

export const createPersonRequest = defineRequest(
  (config: RequestConfig, groupId: string, person: CreatePersonInput) => {
    return {
      method: 'POST',
      path: '/parse/classes/Person',
      body: {
        name: person.name,
        initials: person.initials,

        GlobalId: generateUuid(),

        createdGlobally: {
          __type: 'Date',
          iso: dateToIso(new Date()),
        },
        group: {
          __type: 'Pointer',
          className: '_User',
          objectId: groupId,
        },
        UpdateID: generateUuid(),
        UpdateInstallationID: config.installationId,
      },
      options: { headers: config.getHeaders() },
    } as RequestDetails<Promise<CreateOrUpdatePersonResponse>>;
  }
);

export const updatePersonRequest = defineRequest(
  (
    config: RequestConfig,
    groupId: string,
    personId: string,
    person: UpdatePersonInput
  ) => {
    const createdGlobally =
      person.createdGlobally instanceof Date
        ? dateToIso(person.createdGlobally)
        : person.createdGlobally;

    return {
      method: 'PUT',
      path: '/parse/classes/Person/' + personId,
      body: {
        name: person.name,
        initials: person.initials,

        GlobalId: person.globalId,
        objectId: person.objectId,

        createdGlobally: {
          __type: 'Date',
          iso: createdGlobally,
        },
        group: {
          __type: 'Pointer',
          className: '_User',
          objectId: groupId,
        },
        UpdateID: generateUuid(),
        UpdateInstallationID: config.installationId,
      },
      options: { headers: config.getHeaders() },
    } as RequestDetails<Promise<CreateOrUpdatePersonResponse>>;
  }
);
