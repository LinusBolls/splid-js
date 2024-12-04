import { RequestConfig } from '../requestConfig';
import { IsoTime } from '../types/primitives';

export interface GetFileWrapperResponse {
  success: {
    result: {
      dataID: string;
      file: {
        __type: 'File';
        /** e.g. 'b03cbab8414d498e3fb9aa962ebbd2d5_file.bin' */
        name: string;
        /** e.g. 'https://splidfiles.s3.amazonaws.com/b03cbab8414d498e3fb9aa962ebbd2d5_file.bin' */
        url: string;
      };
      createdAt: IsoTime;
      updatedAt: IsoTime;
      objectId: string;
      __type: 'Object';
      className: 'FileWrapper';
    };
  };
}

export function getFileWrapper(_: RequestConfig, dataID: string) {
  return {
    id: 'getFileWrapper',
    path: '/parse/functions/getFileWrapper',
    method: 'POST',
    body: { dataID },
  } as const;
}
