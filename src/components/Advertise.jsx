
import React, { useState, useEffect } from 'react';

const AdvertiseBanner = ({ images, desktopHeight = '500px', mobileHeight = '250px', width = '100%' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [images]);

  const currentImage = images.length > 0 ? images[currentIndex].image : null;

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden z-9">
      {currentImage && (
        <img
          className="block mx-auto max-w-full"
          style={{ 
            height: window.innerWidth >= 768 ? desktopHeight : mobileHeight, // Switch height based on screen size
            width 
          }}
          src={currentImage}
          alt={`Banner ${currentIndex + 1}`}
        />
      )}

      {/* Navigation dots */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 bg-gray-400 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentIndex ? 'bg-green-600' : ''
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>

      {/* Navigation dots for mobile */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex lg:hidden space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 bg-gray-400 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentIndex ? 'bg-green-600' : ''
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvertiseBanner;
