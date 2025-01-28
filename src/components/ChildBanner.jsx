import React from "react";

const ChildBanner = () => {
  return (
    <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white rounded-2xl shadow-lg overflow-hidden w-11/12 md:w-8/12 lg:w-6/12 mx-auto p-6">
      {/* Floating Silver Coin */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-full shadow-xl flex justify-center items-center animate-bounce">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/AdvertiseBanner%2FGIFT.png?alt=media&token=fe2983d1-055d-4171-9846-d43d0eaaf2cf"
          alt="Silver Coin"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Content */}
      <div className="text-center relative z-10">
        {/* Headline */}
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          Gift: Silver Coin for ₹5000 Purchase
        </h1>

        {/* Subtext */}
        <p className="text-lg mt-4 text-gray-300">
          <span className="font-semibold text-gray-200">
            "Timeless treasures:"
          </span>{" "}
          Get a silver coin on purchases above ₹5000!
        </p>
        <p className="text-lg mt-2 text-gray-300">
          "Celebrate every occasion with the elegance of silver – yours with a ₹5000 purchase!"
        </p>
        <p className="text-lg mt-2 text-gray-300">
          "Spend ₹5000 or more and receive a silver coin as a gift of tradition and value!"
        </p>

        {/* Call-to-Action Button */}
        <button className="mt-6 bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 hover:scale-105 shadow-lg transition-all duration-300">
          Shop Now
        </button>
      </div>

      {/* Floating Glow Circle */}
      <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-b from-gray-700 to-gray-500 rounded-full animate-pulse"></div>
    </div>
  );
};

export default ChildBanner;
