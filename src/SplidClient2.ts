import Parse from 'parse/node';
import { CurrencyCode, DeviceType } from './types/primitives';

// Sadly, the parse JS SDK is a singleton, so this config is global
Parse.initialize(
  'AKCaB0FCF0NIigWjxcDBpDYh7q6eN7gYfKxk5QBN',
  '4Z29DJvRGdVnB5dcTvDTTG01fbkITxvcPCPOt21M'
);
Parse.serverURL = 'https://splid.herokuapp.com/parse';

export interface GroupInfo {
  shortCode: string;
  longCode: string;
  extendedShortCode: string;
  objectId: string;
}

export type GroupCodes = Omit<GroupInfo, 'objectId'>;

export interface SplidClient {
  createGroup(): Promise<GroupInfo>;
  fetchGroupCodes(groupObjectId: string): Promise<GroupCodes>;
  joinGroupWithAnyCode(code: string): Promise<GroupInfo>;
  getCurrencyRates(): Promise<Record<CurrencyCode, number>>;
  getCodeConfig(deviceType: DeviceType): Promise<string>;
}

export class ParseSplidClient implements SplidClient {
  createGroup(): Promise<GroupInfo> {
    return Parse.Cloud.run('createGroup');
  }

  fetchGroupCodes(groupObjectId: string): Promise<GroupCodes> {
    return Parse.Cloud.run('fetchCodes', {
      group: groupObjectId,
    });
  }

  joinGroupWithAnyCode(code: string): Promise<GroupInfo> {
    return Parse.Cloud.run('joinGroupWithAnyCode', { code });
  }

  getCurrencyRates(): Promise<Record<CurrencyCode, number>> {
    return Parse.Cloud.run('getCurrencyRates');
  }

  getCodeConfig(deviceType: DeviceType): Promise<string> {
    return Parse.Cloud.run('getCodeConfig', { deviceType });
  }
}

// export class SplidBatchClient implements SplidClient {
//   createGroup(): Promise<GroupInfo> {
//     throw new Error('Method not implemented.');
//   }
// }
