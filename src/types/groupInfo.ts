import { CurrencyCode, GroupId, IsoTime, Uuid } from './primitives';

export interface GroupInfo {
  UpdateInstallationID: Uuid;
  name: string; // e.g. "La Famiglia"
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
    objectId: 'QfQhx0XSSc';
  };
  createdAt: IsoTime;
  updatedAt: IsoTime;
  customCategories: string[]; // e.g. [ "Food" ]
  isDeleted: boolean;
  objectId: 'AL5VHgcVHE';
  __type: 'Object';
  className: 'GroupInfo';
}
