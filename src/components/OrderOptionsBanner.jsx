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
      <div className="w-1/2 overflow-hidden bg-[#ABBA7C]  p-2 rounded-xl shadow-md flex flex-col items-center justify-center">
      <FaWhatsapp className="text-6xl text-[#3D5300] mb-2" />
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-[#E9EED9] w-full bg-[#3D5300] px-1 py-2 rounded-lg shadow-md hover:bg-green-800 text-center">
        <span className="text-center text-xl ">Click Here To Order via WhatsApp  </span><br />
        <span className="text-center text-semibold text-md "><b>{whatsappNumber}</b></span>
        </a>
      </div>
      
     {/* Landline Call Banner */}
      <div className="w-1/2  overflow-hidden bg-[#B9E5E8]  p-2 rounded-xl shadow-md flex flex-col items-center justify-center">
        <TbDeviceLandlinePhone className="text-6xl text-[#4A628A] mb-2" />
        <a href={`tel:${phoneNumber}`} className="text-[#DFF2EB] w-full bg-[#7AB2D3] px-1 py-2 rounded-lg shadow-md hover:bg-[#4A628A] text-center">
        <span className="text-center text-xl ">Click Here To Order via Phone Call  </span><br />
        <span className="text-center text-semibold text-md "><b>{phoneNumber}</b></span>
        </a>
      </div>
    </div>
  );
};

export default OrderOptions;