import { RequestDetails, defineRequest } from '../defineRequest';
import { RequestConfig } from '../requestConfig';

export type CreateGroupResponse = {
  result: {
    code: 'JPSW8L69G';
    longCode: 'AENYnFHS2MqDKoSlovcN6rogl87FRWMZ4GgIUEUK6IecuLHzDf2HZganGcNkcifn';
    extendedShortCode: 'JPSW8L69GU';
    objectId: 'lYB962dOHa';
  };
};

export const createGroupRequest = defineRequest((config: RequestConfig) => {
  return {
    method: 'POST',
    path: '/parse/functions/createGroup',
    // yes, the body is supposed to be empty
    body: {},
    options: { headers: config.getHeaders() },
  } as RequestDetails<Promise<CreateGroupResponse>>;
});
