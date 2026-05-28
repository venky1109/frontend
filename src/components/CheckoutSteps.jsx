import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign In', to: '/login', active: step1 },
    { label: 'Shipping', to: '/shipping', active: step2 },
    { label: 'Payment', to: '/payment', active: step3 },
    { label: 'Place Order', to: '/placeorder', active: step4 },
  ];

  return (
    <div className="mb-6 mt-12 flex items-center justify-center gap-1.5 overflow-x-auto pb-1 sm:mt-16 sm:gap-2">
      {steps.map((step, index) => {
        const content = (
          <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm transition sm:px-3 sm:py-1.5 sm:text-xs ${
              step.active
                ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                : 'bg-rose-50 text-slate-500 ring-1 ring-rose-100'
            }`}
          >
            {index + 1}. {step.label}
          </span>
        );

        return step.active ? (
          <Link key={step.label} to={step.to} className="shrink-0">
            {content}
          </Link>
        ) : (
          <span key={step.label} className="shrink-0">
            {content}
          </span>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
