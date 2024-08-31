// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import AdvertisingBanner from '../components/Advertise';
import advertise from '../advertise';
import homeConfig from '../HomeConfig.json'; // Import JSON configuration

const HomeScreen = () => {
  const adv = advertise.find((item) => item.type === 'BodyBanner');
  const [categories, setCategories] = useState([]);

  // Fetch all categories
  const { data, isLoading, error } = useGetAllCategoriesQuery();

  useEffect(() => {
    if (data && data.categories) {
      setCategories(data.categories);
    }
  }, [data]);

  // Function to find the matching image for each category
  const getCategoryImage = (categoryName) => {
    // Find the matching category customization
    const categoryCustomization = homeConfig.sections
      .find((section) => section.type === 'category')
      ?.customization.categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );

    // Return the image URL if found; otherwise, use a default image
    return categoryCustomization ? categoryCustomization.image : 'https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/Baking_needs_300.png?alt=media&token=c1707f2a-92ab-46c5-b219-936b559cb6f2';
  };
  const categorySection = homeConfig.sections.find((section) => section.type === 'category');
  const categoryTitle = categorySection ? categorySection.title : 'Categories';

  return (
    <>
      <div className="mt-20">
        <AdvertisingBanner
          images={adv.images}
          height={adv.dimensions.height}
          width={adv.dimensions.width}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="mt-4 mb-24">
          <h2 className="text-3xl font-serif text-green-800 mb-4 semi-bold">
            {categoryTitle}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                name={category}
                image={getCategoryImage(category)} // Dynamically set the image
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeScreen;
