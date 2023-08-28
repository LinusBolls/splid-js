import { RequestConfig } from '../requestConfig';
import { IsoTime } from '../types/primitives';

export type CreatePersonResponse = {
  objectId: 'QjisA7kjLi';
  createdAt: IsoTime;
};

export async function createPerson(
  config: RequestConfig,
  groupId: string,
  person: {
    initials: string;
    name: string;
  }
) {
  const url = config.baseUrl + '/parse/classes/Person';

  const body = {
    UpdateInstallationID: '736a96e9-25f5-4522-98ae-d4b3629bf109',
    initials: person.initials,
    name: person.name,
    UpdateID: 'e41eab0b-91b9-4932-aea2-f6622fde1319',
    createdGlobally: {
      __type: 'Date',
      iso: '2023-08-28T15:22:30.758Z',
    },
    GlobalId: '83afb815-60a7-4ff8-a657-9bb6cabce564',
    group: {
      __type: 'Pointer',
      className: '_User',
      objectId: groupId,
    },
  };
  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<CreatePersonResponse>(
    url,
    body,
    options
  );
  return res.data;
}
