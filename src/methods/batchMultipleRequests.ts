import { AxiosError } from 'axios';
import { generateInviteCodes } from '../inviteCodes';
import { RequestConfig } from '../requestConfig';
import { SplidError } from '../splidErrors';
import { IsoTime } from '../types/primitives';

export type BatchMultipleRequestsResponse = {
  code: string;

  error?: (typeof SplidError)[keyof typeof SplidError];

  success?: {
    result: {
      objectId: 'VmXrQPCfFe';
      shortCode: 'CPT4QT';
      extendedShortCode: 'CPT4QTMIXL';
      longCode: 'xdRIGQfZAKlb3XIiD2CjWCXeBZsSi9lWXDcXWWtd2YKg8KFYJ1xccKx1FKF87GYv';
    };
  };
}[];

export async function batchMultipleRequests(
  config: RequestConfig,
  codes: string[]
) {
  const url = config.baseUrl + '/parse/batch';

  const body = {
    requests: codes.map((code) => ({
      method: 'POST',
      path: '/parse/functions/joinGroupWithAnyCode',
      body: {
        code,
      },
    })),
  };
  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<BatchMultipleRequestsResponse>(
    url,
    body,
    options
  );
  if (
    res.data.some(
      (i) => i.error?.error === SplidError.ACCESS_DENIED_RATE_LIMITED.error
    )
  ) {
    throw new Error(SplidError.ACCESS_DENIED_RATE_LIMITED.error);
  }
  return res.data;
}
