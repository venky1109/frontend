import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, image, className }) => {
  const encodedCategoryName = encodeURIComponent(name);

  return (
    <Link to={`/category/${encodedCategoryName}`} className={`block ${className}`}>
      <div className="relative text-center mx-0 group p-1">
        
        {/* Fixed aspect-ratio container with reserved height */}
       <div
  className="w-full sm:w-50 max-w-full max-h-full rounded-md overflow-hidden mx-auto relative aspect-[2/3] bg-gray-100 border border-gray-300"
>
  <img
    src={image}
    alt={name}
    loading="lazy"
    decoding="async"
    width="208"
    height="308"
    className="object-cover w-full h-full rounded-md transition-transform duration-300 ease-out group-hover:-translate-y-2"
    fetchpriority="auto"
  />
</div>


        {/* Reserve space for text (helps prevent CLS) */}
        {/* <div className="mt-1 min-h-[1rem]">
          <h1 className="text-[10px] font-serif sm:text-sm md:text-base text-red-900 font-semibold uppercase">
            {name}
          </h1>
        </div> */}
      </div>
    </Link>
  );
};

export default CategoryCard;
