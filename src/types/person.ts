import { IsoTime, UserId, Uuid } from './primitives';

export interface Person {
  GlobalId: UserId;
  UpdateID: Uuid;
  isDeleted: boolean;
  createdGlobally: {
    __type: 'Date';
    iso: IsoTime;
  };
  UpdateInstallationID: Uuid;
  group: {
    __type: 'Pointer';
    className: '_User';
    objectId: 'QfQhx0XSSc';
  };
  name: string; // e.g. "Daniel" (yes, even when `isDeleted: true`)
  initials: string; // e.g. "D"
  createdAt: IsoTime;
  updatedAt: IsoTime;
  objectId: 'Pv2p7KumiG';
  __type: 'Object';
  className: 'Person';
}
