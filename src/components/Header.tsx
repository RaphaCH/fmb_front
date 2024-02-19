import React from "react";
import logo from "../assets/icons/Acc_Logo_Black_Purple_RGB.png";

const Header = () => {
  return (
    <header>
      <h2 className="boxTitle text-center">
        FMB: Housing Costs Reimbursement Tool
      </h2>
      <img src={logo} alt="Accenture Logo" width={120} />
    </header>
  );
};

export default Header;
