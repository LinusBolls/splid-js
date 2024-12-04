import { RequestConfig } from '../requestConfig';
import { wrapRequestObject } from '../requestObject';
import { getFileWrapper } from './getFileWrapper';

export type GetFileBlobResponse = Blob;

export async function getFileBlob(
  config: RequestConfig,
  dataID: string
): Promise<GetFileBlobResponse> {
  const query = wrapRequestObject(getFileWrapper);

  const data = await query(config, dataID);

  const url = data?.[0]?.success?.result?.file?.url;

  if (!url) {
    throw new Error(
      'SplidClient.file.getBlob: failed to get url from invalid response'
    );
  }
  const res = await config.fetch(url);

  if (!res.ok) {
    throw new Error(
      `SplidClient.file.getBlob: GET ${url} failed with status ${res.status}`
    );
  }
  const blob = await res.blob();

  return blob;
}
