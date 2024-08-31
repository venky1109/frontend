import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, image }) => {
  // Encode the category name for use in the URL
  const encodedCategoryName = encodeURIComponent(name);

  return (
    <Link to={`/category/${encodedCategoryName}`} className="block">
      <div className="relative bg-green-300 rounded-full shadow-lg text-center w-24 h-24 transform transition-transform duration-700 hover:scale-110 mx-auto group">
        {/* Image Container */}
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto transform transition-transform duration-700">
          <img
            src={image}
            alt={name}
            width={256}
            height={256}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Category Name Header */}
        <header className="absolute top-full left-0 w-full p-1 rounded-2xl transform transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-y-14">

          <h1 className=" font-semibold text-black bg-white z-50">{name}</h1>
        </header>
      </div>
    </Link>
  );
};

export default CategoryCard;
