import { AxiosError } from 'axios';
import { RequestConfig } from '../requestConfig';

export type JoinGroupWithCode400Response =
  | { code: 141; error: 'Access denied: invalid code' }
  | { code: 141; error: 'Access denied: too many invalid codes' };

export type JoinGroupWithAnyCodeResponse = {
  result: {
    objectId: 'LLTvQ7oHPI';
    /**
     * the invite code for this group is "PWJE2BP7K"
     */
    shortCode: 'PWJE2B';
    extendedShortCode: 'PWJE2BP7K9';
    longCode: 'jaW3PQ9KAqgfe1DZmx9ysCJhrZx5ZTxmdfpx4W5jZBiTcSy7C1hIbaL7Iyk3lQne';
  };
};

const removeAllSpaces = (str: string) => str.replace(/\s/g, '');

export async function joinGroupWithAnyCode(
  config: RequestConfig,
  rawCode: string
) {
  try {
    const url = config.baseUrl + '/parse/functions/joinGroupWithAnyCode';

    const code = removeAllSpaces(rawCode);

    const body = {
      code,
    };
    const options = { headers: config.getHeaders() };

    const res = await config.httpClient.post<JoinGroupWithAnyCodeResponse>(
      url,
      body,
      options
    );
    return res.data;
  } catch (err) {
    // if (err.name === "AxiosError") {

    //   const axiosErr = err as AxiosError<JoinGroupWithCode400Response>;

    //   if (axiosErr.response.data.error === 'Access denied: too many invalid codes') {

    //     config.logger.error("joinGroupWithAnyCode: rate limited. change your 'x-parse-installation-id' to an arbitrary uuid to reset this.");

    //     throw axiosErr;
    //   }
    //   if (axiosErr.response.data.error === 'Access denied: invalid code') {
    //     return false;
    //   }
    // }
    throw err;
  }
}
