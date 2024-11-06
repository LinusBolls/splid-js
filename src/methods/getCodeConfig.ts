import { RequestConfig } from '../requestConfig';

export interface GetCodeConfigResponse {
  result: {
    type: 'short';
    /** at the time of writing, this is always `9` for both devices */
    length: number;
  };
}

export async function getCodeConfig(
  config: RequestConfig,
  device: 'ios' | 'android'
) {
  const res = await config.httpClient.post<GetCodeConfigResponse>(
    config.baseUrl + '/parse/functions/getCodeConfig',
    {
      device,
    },
    {
      headers: config.getHeaders(),
    }
  );
  const data = res.data;

  return data;
}
