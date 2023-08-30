import { RequestConfig } from '../requestConfig';
import { SplidError } from '../splidErrors';
import { BatchItem } from '../batch';

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
  requests: BatchItem[]
) {
  const url = config.baseUrl + '/parse/batch';

  const body = {
    requests,
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
