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
    objectId: string;
  };
  name: string;
  initials: string;
  createdAt: IsoTime;
  updatedAt: IsoTime;
  objectId: string;
  __type: 'Object';
  className: 'Person';
}
