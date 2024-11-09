import { CurrencyCode, EntryId, IsoTime, UserId, Uuid } from './primitives';

export type UseridToShareMap = Record<UserId, number>;

export type EntryItem = {
  /**
   * the total amount of the payment (e.g. 69).
   */
  AM: number;
  P: {
    /**
     * a map of a userId to their share (how much they profit from the expense). the shares are floats between 0 and 1 and their sum is exactly 1.
     */
    P: UseridToShareMap;
    /**
     * **this field is not relevant for calculating the balance**
     *
     * when assigning the people who profit from an expense, if you scroll all the way to the right, there is the option to toggle between "Percent" and "Share" ("Percent" being the default).
     *
     * this field acts as a boolean that indicates whether the expense is in "Share" mode.
     *
     * when this field is set to `1`, the `SS` field is defined.
     */
    PT: 0 | 1;
    /**
     * **this field is not relevant for calculating the balance**
     *
     * when assigning the people who profit from an expense, if you scroll all the way to the right, there is the option to toggle between "Percent" and "Share" ("Percent" being the default).
     *
     * this field indicates the total amount of shares the expense is split by. it's only used for visually displaying the amounts of shares to the user.
     *
     * this field is defined when the `PT` field is set to `1`.
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
  /** there are edge cases in the Splid API where it will return multiple copies of the same entry, which is not desired. you should de-duplicate these by their `GlobalId` when you're e.g. calculating the balance. */
  GlobalId: EntryId;
  /**
   * freetext, e.g. "Train tickets".
   * doesn't exist if `isPayment: true`
   */
  title?: string;
  secondaryPayers?: Record<string, number>;
  primaryPayer: UserId;
  createdGlobally: {
    __type: 'Date';
    iso: IsoTime;
  };
  isDeleted: boolean;
  group: {
    __type: 'Pointer';
    className: '_User';
    objectId: string;
  };
  items: EntryItem[];
  isPayment: boolean;
  UpdateID: Uuid;
  currencyCode: CurrencyCode;
  createdAt: IsoTime;
  updatedAt: IsoTime;
  objectId: string;
  __type: 'Object';
  className: 'Entry';

  /**
   * you will never get an entry with `{ __op: 'Delete' }` from the api, but you have to send it to the api like this to clear the field.
   * setting `{ category: undefined }` will not work.
   */
  category?:
    | {
        /**
         * e.g. "Food"
         */
        originalName: string;
        type: EntryCategory;
      }
    | {
        __op: 'Delete';
      };
  /**
   * the "Purchased On" date. this is the only date you should manually modify.
   *
   * you will never get an entry with `{ __op: 'Delete' }` from the api, but you have to send it to the api like this to clear the field.
   * setting `{ date: undefined }` will not work.
   */
  date?:
    | {
        __type: 'Date';
        iso: IsoTime;
      }
    | {
        __op: 'Delete';
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
