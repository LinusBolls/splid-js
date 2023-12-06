export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestDetails<Response> {
  method: HttpMethod;
  path: string;
  body: any;
}

export function defineRequest<ResponseType, Args extends any[]>(
  getRequestDetails: (...args: Args) => RequestDetails<ResponseType>
): (...args: Args) => RequestDetails<ResponseType> {
  return getRequestDetails;
}
