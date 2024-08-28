import React from 'react';
import logo from '../assets/ManaKiranaLogoWithName.png';

const PrintableOrderDetails = ({ order }) => {
  return (
    <div id="printable-content" className="p-4 mt-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Mana Kirana Logo" className="w-2 h-2 mr-1" />
          <div>
            <h2 className="text-xl font-bold">Mana Kirana</h2>
            <p className="text-sm text-gray-600">
              <i>
                <u>manakirana.online</u>
              </i>
            </p>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-semibold mt-4">Invoice Number: {order._id}</h4>

      <h3 className="text-lg font-semibold mt-4">
        <u>Shipping Details</u>
      </h3>
      <p className="text-sm mt-1">
        <strong>Name: </strong> {order.user.name}
      </p>
      <p className="text-sm mt-1">
        <strong>Phone Number: </strong>
        <a href={`call to:${order.user.phoneNo}`} className="text-blue-600">
          {order.user.phoneNo}
        </a>
      </p>
      <p className="text-sm mt-1">
        <strong>Address:</strong> {order.shippingAddress.address},{' '}
        {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
        {order.shippingAddress.country}
      </p>

      <h3 className="text-lg font-semibold mt-4">
        <u>Order Items</u>
      </h3>
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">ITEM TYPE/Brand Name</th>
            <th className="p-2 border">WEIGHT</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">RATE</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.brand}</td>
              <td className="p-2 border">{item.quantity}{item.units}</td>
              <td className="p-2 border">{item.qty}</td>
              <td className="p-2 border">
                {item.qty} x &#x20b9;{item.price}
              </td>
              <td className="p-2 border">
                &#x20b9;{(item.price * item.qty).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" className="text-right p-2 border font-bold">
              Total:
            </td>
            <td className="p-2 border font-bold">
              &#x20b9;{Math.round(order.orderItems.reduce((total, item) => total + item.price * item.qty, 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintableOrderDetails;
