import { CurrencyCode, EntryId, IsoTime, UserId, Uuid } from './primitives';

export type UseridToShareMap = Record<UserId, number>;

export type EntryItem = {
  /**
   * the total amount of the payment (e.g. 69).
   */
  AM: number;
  P: {
    /**
     * a map of a userId to their share. the shares are floats between 0 and 1 and their sum is exactly 1.
     */
    P: UseridToShareMap;
    /**
     * observed to be always 0 except for when `SS` is defined, in which case it is 1
     */
    PT: number;
    /**
     * TODO: research this
     * extremely rare, observed as 1, 8, 15
     */
    SS?: number;
  };
  /**
   * if the expense consists of multiple item, this is the title of the sub-item
   */
  T?: string;
};

/**
 * dongs
 */
export interface Entry {
  UpdateInstallationID: Uuid;
  GlobalId: EntryId;
  /**
   * freetext, e.g. "Train tickets".
   * doesn't exist if `isPayment: true`
   */
  title?: string;
  /**
   * TODO: research this
   */
  secondaryPayers?: {};
  primaryPayer: UserId;
  createdGlobally: {
    __type: 'Date';
    iso: IsoTime;
  };
  isDeleted: boolean;
  group: {
    __type: 'Pointer';
    className: '_User';
    objectId: 'QfQhx0XSSc';
  };
  items: EntryItem[];
  isPayment: boolean;
  UpdateID: Uuid;
  currencyCode: CurrencyCode;
  createdAt: IsoTime;
  updatedAt: IsoTime;
  objectId: 'KITH5S6HmD';
  __type: 'Object';
  className: 'Entry';

  category?: {
    /**
     * e.g. "Food"
     */
    originalName: string;
    type: EntryCategory;
  };
}

export const EntryCategories = {
  ACCOMMODATION: 'accommodation',
  ENTERTAINMENT: 'entertainment',
  GROCERIES: 'groceries',
  RESTAURANTS: 'restaurants',
  TRANSPORT: 'transport',
  CUSTOM: 'custom',
} as const;

export type EntryCategory =
  (typeof EntryCategories)[keyof typeof EntryCategories];
