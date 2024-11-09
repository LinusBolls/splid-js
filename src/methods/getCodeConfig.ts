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
  const res = await config.fetch(
    config.baseUrl + '/parse/functions/getCodeConfig',
    {
      method: 'POST',
      body: JSON.stringify({ device }),
      headers: config.getHeaders(),
    }
  );
  const data: GetCodeConfigResponse = await res.json();

  return data;
}
