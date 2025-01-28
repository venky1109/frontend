import React, { useEffect, useRef, useState } from "react";
import GoldCoinAnimation from "./GoldCoinAni";
import mhlogo from "../assets/RaithuDairyLogo444x336.jpeg";

const MegaBanner = () => {
    const bannerRef = useRef(null);
    const [bannerHeight, setBannerHeight] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false); // Track whether the banner is expanded

    // Measure the banner height
    useEffect(() => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.offsetHeight);
      }
    }, []);
  
    // Handle banner click
    const toggleBanner = () => {
      setIsExpanded((prev) => !prev);
    };
  
    // Measure the banner height
    useEffect(() => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.offsetHeight);
      }
    }, []);
  
    return (
        <div
  ref={bannerRef}
  className={`relative bg-gradient-to-b from-green-400 via-green-500 to-teal-600 text-white rounded-2xl shadow-lg overflow-hidden w-full py-8 md:py-6 cursor-pointer transition-all duration-500 ${
    isExpanded ? "h-auto" : "min-h-[200px]"
  }`}

        style={{
          "--banner-height": `${bannerHeight}px`,
        }}
        onClick={toggleBanner}
      >
        {/* Falling Gold Coins */}
        {!isExpanded && <GoldCoinAnimation />}
      
        {/* Main Content */}
        <div className="relative z-10 text-center">
          <h1 className="relative text-4xl lg:text-5xl font-extrabold uppercase tracking-wide">
            <span className="relative text-orange-900">
              శ్రీ మహాలక్ష్మి రైతు డెయిరీ
            </span>
          </h1>
          <br />
          <h1 className="text-4xl lg:text-6xl uppercase tracking-wider relative font-extrabold bg-clip-text animate-flashZoom drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]">
            <span className="relative text-orange-100">
              బంగారు నాణెం ఆఫర్
            </span>
          </h1>
      
          {/* <p className="text-lg mt-4 text-gray-100">
            Subscribe to our{" "}
            <span className="font-semibold text-yellow-300">Daily Milk Package</span>{" "}
            now and enjoy amazing savings!
          </p>
      
          {!isExpanded && (
            <button className="mt-6 bg-orange-700 text-white font-bold py-2 px-4 rounded-full hover:bg-yellow-500 hover:scale-105 shadow-lg transition-all duration-300 mx-auto block">
              ORDER
            </button>
          )} */}
        </div>
        {isExpanded && (
    <div className="mt-6 text-center">
      <h2 className="text-2xl font-bold text-yellow-300">Offer Details</h2>
      <p className="mt-4 text-lg text-gray-100">
        With our Daily Milk Package, you’ll receive fresh milk daily and have
        a chance to win a <span className="font-bold text-yellow-300">gold coin</span> every month!
      </p>
      <button className="mt-6 bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-600 hover:scale-105 shadow-lg transition-all duration-300">
        Learn More
      </button>
    </div>
  )}
        {/* Logo Positioned Bottom Right */}
        <img
          src={mhlogo}
          alt="Sri Maha Lakshmi Raithu Dairy"
          className="absolute bottom-1 right-2 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
        />
      </div>
      
      
    );
  };
  
  export default MegaBanner;


 