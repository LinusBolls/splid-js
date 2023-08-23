import { RequestConfig } from '../requestConfig';
import { IsoTime } from '../types/primitives';

export type InstallationResponse = {
  updatedAt: IsoTime;
};

export async function installation(config: RequestConfig, code: string) {
  const url = config.baseUrl + '/parse/classes/_Installation/' + code;

  const body = {
    referrer: '9c261483-2c88-4685-aae2-34531aedaf2a',
    parseVersion: '4.1.0',
    channels: ['group_alert_QfQhx0XSSc', 'group_silent_QfQhx0XSSc'],
    numberOfGroups: 1,
    languageCode: 'EN',
    objectId: code,
  };
  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.put<InstallationResponse>(
    url,
    body,
    options
  );
  return res.data;
}
