import React, { Dispatch, SetStateAction, useState } from 'react';
import { Address, WDay, WMonth } from '../models/types';
import WorkdayList from './CalendarComponents/WorkdayList';
import MonthPicker from "./MonthPicker";
import SplitDayToggle from './CalendarComponents/SplitDayToggle';

type CalendarProps = {
  data: WMonth;
  resAddress: Address;
  addresses: Address[];
  selectedDate: Date;
  setMonthData: Dispatch<SetStateAction<WMonth>>;
  updateDate: (date: Date) => void;
  updateWorkdaysByMonth: (updatedMonth: WMonth) => void;
};
const Calendar = ({
  data,
  resAddress,
  addresses,
  selectedDate,
  setMonthData,
  updateDate,
  updateWorkdaysByMonth,
}: CalendarProps) => {
  const [isSplitDay, setIsSplitDay] = useState<boolean>(
    data.workdays.some(
      (day: WDay) =>
        day.workPlaceAddressAm?.addressName !==
        day.workPlaceAddressPm?.addressName
    )
  );

  const updateDay = (editedDay: WDay) => {
    let day = data.workdays.find(
      (day: WDay) => day.workDate === editedDay.workDate
    );
    day = editedDay;
    updateWorkdaysByMonth(data);
  };

  const updateMonth = (editedMonth: WDay[]) => {
    data.workdays = editedMonth;
    updateWorkdaysByMonth(data);
  };

  return (
    <div>
      <h2 className='sectionTitle'>Calendar</h2>
      <div className='toggle-month-picker'>
        <SplitDayToggle
          isSplitDay={isSplitDay}
          setIsSplitDay={setIsSplitDay}
          month={data.workdays}
          updateMonth={updateMonth}
        />
        <MonthPicker updateDate={updateDate} selectedDate={selectedDate} />
      </div>
      <WorkdayList
        month={data.workdays}
        addresses={addresses}
        resAddress={resAddress}
        updateDay={updateDay}
        updateMonth={updateMonth}
        isSplitDay={isSplitDay}
      />
    </div>
  );
};
export default Calendar;
