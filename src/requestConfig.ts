import type { AxiosInstance } from 'axios';
import { Logger } from './logging';

export interface RequestConfig {
  httpClient: AxiosInstance;
  baseUrl: string;
  logger: Logger;
  installationId: string;
  getHeaders: () => Record<string, string>;
}
