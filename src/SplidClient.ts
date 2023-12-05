import axios, { AxiosError } from 'axios';
import { RequestConfig } from './requestConfig';
import { joinGroupWithAnyCode } from './methods/joinGroupWithAnyCode';
import { ScopedLogger } from './logging';
import { FuncWithoutConfigArg } from './util';
import { findObjects } from './methods/findObjects';
import { SplidError } from './splidErrors';

export interface SplidClientOptions {
  disableAutomaticInstallationIdRefresh?: boolean;
  installationId?: string;
}
export default class SplidClient {
  private requestConfig: RequestConfig;
  private installationId: string;
  private disableAutomaticInstallationIdRefresh: boolean;

  constructor(options?: SplidClientOptions) {
    this.installationId = options?.installationId ?? crypto.randomUUID();

    this.disableAutomaticInstallationIdRefresh =
      options?.disableAutomaticInstallationIdRefresh ?? false;

    this.requestConfig = {
      baseUrl: 'https://splid.herokuapp.com',
      getHeaders: this.getHeaders.bind(this),
      httpClient: axios.create(),
      logger: new ScopedLogger('splid-js'),
    };
  }
  setInstallationId(installationId: string) {
    this.installationId = installationId;
  }
  setRandomInstallationId() {
    this.installationId = crypto.randomUUID();
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
    getByInviteCode: this.injectRequestConfig(joinGroupWithAnyCode),
  };
  groupInfo = {
    getByGroup: this.injectRequestConfig(findObjects('GroupInfo')),
  };
  person = {
    getByGroup: this.injectRequestConfig(findObjects('Person')),
  };
  entry = {
    getByGroup: this.injectRequestConfig(findObjects('Entry')),
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
}
