export interface RequestDetails<Response> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body: any;
}

export function defineRequest<ResponseType, Args extends any[]>(
  getRequestDetails: (...args: Args) => RequestDetails<ResponseType>
): (...args: Args) => RequestDetails<ResponseType> {
  return getRequestDetails;
}
