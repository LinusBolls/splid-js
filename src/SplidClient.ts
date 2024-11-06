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
import { toFixed } from './toFixed';

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
  balance = {
    /**
     * requests all necessary data and calculates the group member's balances based on the expenses and payments.
     *
     * might be off of the results of the Splid App by a single digit in some cases (single cent).
     *
     * not tested for currencies other than `EUR`.
     */
    getByGroup: async function (groupId: string): Promise<{
      balance: Record<
        string,
        {
          balance: string;
        }
      >;
      suggestedPayments: { from: string; to: string; amount: number }[];
    }> {
      let isEntriesFinished = false;

      let entries: Entry[] = [];

      while (!isEntriesFinished) {
        const res = await this.entry.getByGroup(groupId, entries.length);

        entries = entries.concat(res.result.results);

        if (res.result.results.length < 100) {
          isEntriesFinished = true;
        }
      }

      let isPeopleFinished = false;

      let people: Person[] = [];

      while (!isPeopleFinished) {
        const res = await this.person.getByGroup(groupId, people.length);

        people = people.concat(res.result.results);

        if (res.result.results.length < 100) {
          isPeopleFinished = true;
        }
      }

      let balance = people.reduce<
        Record<
          string,
          {
            person: any;
            payedFor: number;
            payedBy: number;
            balance: string;
          }
        >
      >((obj, i) => {
        obj[i.GlobalId] = {
          person: i,
          payedFor: 0,
          payedBy: 0,
          balance: '',
        };
        return obj;
      }, {});

      for (const entry of dedupeByGlobalId(entries)) {
        if (entry.isDeleted) continue;

        // payments work the same as expenses, we can treat them the same

        if (!balance[entry.primaryPayer])
          throw new Error(
            `SplidClient.balance.getByGroup: failed to resolve primary payer with id "${entry.primaryPayer}"`
          );

        for (const [id, amount] of Object.entries(
          entry.secondaryPayers ?? {}
        )) {
          if (!balance[id])
            throw new Error(
              `SplidClient.balance.getByGroup: failed to resolve secondary payer with id "${id}"`
            );

          balance[id].payedFor += amount;
          balance[entry.primaryPayer].payedFor -= amount;
        }
        for (const item of entry.items) {
          balance[entry.primaryPayer].payedFor += item.AM;

          for (const [id2, percOrShare] of Object.entries(item.P.P)) {
            if (!balance[id2])
              throw new Error(
                `SplidClient.balance.getByGroup: failed to resolve profiteer with id "${id2}"`
              );

            balance[id2].payedBy += item.AM * percOrShare;
          }
        }
      }

      for (const person of Object.values(balance)) {
        person.balance = toFixed(person.payedBy - person.payedFor);
      }

      return {
        balance,
        suggestedPayments: getSuggestedPayments(balance),
      };
    }.bind(this) as (groupId: string) => Promise<{
      balance: Record<
        string,
        {
          balance: string;
        }
      >;
      suggestedPayments: { from: string; to: string; amount: number }[];
    }>,
  };
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
