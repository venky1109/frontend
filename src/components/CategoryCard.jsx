import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, image, className }) => {
  // Encode the category name for use in the URL
  const encodedCategoryName = encodeURIComponent(name);

  return (
    <Link to={`/category/${encodedCategoryName}`} className={`block ${className}`}>
      <div className="relative text-center mx-0 group p-1 "> {/* Decreased padding around the card */}
        {/* Image Container */}
        <div className="w-full sm:w-52 sm:h-52 max-w-full max-h-full rounded-md overflow-hidden mx-auto relative">
          {/* Apply animation to the image */}
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full rounded-md transform transition-transform duration-500 ease-out group-hover:scale-125" // Zoom effect
          />
        </div>
        {/* Category Name on the Card Below the Image */}
        {/* <div className="mt-0.5"> {/* Decreased margin-top to reduce space */}
          {/* <h1 className="text-[10px] font-serif sm:text-sm md:text-base text-red-900 semi-bold uppercase">{name}</h1> */}
        {/* </div> */} 
      </div>
    </Link>
  );
};

export default CategoryCard;
