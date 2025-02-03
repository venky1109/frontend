import React from "react";

const ChildBanner = () => {
  return (
    <div className="relative bg-[#3D5300] text-white rounded-2xl shadow-lg overflow-hidden w-11/12 md:w-8/12 lg:w-6/12 mx-auto p-6">
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
        <h1 className="text-3xl lg:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent text-white">
          Get Silver Coin for every ₹5000 Purchase
        </h1>   

        {/* Subtext */}
        <ul className="text-lg text-bold mt-4 text-white list-disctext-left pl-8">
  <li>₹5000 కి పైగా కొనుగోలు చేస్తే వెండి నాణెం ఉచితం!</li>
  <li>₹2000 లేదా అంతకంటే ఎక్కువ కొనుగోలు చేసి, వైర్‌డ్ ఇయర్‌ఫోన్లు ఉచితంగా పొందండి!</li>
</ul>

        <p className="text-md rounded-md bg-[#F09319]  py-1 text-white ">త్వరపడండి... ఆఫర్ స్టాక్ ఉన్నంతవరకే!</p>
        
      
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
