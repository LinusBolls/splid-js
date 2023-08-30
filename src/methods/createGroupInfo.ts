import { v4 as generateUuid } from 'uuid';
import currencyExchangeRates from '../data/currencyExchangeRates.data';
import { RequestConfig } from '../requestConfig';
import { CurrencyCode, IsoTime } from '../types/primitives';
import { dateToIso } from '../dateToIso';

export type CreateGroupInfoResponse = {
  objectId: 'Aw4u4KZPEx';
  createdAt: IsoTime;
};

export async function createGroupInfo(
  config: RequestConfig,
  groupId: string,
  groupInfo: CreateGroupInfoInput
) {
  const url = config.baseUrl + '/parse/classes/GroupInfo';

  const body = getCreateGroupInfo(config, groupId, groupInfo).body;

  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<CreateGroupInfoResponse>(
    url,
    body,
    options
  );
  return res.data;
}

export async function updateGroupInfo(
  config: RequestConfig,
  groupId: string,
  groupInfoId: string,
  groupInfo: UpdateGroupInfoInput
) {
  const url = config.baseUrl + '/parse/classes/GroupInfo/' + groupInfoId;

  const body = getUpdateGroupInfo(config, groupId, groupInfoId, groupInfo).body;

  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.put<CreateGroupInfoResponse>(
    url,
    body,
    options
  );
  return res.data;
}

type BaseGroupInfoInput = {
  name: string;
  defaultCurrencyCode: CurrencyCode;
  customCategories: string[];
};
type CreateGroupInfoInput = BaseGroupInfoInput;
type UpdateGroupInfoInput = BaseGroupInfoInput & {
  createdGlobally: Date | string;
  globalId: string;
  objectId: string;
};

export const getCreateGroupInfo = (
  config: RequestConfig,
  groupId: string,
  groupInfo: CreateGroupInfoInput
) => {
  return {
    method: 'POST',
    path: '/parse/classes/GroupInfo',
    body: {
      name: groupInfo.name,
      defaultCurrencyCode: groupInfo.defaultCurrencyCode,
      wallpaperID: {
        __op: 'Delete',
      },
      customCategories: groupInfo.customCategories.length
        ? groupInfo.customCategories
        : {
            __op: 'Delete',
          },
      /**
       * TODO: research this
       */
      creatorExperiments: {
        __op: 'Delete',
      },
      currencyRates: currencyExchangeRates,

      creatorInstallationID: config.installationId,
      UpdateInstallationID: config.installationId,
      UpdateID: generateUuid(),
      createdGlobally: {
        __type: 'Date',
        iso: dateToIso(new Date()),
      },
      GlobalId: generateUuid(),
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
    },
  };
};

export const getUpdateGroupInfo = (
  config: RequestConfig,
  groupId: string,
  groupInfoId: string,
  groupInfo: UpdateGroupInfoInput
) => {
  return {
    method: 'PUT',
    path: '/parse/classes/GroupInfo/' + groupInfoId,
    body: {
      name: groupInfo.name,
      defaultCurrencyCode: groupInfo.defaultCurrencyCode,
      wallpaperID: {
        __op: 'Delete',
      },
      customCategories: groupInfo.customCategories.length
        ? groupInfo.customCategories
        : {
            __op: 'Delete',
          },
      creatorExperiments: {
        __op: 'Delete',
      },
      currencyRates: currencyExchangeRates,

      // creatorInstallationID: config.installationId,
      UpdateInstallationID: config.installationId,
      UpdateID: generateUuid(),
      createdGlobally: {
        __type: 'Date',
        iso: dateToIso(new Date()),
      },
      GlobalId: generateUuid(),
      objectId: groupInfoId,
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
    },
  };
};
