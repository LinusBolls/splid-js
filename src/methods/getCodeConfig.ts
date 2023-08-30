import { RequestConfig } from '../requestConfig';
import { DeviceType } from '../types/primitives';

export type GetCodeConfigResponse = {
  result: {
    type: 'short';
    /**
     * number of digits of group invite codes, always 9 as of this comment, but used to be 6 until march of 2023.
     */
    length: number;
  };
};

export async function getCodeConfig(
  config: RequestConfig,
  deviceType: DeviceType
) {
  const url = config.baseUrl + '/parse/functions/getCodeConfig';

  const body = {
    deviceType,
  };
  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<GetCodeConfigResponse>(
    url,
    body,
    options
  );
  return res.data;
}
