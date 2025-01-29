import React, { useEffect, useRef, useState } from "react";
import GoldCoinAnimation from "./GoldCoinAni";
import mhlogo from "../assets/RaithuDairyLogo150x102.png";

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
  className={`relative bg-gradient-to-b from-amber-300 via-amber-200 to-amber-300 text-white rounded-2xl shadow-lg overflow-hidden w-full py-1 md:py-6 cursor-pointer transition-all duration-500 ${
    isExpanded ? "h-auto" : "min-h-[200px]"
  }`}

        style={{
          "--banner-height": `${bannerHeight}px`,
        }}
        onClick={toggleBanner}
      >
        {/* Falling Gold Coins */}
        {!isExpanded && <GoldCoinAnimation />}

        {/* <GoldCoinAnimation /> */}
        
      
        {/* Main Content */}
        <div className="relative  text-center">
 
        <img
  src={mhlogo}
  alt="Sri Maha Lakshmi Raithu Dairy"
  className="mx-auto flex justify-center h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain py-0"
/>

        <h1 className="relative text-4xl lg:text-5xl font-extrabold uppercase tracking-wide font-anek-telugu font-semibold">
  
  <span className="relative text-green-800">
    శ్రీ మహా లక్ష్మి రైతు డైరీ
  </span>
</h1>
          <br />
          <h1 className="text-2xl lg:text-5xl uppercase tracking-wider relative font-nunito-sans font-semibold bg-clip-text animate-flashZoom drop-shadow-[2px_2px_0px_rgba(0,0,0,0.7)]">
  <span className="relative text-red-700">
    Gold Coin Offer
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
  <div className="mt-2 text-left px-4">
  <h2 className="text-2xl text-center font-nunito-sans font-bold text-yellow-800">
  ఆఫర్ వివరాలు
</h2>

<ul className="mt-1 list-disc list-inside text-lg text-gray-600 font-anekTelugu">
  <li className="pl-1 text-gray-900">
    ప్రతి నెల రూ. 3000 విలువైన కిరాణా మరియు పాలు సంవత్సరం పొడుగునా కొనుగోలు చేసే వారికి
    <span className="font-bold text-gray-900"> 1 కుపన్</span> ఇవ్వబడును.
  </li>

  <li className="pl-1 text-gray-900">
    ఆ కుపన్ మొదట <span className="font-bold text-gray-900">50 మందికి</span> మాత్రమే ఇవ్వబడును.
  </li>

  <li className="pl-1 text-gray-900">
    ఆ 50 మందిలో <span className="font-bold text-gray-900">4 కుపన్లు</span> లక్కీడ్రా ద్వారా ఎంపిక చేయబడును.
  </li>
</ul>

{/* New Section for Prizes */}
<h2 className="text-2xl text-center font-nunito-sans font-bold text-yellow-800 mt-2">
  బహుమతులు
</h2>

<ul className="mt-1 list-disc list-inside text-lg text-gray-600 font-anekTelugu">
  <li className="pl-1 text-gray-900">
    <span className="font-bold text-gray-900">మొదటి బహుమతి :</span> 1g GOLD
  </li>

  <li className="pl-1 text-gray-900">
    <span className="font-bold text-gray-900">రెండవ బహుమతి   :</span> 20g వెండి
  </li>

  <li className="pl-1 text-gray-900">
    <span className="font-bold text-gray-900">మూడవ బహుమతి :</span> 10g వెండి
  </li>

  <li className="pl-1 text-gray-900">
    <span className="font-bold text-gray-900">నాల్గవ బహుమతి   :</span>  ఏదైన ప్రత్యేక బహుమతి
  </li>

  <li className="pl-1 text-gray-900">
    <span className="font-bold text-gray-900">ప్రతి 50 మందికి:</span> ఏదొక చిన్న బహుమతి ఇవ్వబడును.
  </li>
</ul>





    {/* <p className="mt-6 text-lg text-gray-600 font-anekTelugu">
      శ్రీ మహాలక్ష్మీ రైతు డెయిరీ షాప్ దగ్గర పాలు కొనుగోలు చేసే వారు,
      ముందుగా నెల పాలు డబ్బులు అడ్వాన్స్ జమ చేసిన వారికి <span className="font-bold text-gray-900">2 రోజులు ఉచితంగా</span> పాలు ఇవ్వబడును.
    </p> */}
  
    <button className="mt-2 mb-2 mx-auto flex justify-center bg-yellow-800 text-gray-100 font-nunito-sans font-bold py-1 px-6 rounded-full hover:bg-gray-900 hover:scale-105 shadow-lg transition-all duration-300">
      SUBSCRIBE
    </button>
  

  </div>
)}

      {/* Logo Positioned Bottom Right */}
{/* Logo Positioned at the Top Center */}



      </div>
      
      
    );
  };
  
  export default MegaBanner;


 