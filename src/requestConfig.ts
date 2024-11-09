import { Logger } from './logging';

export interface RequestConfig {
  fetch: typeof fetch;
  baseUrl: string;
  logger: Logger;
  getHeaders: () => Record<string, string>;
  installationId: string;
  randomUUID: () => string;
  assertResponseBody: <T>(body: T) => T;
}
