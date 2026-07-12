import React from 'react';
import QuantityStepper from './QuantityStepper';

export default function MenuCard({ 
  item, 
  variantId, 
  quantityInCart, 
  onAddClick, 
  onUpdateQty 
}) {
  const { name, price, description, isVeg, isBestseller, isRecommended, imageUrl } = item;

  // Hierarchical Fallback Image Pipeline
  const resolveItemImage = () => {
    if (imageUrl) return imageUrl;
    if (item.outletOverrideImageUrl) return item.outletOverrideImageUrl;
    if (item.restaurantOverrideImageUrl) return item.restaurantOverrideImageUrl;
    if (item.globalDefaultImageUrl) return item.globalDefaultImageUrl;
    if (item.categoryDefaultImageUrl) return item.categoryDefaultImageUrl;
    
    // Default SVG Placeholder
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" stroke="%23f1f3f7" stroke-width="2" height="100" fill="%23fcf8fc"/><text x="50%" y="50%" font-size="10" font-family="sans-serif" font-weight="bold" fill="%23c8c8d0" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>`;
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-4 flex gap-4 justify-between items-start transition-all duration-200 hover:shadow-xs">
      <div className="flex-1 space-y-1.5 pr-2">
        <div className="flex items-center gap-2">
          {/* Veg/Non-Veg Indicator Dot */}
          <div className={isVeg ? 'veg-dot' : 'nonveg-dot'}>
            <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          
          {isBestseller && (
            <span className="bg-amber-500/10 text-amber-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
              ⭐ Bestseller
            </span>
          )}
          {isRecommended && (
            <span className="bg-[#6311f4]/10 text-[#6311f4] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
              👍 Chef Pick
            </span>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[15px] text-zinc-900 tracking-tight">{name}</h3>
          <span className="font-extrabold text-[14px] text-zinc-950 block mt-0.5">₹{price}</span>
        </div>

        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
          {description || 'Freshly prepared with premium quality ingredients.'}
        </p>
      </div>

      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
        <img 
          src={resolveItemImage()} 
          alt={name} 
          className="w-full h-full object-cover rounded-xl bg-zinc-50 border border-zinc-100/60"
        />
        
        {/* ADD / Quantity Stepper Overlay Button */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[80%] flex justify-center">
          {quantityInCart > 0 ? (
            <QuantityStepper 
              quantity={quantityInCart} 
              onIncrement={() => onUpdateQty(1)}
              onDecrement={() => onUpdateQty(-1)}
              className="shadow-md"
            />
          ) : (
            <button
              onClick={onAddClick}
              className="bg-white border border-[#6311f4]/30 hover:border-[#6311f4] text-[#6311f4] font-black text-xs px-4 py-1.5 rounded-lg shadow-xs hover:bg-[#6311f4]/5 active:scale-95 transition-all w-full text-center uppercase tracking-wider cursor-pointer"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
