import React from 'react';

export default function QuantityStepper({ 
  quantity, 
  onIncrement, 
  onDecrement, 
  className 
}) {
  return (
    <div className={`flex items-center gap-2.5 bg-white border border-[#6311f4]/30 rounded-lg p-1 px-2 select-none ${className || ''}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className="w-5.5 h-5.5 flex items-center justify-center hover:bg-zinc-50 text-[#6311f4] font-black text-xs rounded transition-all cursor-pointer active:scale-90"
      >
        -
      </button>
      <span className="font-extrabold text-[12px] text-zinc-950 w-4.5 text-center">{quantity}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        className="w-5.5 h-5.5 flex items-center justify-center hover:bg-zinc-50 text-[#6311f4] font-black text-xs rounded transition-all cursor-pointer active:scale-90"
      >
        +
      </button>
    </div>
  );
}
