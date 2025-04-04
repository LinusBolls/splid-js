import { sanitizeParseObject, WithoutParseKeys } from '../parse';
import { RequestConfig } from '../requestConfig';
import { GroupInfo } from '../types/groupInfo';
import { IsoTime } from '../types/primitives';

export interface UpdateGroupResponse {
  success: {
    updatedAt: IsoTime;
  };
}
type Input = Omit<WithoutParseKeys<GroupInfo>, 'UpdateID'>;

export function updateGroup(config: RequestConfig, data: Input | Input[]) {
  const arr = Array.isArray(data) ? data : [data];

  return arr.map((i: GroupInfo) => {
    const sanitized = sanitizeParseObject(i);

    sanitized.UpdateID = config.randomUUID();

    if (!sanitized.wallpaperID) {
      sanitized.wallpaperID = {
        __op: 'Delete',
      };
    }

    return {
      id: 'updateGroup',
      path: '/parse/classes/GroupInfo/' + i.objectId,
      method: 'PUT',
      body: sanitized,
    } as const;
  });
}
