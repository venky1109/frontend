// import { TbTruckDelivery } from "react-icons/tb";
// import logo from "../assets/ManaKiranaLogo448x336.jpg";

const FreeHomeDelivery = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden bg-gradient-to-b from-[#A6CDC6] via-[#85B5AE] to-[#5D8E86] rounded-2xl shadow-lg flex items-center justify-center px-4">
      {/* Moving Truck Animation */}
      <div className="absolute w-full h-full flex items-center animate-truck-move pointer-events-none">
        <div className="relative ml-1">
          {/* <TbTruckDelivery
            className="text-gray-200 text-8xl opacity-90"
            aria-label="Truck delivery animation"
          /> */}
          {/* Optional Logo inside truck */}
          {/* <img src={logo} alt="Manakirana Logo" className="absolute top-[44px] left-[31px] transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white p-1 rounded-full shadow-md" /> */}
        </div>
      </div>

      {/* Static Text Content */}
      <div className="relative z-10 w-full text-center">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md leading-tight">
          Free Home Delivery
        </h2>
        <p className="text-sm sm:text-md font-medium text-gray-100 mt-1">
          Get your order delivered within 24 hours!
        </p>
      </div>
    </div>
  );
};

export default FreeHomeDelivery;
