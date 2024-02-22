import React, { useEffect, useState } from 'react';
import { Address, WDay } from '../../models/types';
import { TimeOfDay } from '../../models/enums';
import DayItem from './DayItem';

type ListProps = {
  month: WDay[];
  addresses: Address[];
  resAddress: Address;
  displayedDate: Date;
  updateDay: (editedDay: WDay) => void;
  updateMonth: (editedMonth: WDay[]) => void;
  isSplitDay: boolean;
};
type ItemProps = {
  day: WDay;
  index: number;
};
type WeekData = {
  dayNumber: number;
  workPlaceAddressAm: Address | null;
  workPlaceAddressPm: Address | null;
  isWorkdayAm: boolean;
  isWorkdayPm: boolean;
  isHolidayAm: boolean;
  isHolidayPm: boolean;
};
const WorkdayList = ({
  month,
  addresses,
  resAddress,
  displayedDate,
  updateDay,
  updateMonth,
  isSplitDay,
}: ListProps) => {
  const [firstFullWeekIndexes, setFirstFullWeekIndexes] = useState<number[]>(
    []
  );

  useEffect(() => {
    findFirstFullWeek();
  }, [displayedDate]);

  const findFirstFullWeek = () => {
    let i = month.findIndex((d) => new Date(d.workDate).getDay() === 1);
    setFirstFullWeekIndexes([i++, i++, i++, i++, i++]);
  };

  const autofillWeeks = (index: number) => {
    const weekData: WeekData[] = month
      .slice(index - 4, index + 1)
      .map((day: WDay) => {
        return {
          dayNumber: new Date(day.workDate).getDay(),
          workPlaceAddressAm: day.workPlaceAddressAm,
          workPlaceAddressPm: day.workPlaceAddressPm,
          isWorkdayAm: day.isWorkdayAm,
          isWorkdayPm: day.isWorkdayPm,
          isHolidayAm: day.isHolidayAm,
          isHolidayPm: day.isHolidayPm,
        };
      });

    month = month.map((day: WDay, i: number) => {
      const dayOfWeek = weekData.find(
        (weekday: WeekData) =>
          new Date(day.workDate).getDay() === weekday.dayNumber
      );
      // if (dayOfWeek && i > index && !publicHolidays.includes(day.workDate)) {
      if (dayOfWeek && i > index) {
        day.workPlaceAddressAm = dayOfWeek.workPlaceAddressAm;
        day.workPlaceAddressPm = dayOfWeek.workPlaceAddressPm;
        day.isWorkdayAm = dayOfWeek.isWorkdayAm;
        day.isWorkdayPm = dayOfWeek.isWorkdayPm;
        day.isHolidayAm = dayOfWeek.isHolidayAm;
        day.isHolidayPm = dayOfWeek.isHolidayPm;
      }
      return day;
    });

    updateMonth(month);
  };

  const Item = ({ day, index }: ItemProps) => {
    const date: Date = new Date(day.workDate);
    const isWeekend: boolean = date.getDay() % 6 === 0;
    const weekday: string = date.toLocaleDateString('en-gb', {
      weekday: 'short',
    });
    const formattedDate: string = date.toLocaleDateString('en-gb', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    return (
      <>
        <tr
          className={
            isWeekend
              ? 'bg-accent'
              : firstFullWeekIndexes.includes(index)
              ? 'even:bg-base-100 odd:bg-accent odd:bg-opacity-20 border-x-4 border-primary'
              : 'even:bg-base-100 odd:bg-accent odd:bg-opacity-20'
          }
        >
          <td className='cellItem flex justify-between first:bg-accent first:bg-opacity-30'>
            <div>{weekday}</div>
            <div>{formattedDate}</div>
          </td>
          {isSplitDay ? (
            <>
              <DayItem
                day={day}
                time={TimeOfDay.AM}
                defaultWorkplace={resAddress}
                addresses={addresses}
                updateDay={updateDay}
              />
              <DayItem
                day={day}
                time={TimeOfDay.PM}
                defaultWorkplace={resAddress}
                addresses={addresses}
                updateDay={updateDay}
              />
            </>
          ) : (
            <DayItem
              day={day}
              time={TimeOfDay.FULL}
              defaultWorkplace={resAddress}
              addresses={addresses}
              updateDay={updateDay}
            />
          )}
        </tr>
        {firstFullWeekIndexes[4] === index && (
          <tr className='full-width'>
            <td className='full-width block p-0 border-none'>
              <button
                className='btn btn-primary w-full rounded-t-none margin-none no-animation'
                onClick={() => autofillWeeks(index)}
              >
                <span className='mr-3 mb-0.5 text-lg'>{'\u21E9'}</span>Click to
                fill the following weeks with the same arrangement as above{' '}
                <span className='ml-3 mb-0.5 text-lg'>{'\u21E9'}</span>
              </button>
            </td>
          </tr>
        )}
      </>
    );
  };

  const SplitDayHeaders = () => {
    return (
      <thead>
        <tr className=''>
          <th className='bg-primary text-white row-span-2 header-date'>Date</th>
          <th className='bg-primary text-white col-start-2 col-span-3'>
            Morning
          </th>
          <th className='bg-primary text-white col-start-5 col-span-3'>
            Afternoon
          </th>
          <th className='bg-primary text-white bg-opacity-70'>Location</th>
          <th className='bg-primary text-white bg-opacity-70'>Work Day</th>
          <th className='bg-primary text-white bg-opacity-70'>Absence</th>
          <th className='bg-primary text-white bg-opacity-80'>Location</th>
          <th className='bg-primary text-white bg-opacity-80'>Work Day</th>
          <th className='bg-primary text-white bg-opacity-80'>Absence</th>
        </tr>
      </thead>
    );
  };

  const NonSplitDayHeaders = () => {
    return (
      <thead>
        <tr className='table-header-grid'>
          <th className='bg-primary text-white header-date'>Date</th>
          <th className='bg-primary text-white'>Location</th>
          <th className='bg-primary text-white'>Work Day</th>
          <th className='bg-primary text-white'>Absence</th>
        </tr>
      </thead>
    );
  };

  return (
    <div>
      <table
        className={
          isSplitDay
            ? 'table table-pin-rows w-full wTable split-days'
            : 'table table-pin-rows w-full wTable non-split-days'
        }
      >
        {isSplitDay ? <SplitDayHeaders /> : <NonSplitDayHeaders />}
        <tbody>
          {month.map((day, index) => (
            <Item key={index} day={day} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkdayList;
