import { CreateExpenseResponse } from './methods/createExpense';
import { CreateGroupResponse } from './methods/createGroup';
import { CreatePaymentResponse } from './methods/createPayment';
import { CreatePersonResponse } from './methods/createPerson';
import { UpdateEntryResponse } from './methods/updateEntry';
import { UpdateGroupResponse } from './methods/updateGroup';
import { UpdatePersonResponse } from './methods/updatePerson';
import { RequestConfig } from './requestConfig';

export const executeRequestObjects = async <T extends RequestObject[]>(
  config: RequestConfig,
  requests: T
) => {
  const url = config.baseUrl + '/parse/batch';

  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post(url, { requests }, options);

  const data = res.data as {
    [K in keyof T]: IdToResponseTypesMap[T[K]['id']];
  };
  return data;
};

export const wrapRequestObject =
  <Args extends [RequestConfig, ...unknown[]]>(
    func: (...args: Args) => RequestObject | Promise<RequestObject>
  ) =>
  async (...args: Args) => {
    const requestObject = await func(...args);

    const data = await executeRequestObjects(args[0], [requestObject]);

    return data[0];
  };

export interface IdToResponseTypesMap {
  createExpense: CreateExpenseResponse;
  createPayment: CreatePaymentResponse;
  updateGroup: UpdateGroupResponse;
  updatePerson: UpdatePersonResponse;
  updateEntry: UpdateEntryResponse;
  createGroup: CreateGroupResponse;
  createPerson: CreatePersonResponse;
}

export type RequestObject = {
  id: keyof IdToResponseTypesMap;
  path: string;
  method: string;
  body: unknown;
};
