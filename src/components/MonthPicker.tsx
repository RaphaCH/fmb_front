import React, { MouseEventHandler, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import '../assets/react-datepicker-stylesheets/datepicker.scss';
import calendarIcon from '../assets/icons/calendar_purple.png';

type Props = {
  displayedDate: Date;
  updateDate: (date: Date) => void;
};
type CustomButtonProps = {
  value?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
const MonthPicker = ({ displayedDate, updateDate }: Props) => {
  const currentYear = new Date().getFullYear();
  const minDate: Date = new Date(currentYear, 0);
  const maxDate: Date = new Date(currentYear, 11);

  const changeMonth = (newDate: Date) => {
    updateDate(newDate);
  };

  const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ value, onClick }, ref) => (
      <button
        className='btn btn-primary btn-outline open-picker'
        onClick={onClick}
        ref={ref}
      >
        <img
          src={calendarIcon}
          alt='Calendar icon'
          width={20}
          height={20}
          className='mr-2'
        />
        {value}
        <div className='collapsible-arrow down small' />
      </button>
    )
  );

  return (
    <div className='date-picker-container'>
      <DatePicker
        selected={displayedDate}
        onChange={(newDate: Date) => changeMonth(newDate)}
        dateFormat='MMM y'
        minDate={minDate}
        maxDate={maxDate}
        showMonthYearPicker
        customInput={<CustomButton />}
      />
    </div>
  );
};

export default MonthPicker;
