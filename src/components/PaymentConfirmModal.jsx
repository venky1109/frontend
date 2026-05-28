import { FaTimes, FaCheckCircle, FaUniversity } from 'react-icons/fa';
import { MdCurrencyRupee } from 'react-icons/md';

const PaymentConfirmModal = ({ method, loading, onCancel, onConfirm }) => {
  if (!method) {
    return null;
  }

  const isOnline = method === 'Online';
  const label = isOnline ? 'Online Payment' : 'Cash/UPI On Delivery';
  const Icon = isOnline ? FaUniversity : MdCurrencyRupee;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/25 px-4">
      <div className="w-full max-w-[17rem] rounded-2xl border border-emerald-50 bg-white/95 p-3 shadow-[0_14px_36px_rgba(15,23,42,0.16)]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${isOnline ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Icon />
            </span>
            <div>
              <p className="text-[9px] font-normal uppercase tracking-wide text-emerald-700">Confirm payment</p>
              <h2 className="text-sm font-normal text-slate-950">{label}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close payment confirmation"
          >
            <FaTimes className="text-[10px]" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-normal text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Change
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/90 px-2.5 py-2 text-[11px] font-normal text-white shadow-sm shadow-emerald-100 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
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
