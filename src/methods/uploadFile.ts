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
  const uploadResponse = await config.fetch(
    config.baseUrl + '/parse/files/file',
    {
      method: 'POST',
      body: buffer.buffer as ArrayBuffer,
      headers: {
        ...config.getHeaders(),
        'Content-Type': 'application/octet-stream',
      },
    }
  );

  const dataID = config.randomUUID();

  const uploadData: UploadRawFileResponse = await uploadResponse.json();

  const createResponse = await config.fetch(
    config.baseUrl + '/parse/classes/FileWrapper',
    {
      method: 'POST',
      body: JSON.stringify({
        dataID,
        file: {
          __type: 'File',
          url: uploadData.url,
          name: uploadData.name,
        },
      }),
      headers: config.getHeaders(),
    }
  );
  const createData: CreateFileWrapperResponse = await createResponse.json();

  return {
    dataID,
    file: uploadData,
    fileWrapper: createData,
  };
}
