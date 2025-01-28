import React, { useEffect, useRef, useState } from "react";

const AdvertiseSlider = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ads = [
    {
      title: "Dry Fruits",
      description: "Nourish your body with nature’s power-packed dry fruits!",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FDRYFRUITS.png?alt=media&token=16b22c59-28ad-4689-b24f-26fa38cb6a76",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Pulses",
      description: "Up to 30% Off",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FRICEANDPULSES.png?alt=media&token=aa4b615f-38fc-4876-8d1d-a114c89c5f15",
      bgColor: "bg-blue-100",
    },
    {
      title: "Cleaning Essentials",
      description: "Starting from ₹10",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FCLEANINGESSESENTIALS.png?alt=media&token=cd970a97-c1b1-47a6-be82-5bf1c7c5443b",
      bgColor: "bg-green-100",
    },
    {
      title: "Bumper Gift",
      description: "Order Now!",
      image: "https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FGIFT.png?alt=media&token=fe2983d1-055d-4171-9846-d43d0eaaf2cf",
      bgColor: "bg-red-100",
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
    <div className="relative w-full mt-4 px-4">
      {/* Responsive Layout */}
      <div
        ref={scrollContainerRef}
        className="flex lg:grid lg:grid-cols-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory space-x-6 lg:space-x-0 scrollbar-hide scroll-smooth"
      >
        {ads.map((ad, index) => (
          <div
            key={index}
            className={`relative min-w-[100%] sm:min-w-[45%] lg:min-w-0 ${ad.bgColor} rounded-2xl shadow-lg overflow-hidden snap-center group h-36 flex items-center`}
          >
             <img
    src={ad.image}
    alt={ad.title}
    className="w-1/2 h-full object-cover object-right transition-transform duration-300 group-hover:scale-105 rounded-r-2xl"
  />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-500 via-transparent to-transparent opacity-70 group-hover:opacity-80"></div>
            <div className="absolute bottom-4 left-4">
              <h2 className="text-white font-bold text-xl">{ad.title}</h2>
              <p className="text-gray-200 text-sm">{ad.description}</p>
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
