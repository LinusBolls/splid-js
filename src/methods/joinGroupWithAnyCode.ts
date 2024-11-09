import { RequestConfig } from '../requestConfig';
import { SplidError } from '../splidErrors';

export type JoinGroupWithCode400Response =
  (typeof SplidError)[keyof typeof SplidError];

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
  const code = removeAllSpaces(rawCode).toUpperCase();

  const res = await config.fetch(
    config.baseUrl + '/parse/functions/joinGroupWithAnyCode',
    {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: config.getHeaders(),
    }
  );
  const data: JoinGroupWithAnyCodeResponse = await res.json();

  return config.assertResponseBody(data);
}
