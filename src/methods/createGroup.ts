import { defaultCurrencyRates } from '../defaultCurrencyRates';
import { RequestConfig } from '../requestConfig';
import { executeRequestObjects } from '../requestObject';
import { createPerson, CreatePersonResponse } from './createPerson';
import { UpdateGroupResponse } from './updateGroup';

export interface CreateGroupRawResponse {
  result: {
    code: 'UVFP588H7';
    longCode: 'R6sjlghj8lPm14IGjMkJdEFjPUPYKemcWpwbkrRtDezSQprVAdwGDkEnnKuQoeo8';
    extendedShortCode: 'UVFP588H7L';
    objectId: 'oCCCOtA24J';
  };
}

export interface CreateGroupResponse {
  group: CreateGroupRawResponse;
  groupInfo: UpdateGroupResponse;
  groupMembers: CreatePersonResponse[];
}

export type MemberInput =
  | string
  | {
      name: string;
      initials?: string;
    };

export interface CreateGroupOptions {
  currencyRates?: Record<string, number>;
  defaultCurrencyCode?: string;
  customCategories?: string[];
  wallpaperID?: string;
}

export async function createGroup(
  config: RequestConfig,
  name: string,
  members: MemberInput[],
  options?: CreateGroupOptions
): Promise<CreateGroupResponse> {
  const groupRes = await config.httpClient.post<CreateGroupRawResponse>(
    config.baseUrl + '/parse/functions/createGroup',
    {},
    { headers: config.getHeaders() }
  );
  const groupId = groupRes.data.result.objectId;

  const mappedMembers = members.map((i) =>
    typeof i === 'string' ? { name: i } : i
  );

  const persons = mappedMembers.map((i) => {
    return createPerson(config, groupId, i.name, i.initials);
  });

  const requestObject = {
    id: 'updateGroup',
    path: '/parse/classes/GroupInfo',
    method: 'POST',
    body: {
      UpdateInstallationID: config.installationId,
      customCategories: options?.customCategories ?? {
        __op: 'Delete',
      },
      GlobalId: config.randomUUID(),
      currencyRates: options?.currencyRates ?? defaultCurrencyRates,
      isDeleted: false,
      wallpaperID: options?.wallpaperID ?? {
        __op: 'Delete',
      },
      creatorExperiments: {},
      createdGlobally: {
        __type: 'Date',
        iso: new Date().toISOString(),
      },
      defaultCurrencyCode: options?.defaultCurrencyCode ?? 'EUR',
      UpdateID: config.randomUUID(),
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
      creatorInstallationID: config.installationId,
      name: name,
    },
  } as const;

  const [groupInfoRes, ...personResponses] = await executeRequestObjects(
    config,
    [requestObject, ...persons] as const
  );

  return {
    group: groupRes.data,
    groupInfo: groupInfoRes,
    groupMembers: personResponses as CreatePersonResponse[],
  };
}
