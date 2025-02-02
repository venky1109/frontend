import { TbTruckDelivery } from "react-icons/tb";
import logo from "../assets/ManaKiranaLogo448x336.jpg";

const FreeHomeDelivery = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 pl-4 pr-4 rounded-2xl shadow-lg flex items-center justify-center">
  <div className="absolute w-full h-full flex items-center animate-truck-move">
    <div className="relative ml-1">
      <TbTruckDelivery className="text-red-900 text-8xl opacity-90 " />
      <img src={logo} alt="Manakirana Logo" className="absolute top-[44px] left-[31px] transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white p-1 rounded-full shadow-md" />
    </div>
  </div>
  <div className="absolute w-full flex items-center justify-center px-4">
    <div className="flex flex-col items-center text-center max-w-full">
      <h2 className="text-3xl font-bold text-white drop-shadow-md">Free Home Delivery</h2>
      <p className="text-md font-medium pl-2 text-gray-100 whitespace-nowrap">Get your order delivered within 24 hours!</p>
    </div>
  </div>
</div>
  );
};

export default FreeHomeDelivery;
