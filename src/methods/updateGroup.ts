import { sanitizeParseObject } from '../parse';
import { RequestConfig } from '../requestConfig';
import { RequestObject } from '../requestObject';
import { GroupInfo } from '../types/groupInfo';
import { IsoTime } from '../types/primitives';

export interface UpdateGroupResponse {
  success: {
    updatedAt: IsoTime;
  };
}

export function updateGroup(config: RequestConfig, data: GroupInfo) {
  const sanitized = sanitizeParseObject(data);

  sanitized.UpdateID = config.randomUUID();

  if (!sanitized.wallpaperID) {
    sanitized.wallpaperID = {
      __op: 'Delete',
    };
  }

  return {
    id: 'updateGroup',
    path: '/parse/classes/GroupInfo/' + data.objectId,
    method: 'PUT',
    body: sanitized,
  } as const;
}
