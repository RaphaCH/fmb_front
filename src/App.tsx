import React, { useState, useEffect } from 'react';
import useLocalStorage from './utils/useLocalStorage';
import UserName from './components/UserName';
import Save from './components/Save';
import Attachments from './components/Attachments';
import WorkplaceAddress from './components/WorkplaceAddress';
import {
  Address,
  AllAddresses,
  MainWorkplaces,
  ModalDetails,
  MonthAddresses,
  MonthMainWorkplace,
  MonthYear,
  ResAddress,
  ResAddresses,
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
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';

function App() {
  const currentDate: Date = new Date();
  currentDate.setFullYear(2025);
  const { getItem, setItem, clearWorkdaysAndAddresses } = useLocalStorage();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [displayedDate, setDisplayedDate] = useState<Date>(currentDate);
  const [selectedMY, setSelectedMY] = useState<MonthYear>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  const [hasUpdatedDate, setHasUpdatedDate] = useState<boolean>(true);
  const [addressToDelete, setAddressToDelete] = useState<Address | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    message: 'Unknown alert',
    type: ModalTypes.ERROR,
  });
  const [userName, setUserName] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [resAddress, setResAddress] = useState<Address | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [monthData, setMonthData] = useState<WMonth | undefined>(undefined);
  const [mainWorkplace, setMainWorkplace] = useState<
    Address | undefined | null
  >(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [isSplitDay, setIsSplitDay] = useState<boolean>(false);

  useEffect(() => {
    if (hasUpdatedDate) {
      const updatedAddresses: Address[] = handleAddressData();
      refreshNewYear();
      handleNameAndFiles();
      handleResAddressData(updatedAddresses);
      handleMainWorkplaceData(updatedAddresses);
      handleWorkdayData(updatedAddresses[0]);
      setHasUpdatedDate(false);
      setDisplayedDate(selectedDate);
    }
  }, [hasUpdatedDate, monthData]);

  const refreshNewYear = () => {
    const storedWorkdayData = getItem(StorageTypes.WORKDAYS);
    if (!storedWorkdayData?.find((m: WMonth) => m.year === selectedMY.year)) {
      if (
        clearWorkdaysAndAddresses(selectedMY.month, selectedMY.year) === false
      ) {
        openModal({
          type: ModalTypes.ERROR,
        });
      }
    }
  };

  const handleNameAndFiles = () => {
    const userName = getItem(StorageTypes.USER_NAME);
    if (userName === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    } else {
      setUserName(userName);
    }
    const files = getItem(StorageTypes.FILES);
    if (files === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    } else {
      setFiles(files);
    }
  };

  const handleSaveUserName = (name: string) => {
    setUserName(name);
    if (setItem(StorageTypes.USER_NAME, name) === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    }
  };

  const handleSaveData = () => {
    const updatedMonthWorkdays: WMonth = updateMonthInWorkdays(monthData);
    setItem(StorageTypes.USER_NAME, userName);
    storeAllResAddressesWithUpdatedRes(resAddress);
    storeAllWorkplaceAddressesWithUpdatedAddresses(addresses);
    storeAllMainWorkplacesWithUpdatedMainWorkplace(mainWorkplace);
    storeWorkdaysWithUpdatedMonth(updatedMonthWorkdays);
    openModal({
      message: 'Saved',
      type: ModalTypes.SUCCESS,
    });
  };

  const addResToWorkdays = (address: Address) => {
    const updatedWorkdays: WDay[] = monthData.workdays.map((d: WDay) => {
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
    storeWorkdaysWithUpdatedMonth(updatedMonth);
    updateMainWorkplace(updatedMonth);
  };

  const updateMonthInWorkdays = (updatedMonth: WMonth) => {
    const storedWorkdays = getItem(StorageTypes.WORKDAYS) ?? [];
    return storedWorkdays.map((o) =>
      o.month === updatedMonth.month && o.year === updatedMonth.year
        ? monthData
        : o
    );
  };

  const addWorkPlaceAddress = (
    group: object,
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
      (group: object, product: WDay) => {
        const { workPlaceAddressAm, workPlaceAddressPm } = product;
        group = addWorkPlaceAddress(group, product, workPlaceAddressAm);
        group = addWorkPlaceAddress(group, product, workPlaceAddressPm);
        return group;
      },
      {}
    );
    let newDistance = null;
    let newMainWorkplace = null;
    if (Object.values(groupByLocation).length > 0) {
      const mainWorkplaceName: string = Object.keys(groupByLocation).reduce(
        (a: string, b: string) =>
          groupByLocation[a] > groupByLocation[b] ? a : b
      );
      newMainWorkplace =
        addresses.find(
          (add: Address) => add.addressName === mainWorkplaceName
        ) ?? undefined;
      if (newMainWorkplace) {
        newDistance = Number(
          getDistance(
            newMainWorkplace.addressCoordinates,
            resAddress.addressCoordinates
          )
        );
      }
    }
    setMainWorkplace(newMainWorkplace);
    setDistance(newDistance);
    storeAllMainWorkplacesWithUpdatedMainWorkplace(newMainWorkplace);
  };

  const handleSaveResAddress = (address: Address) => {
    setResAddress(address);
    storeAllResAddressesWithUpdatedRes(address);
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
      storeAllResAddressesWithUpdatedRes(address);
    }
    setAddresses(addressList);

    storeAllWorkplaceAddressesWithUpdatedAddresses(addressList);
    addResToWorkdays(address);
    if (!mainWorkplace) {
      storeAllMainWorkplacesWithUpdatedMainWorkplace(address);
      setMainWorkplace(address);
      setDistance(0);
    } else if (mainWorkplace.addressName === 'Residential address') {
      setMainWorkplace(address);
    } else {
      const updatedMainWorkplace = addressList.find(
        (a: Address) => a.addressName === mainWorkplace.addressName
      );
      setMainWorkplace(updatedMainWorkplace);
      setDistance(updatedMainWorkplace.distanceFromResAdd);
    }
  };

  const storeAllResAddressesWithUpdatedRes = (address: Address) => {
    let updatedResAddresses: ResAddresses =
      getItem(StorageTypes.RES_ADDRESSES) ?? [];
    if (
      updatedResAddresses?.some(
        (add: ResAddress) =>
          add.month === selectedMY.month && add.year === selectedMY.year
      )
    ) {
      updatedResAddresses = updatedResAddresses
        .map((add: ResAddress) =>
          add.month === selectedMY.month && add.year === selectedMY.year
            ? {
                ...add,
                address: address,
              }
            : add
        )
        .sort(sortMonths);
    } else {
      updatedResAddresses.push({
        month: selectedMY.month,
        year: selectedMY.year,
        address: address,
      });
      updatedResAddresses = updatedResAddresses.sort(sortMonths);
    }
    if (setItem(StorageTypes.RES_ADDRESSES, updatedResAddresses) === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    }
  };

  const storeAllWorkplaceAddressesWithUpdatedAddresses = (
    addressList: Address[]
  ) => {
    let updatedAddresses: AllAddresses = getItem(StorageTypes.ADDRESSES) ?? [];
    if (
      updatedAddresses?.some(
        (add: MonthAddresses) =>
          add.month === selectedMY.month && add.year === selectedMY.year
      )
    ) {
      updatedAddresses = updatedAddresses
        .map((adds: MonthAddresses) =>
          adds.month === selectedMY.month && adds.year === selectedMY.year
            ? {
                ...adds,
                addresses: addressList,
              }
            : adds
        )
        .sort(sortMonths);
    } else {
      updatedAddresses.push({
        month: selectedMY.month,
        year: selectedMY.year,
        addresses: addressList,
      });
      updatedAddresses = updatedAddresses.sort(sortMonths);
    }
    if (setItem(StorageTypes.ADDRESSES, updatedAddresses) === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    }
  };

  const storeAllMainWorkplacesWithUpdatedMainWorkplace = (
    mainWorkplace: Address
  ) => {
    let updatedMainWorkplaces: MainWorkplaces =
      getItem(StorageTypes.MAINWORKPLACES) ?? [];
    if (
      updatedMainWorkplaces?.some(
        (add: MonthMainWorkplace) =>
          add.month === selectedMY.month && add.year === selectedMY.year
      )
    ) {
      updatedMainWorkplaces = updatedMainWorkplaces
        .map((wp: MonthMainWorkplace) =>
          wp.month === selectedMY.month && wp.year === selectedMY.year
            ? {
                ...wp,
                address: mainWorkplace,
              }
            : wp
        )
        .sort(sortMonths);
    } else {
      updatedMainWorkplaces.push({
        month: selectedMY.month,
        year: selectedMY.year,
        address: mainWorkplace,
      });
      updatedMainWorkplaces = updatedMainWorkplaces.sort(sortMonths);
    }
    if (setItem(StorageTypes.MAINWORKPLACES, updatedMainWorkplaces) === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    }
  };

  const storeWorkdaysWithUpdatedMonth = (updatedMonth: WMonth) => {
    let updatedWorkdays: Workdays = getItem(StorageTypes.WORKDAYS) ?? [];
    if (
      updatedWorkdays?.some(
        (mon: WMonth) =>
          mon.month === selectedMY.month && mon.year === selectedMY.year
      )
    ) {
      updatedWorkdays = updatedWorkdays
        .map((mon: WMonth) =>
          mon.month === updatedMonth.month && mon.year === updatedMonth.year
            ? updatedMonth
            : mon
        )
        .sort(sortMonths);
    } else {
      updatedWorkdays.push(updatedMonth);
      updatedWorkdays = updatedWorkdays.sort(sortMonths);
    }
    if (setItem(StorageTypes.WORKDAYS, updatedWorkdays) === false) {
      openModal({
        type: ModalTypes.ERROR,
      });
    }
  };

  const handleSaveNewAddress = (address: Address) => {
    const updatedAddressList: Address[] = [...addresses, address];
    setAddresses(updatedAddressList);
    storeAllWorkplaceAddressesWithUpdatedAddresses(updatedAddressList);
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
      if (setItem(StorageTypes.FILES, toStore) === false) {
        openModal({
          type: ModalTypes.ERROR,
        });
      }
    }
  };

  const handleWorkdayData = (resAddressForMonth: Address) => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const storedWorkdayData = getItem(StorageTypes.WORKDAYS) ?? [];

    let month = storedWorkdayData?.find(
      (m: WMonth) => m.month === selectedMonth && m.year === selectedYear
    );
    if (!month) {
      month = getNewMonth(resAddressForMonth);
      storedWorkdayData.push(month);
    }
    setIsSplitDay(
      month.workdays.some(
        (day: WDay) =>
          day.workPlaceAddressAm?.addressName !==
          day.workPlaceAddressPm?.addressName
      )
    );
    setMonthData(month);
  };

  const handleAddressData = () => {
    const allAddresses: AllAddresses = getItem(StorageTypes.ADDRESSES);
    let newlySelectedMonthAddresses: Address[] = allAddresses?.find(
      (add: MonthAddresses) =>
        add.month === selectedMY.month && add.year === selectedMY.year
    )?.addresses;
    // If no saved addresses for selected month, retrieve addresses from current month if existing,
    // else from the latest month (in time) stored
    if (
      !newlySelectedMonthAddresses ||
      newlySelectedMonthAddresses.length < 2
    ) {
      if (allAddresses) {
        newlySelectedMonthAddresses =
          allAddresses.find(
            (add: MonthAddresses) =>
              add.month === currentDate.getMonth() &&
              add.year === currentDate.getFullYear()
          )?.addresses ?? allAddresses[allAddresses.length - 1]?.addresses;
      } else {
        newlySelectedMonthAddresses = [];
      }
    }
    setAddresses(newlySelectedMonthAddresses);
    return newlySelectedMonthAddresses;
  };

  const handleResAddressData = (newlySelectedMonthAddresses: Address[]) => {
    const newlySelectedResAddress: Address = getItem(
      StorageTypes.RES_ADDRESSES
    )?.find(
      (add: ResAddress) =>
        add.month === selectedMY.month && add.year === selectedMY.year
    )?.address;
    const newResAddress: Address =
      newlySelectedResAddress ?? newlySelectedMonthAddresses[0] ?? undefined;
    setResAddress(newResAddress);
  };

  const handleMainWorkplaceData = (newlySelectedMonthAddresses: Address[]) => {
    const allMainWorkplaces: MainWorkplaces = getItem(
      StorageTypes.MAINWORKPLACES
    );
    const newlySelectedMainWP: Address = allMainWorkplaces?.find(
      (add: MonthMainWorkplace) =>
        add.month === selectedMY.month && add.year === selectedMY.year
    )?.address;
    const newMainWP: Address =
      newlySelectedMainWP === null
        ? null
        : newlySelectedMainWP ?? newlySelectedMonthAddresses[0] ?? undefined;
    setMainWorkplace(newMainWP);
    setDistance(newMainWP?.distanceFromResAdd);
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
    storeAllWorkplaceAddressesWithUpdatedAddresses(addressesWithDeleted);
    deleteWorkplaceFromWorkdays(addressToDelete);
    cancelAction();
  };

  const cancelAction = () => {
    setAddressToDelete(undefined);
    closeModal();
  };

  const getNewMonth = (resAddressForMonth: Address) => {
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
        workPlaceAddressAm: isWeekend ? null : resAddressForMonth,
        isWorkdayAm: !isWeekend,
        isHolidayAm: false,
        workPlaceAddressPm: isWeekend ? null : resAddressForMonth,
        isWorkdayPm: !isWeekend,
        isHolidayPm: false,
        isWeekend: isWeekend,
      });
    }
    return { month: month, year: year, workdays: days };
  };

  const sortMonths = (a, b) => {
    const aDate: Date = new Date(a.year, a.month, 1);
    const bDate: Date = new Date(b.year, b.month, 1);
    return Number(aDate) - Number(bDate);
  };

  const handleUpdatedDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedMY({ month: date.getMonth(), year: date.getFullYear() });
    setHasUpdatedDate(true);
  };

  return (
    <div className='App'>
      <div className='app-container'>
        <Header />
        <Disclaimer />
        <UserName userName={userName} handleSaveUserName={handleSaveUserName} />
        <Attachments
          files={files}
          setFiles={setFiles}
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
            isSplitDay={isSplitDay}
            setIsSplitDay={setIsSplitDay}
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
        <Footer />
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
