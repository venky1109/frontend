import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, image, className }) => {
  const encodedCategoryName = encodeURIComponent(name);

  return (
    <Link to={`/category/${encodedCategoryName}`} className={`block min-w-0 ${className}`}>
      <div className="group h-full rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-md bg-gray-50">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            width="208"
            height="260"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            fetchpriority="auto"
          />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
