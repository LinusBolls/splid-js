import { RequestConfig } from '../requestConfig';
import { Entry, EntryCategories } from '../types/entry';

const assertUuid = (uuid: unknown, propertyName: string) => {
  if (typeof uuid !== 'string')
    throw new Error(`Invalid UUID: must be string, but received "${uuid}".`);
  if (!/^[a-zA-Z0-9-]+$/.test(uuid) || !uuid.includes('-'))
    throw new Error(
      `SplidJs.entry.create: Invalid UUID for ${propertyName}: "${uuid}". Did you accidentally pass user.objectId instead of user.GlobalId?`
    );
};

const assertObjectId = (objectId: unknown, propertyName: string) => {
  if (typeof objectId !== 'string')
    throw new Error(
      `Invalid objectId: must be string, but received "${objectId}".`
    );
  if (!/^[a-zA-Z0-9]+$/.test(objectId))
    throw new Error(
      `SplidJs.entry.create: Invalid objectId for ${propertyName}: must be alphanumeric, but received "${objectId}". Did you accidentally pass group.GlobalId instead of group.objectId?`
    );
};

const assertEntryCategory = (category: unknown) => {
  // category can be null or undefined
  if (typeof category == null) return;

  const allowedCategoryTypes = Object.values(EntryCategories).map(
    (i) => `"${i}"`
  );

  if (
    typeof category !== 'object' ||
    !('type' in category) ||
    typeof category.type !== 'string' ||
    !('originalName' in category) ||
    typeof category.originalName !== 'string' ||
    !(Object.values(EntryCategories) as string[]).includes(category.type)
  ) {
    throw new Error(
      `SplidJs.entry.create: Invalid entry category: must be { type: ${allowedCategoryTypes.join(' | ')}; originalName: string }, but received "${JSON.stringify(category)}".`
    );
  }
};

export function createEntry(
  config: RequestConfig,
  entry: Omit<
    Entry,
    | 'GlobalId'
    | 'UpdateInstallationID'
    | 'createdGlobally'
    | 'createdAt'
    | 'updatedAt'
    | 'UpdateID'
    | 'className'
    | '__type'
    | 'objectId'
    | 'isDeleted'
    | 'isPayment'
    | 'group'
  > & {
    isDeleted?: boolean;
    isPayment?: boolean;
  } & (
      | {
          group: {
            __type: 'Pointer';
            className: '_User';
            objectId: string;
          };
        }
      | { groupObjectId: string }
    )
) {
  if ('group' in entry)
    assertObjectId(entry.group.objectId, 'entry.group.objectId');
  else {
    assertObjectId(entry.groupObjectId, 'entry.groupObjectId');
  }

  assertEntryCategory(entry.category);

  assertUuid(entry.primaryPayer, 'entry.primaryPayer');

  for (const userId of Object.keys(entry.secondaryPayers ?? {})) {
    assertUuid(userId, 'entry.secondaryPayers');
  }

  for (const item of entry.items) {
    for (const profiteerId of Object.keys(item.P.P)) {
      assertUuid(profiteerId, 'entry.items.P.P');
    }
  }

  if (entry.items.length < 1) {
    throw new Error(`SplidJs.entry.create: entry must have at least one item.`);
  }
  if (entry.items.length < 2 && !entry.title) {
    throw new Error(
      `SplidJs.entry.create: entry must have a title if it only has one item.`
    );
  }
  for (const item of entry.items) {
    if (Object.keys(item.P.P).length < 1) {
      throw new Error(
        `SplidJs.entry.create: item must have at least one profiteer, but received "${JSON.stringify(item.P)}".`
      );
    }
  }

  const requestObj = {
    id: 'createExpense',
    path: '/parse/classes/Entry',
    method: 'POST',
    body: {
      isDeleted: false,
      isPayment: false,
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
      secondaryPayers: {},
      group:
        'group' in entry
          ? entry.group
          : {
              __type: 'Pointer',
              className: '_User',
              objectId: entry.groupObjectId,
            },
      ...entry,
    },
  } as const;

  // @ts-expect-error this needs to get stripped, otherwise the splid api won't accept the request
  delete requestObj.body.groupObjectId;

  return requestObj;
}
