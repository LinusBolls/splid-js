import { RequestConfig } from '../requestConfig';
import { Entry } from '../types/entry';

export function createEntry(
  config: RequestConfig,
  entry: Omit<
    Entry,
    | 'GlobalId'
    | 'UpdateInstallationID'
    | 'createdGlobally'
    | 'created'
    | 'UpdateID'
  >
) {
  const requestObj = {
    id: 'createExpense',
    path: '/parse/classes/Entry',
    method: 'POST',
    body: {
      ...entry,
      UpdateInstallationID: config.installationId,
      GlobalId: config.randomUUID(),
      notes: {
        __op: 'Delete',
      },
      createdGlobally: {
        __type: 'Date',
        iso: new Date().toISOString(),
      },
      UpdateID: config.randomUUID(),
    },
  } as const;
  return requestObj;
}
