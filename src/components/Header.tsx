import React from 'react';
import logo from '../assets/icons/Acc_Logo_Black_Purple_RGB.png';

const Header = () => {
  return (
    <header>
      <h2 className='header-title'>
        FMB Housing Costs - Proof of Work Location
      </h2>
      <img className='mb-[10px]' src={logo} alt='Accenture Logo' width={120} />
    </header>
  );
};

export default Header;
