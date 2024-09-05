import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PromotionCard = ({ title, description, image }) => {
  return (
    <div
      className="relative w-32 h-32 sm:w-72 sm:h-72 overflow-hidden rounded-full shadow-lg flex items-center justify-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {/* Overlay with semi-transparent background */}
        <div className="text-center text-white p-1 sm:p-4">
          <h2 className="text-xs leading-[12px] sm:text-xl sm:leading-[24px] font-bold mb-1 sm:mb-2">{title}</h2> {/* Smaller title for mobile */}
          <p className="text-[7px] leading-[15px] sm:text-base sm:leading-[24px] mb-1 sm:mb-4">{description}</p> {/* Smaller description for mobile */}
          <Link
            to="/promotion"
            className="text-[10px] sm:text-sm px-2 py-1 sm:px-4 sm:py-2 bg-white text-purple-600 font-semibold rounded-md shadow-md hover:bg-purple-100"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
