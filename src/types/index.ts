import {
  Entry as SplidJsEntry,
  EntryItem as SplidJsEntryItem,
  UseridToShareMap as SplidJsUseridToShareMap,
} from './entry';
import { GroupInfo as SplidJsGroupInfo } from './groupInfo';
import { Person as SplidJsPerson } from './person';

export namespace SplidJs {
  /**
   * represents either an expense or a payment.
   */
  export type Entry = SplidJsEntry;
  /**
   * represents an item of an expense or a payment.
   */
  export type EntryItem = SplidJsEntryItem;
  export type Person = SplidJsPerson;
  export type GroupInfo = SplidJsGroupInfo;
  /**
   * a map of a userId to their share. the shares are floats between 0 and 1 and their sum is exactly 1.
   */
  export type UseridToShareMap = SplidJsUseridToShareMap;
}
