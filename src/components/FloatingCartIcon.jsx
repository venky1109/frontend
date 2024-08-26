// import React, { useEffect, useState } from 'react';
// import { FaShoppingBag } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const FloatingCartIcon = () => {
//   const { cartItems } = useSelector((state) => state.cart);
//   const [isFooterVisible, setFooterVisible] = useState(false);

//   useEffect(() => {
//     const footer = document.querySelector('footer'); // Assuming your footer element is a <footer> tag

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setFooterVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 } // Adjust the threshold if needed
//     );

//     if (footer) {
//       observer.observe(footer);
//     }

//     return () => {
//       if (footer) {
//         observer.unobserve(footer);
//       }
//     };
//   }, []);

//   return (
//     <div className={`fixed right-5 inset-y-1/2 z-50 lg:block ${isFooterVisible ? 'hidden' : 'block'}`}>
//       <Link to="/cart" className="relative">
//         <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600">
//           <FaShoppingBag className="text-2xl" />
//           {cartItems.length > 0 && (
//             <span className="absolute top-0 right-0 inline-block w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//               {cartItems.length}
//             </span>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default FloatingCartIcon;


// import React, { useEffect, useState } from 'react';
// import { FaShoppingBag } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const FloatingCartIcon = () => {
//   const { cartItems } = useSelector((state) => state.cart);
//   const [isFooterVisible, setFooterVisible] = useState(false);

//   // Calculate total price
//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.dprice * item.qty,
//     0
//   );

//   useEffect(() => {
//     const footer = document.querySelector('footer'); // Assuming your footer element is a <footer> tag

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setFooterVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 } // Adjust the threshold if needed
//     );

//     if (footer) {
//       observer.observe(footer);
//     }

//     return () => {
//       if (footer) {
//         observer.unobserve(footer);
//       }
//     };
//   }, []);

//   return (
//     <div className={`fixed right-5 inset-y-1/2 z-50 lg:block ${isFooterVisible ? 'hidden' : 'block'}`}>
//       <Link to="/cart" className="relative">
//         <div className="flex items-center justify-center w-14 h-16 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out">
//           <FaShoppingBag className="text-2xl" />
//           {cartItems.length > 0 && (
//             <>
//               <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
//                 {cartItems.length}
//               </span>
//               <span className="absolute -bottom-5  bg-white text-green-600 text-sm font-semibold px-2 py-1 rounded-lg shadow-md">
//                 ₹{totalPrice}
//               </span>
//             </>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default FloatingCartIcon;

import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FloatingCartIcon = React.forwardRef((props, ref) => {
  const { cartItems } = useSelector((state) => state.cart);
  const [isFooterVisible, setFooterVisible] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.dprice * item.qty,
    0
  );

  useEffect(() => {
    const footer = document.querySelector('footer'); // Assuming your footer element is a <footer> tag

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust the threshold if needed
    );

    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <div className={`fixed right-5 inset-y-1/2 z-50 lg:block ${isFooterVisible ? 'hidden' : 'block'}`}>
      <Link to="/cart" className="relative" ref={ref}>
        {/* <div className="flex items-center justify-center w-14 h-16 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"> */}
        <div className="flex items-center justify-center w-14 h-16 bg-yellow-700 text-white rounded-lg shadow-lg hover:bg-yellow-800 transition duration-300 ease-in-out">
          <FaShoppingBag className="text-2xl" />
          {cartItems.length > 0 && (
            <>
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                {cartItems.length}
              </span>
              <span className="absolute -bottom-5  bg-white text-green-600 text-sm font-semibold px-2 py-1 rounded-lg shadow-md">
                ₹{totalPrice}
              </span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
});

export default FloatingCartIcon;
