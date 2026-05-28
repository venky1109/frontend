import {  FaWhatsapp } from 'react-icons/fa';
import { TbDeviceLandlinePhone } from "react-icons/tb";

import { useState } from 'react';
import HomeConfig from '../HomeConfig.json';

const ContactUsBanner = () => {
  const [whatsappNumber] = useState(HomeConfig.whatsappNumber?.[0] || 'No Number Available');
  const [phoneNumber] = useState(HomeConfig.phoneNumber?.[0] || 'No Number Available');

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      {/* First line: Order from */}
      <div className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-emerald-800">
        Order from:
      </div>
      
      <div className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        {/* Second line: WhatsApp */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
          <FaWhatsapp className="text-emerald-700" size={18} />
          <span className="text-xs font-bold text-slate-800">{whatsappNumber}</span>
        </a>
      </div>

      <div className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        {/* Third line: Phone */}
        <div className="flex items-center gap-1.5">
          <TbDeviceLandlinePhone className="text-emerald-700" size={18} />
          <span className="text-xs font-bold text-slate-800">{phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUsBanner;
