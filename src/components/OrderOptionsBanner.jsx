import { FaWhatsapp } from "react-icons/fa";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import HomeConfig from "../HomeConfig.json";

const OrderOptions = () => {
  const whatsappNumber = HomeConfig.whatsappNumber?.[0] || "No Number Available";
  const phoneNumber = HomeConfig.phoneNumber?.[0] || "No Number Available";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-4 px-2 mt-4">
      {/* WhatsApp Order Box */}
      <div className="flex-1 bg-[#ABBA7C] p-4 rounded-xl shadow-lg flex flex-col items-center text-center">
        <FaWhatsapp className="text-5xl sm:text-6xl text-[#3D5300] mb-3" aria-label="WhatsApp Icon" />
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#3D5300] text-white text-sm sm:text-base font-semibold px-3 py-2 rounded-lg hover:bg-green-800 transition"
          aria-label={`Order via WhatsApp ${whatsappNumber}`}
        >
          Click Here To Order via WhatsApp
          <br />
          <span className="block text-base font-bold mt-1">{whatsappNumber}</span>
        </a>
      </div>

      {/* Phone Call Order Box */}
      <div className="flex-1 bg-[#B9E5E8] p-4 rounded-xl shadow-lg flex flex-col items-center text-center">
        <TbDeviceLandlinePhone className="text-5xl sm:text-6xl text-[#4A628A] mb-3" aria-label="Phone Icon" />
        <a
          href={`tel:${phoneNumber}`}
          className="w-full bg-[#7AB2D3] text-white text-sm sm:text-base font-semibold px-3 py-2 rounded-lg hover:bg-[#4A628A] transition"
          aria-label={`Order via Phone ${phoneNumber}`}
        >
          Click Here To Order via Phone Call
          <br />
          <span className="block text-base font-bold mt-1">{phoneNumber}</span>
        </a>
      </div>
    </div>
  );
};

export default OrderOptions;
