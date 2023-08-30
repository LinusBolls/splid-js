import { RequestConfig } from '../requestConfig';
import { ClassName } from '../types/className';
import { IsoTime } from '../types/primitives';

export type DeleteObjectResponse<T extends unknown> = {
  updatedAt: IsoTime;
};

const deleteObject =
  <T extends keyof ClassName>(className: T) =>
  async (config: RequestConfig, objectId: string) => {
    const url = config.baseUrl + '/parse/classes/' + className + '/' + objectId;

    const body = {
      isDeleted: true,
      objectId,
    };
    const options = { headers: config.getHeaders() };

    const res = await config.httpClient.put<DeleteObjectResponse<ClassName[T]>>(
      url,
      body,
      options
    );
    return res.data;
  };
export const deletePerson = deleteObject('Person');
export const deleteGroupInfo = deleteObject('GroupInfo');
export const deleteEntry = deleteObject('Entry');
