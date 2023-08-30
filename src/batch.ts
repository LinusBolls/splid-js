import { RequestDetails, defineRequest } from './defineRequest';
import { createPersonRequest } from './methods/createPerson';
import { RequestConfig } from './requestConfig';
import { FuncWithoutConfigArg } from './util';

export class BatchClient {
  private requestConfig: RequestConfig;

  constructor(requestConfig: RequestConfig) {
    this.requestConfig = requestConfig;
  }

  person = {
    create: this.injectRequestConfig(createPersonRequest),
  };
  private injectRequestConfig<
    F extends (requestConfig: RequestConfig, ...args: any[]) => any,
  >(f: F) {
    // @ts-ignore
    const newF: FuncWithoutConfigArg<typeof f> = (...args) => {
      return f(this.requestConfig, ...args);
    };
    return newF;
  }
}

export const batch = defineRequest(
  <Res extends RequestDetails<unknown>[]>(
    config: RequestConfig,
    func: (batchClient: BatchClient) => Res
  ) => {
    const requests = func(new BatchClient(config));

    return {
      method: 'POST',
      path: '/parse/batch',
      body: {
        requests,
      },
      // options: { headers: config.getHeaders() },
    } as RequestDetails<Promise<unknown[]>>;
  }
);
