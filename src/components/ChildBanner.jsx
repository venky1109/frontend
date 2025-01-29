import React from "react";

const ChildBanner = () => {
  return (
    <div className="relative bg-gradient-to-b from-cyan-600 via-cyan-500 to-cyan-600 text-white rounded-2xl shadow-lg overflow-hidden w-11/12 md:w-8/12 lg:w-6/12 mx-auto p-6">
      {/* Floating Silver Coin */}
      {/* <div className="absolute -top-0 -left-0 w-24 h-24 bg-gradient-to-t from-gray-400 to-gray-300 rounded-full shadow-xl flex justify-center items-center animate-bounce">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FGIFT.png?alt=media&token=fe2983d1-055d-4171-9846-d43d0eaaf2cf"
          alt="Silver Coin"
          className="w-32 h-32 object-contain"
        />
      </div> */}

      {/* Content */}
      <div className="text-center relative">
        {/* Headline */}
        <h1 className="text-3xl lg:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          Get Silver Coin for every ₹5000 Purchase
        </h1>   

        {/* Subtext */}
        <p className="text-lg mt-4 text-gray-100">
          {/* <span className="font-semibold text-gray-100">
            "అమూల్యమైన బహుమతి:"
          </span>{" "} */}
          ₹5000 కి పైగా కొనుగోలు చేస్తే వెండి నాణెం ఉచితం!
        </p>

        <p className="text-lg mt-4 text-gray-100">
        {/* <span className="font-semibold text-gray-100">
            "అమూల్యమైన బహుమతి:"
          </span>{" "} */}
          "₹2000 లేదా అంతకంటే ఎక్కువ కొనుగోలు చేసి, వైర్‌డ్ ఇయర్‌ఫోన్లు ఉచితంగా పొందండి!"
        </p>
        <p className="text-md rounded-md bg-gray-200 font-semibold text-yellow-600 animate-flashZoom">త్వరపడండి... ఆఫర్ స్టాక్ ఉన్నంతవరకే!</p>
        
        {/* Call-to-Action Button */}
        <button className="mt-3 bg-gray-100 text-gray-800 font-bold py-1 px-8 rounded-full hover:bg-gray-200 hover:scale-105 shadow-lg transition-all duration-300">
          Shop Now
        </button>
      </div>

      
  
  
    {/* <img
      src="https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FGIFT.png?alt=media&token=fe2983d1-055d-4171-9846-d43d0eaaf2cf"
      alt="Silver Coin"
      className="absolute bottom-4 right-1 w-20 h-22 object-contain"
    />
 

 */}

      
    </div>
  );
};

export default ChildBanner;
