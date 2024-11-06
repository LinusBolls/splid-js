import { RequestConfig } from '../requestConfig';

export type JoinGroupWithCode400Response =
  | { code: 141; error: 'Access denied: invalid code' }
  | { code: 141; error: 'Access denied: too many invalid codes' };

export type JoinGroupWithAnyCodeResponse = {
  result: {
    objectId: string;
    /**
     * the invite code used to join the group
     */
    shortCode: string;
    extendedShortCode: string;
    longCode: string;
  };
};

const removeAllSpaces = (str: string) => str.replace(/\s/g, '');

export async function joinGroupWithAnyCode(
  config: RequestConfig,
  rawCode: string
) {
  try {
    const url = config.baseUrl + '/parse/functions/joinGroupWithAnyCode';

    const code = removeAllSpaces(rawCode).toUpperCase();

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
