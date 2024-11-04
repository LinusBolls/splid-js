import { RequestConfig } from '../requestConfig';
import { IsoTime } from '../types/primitives';

interface UploadRawFileResponse {
  url: string;
  name: string;
}

interface CreateFileWrapperResponse {
  objectId: string;
  createdAt: IsoTime;
}

export interface UploadFileResponse {
  dataID: string;
  file: UploadRawFileResponse;
  fileWrapper: CreateFileWrapperResponse;
}

export async function uploadFile(
  config: RequestConfig,
  buffer: Buffer
): Promise<UploadFileResponse> {
  const uploadResponse = await config.httpClient.post<UploadRawFileResponse>(
    config.baseUrl + '/parse/files/file',
    buffer,
    {
      headers: {
        ...config.getHeaders(),
        'Content-Type': 'application/octet-stream',
      },
    }
  );

  const dataID = config.randomUUID();

  const createResponse =
    await config.httpClient.post<CreateFileWrapperResponse>(
      config.baseUrl + '/parse/classes/FileWrapper',
      {
        dataID,
        file: {
          __type: 'File',
          url: uploadResponse.data.url,
          name: uploadResponse.data.name,
        },
      },
      { headers: config.getHeaders() }
    );

  return {
    dataID,
    file: uploadResponse.data,
    fileWrapper: createResponse.data,
  };
}
