import axios, { AxiosError } from 'axios';

import { BatchClient } from './BatchClient';
import { getBalance } from './getBalance';
import { getSuggestedPayments } from './getSuggestedPayments';
import { ScopedLogger } from './logging';
import { createExpense } from './methods/createExpense';
import { createGroup } from './methods/createGroup';
import { createPayment } from './methods/createPayment';
import { createPerson } from './methods/createPerson';
import { findObjects } from './methods/findObjects';
import { getCodeConfig } from './methods/getCodeConfig';
import { joinGroupWithAnyCode } from './methods/joinGroupWithAnyCode';
import { updateEntry } from './methods/updateEntry';
import { updateGroup } from './methods/updateGroup';
import { updatePerson } from './methods/updatePerson';
import { uploadFile } from './methods/uploadFile';
import { RequestConfig } from './requestConfig';
import {
  executeRequestObjects,
  IdToResponseTypesMap,
  RequestObject,
  wrapRequestObject,
} from './requestObject';
import { SplidError } from './splidErrors';
import { toFixed } from './toFixed';
import { Entry } from './types/entry';
import { Person } from './types/person';
import { dedupeByGlobalId, FuncWithoutConfigArg } from './util';

export interface SplidClientOptions {
  /**
   * by default, the client automatically switches to a new installation id if we hit a rate limit with the Splid API
   */
  disableAutomaticInstallationIdRefresh?: boolean;
  /**
   * used for the `x-parse-installation-id` header when making requests to the Splid API.
   *
   * changing this resets any rate limits that may be active
   */
  installationId?: string;

  /**
   * used for the `x-parse-application-id` header when making requests to the Splid API
   */
  parseApplicationId?: string;
  /**
   * used for the `x-parse-client-key` header when making requests to the Splid API
   */
  parseClientKey?: string;
}
export default class SplidClient {
  private requestConfig: RequestConfig;
  /**
   * by default, the client automatically switches to a new installation id if we hit a rate limit with the Splid API
   */
  private disableAutomaticInstallationIdRefresh: boolean;

  /**
   * used for the `x-parse-application-id` header when making requests to the Splid API
   */
  public parseApplicationId: string;
  /**
   * used for the `x-parse-client-key` header when making requests to the Splid API
   */
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
  /**
   * used for the `x-parse-installation-id` header when making requests to the Splid API.
   *
   * changing this resets any rate limits that may be active
   */
  public get installationId() {
    return this.requestConfig.installationId;
  }
  /**
   * resets any rate limits that may be active
   */
  public setInstallationId(installationId: string) {
    this.requestConfig.installationId = installationId;
  }
  /**
   * resets any rate limits that may be active
   */
  public setRandomInstallationId() {
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
  /**
   * the Splid App dynamically configures the length an invite code needs to have from the backend, presumably so they could seamlessly switch to longer codes should they run into limits in the future.
   *
   * at the time of writing, the length of invite codes is always `9`.
   */
  public getCodeConfig = this.injectRequestConfig(getCodeConfig);
  public group = {
    getByInviteCode: this.injectRequestConfig(joinGroupWithAnyCode),
    create: this.injectRequestConfig(createGroup),
  };
  public groupInfo = {
    getByGroup: this.injectRequestConfig(findObjects('GroupInfo')),
    getOneByGroup: this.injectRequestConfig((config, groupId) =>
      findObjects('GroupInfo')(config, groupId).then(
        (res) => res.result.results[0]
      )
    ),

    set: this.injectRequestConfig(wrapRequestObject(updateGroup)),
  };
  public person = {
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
  public entry = {
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

  public file = {
    /**
     * uploads a file to the Splid API.
     *
     * at the time of writing, this is only used for group wallpapers.
     */
    upload: this.injectRequestConfig(uploadFile),
  };

  /**
   * a primitive that combines multiple actions into one request, speeding them up and making them less bandwidth intense.
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

    const requestObjects = callback(batch).flat();

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

          switch (axiosErr.response?.data?.error) {
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
          if (axiosErr.code === 'ERR_NETWORK') {
            this.requestConfig.logger.error(
              'request failed due to network error'
            );
            throw err;
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
