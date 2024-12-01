import { CreateExpenseResponse } from './methods/createExpense';
import { CreateGroupResponse } from './methods/createGroup';
import { CreatePaymentResponse } from './methods/createPayment';
import { CreatePersonResponse } from './methods/createPerson';
import { GetCurrencyRatesResponse } from './methods/getCurrencyRates';
import { UpdateEntryResponse } from './methods/updateEntry';
import { UpdateGroupResponse } from './methods/updateGroup';
import { UpdatePersonResponse } from './methods/updatePerson';
import { RequestConfig } from './requestConfig';

const removeIdProperty = (request: RequestObject) => {
  return { ...request, id: undefined };
};

export const executeRequestObjects = async <T extends RequestObject[]>(
  config: RequestConfig,
  requestsInput: T
) => {
  // the id is only used by splid-js, so we remove it before sending the request
  const requests = requestsInput.map(removeIdProperty);

  const res = await config.fetch(config.baseUrl + '/parse/batch', {
    method: 'POST',
    body: JSON.stringify({ requests }),
    headers: config.getHeaders(),
  });

  const data: {
    [K in keyof T]: IdToResponseTypesMap[T[K]['id']];
  } = await res.json();
  return data;
};

export const wrapRequestObject =
  <T extends RequestObject, Args extends [RequestConfig, ...unknown[]]>(
    func: (...args: Args) => T | Promise<T> | T[] | Promise<T[]>
  ) =>
  async (...args: Args) => {
    const requestObject = await func(...args);

    const data = await executeRequestObjects(
      args[0],
      Array.isArray(requestObject) ? requestObject : [requestObject]
    );
    return data;
  };

export interface IdToResponseTypesMap {
  createExpense: CreateExpenseResponse;
  createPayment: CreatePaymentResponse;
  updateGroup: UpdateGroupResponse;
  updatePerson: UpdatePersonResponse;
  updateEntry: UpdateEntryResponse;
  createGroup: CreateGroupResponse;
  createPerson: CreatePersonResponse;
  getCurrencyRates: GetCurrencyRatesResponse;
}

export type RequestObject = {
  id: keyof IdToResponseTypesMap;
  path: string;
  method: string;
  body: unknown;
};
