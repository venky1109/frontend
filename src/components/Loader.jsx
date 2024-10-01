import React from "react";
// import { BsCart3 } from "react-icons/bs";
import logo from '../assets/ManaKiranaLogoWithName.gif';  // Import the logo correctly

const Loader = () => {
  return (
    <div className="flex justify-center items-start h-screen mt-40">
      {/* Use an img tag to display the logo */}
      <img src={logo} alt="Loading..." className="animate-slowSpin h-24 w-24" />
    </div>
  );
};

export default Loader;
