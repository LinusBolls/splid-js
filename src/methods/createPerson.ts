import { v4 as generateUuid } from 'uuid';
import { RequestConfig } from '../requestConfig';
import { IsoTime } from '../types/primitives';
import { dateToIso } from '../dateToIso';
import { RequestDetails, defineRequest } from '../defineRequest';

export type CreatePersonResponse = {
  objectId: 'QjisA7kjLi';
  createdAt: IsoTime;
};

export async function createPerson(
  config: RequestConfig,
  groupId: string,
  person: CreatePersonInput
) {
  const url = config.baseUrl + '/parse/classes/Person';

  const body = getCreatePerson(config, groupId, person).body;

  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<CreatePersonResponse>(
    url,
    body,
    options
  );
  return res.data;
}

export async function updatePerson(
  config: RequestConfig,
  groupId: string,
  personId: string,
  person: UpdatePersonInput
) {
  const url = config.baseUrl + '/parse/classes/Person/' + personId;

  const body = getUpdatePerson(config, groupId, personId, person).body;

  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.put<CreatePersonResponse>(
    url,
    body,
    options
  );
  return res.data;
}

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

export const getCreatePerson = (
  config: RequestConfig,
  groupId: string,
  person: BasePersonInput
) => {
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
  };
};

export const getUpdatePerson = (
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
  };
};

export const createPersonRequest = defineRequest(
  (config: RequestConfig, groupId: string, person: BasePersonInput) => {
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
    } as RequestDetails<Promise<{ foo: string }>>;
  }
);
