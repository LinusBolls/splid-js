import { CurrencyCode, GroupId, IsoTime, Uuid } from './primitives';

export interface GroupInfo {
  UpdateInstallationID: Uuid;
  name: string;
  defaultCurrencyCode: CurrencyCode;
  creatorInstallationID: Uuid;
  UpdateID: Uuid;
  createdGlobally: {
    __type: 'Date';
    iso: IsoTime;
  };
  /**
   * maps a currency code to its value in dollars
   */
  currencyRates: Record<CurrencyCode, number>;
  GlobalId: GroupId;
  group: {
    __type: 'Pointer';
    className: '_User';
    objectId: string;
  };
  createdAt: IsoTime;
  updatedAt: IsoTime;
  /**
   * e.g. [ "Food" ]
   */
  customCategories: string[];
  isDeleted: boolean;
  objectId: string;
  __type: 'Object';
  className: 'GroupInfo';

  wallpaperID?:
    | string
    | {
        __op: 'Delete';
      };
}
