import { StorageTypes } from '../models/enums';
import {
  AllAddresses,
  MainWorkplaces,
  ResAddresses,
  StoredFile,
  Workdays,
  MonthAddresses,
  ResAddress,
} from '../models/types';

const useLocalStorage = () => {
  const setItem = (
    key: string,
    value:
      | string // User name
      | ResAddresses
      | AllAddresses
      | StoredFile[]
      | Workdays
      | MainWorkplaces
      | null
  ) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getFiles = (item: string) => {
    const array: StoredFile[] = JSON.parse(item);
    if (array?.length > 0) {
      const fileList = new DataTransfer();
      array.forEach((f: StoredFile) => {
        const file = dataURLtoFile(f.base64, f.name);
        fileList.items.add(file);
      });
      return fileList.files;
    }
    return null;
  };

  const getItem = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (key === StorageTypes.FILES) {
        return getFiles(item);
      }
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      return false;
    }
  };

  const clearWorkdaysAndAddresses = (month: number, year: number) => {
    const lastResAddress: ResAddress = getItem(
      StorageTypes.RES_ADDRESSES
    )?.pop();
    const lastAddresses: MonthAddresses = getItem(
      StorageTypes.ADDRESSES
    )?.pop();
    if (lastResAddress) {
      if (
        setItem(StorageTypes.RES_ADDRESSES, [
          { ...lastResAddress, month: month, year: year },
        ]) === false
      ) {
        return false;
      }
    }
    if (lastAddresses) {
      if (
        setItem(StorageTypes.ADDRESSES, [
          { ...lastAddresses, month: month, year: year },
        ]) === false
      ) {
        return false;
      }
    }
    localStorage.removeItem(StorageTypes.MAINWORKPLACES);
    localStorage.removeItem(StorageTypes.WORKDAYS);
  };

  return { setItem, getItem, clearWorkdaysAndAddresses };
};

export default useLocalStorage;
