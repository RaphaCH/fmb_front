import React, { useState, useEffect } from 'react';
import useLocalStorage from './utils/useLocalStorage';
import PersonalData from './components/PersonalData';
import Save from './components/Save';
import Attachments from './components/Attachments';
import WorkplaceAddress from './components/WorkplaceAddress';
import {
  Address,
  ModalDetails,
  StoredFile,
  WDay,
  WMonth,
  Workdays,
} from './models/types';
import { ModalTypes, StorageTypes } from './models/enums';
import AlertModal from './components/AlertModal';
import Calendar from './components/Calendar';
import ResidentialAddress from './components/ResidentialAddress';
import Header from './components/Header';
import EligibilityMessage from './components/EligibilityMessage';
import getDistance from './utils/getDistance';
import toBase64 from './utils/toBase64';

function App() {
  const currentDate: Date = new Date();
  const { getItem, setItem } = useLocalStorage();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [displayedDate, setDisplayedDate] = useState<Date>(currentDate);
  const [hasUpdatedDate, setHasUpdatedDate] = useState<boolean>(true);
  const [addressToDelete, setAddressToDelete] = useState<Address>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    message: 'Unknown alert',
    type: ModalTypes.ERROR,
  });
  const [userName, setUserName] = useState<string>(
    getItem(StorageTypes.USER_NAME) ?? ''
  );
  const [files, setFiles] = useState<FileList | null>(
    getItem(StorageTypes.FILES) ?? []
  );
  const [resAddress, setResAddress] = useState<Address | undefined>(
    getItem(StorageTypes.RES_ADDRESS) ?? undefined
  );
  const [addresses, setAddresses] = useState<Address[]>(
    getItem(StorageTypes.ADDRESSES) ?? []
  );
  const [workdayData, setWorkdayData] = useState<Workdays | undefined>(
    getItem(StorageTypes.WORKDAYS) ?? []
  );
  const [monthData, setMonthData] = useState<WMonth | undefined>(undefined);
  const [mainWorkplace, setMainWorkplace] = useState<Address | null>(
    getItem(StorageTypes.MAINWORKPLACE)?.address ?? null
  );
  const [distance, setDistance] = useState<number | null>(
    getItem(StorageTypes.MAINWORKPLACE)?.distance ?? null
  );

  useEffect(() => {
    if (hasUpdatedDate) {
      handleWorkdayData();
      setHasUpdatedDate(false);
      setDisplayedDate(selectedDate);
    }
  }, [hasUpdatedDate]);

  const handleSaveData = () => {
    setItem(StorageTypes.USER_NAME, userName);
    const updatedWorkdays = updateMonthInWorkdays(monthData);
    saveWorkdays(updatedWorkdays);
    openModal({
      message: 'Saved',
      type: ModalTypes.SUCCESS,
    });
  };

  const saveWorkdays = (updatedWorkdays: Workdays) => {
    setItem(StorageTypes.WORKDAYS, updatedWorkdays);
    setItem(StorageTypes.MAINWORKPLACE, {
      address: mainWorkplace,
      distance: distance,
    });
    setWorkdayData(updatedWorkdays);
  };

  const addResToWorkdays = (address: Address) => {
    const updatedWorkdays = monthData.workdays.map((d) => {
      if (
        d.isWorkdayAm &&
        d.isWorkdayPm &&
        !d.workPlaceAddressAm &&
        !d.workPlaceAddressPm
      ) {
        return {
          ...d,
          workPlaceAddressAm: address,
          workPlaceAddressPm: address,
        };
      } else if (d.isWorkdayAm && !d.workPlaceAddressAm) {
        return {
          ...d,
          workPlaceAddressAm: address,
        };
      } else if (d.isWorkdayPm && !d.workPlaceAddressPm) {
        return {
          ...d,
          workPlaceAddressPm: address,
        };
      }
      return d;
    });
    updateWorkdaysByMonth({
      month: monthData.month,
      year: monthData.year,
      workdays: updatedWorkdays,
    });
  };

  const deleteWorkplaceFromWorkdays = (workplace: Address) => {
    const updatedWorkdays = monthData.workdays.map((d) => {
      if (
        d.workPlaceAddressAm?.addressName === workplace.addressName &&
        d.workPlaceAddressPm?.addressName === workplace.addressName
      ) {
        return {
          ...d,
          workPlaceAddressAm: resAddress,
          workPlaceAddressPm: resAddress,
        };
      } else if (d.workPlaceAddressAm?.addressName === workplace.addressName) {
        return {
          ...d,
          workPlaceAddressAm: resAddress,
        };
      } else if (d.workPlaceAddressPm?.addressName === workplace.addressName) {
        return {
          ...d,
          workPlaceAddressPm: resAddress,
        };
      }
      return d;
    });
    updateWorkdaysByMonth({
      month: monthData.month,
      year: monthData.year,
      workdays: updatedWorkdays,
    });
  };

  const updateWorkdaysByMonth = (updatedMonth: WMonth) => {
    setMonthData(updatedMonth);
    const updatedWorkdays = updateMonthInWorkdays(updatedMonth);
    setWorkdayData(updatedWorkdays);
    updateMainWorkplace(updatedMonth);
  };

  const updateMonthInWorkdays = (updatedMonth: WMonth) => {
    return workdayData.map((o) =>
      o.month === updatedMonth.month && o.year === updatedMonth.year
        ? monthData
        : o
    );
  };

  const addWorkPlaceAddress = (
    group: {},
    product: WDay,
    workPlaceAddress: Address | null
  ) => {
    if (workPlaceAddress) {
      group[workPlaceAddress.addressName] =
        group[workPlaceAddress.addressName] ?? [];
      group[workPlaceAddress.addressName].push(product);
    }
    return group;
  };

  const updateMainWorkplace = (updatedMonthData: WMonth) => {
    const groupByLocation = updatedMonthData.workdays.reduce(
      (group: {}, product: WDay) => {
        const { workPlaceAddressAm, workPlaceAddressPm } = product;
        group = addWorkPlaceAddress(group, product, workPlaceAddressAm);
        group = addWorkPlaceAddress(group, product, workPlaceAddressPm);
        return group;
      },
      {}
    );
    let newDistance = null;
    if (Object.values(groupByLocation).length > 0) {
      const mainWorkplaceName: string = Object.keys(groupByLocation).reduce(
        (a: string, b: string) =>
          groupByLocation[a] > groupByLocation[b] ? a : b
      );
      const newMainWorkplace =
        addresses.find(
          (add: Address) => add.addressName === mainWorkplaceName
        ) ?? null;
      setMainWorkplace(newMainWorkplace);
      if (newMainWorkplace) {
        newDistance = Number(
          getDistance(
            newMainWorkplace.addressCoordinates,
            resAddress.addressCoordinates
          )
        );
      }
    } else {
      setMainWorkplace(null);
    }
    setDistance(newDistance);
  };

  const handleSaveResAddress = (address: Address) => {
    setResAddress(address);
    let addressList = [address];
    if (addresses.length > 0) {
      let modifiedAddressList = addresses;
      modifiedAddressList[0] = address;
      modifiedAddressList = modifiedAddressList.map((add) => {
        return {
          ...add,
          distanceFromResAdd: Number(
            getDistance(address.addressCoordinates, add.addressCoordinates)
          ),
        };
      });
      addressList = modifiedAddressList;
    }
    setAddresses(addressList);
    setItem(StorageTypes.RES_ADDRESS, address);
    setItem(StorageTypes.ADDRESSES, addressList);
    addResToWorkdays(address);
    if (!mainWorkplace) {
      setItem('mainWorkplace', { address: address, distance: 0 });
      setMainWorkplace(address);
      setDistance(0);
    } else if (mainWorkplace.addressName === 'Res Address') {
      setMainWorkplace(address);
    } else {
      const updatedMainWorkplace = addressList.find(
        (a: Address) => a.addressName === mainWorkplace.addressName
      );
      setMainWorkplace(updatedMainWorkplace);
      setDistance(updatedMainWorkplace.distanceFromResAdd);
    }
  };

  const handleSaveNewAddress = (address: Address) => {
    const updatedAddressList: Address[] = [...addresses, address];
    setAddresses(updatedAddressList);
    setItem(StorageTypes.ADDRESSES, updatedAddressList);
  };

  const handleSaveFiles = (files: StoredFile[]) => {
    setItem(StorageTypes.FILES, files);
  };

  const handleDeleteFile = async (indexToDelete: number) => {
    const uploadedFiles: FileList = files;
    if (uploadedFiles) {
      const updatedFileList = new DataTransfer();
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (indexToDelete !== i) {
          updatedFileList.items.add(uploadedFiles[i]);
        }
      }
      const toStore = [];
      for (const file of updatedFileList.files) {
        const storageCompatibleFile = {
          name: file.name,
          base64: await toBase64(file),
        };
        toStore.push(storageCompatibleFile as StoredFile);
      }
      setFiles(updatedFileList.files);
      setItem(StorageTypes.FILES, toStore);
    }
  };

  const handleWorkdayData = () => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    let month = workdayData?.find(
      (m: WMonth) => m.month === selectedMonth && m.year === selectedYear
    );
    if (!month) {
      month = getNewMonth();
      workdayData.push(month);
      saveWorkdays(workdayData);
    }
    setMonthData(month);
  };

  const handleDeleteAddress = (address: Address) => {
    setModalDetails({
      message: `Are you sure you want to delete "${address.addressName}"?`,
      type: ModalTypes.CONFIRMATION,
    });
    setAddressToDelete(address);
    setIsModalOpen(true);
  };

  const openModal = (modalDetails: ModalDetails) => {
    setModalDetails(modalDetails);
    setIsModalOpen(true);
    if (modalDetails.type === ModalTypes.SUCCESS) {
      setTimeout(() => closeModal(), 1000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDeleteAction = () => {
    const addressesWithDeleted: Address[] = addresses.filter(
      (add) => add.addressName !== addressToDelete.addressName
    );
    setAddresses(addressesWithDeleted);
    setItem(StorageTypes.ADDRESSES, addressesWithDeleted);
    deleteWorkplaceFromWorkdays(addressToDelete);
    // if (mainWorkplace.addressName === addressToDelete.addressName) {
    //   updateMainWorkplace();
    // }
    // setMonthData(updatedMonth);
    // const updatedWorkdays = updateMonthInWorkdays(updatedMonth);
    // setWorkdayData(updatedWorkdays);
    // updateMainWorkplace();
    cancelAction();
  };

  const cancelAction = () => {
    setAddressToDelete(null);
    closeModal();
  };

  const getNewMonth = () => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const date = new Date(year, month, 1);
    const days: WDay[] = [];

    while (date.getMonth() === month) {
      date.setDate(date.getDate() + 1);
      const formattedDate = date.toISOString().substring(0, 10);
      const isWeekend: boolean =
        // publicHolidays.includes(formattedDate) ||
        [0, 6].indexOf(new Date(formattedDate).getDay()) !== -1;
      days.push({
        workDate: formattedDate,
        workPlaceAddressAm: isWeekend ? null : resAddress,
        isWorkdayAm: !isWeekend,
        isHolidayAm: false,
        workPlaceAddressPm: isWeekend ? null : resAddress,
        isWorkdayPm: !isWeekend,
        isHolidayPm: false,
        isWeekend: isWeekend,
      });
    }
    return { month: month, year: year, workdays: days };
  };

  const handleUpdatedDate = (date: Date) => {
    setSelectedDate(date);
    setHasUpdatedDate(true);
  };

  return (
    <div className='App'>
      <div>
        <Header />
        <PersonalData userName={userName} setUserName={setUserName} />
        <Attachments
          files={files}
          setFiles={setFiles}
          saveFiles={(files) => handleSaveFiles(files)}
          deleteFile={(indexToDelete) => handleDeleteFile(indexToDelete)}
          openModal={openModal}
        />
        <ResidentialAddress
          resAddress={resAddress}
          saveResAddress={(address) => handleSaveResAddress(address)}
          openModal={openModal}
        />
        <WorkplaceAddress
          addresses={addresses}
          saveAddress={(address) => handleSaveNewAddress(address)}
          openModal={openModal}
          deleteAddress={(address) => handleDeleteAddress(address)}
        />
        {monthData && (
          <Calendar
            data={monthData}
            resAddress={resAddress}
            addresses={addresses}
            displayedDate={displayedDate}
            updateDate={(date: Date) => handleUpdatedDate(date)}
            updateWorkdaysByMonth={(updatedMonth: WMonth) =>
              updateWorkdaysByMonth(updatedMonth)
            }
          />
        )}
        <EligibilityMessage mainWorkplace={mainWorkplace} distance={distance} />
        <Save
          saveData={handleSaveData}
          monthData={monthData}
          userName={userName}
          addresses={addresses}
          mainWorkplace={mainWorkplace}
          distance={distance}
          files={files}
        />
      </div>
      <AlertModal
        modalIsOpen={isModalOpen}
        modalDetails={modalDetails}
        closeModal={closeModal}
        confirmAction={confirmDeleteAction}
        cancelAction={cancelAction}
      />
    </div>
  );
}

export default App;
