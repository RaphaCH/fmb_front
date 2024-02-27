import React, { Dispatch, SetStateAction } from 'react';
import { Address, WDay, WMonth } from '../models/types';
import WorkdayList from './CalendarComponents/WorkdayList';
import MonthPicker from './MonthPicker';
import SplitDayToggle from './CalendarComponents/SplitDayToggle';

type CalendarProps = {
  data: WMonth;
  resAddress: Address;
  addresses: Address[];
  isSplitDay: boolean;
  setIsSplitDay: Dispatch<SetStateAction<boolean>>;
  displayedDate: Date;
  updateDate: (date: Date) => void;
  updateWorkdaysByMonth: (updatedMonth: WMonth) => void;
};
const Calendar = ({
  data,
  resAddress,
  addresses,
  isSplitDay,
  setIsSplitDay,
  displayedDate,
  updateDate,
  updateWorkdaysByMonth,
}: CalendarProps) => {
  const updateDay = (editedDay: WDay) => {
    const updatedDays: WDay[] = data.workdays.map((day: WDay) =>
      day.workDate === editedDay.workDate ? editedDay : day
    );
    updateWorkdaysByMonth({
      month: data.month,
      year: data.year,
      workdays: updatedDays,
    });
  };

  const updateMonth = (editedMonth: WDay[]) => {
    updateWorkdaysByMonth({
      month: data.month,
      year: data.year,
      workdays: editedMonth,
    });
  };

  return (
    <div>
      <h2 className='section-title'>Calendar</h2>
      <div className='toggle-month-picker'>
        <SplitDayToggle
          isSplitDay={isSplitDay}
          setIsSplitDay={setIsSplitDay}
          month={data.workdays}
          updateMonth={updateMonth}
        />
        <MonthPicker updateDate={updateDate} displayedDate={displayedDate} />
      </div>
      <WorkdayList
        month={data.workdays}
        addresses={addresses}
        resAddress={resAddress}
        displayedDate={displayedDate}
        updateDay={updateDay}
        updateMonth={updateMonth}
        isSplitDay={isSplitDay}
      />
    </div>
  );
};
export default Calendar;
