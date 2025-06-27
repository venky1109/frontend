import React, { useEffect, useRef, useState } from "react";
import mhlogo from "../assets/RaithuDairyLogo150x102.png";

const MegaBanner = () => {
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, []);

  const toggleBanner = () => setIsExpanded((prev) => !prev);

  return (
    <div
      ref={bannerRef}
      className={`relative bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 text-white rounded-2xl shadow-lg overflow-hidden w-full py-2 md:py-6 cursor-pointer transition-all duration-500 ${
        isExpanded ? "h-auto" : "min-h-[240px]"
      }`}
      style={{
        "--banner-height": `${bannerHeight}px`,
      }}
      onClick={toggleBanner}
    >
      {/* Content */}
      <div className="text-center px-4">
        {/* Logo */}
        <img
          src={mhlogo}
          alt="Sri Maha Lakshmi Raithu Dairy"
          className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain"
          loading="lazy"
          decoding="async"
          width="96"
          height="96"
        />

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-bold leading-snug text-green-800 font-anek-telugu mt-2">
          శ్రీ మహా లక్ష్మీ రైతు డైరీ
        </h1>

        {/* Subheadline */}
        <h2 className="text-xl md:text-3xl uppercase font-bold text-red-600 font-nunito-sans mt-1 animate-flashZoom">
          Gold Coin Offer
        </h2>

        {/* Note */}
        <p className="text-sm text-green-800 mt-1">
          మొదటి 50 మందికి ప్రత్యేకమైన ఆఫర్!
        </p>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 text-left px-4">
          <h2 className="text-xl text-center font-bold text-yellow-800 font-nunito-sans">
            ఆఫర్ వివరాలు
          </h2>
          <ul className="list-disc text-gray-800 text-md font-anekTelugu mt-2 space-y-1 pl-6">
            <li>
              ప్రతి నెల రూ. 3000 విలువైన కిరాణా మరియు పాలు సంవత్సరం పొడుగునా కొనుగోలు చేసే వారికి <b>1 కుపన్</b> ఇవ్వబడును.
            </li>
            <li>ఆ కుపన్ మొదట <b>50 మందికి</b> మాత్రమే ఇవ్వబడును.</li>
            <li>ఆ 50 మందిలో <b>4 కుపన్లు</b> లక్కీడ్రా ద్వారా ఎంపిక చేయబడును.</li>
          </ul>

          <h3 className="text-xl text-center font-bold text-yellow-800 font-nunito-sans mt-4">
            బహుమతులు
          </h3>
          <ul className="list-disc text-gray-800 text-md font-anekTelugu mt-2 space-y-1 pl-6">
            <li><b>మొదటి బహుమతి :</b> 1g GOLD</li>
            <li><b>రెండవ బహుమతి :</b> 20g వెండి</li>
            <li><b>మూడవ బహుమతి :</b> 10g వెండి</li>
            <li><b>నాల్గవ బహుమతి :</b> ఏదైన ప్రత్యేక బహుమతి</li>
            <li><b>ప్రతి 50 మందికి:</b> ఏదొక చిన్న బహుమతి ఇవ్వబడును.</li>
          </ul>

          <h4 className="text-center text-green-800 font-bold text-lg mt-4">
            📞 మరిన్ని వివరాల కోసం సంప్రదించండి: <i>8121774325</i>
          </h4>
        </div>
      )}
    </div>
  );
};

export default MegaBanner;
