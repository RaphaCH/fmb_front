import React from 'react';
import { Address, WDay } from '../../models/types';
import { TimeOfDay } from '../../models/enums';

type Props = {
  day: WDay;
  time: TimeOfDay;
  defaultWorkplace: Address;
  updateDay: (editedDay: WDay) => void;
};
const WorkdayTypeRadioButtons = ({
  day,
  time,
  defaultWorkplace,
  updateDay,
}: Props) => {
  const setWorkdayType = (type: string) => {
    if (day[`isWorkday${time}`] && day.isWeekend) {
      day[`isWorkday${time}`] = false;
    } else {
      day[`isWorkday${time}`] = type === 'workday';
      day[`isHoliday${time}`] = type === 'holiday';
    }
    if (day[`isWorkday${time}`]) {
      day[`workPlaceAddress${time}`] = defaultWorkplace;
    } else {
      day[`workPlaceAddress${time}`] = null;
    }
    updateDay(day);
  };

  const setWorkdayTypeFullDay = (type: string) => {
    if (day.isWorkdayAm && day.isWeekend) {
      day.isWorkdayAm = false;
      day.isWorkdayPm = false;
    } else {
      day.isWorkdayAm = type === 'workday';
      day.isWorkdayPm = type === 'workday';
      day.isHolidayAm = type === 'holiday';
      day.isHolidayPm = type === 'holiday';
    }
    if (day.isWorkdayAm) {
      day.workPlaceAddressAm = defaultWorkplace;
      day.workPlaceAddressPm = defaultWorkplace;
    } else {
      day.workPlaceAddressAm = null;
      day.workPlaceAddressPm = null;
    }
    updateDay(day);
  };

  if (time === TimeOfDay.FULL) {
    return (
      <>
        <td className='cell-item'>
          <input
            type='radio'
            name={day.workDate}
            value='workday'
            defaultChecked={day.isWorkdayAm ?? false}
            required={!day.isWeekend}
            className='checkbox checkbox-primary checkbox-xs no-animation mt-2.5'
            onClick={() => setWorkdayTypeFullDay('workday')}
          />
        </td>
        <td className='cell-item'>
          {!day.isWeekend && (
            <input
              type='radio'
              name={day.workDate}
              value='holiday'
              defaultChecked={day.isHolidayAm ?? false}
              required={!day.isWeekend}
              className='checkbox checkbox-primary checkbox-xs no-animation mt-2.5'
              onClick={() => setWorkdayTypeFullDay('holiday')}
            />
          )}
        </td>
      </>
    );
  } else {
    return (
      <>
        <td className='cell-item split-day'>
          <input
            type='radio'
            name={`${day.workDate}-${time}`}
            value='workday'
            defaultChecked={day[`isWorkday${time}`] ?? false}
            required={!day.isWeekend}
            className='checkbox checkbox-primary checkbox-xs no-animation mt-2.5'
            onClick={() => setWorkdayType('workday')}
          />
        </td>
        <td className='cell-item split-day'>
          {!day.isWeekend && (
            <input
              type='radio'
              name={`${day.workDate}-${time}`}
              value='holiday'
              defaultChecked={day[`isHoliday${time}`] ?? false}
              required={!day.isWeekend}
              className='checkbox checkbox-primary checkbox-xs no-animation mt-2.5'
              onClick={() => setWorkdayType('holiday')}
            />
          )}
        </td>
      </>
    );
  }
};

export default WorkdayTypeRadioButtons;
