import { FaWhatsapp } from "react-icons/fa";
// import { TbDeviceLandlinePhone } from "react-icons/tb";
import HomeConfig from "../HomeConfig.json";

const OrderOptions = () => {
  const whatsappNumber = HomeConfig.whatsappNumber?.[0] || "No Number Available";
  // const phoneNumber = HomeConfig.phoneNumber?.[0] || "No Number Available";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const orderOptions = [
    {
      label: "Shop Easily on WhatsApp",
      description: "Just send your grocery list, product names, or photos. We'll help you place your order fast and hassle-free.",
      value: whatsappNumber,
      cta: "Start Ordering",
      href: whatsappLink,
      Icon: FaWhatsapp,
      accent: "text-green-700",
      iconBg: "bg-green-50",
      button: "bg-green-700 hover:bg-green-800 focus:ring-green-500",
      ariaLabel: `Order via WhatsApp ${whatsappNumber}`,
    },
    // {
    //   label: "Order by Phone Call",
    //   description: "Call us directly to place your grocery order.",
    //   value: phoneNumber,
    //   href: `tel:${phoneNumber}`,
    //   Icon: TbDeviceLandlinePhone,
    //   accent: "text-sky-700",
    //   iconBg: "bg-sky-50",
    //   button: "bg-sky-700 hover:bg-sky-800 focus:ring-sky-500",
    //   ariaLabel: `Order via Phone ${phoneNumber}`,
    // },
  ];

  return (
    <div className="mt-4 grid w-full gap-3 px-2">
      {orderOptions.map(({ label, description, value, cta, href, Icon, accent, iconBg, button, ariaLabel }) => (
        <a
          key={label}
          href={href}
          target={label.includes("WhatsApp") ? "_blank" : undefined}
          rel={label.includes("WhatsApp") ? "noopener noreferrer" : undefined}
          className="group flex min-w-0 items-center gap-3 rounded-lg border border-green-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 sm:p-4"
          aria-label={ariaLabel}
        >
          <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg sm:h-14 sm:w-14 ${iconBg}`}>
            <Icon className={`text-3xl sm:text-4xl ${accent}`} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-base font-semibold text-gray-900">{label}</span>
            <span className="mt-1 block text-xs leading-5 text-gray-600 sm:text-sm">{description}</span>
            <span className={`mt-1 block truncate text-base font-bold ${accent}`}>{value}</span>
          </span>
          <span className={`flex-none rounded-md px-3 py-2 text-xs font-semibold text-white transition ${button}`}>
            {cta}
          </span>
        </a>
      ))}
    </div>
  );
};

export default OrderOptions;
