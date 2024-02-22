import { StorageTypes } from '../models/enums';
import {
  AllAddresses,
  MainWorkplaces,
  ResAddresses,
  StoredFile,
  Workdays,
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
      console.log(error);
    }
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
      console.log(error);
    }
  };

  return { setItem, getItem };
};

export default useLocalStorage;
