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
      accent: "text-emerald-700",
      iconBg: "bg-white/90",
      button: "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500",
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
          className="group block min-w-0 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:p-4"
          aria-label={ariaLabel}
        >
          <span className="flex items-center gap-3">
            <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg sm:h-14 sm:w-14 ${iconBg}`}>
              <Icon className={`text-3xl sm:text-4xl ${accent}`} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-base font-bold text-emerald-950 sm:text-lg">
              {label}
            </span>
          </span>

          <span className="mt-2 block text-xs leading-5 text-slate-700 sm:text-sm">
            {description}
          </span>

          <span className="mt-3 flex items-center justify-between gap-3">
            <span className={`min-w-0 truncate text-base font-bold ${accent}`}>{value}</span>
            <span className={`flex-none rounded-md px-3 py-2 text-xs font-semibold text-white transition sm:px-4 ${button}`}>
              {cta}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
};

export default OrderOptions;
