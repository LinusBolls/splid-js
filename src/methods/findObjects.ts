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

export const findObjects =
  <T extends keyof ClassName>(className: T) =>
  async (
    config: RequestConfig,
    groupId: string,
    skip = 0,
    limit = 100,
    minDate?: Date
  ) => {
    const body = {
      className,
      minDate: {
        __type: 'Date',
        iso: minDate?.toISOString() ?? '1969-12-31T00:00:00.000Z',
      },
      group: groupId,
      limit,
      skip,
    };

    const res = await config.fetch(
      config.baseUrl + '/parse/functions/findObjects',
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: config.getHeaders(),
      }
    );
    const data: FindObjectsResponse<ClassName[T]> = await res.json();

    return data;
  };
