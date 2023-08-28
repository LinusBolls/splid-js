import { RequestConfig } from '../requestConfig';
import { ClassName } from '../types/className';
import { IsoTime } from '../types/primitives';

export type FindObjectsResponse<T extends unknown> = {
  result: {
    serverDate: {
      __type: 'Date';
      iso: IsoTime;
    };
    results: T[];
  };
};

const dateToIso = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so +1 is necessary
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};

const findObjects =
  <T extends keyof ClassName>(className: T) =>
  async (
    config: RequestConfig,
    groupId: string,
    skip = 0,
    limit = 100,
    minDate?: Date
  ) => {
    const url = config.baseUrl + '/parse/functions/findObjects';

    const body = {
      className,
      minDate: {
        __type: 'Date',
        iso: minDate ? dateToIso(minDate) : '1969-12-31T00:00:00.000Z',
      },
      group: groupId,
      limit,
      skip,
    };
    const options = { headers: config.getHeaders() };

    const res = await config.httpClient.post<FindObjectsResponse<ClassName[T]>>(
      url,
      body,
      options
    );
    return res.data;
  };
export const getPersons = findObjects('Person');
export const getGroupInfos = findObjects('GroupInfo');
export const getEntries = findObjects('Entry');
