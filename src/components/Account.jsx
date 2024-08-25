import React, { useState } from 'react';
import ProfileDetails from './MyProfile';
import MyOrders from './MyOrders';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col h-full">
      <nav>
        <ul className="flex space-x-2 border-b">
          <li>
          <button
  className={`px-2 py-2 font-semibold text-lg ${
    activeTab === 'profile'
      ? 'border-b-2 border-green-500 text-green-700 bg-gray-100'
      : 'text-gray-700 bg-white hover:bg-gray-200'
  } rounded-t-lg transition-colors duration-300 ease-in-out`}
  onClick={() => setActiveTab('profile')}
>
  My Profile
</button>

          </li>
          <li>
          <button
  className={`px-2 py-2 font-semibold text-lg ${
    activeTab === 'orders'
      ? 'border-b-2 border-green-500 text-green-700 bg-gray-100'
      : 'text-gray-700 bg-white hover:bg-gray-200'
  } rounded-t-lg transition-colors duration-300 ease-in-out`}
  onClick={() => setActiveTab('orders')}
>
  My Orders
</button>

          </li>
        </ul>
      </nav>
      <div className="flex-grow overflow-y-auto  max-h-[calc(100vh-150px)] md:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-250px)]">
        {activeTab === 'profile' && <ProfileDetails />}
        {activeTab === 'orders' && <MyOrders />}
      </div>
    </div>
  );
};

export default Account;
