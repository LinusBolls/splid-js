import { CreateExpenseResponse } from './methods/createExpense';
import { CreatePaymentResponse } from './methods/createPayment';
import { UpdateEntryResponse } from './methods/updateEntry';
import { UpdateGroupResponse } from './methods/updateGroup';
import { UpdatePersonResponse } from './methods/updatePerson';
import { RequestConfig } from './requestConfig';

export const executeRequestObject =
  <ReturnType, FuncArgs extends unknown[]>(
    func: (...args: [RequestConfig, ...FuncArgs]) => RequestObject
  ) =>
  async (...args: [RequestConfig, ...FuncArgs]) => {
    const url = args[0].baseUrl + '/parse/batch';

    const options = { headers: args[0].getHeaders() };

    const requestObject = func(...args);

    const res = await args[0].httpClient.post(
      url,
      { requests: [requestObject] },
      options
    );

    const data: IdToResponseTypesMap[(typeof requestObject)['id']] =
      res.data[0];

    return data;
  };

export interface IdToResponseTypesMap {
  createExpense: CreateExpenseResponse;
  createPayment: CreatePaymentResponse;
  updateGroup: UpdateGroupResponse;
  updatePerson: UpdatePersonResponse;
  updateEntry: UpdateEntryResponse;
}

export type RequestObject = {
  id: keyof IdToResponseTypesMap;
  path: string;
  method: string;
  body: unknown;
};
