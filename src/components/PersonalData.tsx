import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
};
const PersonalData = ({ userName, setUserName }: Props) => {
  return (
    <div className='collapse'>
      <div className='boxTitle'>Full name</div>
      <div className='personalData text-sm'>
        <input
          placeholder='Enter name'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='input input-bordered w-full max-w-xs formInput'
          required
          autoComplete='off'
        />
      </div>
    </div>
  );
};

export default PersonalData;
