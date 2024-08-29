// export const BASE_URL = process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
// // export const BASE_URL = ''; // If using proxy
// export const BASE_URL =
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost:5000' // Backend in development
//     : 'http://localhost:5000'; // Backend in production (for local testing)

// export const PRODUCTS_URL = '/api/products';
// export const USERS_URL = '/api/users';
// export const ORDERS_URL = '/api/orders';
// export const PAYPAL_URL = '/api/config/paypal';


export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? ''  // Local backend server in development
    : 'https://mkbackend.onrender.com';  // Replace with the correct backend URL for production

export const PRODUCTS_URL = `${BASE_URL}/api/products`;
export const USERS_URL = `${BASE_URL}/api/users`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;

