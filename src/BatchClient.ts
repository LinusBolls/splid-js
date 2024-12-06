import { createEntry } from './methods/createEntry';
import { createExpense } from './methods/createExpense';
import { createPayment } from './methods/createPayment';
import { createPerson } from './methods/createPerson';
import { updateEntry } from './methods/updateEntry';
import { updateGroup } from './methods/updateGroup';
import { updatePerson } from './methods/updatePerson';
import { RequestConfig } from './requestConfig';
import { FuncWithoutConfigArg } from './util';

export class BatchClient {
  constructor(private readonly requestConfig: RequestConfig) {}

  private injectRequestConfig<
    F extends (requestConfig: RequestConfig, ...args: any[]) => any,
  >(f: F) {
    const newF: FuncWithoutConfigArg<typeof f> = (...args) => {
      return f(this.requestConfig, ...args);
    };
    return newF;
  }

  public person = {
    create: this.injectRequestConfig(createPerson),
    set: this.injectRequestConfig(updatePerson),
  };
  public groupInfo = {
    set: this.injectRequestConfig(updateGroup),
  };
  public entry = {
    create: this.injectRequestConfig(createEntry),
    set: this.injectRequestConfig(updateEntry),

    expense: {
      create: this.injectRequestConfig(createExpense),
    },
    payment: {
      create: this.injectRequestConfig(createPayment),
    },
  };
}
