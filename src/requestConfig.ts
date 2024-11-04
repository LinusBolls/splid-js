import type { AxiosInstance } from 'axios';
import { Logger } from './logging';

export interface RequestConfig {
  httpClient: AxiosInstance;
  baseUrl: string;
  logger: Logger;
  getHeaders: () => Record<string, string>;
  installationId: string;
  randomUUID: () => string;
}
