import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import HomeConfig from '../HomeConfig.json';

const ContactUsBanner = () => {
  const [whatsappNumber] = useState(HomeConfig.whatsappNumber?.[0] || 'No Number Available');
  const [phoneNumber] = useState(HomeConfig.phoneNumber?.[0] || 'No Number Available');

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex items-center space-x-2 rounded-md p-3 m-3">
      {/* First line: Order from */}
      <div className='m-1 bg-gray-200 p-3 pl-5 pr-5 rounded-md'>
      {/* Second line: WhatsApp */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
        <FaWhatsapp className="text-green-700" size={30} />
        <span className="text-green-800 font-semibold text-md pl-4">{whatsappNumber}</span>
      </a>
      </div>
      <div className='m-1 bg-gray-200 p-3 pl-5 pr-5  rounded-md'>
      {/* Third line: Phone */}
      <div className="flex items-center space-x-2 ml-2">
        <FaPhone className="text-green-700" size={30} />
        <span className="text-green-800 font-semibold text-md pl-4 ">{phoneNumber}</span>
      </div>
      </div>
    </div>
  );
};

export default ContactUsBanner;