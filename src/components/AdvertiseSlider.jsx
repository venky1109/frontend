import React, { useEffect, useRef, useState } from "react";

const AdvertiseSlider = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getRandomDescription = (descriptions) => {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const ads = [
   
        {
          title: "Dry Fruits",
          description: getRandomDescription([
            "Wholesome dry fruits for a healthy boost every day!",
            "Nourish your body with nature’s power-packed dry fruits!",
            "Dry fruits: A delicious way to stay healthy and energized!",
          ]),
          image:
            "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FDRYFRUITS.png?alt=media&token=16b22c59-28ad-4689-b24f-26fa38cb6a76",
          bgColor:
            "bg-gradient-to-b from-orange-400 via-red-500 to-pink-600", // Gradient Sunset Vibes
        },
        {
          title: "Pulses",
          description: getRandomDescription([
            "Pure and protein-packed pulses for every meal!",
            "Add the goodness of premium pulses to your diet!",
            "Nutritious pulses for a healthy and balanced lifestyle!",
          ]),
          image:
            "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FRICEANDPULSES.png?alt=media&token=aa4b615f-38fc-4876-8d1d-a114c89c5f15",
          bgColor:
            "bg-gradient-to-b from-yellow-400 via-red-500 to-orange-500", // Luxury Gold
        },
        {
          title: "Cleaning Essentials",
          description: getRandomDescription([
            "Sparkle up your home with our cleaning essentials!",
            "Tough on stains, gentle on surfaces – cleaning made easy!",
            "Keep your space spotless with our reliable cleaning products!",
          ]),
          image:
            "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FCLEANINGESSESENTIALS.png?alt=media&token=cd970a97-c1b1-47a6-be82-5bf1c7c5443b",
          bgColor:
            "bg-gradient-to-b from-teal-200 via-teal-400 to-teal-600", // Minty Fresh
        },
      
    {
      title: "Bumper Gift",
      description: getRandomDescription([
        "Sparkle up your home with our cleaning essentials!",
        "Tough on stains, gentle on surfaces – cleaning made easy!",
        "Keep your space spotless with our reliable cleaning products!",
      ]),
      image:
        "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FGIFT.png?alt=media&token=fe2983d1-055d-4171-9846-d43d0eaaf2cf",
      bgColor:
        "bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700", // Energy Burst
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
    <div className="relative w-full mt-8 px-4">
    {/* Responsive Layout */}
    <div
      ref={scrollContainerRef}
      className="flex lg:grid lg:grid-cols-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory space-x-6 lg:space-x-0 scrollbar-hide scroll-smooth"
    >
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`relative min-w-[100%] sm:min-w-[45%] lg:min-w-0 ${ad.bgColor} rounded-2xl shadow-lg overflow-hidden snap-center group h-auto lg:h-48 flex`}
        >
          {/* Left: Description */}
          <div className="w-3/4 px-4 py-2 flex flex-col justify-center">
            <h2 className="text-gray-800 font-bold text-xl">{ad.title}</h2>
            <p className="text-gray-700 text-sm font-semibold">{ad.description}</p>
            <button className="mt-2 bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-600 hover:scale-105 shadow-lg transition-all duration-300">
              ORDER NOW
            </button>
          </div>
  
          {/* Right: Image */}
          <div className="w-1/4 flex items-center justify-center">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-r-2xl"
            />
          </div>
        </div>
      ))}
    </div>
  
    {/* Dots Indicator */}
    <div className="flex justify-center mt-4 space-x-2 lg:hidden">
      {ads.map((_, index) => (
        <div
          key={index}
          className={`w-1 h-1 rounded-full transition-all duration-300 ${
            index === currentIndex ? "bg-gray-900" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  </div>
  
  

  );
};

export default AdvertiseSlider;
