import { RequestConfig } from '../requestConfig';

export type CreateGroupResponse = {
  result: {
    code: 'JPSW8L69G';
    longCode: 'AENYnFHS2MqDKoSlovcN6rogl87FRWMZ4GgIUEUK6IecuLHzDf2HZganGcNkcifn';
    extendedShortCode: 'JPSW8L69GU';
    objectId: 'lYB962dOHa';
  };
};

export const createGroup = async (config: RequestConfig) => {
  const url = config.baseUrl + '/parse/functions/createGroup';

  // yes, the body is supposed to be empty
  const body = {};
  const options = { headers: config.getHeaders() };

  const res = await config.httpClient.post<CreateGroupResponse>(
    url,
    body,
    options
  );
  return res.data;
};
