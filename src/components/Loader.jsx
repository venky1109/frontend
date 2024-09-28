import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <svg
        className="animate-spin h-24 w-24 text-green-700"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
        ></path>
      </svg>
    </div>
  );
};

export default Loader;
