import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaPrint, FaShoppingBag } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading: queryLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const printableContentRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [orderId, refetch]);

  const formattedOrderDate = order
    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/ /g, '-')
    : '';

  const handlePrint = () => {
    if (!printableContentRef.current) return;

    const printContents = printableContentRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .screen-only { display: none !important; }
            .print-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .print-header h2 { flex: 1; text-align: center; margin: 0; }
            .print-header img { max-width: 90px; }
            .header-line { border: 0; border-top: 2px solid #ddd; margin: 10px 0; }
            .print-footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
            .thank-you { font-weight: bold; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Invoice</h2>
            <img src="/images/icon-192.png" alt="Company Logo" />
          </div>
          <hr class="header-line">
          ${printContents}
          <div class="print-footer">
            <p class="thank-you">Thank you for shopping with Mana Kirana!</p>
            <p>For help, contact customercare@manakirana.online</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading || queryLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  const statusSteps = [
    { label: 'Placed', complete: true },
    { label: 'Paid', complete: order.isPaid },
    { label: 'Packed', complete: order.isPacked },
    { label: 'Dispatched', complete: order.isDispatched },
    { label: 'Delivered', complete: order.isDelivered },
  ];

  return (
    <div className="mt-16 mb-24 bg-gradient-to-b from-emerald-50/70 via-white to-white px-3 py-5 sm:mt-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-800"
          >
            <FaPrint className="h-3.5 w-3.5" />
            Print
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Order details</p>
            <h1 className="text-2xl font-extrabold text-slate-950">Invoice #{order._id?.slice(-8)}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {order.isPaid ? 'Paid' : 'Pay on delivery'}
          </span>
        </div>

        <div ref={printableContentRef} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_22rem] md:items-start">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-950">Bill To / Ship To</h2>
                <span className="text-xs font-bold text-slate-500">{formattedOrderDate}</span>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Invoice</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">{order.isPaid ? order._id : `Order ${order._id}`}</p>
                  {order.isPaid && order.orderId && (
                    <p className="mt-1 break-all text-xs font-semibold text-slate-500">Payment Ref: {order.orderId}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Customer</p>
                  <p className="mt-1 font-extrabold text-slate-900">{order.user.name}</p>
                  <a href={`tel:${order.user.phoneNo}`} className="font-semibold text-emerald-700">{order.user.phoneNo}</a>
                  <p className="mt-1 text-slate-600">
                    {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-extrabold text-slate-950">Supplier Details</h2>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p className="font-extrabold text-emerald-800">MANA KIRANA</p>
                <p>5-85, Uppalaguptham, Near Laxmi Cheruvu, Amalapuram, Samanasa, Dr BR Ambedkar Konaseema, Andhra Pradesh, 533213</p>
                <p><strong>GSTIN/UIN:</strong> 37AHPPV7362L1ZA</p>
                <p><strong>FSSAI License:</strong> 10124999000130</p>
                <p><strong>Email:</strong> <a href="mailto:customercare@manakirana.online" className="text-blue-600">customercare@manakirana.online</a></p>
                <p><strong>Call:</strong> <a href="tel:08856297898" className="text-blue-600">08856-297898</a></p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-950">Order Items</h2>
                <FaShoppingBag className="text-emerald-700" />
              </div>

              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="space-y-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-950">{item.name}</p>
                        <div className="mt-1 flex flex-wrap gap-1 text-[11px] font-semibold text-slate-600">
                          <span className="rounded-full bg-white px-2 py-0.5">{item.brand}</span>
                          <span className="rounded-full bg-white px-2 py-0.5">{item.quantity} {item.units}</span>
                          <span className="rounded-full bg-white px-2 py-0.5">Qty {item.qty}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-950">&#x20b9;{item.price * item.qty}</p>
                        <p className="text-[11px] font-semibold text-slate-500">{item.qty} x &#x20b9;{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4 md:sticky md:top-24">
            <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <h2 className="mb-3 text-lg font-extrabold text-slate-950">Order Summary</h2>
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Total Products Price</span>
                  <span>&#x20b9;{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>&#x20b9;{order.shippingPrice}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-lg font-extrabold text-slate-950">
                  <span>Grand Total</span>
                  <span>&#x20b9;{order.totalPrice}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
              <h2 className="mb-3 text-lg font-extrabold text-slate-950">Order Track</h2>
              <div className="space-y-3">
                {statusSteps.map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${step.complete ? 'bg-emerald-700' : 'bg-slate-300'}`} />
                    <span className={`text-sm font-bold ${step.complete ? 'text-emerald-800' : 'text-slate-500'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
              {!order.isPaid && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
                  Please pay &#x20b9;{order.totalPrice} at delivery time.
                </div>
              )}
            </section>

            <div className="screen-only grid gap-2">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-emerald-800"
              >
                <FaHome className="h-4 w-4" />
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
