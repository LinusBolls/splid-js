/**
 * Can be created using `crypto.randomUUID()`
 *
 * @example "9c261483-2c88-4685-aae2-34531aedaf2a"
 */
export type Uuid = string;

/**
 * Date time in ISO 8601 format.
 *
 * @example "2023-08-22T15:27:23.403Z"
 */
export type IsoTime = string;

/**
 * ISO 4217 currency code.
 *
 * @example "EUR"
 */
export type CurrencyCode = string;

/**
 * @example "0.0.1", "1.2.1"
 */
export type Version = `${number}.${number}.${number}`;

export type UserId = string & { readonly brand?: unique symbol };
export type GroupId = string & { readonly brand?: unique symbol };
export type EntryId = string & { readonly brand?: unique symbol };
export type InstallationId = string & { readonly brand?: unique symbol };

export type DeviceType = 'ios' | 'android';
