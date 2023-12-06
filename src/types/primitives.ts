import currencyExchangeRates from '../data/currencyExchangeRates.data';

/**
 * e.g. "9c261483-2c88-4685-aae2-34531aedaf2a"
 */
export type Uuid = string;

/**
 * e.g. "2023-08-22T15:27:23.403Z"
 */
export type IsoTime = string;

/**
 * e.g. "EUR"
 */
export type CurrencyCode = keyof typeof currencyExchangeRates;

/**
 * e.g. 0.0.1, 1.2.1
 */
export type Version = `${number}.${number}.${number}`;

export type UserId = string & { readonly brand?: unique symbol };
export type GroupId = string & { readonly brand?: unique symbol };
export type EntryId = string & { readonly brand?: unique symbol };
export type InstallationId = string & { readonly brand?: unique symbol };

/**
 * TODO: research this: does `ios` work / do something different?
 */
export type DeviceType = 'ios' | 'android';
