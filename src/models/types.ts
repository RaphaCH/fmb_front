import { ModalTypes } from './enums';

export type Address = {
  addressName: string;
  address: string;
  addressCoordinates: AddressCoordinates;
  distanceFromResAdd: number;
};

export type ResAddress = {
  month: number;
  year: number;
  address: Address;
};

export type ResAddresses = ResAddress[];

export type APIAddress = {
  formatted_address: string;
  geometry: APIAddressGeometry;
  inputValueAddress?: string;
};

type APIAddressGeometry = {
  location: AddressCoordinates;
};

export type AddressCoordinates = {
  lat: number;
  lng: number;
};

export type MonthAddresses = {
  month: number;
  year: number;
  addresses: Address[];
};

export type AllAddresses = MonthAddresses[];

export type WDay = {
  workDate: string;
  workPlaceAddressAm: Address | null;
  workPlaceAddressPm: Address | null;
  isWorkdayAm: boolean;
  isWorkdayPm: boolean;
  isHolidayAm: boolean;
  isHolidayPm: boolean;
  isWeekend: boolean;
};

export type WMonth = {
  month: number;
  year: number;
  workdays: WDay[];
};

export type Workdays = WMonth[];

export type ModalDetails = {
  message: string;
  type: ModalTypes;
  addressInfos?: undefined | APIAddress;
  url?: string;
};

export type MonthMainWorkplace = {
  month: number;
  year: number;
  address: Address;
};

export type MainWorkplaces = MonthMainWorkplace[];

export type MonthYear = {
  month: number;
  year: number;
};

export type StoredFile = {
  name: string;
  base64: string;
};
