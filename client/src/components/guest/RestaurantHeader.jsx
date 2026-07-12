import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RestaurantHeader({ 
  outletName, 
  outletAddress, 
  tableNumber, 
  guestCount, 
  cartItemsCount, 
  backLink, 
  cartLink 
}) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-zinc-100 bg-white/90 backdrop-blur sticky top-0 z-40 px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {backLink && (
          <button 
            onClick={() => typeof backLink === 'string' ? navigate(backLink) : navigate(-1)}
            className="p-2 hover:bg-zinc-50 rounded-full transition cursor-pointer text-zinc-800"
          >
            <span className="material-symbols-outlined text-[22px] font-bold">arrow_back</span>
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-[15px] text-zinc-950 tracking-tight">{outletName}</h1>
            {tableNumber && (
              <span className="bg-[#6311f4]/10 text-[#6311f4] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                T-{tableNumber}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 line-clamp-1">{outletAddress || 'OmniServe Ordering'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {guestCount !== undefined && (
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-full text-zinc-600 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">group</span>
            <span>{guestCount} Seated</span>
          </div>
        )}
        
        {cartLink && (
          <Link 
            to={cartLink} 
            className="relative p-2.5 bg-zinc-50 hover:bg-[#6311f4]/5 hover:text-[#6311f4] rounded-full text-zinc-700 transition flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6311f4] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {cartItemsCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
