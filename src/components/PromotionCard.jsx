import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const PromotionCard = ({ title, description, image }) => {
  const navigate = useNavigate();
  const encodedCategoryName = encodeURIComponent(title);

  const handleShopNowClick = (e) => {
    // Prevent the outer link from being triggered
    e.preventDefault();
    navigate('/promotion');
  };

  return (
    <Link to={`/category/${encodedCategoryName}`}>
      <div
        className="relative w-32 h-32 sm:w-72 sm:h-72 overflow-hidden rounded-full shadow-lg flex items-center justify-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5">
          {/* Overlay with semi-transparent background */}
          <div className="text-center text-white p-1 sm:p-4">
          <h2 className="p-2 mt-9 rounded-lg bg-gray-100 text-black border-2 text-xs leading-[12px] sm:text-lg sm:leading-[24px] font-bold mb-1 sm:mb-2">
              {title}
            </h2>
            <div className='mt-2'>    
            <button
              onClick={handleShopNowClick}
              className="mt-5  text-[10px] sm:text-xs px-1 py-1 sm:px-2 sm:py-1 bg-white text-purple-600 font-semibold rounded-md shadow-md hover:bg-purple-100"
            >
              Shop Now
            </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromotionCard;
