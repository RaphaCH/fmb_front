import React from 'react';
import SubmitAndExportPDF from './SubmitAndExportPDF';
import { Address, WMonth } from '../models/types';

type Props = {
  saveData: () => void;
  monthData: WMonth;
  userName: string;
  addresses: Address[];
  mainWorkplace: Address;
  distance: number;
  files: FileList;
};
const Save = ({
  saveData,
  monthData,
  userName,
  addresses,
  mainWorkplace,
  distance,
  files,
}: Props) => {
  return (
    <div className='flex w-fit'>
      <button
        className='btn btn-primary'
        onClick={saveData}
      >
        Save
      </button>
      <SubmitAndExportPDF
        disabled={
          !mainWorkplace || (distance && distance > 10) || userName === ''
        }
        data={monthData}
        userName={userName}
        addresses={addresses}
        mainWorkplace={mainWorkplace}
        distance={distance}
        files={files}
        onClickSave={saveData}
      />
    </div>
  );
};

export default Save;
