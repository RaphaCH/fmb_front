import React from 'react';

type Props = {
  userName: string;
  handleSaveUserName: (name: string) => void;
};
const UserName = ({ userName, handleSaveUserName }: Props) => {
  return (
    <div className='collapse'>
      <div className='box-title'>Full name*</div>
      <div className='user-name text-sm'>
        <input
          placeholder='Enter full name'
          defaultValue={userName}
          onBlur={(e) => handleSaveUserName(e.target.value.trim())}
          className='input input-bordered w-full max-w-xs form-input'
          autoComplete='off'
        />
      </div>
    </div>
  );
};

export default UserName;
