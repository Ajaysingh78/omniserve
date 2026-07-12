import React from 'react';

export default function OutletBanner({ 
  outletName, 
  tableNumber, 
  status, 
  guestsCount, 
  currentBill, 
  onCallWaiter 
}) {
  return (
    <div className="bg-[#6311f4]/5 border border-[#6311f4]/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Scanned Table</span>
          <span className="bg-[#6311f4] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md">
            Table {tableNumber || 'N/A'}
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status || 'Session Active'}
          </span>
        </div>
        <h2 className="font-bold text-lg text-zinc-950 mt-1.5">{outletName}</h2>
        <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5 font-medium">
          <span>👥 {guestsCount || 1} Guests in session</span>
          {currentBill !== undefined && (
            <>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-900 font-bold">Current Bill: ₹{currentBill}</span>
            </>
          )}
        </p>
      </div>

      {onCallWaiter && (
        <button
          onClick={onCallWaiter}
          className="self-start md:self-center bg-white border border-[#6311f4]/20 hover:bg-[#6311f4]/5 text-[#6311f4] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] font-bold">notifications_active</span>
          <span>Call Waiter</span>
        </button>
      )}
    </div>
  );
}
