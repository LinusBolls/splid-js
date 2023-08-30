import axios, { AxiosError } from 'axios';
import { RequestConfig } from './requestConfig';
import { joinGroupWithAnyCode } from './methods/joinGroupWithAnyCode';
import { Logger, ScopedLogger } from './logging';
import { FuncWithoutConfigArg } from './util';
import { getEntries, getGroupInfos, getPersons } from './methods/findObjects';
import { v4 as generateUuid } from 'uuid';
import { SplidError } from './splidErrors';
import { createExpense, createPayment } from './methods/createEntry';
import { createPerson, updatePerson } from './methods/createPerson';
import { createGroup } from './methods/createGroup';
import { batchMultipleRequests } from './methods/batchMultipleRequests';
import {
  deleteEntry,
  deleteGroupInfo,
  deletePerson,
} from './methods/deleteObject';
import { createGroupInfo, updateGroupInfo } from './methods/createGroupInfo';
import { batch } from './batch';
import { RequestDetails } from './defineRequest';

export interface SplidClientOptions {
  installationId?: string;
  /**
   * a positive integer or `-1` for infinite retries.
   */
  maxRetries?: number;
  /**
   * by default, when we hit Splid's ratelimit, we generate a new `installationId` to circumvent this.
   * this option disables that behaviour.
   */
  disableAutomaticInstallationIdRefresh?: boolean;
  logger?: Logger;
}
/**
 * TODO: support file methods
 */
export default class SplidClient {
  private installationId: string;
  private maxRetries: number;
  private disableAutomaticInstallationIdRefresh: boolean;
  private logger: Logger;
  private requestConfig: RequestConfig;

  constructor(options?: SplidClientOptions) {
    this.installationId = options?.installationId ?? generateUuid();

    this.maxRetries = options?.maxRetries ?? 5;

    this.disableAutomaticInstallationIdRefresh =
      options?.disableAutomaticInstallationIdRefresh ?? false;

    this.logger = options?.logger ?? new ScopedLogger('splid-js');

    this.requestConfig = {
      baseUrl: 'https://splid.herokuapp.com',
      getHeaders: this.getHeaders.bind(this),
      httpClient: axios.create(),
      logger: this.logger,
      installationId: this.installationId,
    };
  }
  setInstallationId(installationId: string) {
    this.installationId = installationId;

    this.requestConfig = {
      baseUrl: 'https://splid.herokuapp.com',
      getHeaders: this.getHeaders.bind(this),
      httpClient: axios.create(),
      logger: this.logger,
      installationId: this.installationId,
    };
  }
  setRandomInstallationId() {
    this.setInstallationId(generateUuid());
  }
  batch = this.execute(batch);

  private execute<
    Response,
    F extends (
      requestConfig: RequestConfig,
      ...args: any[]
    ) => RequestDetails<Response>,
  >(f: F) {
    const newF = async (...args) => {
      const request = f(this.requestConfig, ...args);

      const res = await fetch(this.requestConfig.baseUrl + request.path, {
        body: request.body,
      });
      const data = await res.json();

      return data;
    };
    return newF as FuncWithoutConfigArg<typeof f>;
  }

  private getHeaders() {
    const constantHeaders = {
      'x-parse-app-build-version': '142002',
      'x-parse-app-display-version': '1.4.2',
      /**
       * changing this leads to `{ error: 'unauthorized' }`
       */
      'x-parse-application-id': 'AKCaB0FCF0NIigWjxcDBpDYh7q6eN7gYfKxk5QBN',
      /**
       * this seems arbitrary
       */
      'x-parse-client-key': '4Z29DJvRGdVnB5dcTvDTTG01fbkITxvcPCPOt21M',
      /**
       * this is also arbitrary, but leaving it out leads to `{ code: 141, error: 'Access denied' }`
       */
      'x-parse-installation-id': this.installationId,
      'x-parse-os-version': '13',
      'Content-Type': 'application/json',
    };
    return constantHeaders;
  }
  group = {
    create: this.injectRequestConfig(createGroup),
    getByInviteCode: this.injectRequestConfig(joinGroupWithAnyCode),
  };
  groupInfo = {
    create: this.injectRequestConfig(createGroupInfo),
    getByGroup: this.injectRequestConfig(getGroupInfos),
    update: this.injectRequestConfig(updateGroupInfo),
    delete: this.injectRequestConfig(deleteGroupInfo),
  };
  person = {
    create: this.injectRequestConfig(createPerson),
    getByGroup: this.injectRequestConfig(getPersons),
    update: this.injectRequestConfig(updatePerson),
    delete: this.injectRequestConfig(deletePerson),
  };
  entry = {
    createPayment: this.injectRequestConfig(createPayment),
    createExpense: this.injectRequestConfig(createExpense),
    getByGroup: this.injectRequestConfig(getEntries),
    // update: this.injectRequestConfig(updateEntry),
    delete: this.injectRequestConfig(deleteEntry),
  };
  file = {
    // uploading, changing, deleting
  };

  private refreshInstallationId() {
    if (this.disableAutomaticInstallationIdRefresh) return;

    this.logger.info('encountered rate limit, switching installation id');
    this.setRandomInstallationId();
  }

  private injectRequestConfig<
    F extends (requestConfig: RequestConfig, ...args: any[]) => Promise<any>,
  >(f: F) {
    // @ts-ignore
    const newF: FuncWithoutConfigArg<typeof f> = async (...args) => {
      let numRetries = 0;

      let isSuccess = false;

      let result: ReturnType<F> | null = null;

      let error: unknown | null;

      while (
        !isSuccess &&
        (numRetries <= this.maxRetries || this.maxRetries < 0)
      ) {
        try {
          result = await f(this.requestConfig, ...args);

          isSuccess = true;
        } catch (err) {
          if (numRetries === this.maxRetries) throw err;

          if (
            (err as Error).message ===
              SplidError.ACCESS_DENIED_RATE_LIMITED.error ||
            ((err as Error).name === 'AxiosError' &&
              err.response.data.error ===
                SplidError.ACCESS_DENIED_RATE_LIMITED.error)
          ) {
            this.refreshInstallationId();

            numRetries += 1;

            continue;
          }
          this.logger.error(
            numRetries > 0
              ? `request failed after ${numRetries} retries`
              : `request failed`,
            JSON.stringify(err, null, 2)
          );
          throw err;
        }
        return result;
      }
      if (numRetries > 0) {
        this.logger.info(`request succeeded after ${numRetries} retries`);
      }
      numRetries = 0;
    };
    return newF as FuncWithoutConfigArg<typeof f>;
  }
}
