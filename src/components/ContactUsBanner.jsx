import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import HomeConfig from '../HomeConfig.json';

const ContactUsBanner = () => {
  const [whatsappNumber] = useState(HomeConfig.whatsappNumber?.[0] || 'No Number Available');
  const [phoneNumber] = useState(HomeConfig.phoneNumber?.[0] || 'No Number Available');

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex items-center space-x-4 rounded-md p-1">
      {/* First line: Order from */}
      <div className="text-gray-500 font-bold text-sm sm:text-md">
        Order from:
      </div>
      
      <div className='bg-gray-200 p-2 rounded-md'>
        {/* Second line: WhatsApp */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
          <FaWhatsapp className="text-green-700" size={24} />
          <span className="text-gray-500 font-semibold text-sm sm:text-md">{whatsappNumber}</span>
        </a>
      </div>

      <div className='bg-gray-200 p-2 rounded-md'>
        {/* Third line: Phone */}
        <div className="flex items-center space-x-2">
          <FaPhone className="text-green-700" size={24} />
          <span className="text-gray-500 font-semibold text-sm sm:text-md">{phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUsBanner;
