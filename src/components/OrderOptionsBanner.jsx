import { FaWhatsapp } from "react-icons/fa";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { useState } from "react";
import HomeConfig from "../HomeConfig.json";

const OrderOptions = () => {
  const [whatsappNumber] = useState(HomeConfig.whatsappNumber?.[0] || "No Number Available");
  const [phoneNumber] = useState(HomeConfig.phoneNumber?.[0] || "No Number Available");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="relative w-full flex flex-row items-center justify-center  gap-1">
      {/* WhatsApp Order Banner */}
      <div className="w-1/2 overflow-hidden bg-green-100 border border-green-300 p-2 rounded-xl shadow-md flex flex-col items-center justify-center">
      <FaWhatsapp className="text-6xl text-green-700 mb-2" />
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white w-full bg-gradient-to-b from-green-900 via-green-700 to-green-900 px-1 py-2 rounded-lg shadow-md hover:bg-green-800 text-center">
        <span className="text-center text-xl ">Click Here To Order via WhatsApp  </span><br />
        <span className="text-center text-semibold text-md "><b>{whatsappNumber}</b></span>
        </a>
      </div>
      
     {/* Landline Call Banner */}
      <div className="w-1/2  overflow-hidden bg-amber-100 border border-amber-300 p-2 rounded-xl shadow-md flex flex-col items-center justify-center">
        <TbDeviceLandlinePhone className="text-6xl text-amber-900 mb-2" />
        <a href={`tel:${phoneNumber}`} className="text-white w-full bg-gradient-to-b from-amber-900 via-amber-700 to-amber-900 px-1 py-2 rounded-lg shadow-md hover:bg-gray-800 text-center">
        <span className="text-center text-xl ">Click Here To Order via Phone Call  </span><br />
        <span className="text-center text-semibold text-md "><b>{phoneNumber}</b></span>
        </a>
      </div>
    </div>
  );
};

export default OrderOptions;