import React from "react";

const GoldCoinAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="absolute w-8 h-8 bg-gradient-to-t from-yellow-300 to-yellow-400 rounded-full shadow-md animate-fall-bounce"
          style={{
            left: `${Math.random() * 100}%`, // Random horizontal position
            animationDelay: `${Math.random() * 2}s`, // Random start delay
          }}
        >{/* Gold Coin 3D Effect */}
        <div className="relative w-10 h-10 rounded-full animate-fall-bounce-3d">
          {/* Front Face */}
          <div className="absolute  inset-0 bg-gradient-to-t from-yellow-500 via-yellow-300 to-yellow-200 rounded-full shadow-lg border border-yellow-700 flex justify-center items-center">
            🪙 {/* Gold Coin Emoji as Icon */}
          </div>

          {/* Edge (Simulates Thickness) */}
          {/* <div className=" inset-0 w-7 bg-yellow-700 rounded-full transform rotate-y-90"></div> */}

          {/* Back Face */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-yellow-300 to-yellow-400 rounded-full shadow-lg transform rotateY-180"></div> */}
        </div></div>
      ))}
    </div>
  );
};

export default GoldCoinAnimation;
