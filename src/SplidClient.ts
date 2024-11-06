import axios, { AxiosError } from 'axios';

import { RequestConfig } from './requestConfig';
import { joinGroupWithAnyCode } from './methods/joinGroupWithAnyCode';
import { ScopedLogger } from './logging';
import { dedupeByGlobalId, FuncWithoutConfigArg } from './util';
import { findObjects } from './methods/findObjects';
import { SplidError } from './splidErrors';
import { Person } from './types/person';
import { Entry } from './types/entry';
import { getSuggestedPayments } from './getSuggestedPayments';
import { getBalance } from './getBalance';
import { toFixed } from './toFixed';
import { createExpense } from './methods/createExpense';
import { createPayment } from './methods/createPayment';
import {
  executeRequestObjects,
  IdToResponseTypesMap,
  RequestObject,
  wrapRequestObject,
} from './requestObject';
import { updateGroup } from './methods/updateGroup';
import { updatePerson } from './methods/updatePerson';
import { updateEntry } from './methods/updateEntry';
import { uploadFile } from './methods/uploadFile';
import { getCodeConfig } from './methods/getCodeConfig';
import { createGroup } from './methods/createGroup';
import { createPerson } from './methods/createPerson';
import { BatchClient } from './BatchClient';

export interface SplidClientOptions {
  disableAutomaticInstallationIdRefresh?: boolean;
  installationId?: string;

  parseApplicationId?: string;
  parseClientKey?: string;
}
export default class SplidClient {
  private requestConfig: RequestConfig;
  private disableAutomaticInstallationIdRefresh: boolean;

  public parseApplicationId: string;
  public parseClientKey: string;

  constructor(options?: SplidClientOptions) {
    const randomUUID = () => crypto.randomUUID();

    this.requestConfig = {
      baseUrl: 'https://splid.herokuapp.com',
      getHeaders: this.getHeaders.bind(this),
      httpClient: axios.create(),
      logger: new ScopedLogger('splid-js'),
      installationId: options?.installationId ?? randomUUID(),
      randomUUID,
    };

    this.disableAutomaticInstallationIdRefresh =
      options?.disableAutomaticInstallationIdRefresh ?? false;

    this.parseApplicationId =
      options?.parseApplicationId ?? 'AKCaB0FCF0NIigWjxcDBpDYh7q6eN7gYfKxk5QBN';
    this.parseClientKey =
      options?.parseClientKey ?? '4Z29DJvRGdVnB5dcTvDTTG01fbkITxvcPCPOt21M';
  }
  public get installationId() {
    return this.requestConfig.installationId;
  }
  setInstallationId(installationId: string) {
    this.requestConfig.installationId = installationId;
  }
  setRandomInstallationId() {
    this.requestConfig.installationId = this.requestConfig.randomUUID();
  }

  private getHeaders() {
    const constantHeaders = {
      'x-parse-app-build-version': '182063',
      'x-parse-app-display-version': '1.8.2',
      /**
       * changing this leads to `{ error: 'unauthorized' }`
       */
      'x-parse-application-id': this.parseApplicationId,
      /**
       * this seems arbitrary
       */
      'x-parse-client-key': this.parseClientKey,
      /**
       * this is also arbitrary, but leaving it out leads to `{ code: 141, error: 'Access denied' }`
       */
      'x-parse-installation-id': this.requestConfig.installationId,
      'X-Parse-Client-Version': 'i1.17.3',
      'x-parse-os-version': '13',
      'Content-Type': 'application/json',
    };
    return constantHeaders;
  }
  getCodeConfig = this.injectRequestConfig(getCodeConfig);
  group = {
    getByInviteCode: this.injectRequestConfig(joinGroupWithAnyCode),
    create: this.injectRequestConfig(createGroup),
  };
  groupInfo = {
    getByGroup: this.injectRequestConfig(findObjects('GroupInfo')),

    set: this.injectRequestConfig(wrapRequestObject(updateGroup)),
  };
  person = {
    create: this.injectRequestConfig(wrapRequestObject(createPerson)),
    getByGroup: this.injectRequestConfig(findObjects('Person')),

    getAllByGroup: async function (groupId: string) {
      let isFinished = false;

      let data: Person[] = [];

      while (!isFinished) {
        const res = await this.person.getByGroup(groupId, data.length);

        data = data.concat(res.result.results);

        if (res.result.results.length < 100) {
          isFinished = true;
        }
      }
      return data;
    }.bind(this) as (groupId: string) => Promise<Person[]>,

    set: this.injectRequestConfig(wrapRequestObject(updatePerson)),
  };
  entry = {
    set: this.injectRequestConfig(wrapRequestObject(updateEntry)),
    getByGroup: this.injectRequestConfig(findObjects('Entry')),

    getAllByGroup: async function (groupId: string) {
      let isFinished = false;

      let data: Entry[] = [];

      while (!isFinished) {
        const res = await this.entry.getByGroup(groupId, data.length);

        data = data.concat(res.result.results);

        if (res.result.results.length < 100) {
          isFinished = true;
        }
      }
      return data;
    }.bind(this) as (groupId: string) => Promise<Entry[]>,
    expense: {
      create: this.injectRequestConfig(wrapRequestObject(createExpense)),
    },
    payment: {
      create: this.injectRequestConfig(wrapRequestObject(createPayment)),
    },
  };

  file = {
    upload: this.injectRequestConfig(uploadFile),
  };

  /**
   * combines multiple actions into one request, speeding them up and making them less bandwidth intense
   *
   * ```ts
   * // example: creating multiple group members
   * await splid.batch((b) => names.map((name) => b.person.create(groupId, name)));
   * ```
   */
  public batch = async <T extends RequestObject[]>(
    callback: (batch: BatchClient) => T
  ) => {
    const batch = new BatchClient(this.requestConfig);

    const requestObjects = callback(batch);

    const data = (await executeRequestObjects(
      this.requestConfig,
      requestObjects
    )) as {
      [K in keyof T]: IdToResponseTypesMap[T[K]['id']];
    };
    return data;
  };

  private injectRequestConfig<
    F extends (requestConfig: RequestConfig, ...args: any[]) => any,
  >(f: F) {
    const newF: FuncWithoutConfigArg<typeof f> = (...args) => {
      return f(this.requestConfig, ...args).catch((err: unknown) => {
        if ((err as Error).name === 'AxiosError') {
          const axiosErr = err as AxiosError<
            (typeof SplidError)[keyof typeof SplidError]
          >;

          switch (axiosErr.response.data.error) {
            case SplidError.ACCESS_DENIED_RATE_LIMITED.error:
              if (!this.disableAutomaticInstallationIdRefresh) {
                this.requestConfig.logger.info(
                  'encountered rate limit, switching installation id'
                );

                this.setRandomInstallationId();

                return;
              }
              break;
          }
        }
        this.requestConfig.logger.error(
          'request failed:',
          JSON.stringify(err, null, 2)
        );

        throw err;
      });
    };
    return newF;
  }
  static getBalance = getBalance;
  static getSuggestedPayments = getSuggestedPayments;
  static dedupeByGlobalId = dedupeByGlobalId;
  static getRoundedBalance = toFixed;
}
