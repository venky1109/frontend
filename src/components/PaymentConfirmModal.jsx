import { FaTimes, FaCheckCircle, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';

const PaymentConfirmModal = ({ method, loading, onCancel, onConfirm }) => {
  if (!method) {
    return null;
  }

  const isOnline = method === 'Online';
  const label = isOnline ? 'Online Payment' : 'Cash/UPI Payment On Delivery';
  const Icon = isOnline ? FaUniversity : FaMoneyBillWave;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 px-3 pb-5 backdrop-blur-sm sm:items-center sm:pb-0">
      <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isOnline ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <Icon />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Confirm Payment</p>
              <h2 className="text-lg font-extrabold text-slate-950">{label}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close payment confirmation"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Do you want to continue with this selected payment channel?
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Change
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <FaCheckCircle className="text-xs" />
            {loading ? 'Please wait' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmModal;
