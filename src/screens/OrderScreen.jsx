import React, { useRef , useEffect,useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading: queryLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const printableContentRef = useRef(null);
  const [loading, setLoading] = useState(true); // Track loading manually
   // Conditionally set formattedOrderDate to avoid accessing order.createdAt before order is defined
   useEffect(() => {
    setLoading(true); // Set to true whenever orderId changes
    refetch().then(() => setLoading(false)); // Refetch and update loading state
  }, [orderId, refetch]);
   const formattedOrderDate = order ? new Date(order.createdAt).toLocaleDateString('en-GB', { 
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-') : '';

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handlePrint = () => {
    const printContents = printableContentRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .text-right { text-align: right; }
            .print-header { text-align: right; margin-bottom: 20px; }
            .print-header img { max-width: 50px; }
            .print-footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
            .thank-you { font-weight: bold; font-size: 1.1em; }
            @media screen {
              .print-only { display: none !important; }
            }
            @media print {
              .print-only { display: block !important; }
              .screen-only { display: none !important; }
            }
              .print-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .print-header h2 {
    flex: 1;
    text-align: center;
     align-self: flex-end;
    margin: 0;
  }
  .print-header img {
    max-width: 150px;
    align-self: flex-end;
  }
    .header-line {
    border: 0;
    border-top: 2px solid #ddd; /* Adjust thickness and color */
    margin: 10px 0;
  }
          </style>
        </head>
        <body>
          <div class="print-header">
  <h2>Invoice</h2>
  <img src="/images/ManaKiranaLogo1024x1024.png" alt="Company Logo" /> <!-- Replace with actual logo path -->
  
</div>
<hr class="header-line">

  
          ${printContents}
  
          <div class="print-footer">
            <p class="thank-you">Thank you for your Shopping!</p>
            <p>If you have any questions, feel free to contact us at customercare@manakirana.online</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  if (loading || queryLoading) return <Loader />; // Use either loading state or queryLoading

  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  return (
    <>
      

      {/* Printable Section */}
      <div ref={printableContentRef}>
      {/* <h1 className="text-2xl font-semibold mt-20">
       
      </h1> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mt-24 mb-20">
          <div className="md:col-span-2">
            {/* Customer and supplier details */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <strong className="text-lg font-semibold"><u>Bill To/Ship To:</u></strong>
              <div>
              <strong className="text-md font-semibold"><i>Invoice Details:</i></strong>
              <p><strong className="text-md font-semibold">Invoice Date:</strong> {formattedOrderDate}</p>
</div>
              <p>
  {order.isPaid ? <strong className="text-md font-semibold">Invoice Number</strong> : <strong>Order Number</strong>}: {order._id}
</p>
<strong className="text-md font-semibold"><i>Customer Details:</i></strong>
              <p><strong className="text-md font-semibold">Name: </strong>{order.user.name}</p>
              <p><strong className="text-md font-semibold">Phone Number: </strong><a href={`tel:${order.user.phoneNo}`}>{order.user.phoneNo}</a></p>
              <p><strong className="text-md font-semibold">Address: </strong>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
            </div>

            {/* Supplier Details */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <strong className="text-lg font-semibold"><u>Supplier Details:</u></strong>
              <p className='text-md font-semibold'>MANA KIRANA</p>
              <p>5-85, Uppalaguptham, Near Laxmi Cheruvu, </p><p>Amalapuram, Samanasa, Dr BR Ambedkar Konaseema,</p><p> Andhra Pradesh, 533213</p>
              <p><strong>GSTIN/UIN:</strong> 37AHPPV7362L1ZA</p>
              <p><strong><i>fassai License Number:</i></strong>10124999000130</p>
              <p><strong>For feedback/Complaints</strong></p>
              <p><strong>Email:</strong> <a href="mailto:customercare@manakirana.online" className="text-blue-600">customercare@manakirana.online</a></p>
              <p><strong>Call:</strong> <a href="tel:08856297898" className="text-blue-600">08856-297898</a></p>

              {/* Payment Status */}
              {order.isPaid ? (
                <Message variant="success"><strong>Payment Status:</strong> Paid</Message>
              ) : (
                <Message variant="info">
                  <b>Please Pay Amount of <span className="text-brown-600">&#x20b9;{order.totalPrice}</span> at Delivery time</b>
                </Message>
              )}
            </div>

            {/* Order Items Section */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200">
    <thead>
    <tr>
        <th className="text-left px-4 py-2 min-w-[150px] text-sm sm:text-base">Name</th>
        <th className="px-4 py-2 min-w-[120px] text-sm sm:text-base">Brand</th>
        <th className="px-4 py-2 min-w-[80px] text-sm sm:text-base">Weight</th>
        <th className="px-4 py-2 min-w-[80px] text-sm sm:text-base">Qty</th>
        <th className="px-4 py-2 min-w-[80px] text-sm sm:text-base">Price</th>
        <th className="px-4 py-2 min-w-[120px] text-sm sm:text-base">Qty x Price</th>
        <th className="px-4 py-2 min-w-[100px] text-sm sm:text-base">Total</th>
      </tr>
    </thead>
    <tbody>
      {order.orderItems.map((item, index) => (
        <tr key={index} className="text-sm sm:text-base">
          <td className="text-left px-2 py-2">{item.name}</td>
          <td className="px-2 py-2">{item.brand}</td>
          <td className="px-2 py-2">{item.quantity} {item.units}</td>
          <td className="px-2 py-2">{item.qty}</td>
          <td className="px-2 py-2">&#x20b9;{item.price}</td>
          <td className="px-2 py-2">{item.qty} x &#x20b9;{item.price}</td>
          <td className="px-2 py-2">&#x20b9;{item.price * item.qty}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


              )}
            </div>

            {/* Order Progress Track with Green Progress Line */}
            
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <table className="min-w-full border border-gray-200 mb-4">
              <tbody>
                <tr>
                  <td className="text-left">Total Products Price</td>
                  <td>&#x20b9;{order.itemsPrice}</td>
                </tr>
                <tr>
                  <td className="text-left">Shipping</td>
                  <td>&#x20b9;{order.shippingPrice}</td>
                </tr>
                <tr>
                  <td className="text-left"><strong>Grand Total</strong></td>
                  <td><strong>&#x20b9;{order.totalPrice}</strong></td>
                </tr>
              </tbody>
            </table>
            </div>

            {/* Share and Print Buttons */}
            <div className="print-only screen-only">
            {/* <div className="flex gap-4 mt-4"> */}
              {/* <button onClick={handleNativeShare} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">
                Share
              </button> */}
             
            {/* </div> */}

            {/* Continue Shopping Button */}
            <button onClick={handleContinueShopping} className="bg-green-800 text-white py-2 px-4 rounded mt-4 w-full hover:bg-green-600">
              Continue Shopping
            </button>
            <div className="flex justify-center mt-5">
  <button
    onClick={handlePrint}
    className="bg-green-900 text-white py-2 px-4 rounded hover:bg-green-500"
  >
    Print Invoice
  </button>
</div>


            <div className="bg-white mt-4 p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">Order Track</h2>
              <div className="text-gray-500">
                {order.isDelivered ? (
                  <Message variant="success">Order Delivered</Message>
                ) : order.isDispatched ? (
                  <Message variant="info">Order Dispatched and Delivery In Progress</Message>
                ) : order.isPacked ? (
                  <Message variant="info">Order Packed and Ready for Dispatch</Message>
                ) : (
                  <Message variant="info"><b>Order Successfully Placed and Packing In Progress</b></Message>
                )}
              </div>

              {/* Vertical Progress Bar with Milestones */}
              <div className="relative w-1/2 mx-auto mt-4">
                {/* Background Red Line */}
                <div className="absolute top-0 left-1 w-2 bg-red-500 h-full rounded"></div>

                {/* Green Progress Line */}
                <div
                  className="absolute top-0 left-1 w-2 bg-green-500 rounded transition-all duration-500"
                  style={{
                    height: order.isDelivered
                      ? '100%'    // 100% if delivered
                      : order.isPaid
                      ? '85%'     // 85% if paid
                      : order.isDispatched
                      ? '65%'     // 65% if dispatched
                      : order.isPacked
                      ? '50%'     // 50% if packed
                      : '25%',    // 25% if placed
                  }}
                ></div>

                {/* Milestones */}
                <div className="relative flex flex-col items-start space-y-8 mt-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${order ? 'bg-green-800' : 'bg-red-800'}`}></div>
                    <span className="text-sm font-semibold text-gray-500">Order Placed</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${order.isPacked ? 'bg-green-800' : 'bg-red-800'}`}></div>
                    <span className="text-sm font-semibold text-gray-500">Order Packed</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${order.isDispatched ? 'bg-green-800' : 'bg-red-800'}`}></div>
                    <span className="text-sm font-semibold text-gray-500">Order Dispatched</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${order.isPaid ? 'bg-green-800' : 'bg-red-800'}`}></div>
                    <span className="text-sm font-semibold text-gray-500">Order Paid</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${order.isDelivered ? 'bg-green-800' : 'bg-red-800'}`}></div>
                    <span className="text-sm font-semibold text-gray-500">Order Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
