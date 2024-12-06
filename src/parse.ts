export interface ParseObject {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  className: string;
  __type: string;
}

export type WithoutParseKeys<T> = Omit<T, keyof ParseObject>;

export const sanitizeParseObject = <T extends ParseObject>(
  obj: T
): WithoutParseKeys<T> => {
  const { objectId, createdAt, updatedAt, __type, className, ...rest } = obj;

  return rest;
};
