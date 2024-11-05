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
     * when assigning the people who profit from an expense, if you scroll all the way to the right, there is the option to toggle between "Percent" and "Share" ("Percent" being the default).
     *
     * this field acts as a boolean that indicates whether the expense is in "Share" mode.
     * when this field is set to `0`, the `SS` field be defined.
     */
    PT: 0 | 1;
    /**
     * when assigning the people who profit from an expense, if you scroll all the way to the right, there is the option to toggle between "Percent" and "Share" ("Percent" being the default).
     *
     * this field indicates the total amount of shares the expense is split by.
     * this field is defined if the `PT` field is set to `1`.
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
