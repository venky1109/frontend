import React, { useEffect, useRef, useState ,useCallback} from "react";
import { useNavigate } from 'react-router-dom';


const AdvertiseSlider = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getRandomDescription = (descriptions) => {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };
    const navigate = useNavigate();
 const handleCategoryCardClick = useCallback((categoryName) => {
    navigate(`/category/${categoryName}`);
  }, [navigate]);
  
  const ads = [
   
    {
      title: "Dry Fruits",
      categoryName: "DRYFRUITS",
      description: (
        <span>
          {getRandomDescription([
            "Cashew, Walnuts & more!",
            "Almonds, Raisins & more!",
            "Healthy Dates, Pistachios & more!",
          ])}
          <br />
          <span className="font-bold text-2xl">
            <span className="text-gray-800">UP TO</span>{" "}
            <span className="text-gray-100 text-5xl">60%</span>{" "}
            <span className="text-gray-800">OFF</span>
          </span>
        </span> 
      ),
  image:
    "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FDRYFRUITS.png?alt=media&token=16b22c59-28ad-4689-b24f-26fa38cb6a76",
  bgColor:
    "bg-gradient-to-b from-green-800 via-green-700 to-green-800", // Gradient Sunset Vibes
},

  {
      title: "Rice & Pulses",
      categoryName: "RICE & PULSES",
      description: (
        <span>
          {getRandomDescription([
            "Toor Dal, Moong Dal & more!",
            "Basmati, Sona Masoori & more!",
            "Organic Lentils & more!",
          ])}
          <br />
          <span className="font-bold text-2xl">
            <span className="text-gray-800">UP TO</span>{" "}
            <span className="text-gray-100 text-5xl">50%</span>{" "}
            <span className="text-gray-800">OFF</span>
          </span>
        </span>
      ),
    image:
      "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FRICEANDPULSES.png?alt=media&token=aa4b615f-38fc-4876-8d1d-a114c89c5f15",
    bgColor:
      "bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500", // Luxury Gold
  },

  {
    title: "Cleaning Essentials",
    categoryName: "CLEANING ESSENTIALS",
    description: (
      <span>
        {getRandomDescription([
          "Detergents, Floor Cleaners & more!",
          "Surface Cleaners, Disinfectants & more!",
          "Bathroom Cleaners, Dishwash Liquids & more!",
        ])}
        <br />
        {/* Uncomment below if you want to show the discount */}
        
        <span className="font-bold text-2xl">
          <span className="text-black">UP TO</span>{" "}
          <span className="text-gray-100 text-5xl">40%</span>{" "}
          <span className="text-black">OFF</span>
        </span>
       
      </span>
    ),
    image:
      "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FCLEANINGESSESENTIALS.png?alt=media&token=cd970a97-c1b1-47a6-be82-5bf1c7c5443b",
    bgColor:
      "bg-gradient-to-b from-teal-600 via-teal-500 to-teal-600", // Minty Fresh
  },

  {
    title: "Eggs & Dairy",
    categoryName: "EGGS & DAIRY",
    description: (
      <span>
        {getRandomDescription([
          "Fresh Milk, Paneer & more!",
          "Eggs, Butter, Cheese & more!",
          "Pure Ghee, Curd & more!",
        ])}
        <br />
        <span className="font-bold text-2xl">
          <span className="text-gray-800">UP TO</span>{" "}
          <span className="text-gray-100 text-5xl">20%</span>{" "}
          <span className="text-gray-800">OFF</span>
        </span>
      </span>
    ),
image:
  "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/category%2FEGGS%20%26DAIRY.png?alt=media&token=30b3b784-fa8b-4848-bc20-1e7b51e378ae",
bgColor:
  "bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500", // Energy Burst
},
];
  

  // Auto Scroll Function
  useEffect(() => {
    if (window.innerWidth >= 1024) return; // Disable auto-scroll for large screens

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
    {/* Responsive Layout */}
    <div
      ref={scrollContainerRef}
      className="flex lg:grid lg:grid-cols-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory space-x-6 lg:space-x-0 scrollbar-hide scroll-smooth"
    >
      {ads.map((ad, index) => (
        <div
          key={index}
          onClick={() => handleCategoryCardClick(ad.categoryName)}
          className={`relative min-w-[100%] sm:min-w-[45%] lg:min-w-0 ${ad.bgColor} rounded-2xl shadow-lg overflow-hidden snap-center group h-auto lg:h-48 flex`}
        >
          {/* Left: Description */}
          <div className="w-3/4 px-4 py-2 flex flex-col justify-center">
            <h2 className="text-gray-100 font-bold text-2xl">{ad.title}</h2>
            <p className="text-gray-100 text-sm font-semibold">{ad.description}</p>
            <button 
  className="w-1/2 mt-2 text-[10px] bg-gray-100 text-blue-900 font-bold py-1 px-1 rounded-full 
  hover:bg-yellow-600 hover:scale-105 shadow-lg transition-all duration-300"
  onClick={() => handleCategoryCardClick(ad.categoryName)}
>
  SHOP NOW
</button>

          </div>
  
          {/* Right: Image */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full object-contain transition-transform duration-400 group-hover:scale-105 rounded-r-2xl"
            />
          </div>
        </div>
      ))}
    </div>
  
    {/* Dots Indicator */}
    {/* <div className="flex justify-center mt-4 space-x-2 lg:hidden">
      {ads.map((_, index) => (
        <div
          key={index}
          className={`w-1 h-1 rounded-full transition-all duration-300
            
             ${
            index === currentIndex ? "bg-gray-900" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div> */}
  </div>
  
  

  );
};

export default AdvertiseSlider;
