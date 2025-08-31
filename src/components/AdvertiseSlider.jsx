import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

const AdvertiseSlider = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const getRandomDescription = (descriptions) =>
    descriptions[Math.floor(Math.random() * descriptions.length)];

  const handleCategoryCardClick = useCallback((categoryName) => {
    navigate(`/category/${categoryName}`);
  }, [navigate]);

  const ads = [
    {
      title: "Dry Fruits",
      categoryName: "DRYFRUITS",
      description: getRandomDescription([
        "Cashew, Walnuts & more!",
        "Almonds, Raisins & more!",
        "Healthy Dates, Pistachios & more!",
      ]),
      discount: "60%",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FDRYFRUITS.webp?alt=media&token=93f0dc16-63d1-4ee8-b951-c68037d7ae4c",
      bgColor: "bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700",
    },
    {
      title: "Rice & Pulses",
      categoryName: "RICE & PULSES",
      description: getRandomDescription([
        "Toor Dal, Moong Dal & more!",
        "Basmati, Sona Masoori & more!",
        "Organic Lentils & more!",
      ]),
      discount: "50%",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FRICEANDPULSES.webp?alt=media&token=605accfe-12f8-4225-b394-7d0d81ac909b",
      bgColor: "bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500",
    },
    {
      title: "Cleaning Essentials",
      categoryName: "CLEANING ESSENTIALS",
      description: getRandomDescription([
        "Detergents, Floor Cleaners & more!",
        "Surface Cleaners, Disinfectants & more!",
        "Bathroom Cleaners, Dishwash Liquids & more!",
      ]),
      discount: "40%",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FCLEANINGESSESENTIALS.webp?alt=media&token=ca572b39-dfb0-4918-9a1f-df25cb34104e",
      bgColor: "bg-gradient-to-b from-teal-500 via-teal-400 to-teal-500",
    },
    {
      title: "EGGS & DAIRY",
      categoryName: "Eggs & Dairy",
      description: getRandomDescription([
        "Fresh Milk, Paneer & more!",
        "Eggs, Butter, Cheese & more!",
        "Pure Ghee, Curd & more!",
      ]),
      discount: "20%",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FEGGS%20%26DAIRY.webp?alt=media&token=d0a016b7-e036-4b99-9974-1fb3f122f70e",
      bgColor: "bg-gradient-to-b from-cyan-500 via-cyan-400 to-cyan-500",
    },
  ];

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      setCurrentIndex(nextIndex);
      scrollContainerRef.current?.scrollTo({
        left: scrollContainerRef.current.children[nextIndex].offsetLeft,
        behavior: "smooth",
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, ads.length]);

  return (
    <div className="relative w-full mt-3 px-4">
      <div
        ref={scrollContainerRef}
        className="flex lg:grid lg:grid-cols-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory space-x-6 lg:space-x-0 scrollbar-hide scroll-smooth h-52"
      >
        {ads.map((ad, index) => (
          <div
            key={index}
            onClick={() => handleCategoryCardClick(ad.categoryName)}
            className={`relative min-w-[100%] sm:min-w-[45%] lg:min-w-0 ${ad.bgColor} rounded-2xl shadow-lg overflow-hidden snap-center group h-52 flex lg:flex-col`}
          >
            {/* Desktop View */}
            <div className="hidden lg:flex flex-col justify-between p-4 h-full w-full">
              <div>
                <h2 className="font-bold text-lg text-white mb-1">{ad.title}</h2>
                <p className="text-sm font-medium text-white">{ad.description}</p>
                <p className="text-xl font-bold mt-1">
                  <span className="text-white">UP TO </span>
                  <span className="text-yellow-200 text-3xl">{ad.discount}</span>
                  <span className="text-white"> OFF</span>
                </p>
              </div>
              <div className="flex justify-between items-center gap-2 mt-2">
                <img
                  src={ad.image}
                  alt={ad.title}
                  loading="lazy"
                  className="w-24 h-24 object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryCardClick(ad.categoryName);
                  }}
                  className="text-xs bg-white text-black font-semibold px-2 py-1 rounded-full hover:bg-yellow-400 hover:scale-105 shadow-md transition"
                >
                  SHOP NOW
                </button>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden w-3/4 px-4 py-2 flex flex-col justify-center text-white">
              <h2 className="font-bold text-2xl">{ad.title}</h2>
              <p className="text-sm font-semibold">{ad.description}</p>
              <p className="text-xl font-bold mt-1">
                <span className="text-white">UP TO </span>
                <span className="text-yellow-200 text-3xl">{ad.discount}</span>
                <span className="text-white"> OFF</span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryCardClick(ad.categoryName);
                }}
                className="w-1/2 mt-2 text-xs bg-gray-100 text-blue-900 font-bold py-1 px-2 rounded-full hover:bg-yellow-600 hover:scale-105 shadow-lg transition-all duration-300"
              >
                SHOP NOW
              </button>
            </div>

            <div className="lg:hidden w-1/2 flex items-center justify-center">
              <img
                src={ad.image}
                alt={ad.title}
                loading="lazy"
                className="w-24 h-24 object-contain rounded-r-2xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvertiseSlider;
