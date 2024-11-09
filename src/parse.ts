export interface ParseObject {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  className: string;
  __type: string;
}

export const sanitizeParseObject = <T extends ParseObject>(obj: T) => {
  const { objectId, createdAt, updatedAt, __type, className, ...rest } = obj;

  return rest;
};
