import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function VariantCustomizerSheet({ 
  isOpen, 
  onClose, 
  item, 
  variants, 
  addons, 
  onConfirm, 
  confirmLoading 
}) {
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedAddons, setSelectedAddons] = useState({}); // { addonId: quantity }
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedVariantId(variants[0]._id);
    } else {
      setSelectedVariantId('');
    }
    setSelectedAddons({});
    setQuantity(1);
    setNotes('');
  }, [item, variants, addons]);

  if (!item) return null;

  const currentVariant = variants.find(v => v._id === selectedVariantId);
  const basePrice = currentVariant ? currentVariant.price : item.price;
  
  let addonsTotal = 0;
  Object.entries(selectedAddons).forEach(([addonId, qty]) => {
    const addon = addons.find(a => a._id === addonId);
    if (addon) {
      addonsTotal += addon.price * qty;
    }
  });

  const totalPrice = (basePrice + addonsTotal) * quantity;

  const handleToggleAddon = (addonId) => {
    setSelectedAddons(prev => {
      const copy = { ...prev };
      if (copy[addonId]) {
        delete copy[addonId];
      } else {
        copy[addonId] = 1;
      }
      return copy;
    });
  };

  const handleAddonQty = (addonId, delta) => {
    setSelectedAddons(prev => {
      const copy = { ...prev };
      if (copy[addonId] !== undefined) {
        const nextQty = copy[addonId] + delta;
        if (nextQty >= 1) {
          copy[addonId] = nextQty;
        }
      }
      return copy;
    });
  };

  const handleAdd = () => {
    const chosenAddons = Object.entries(selectedAddons).map(([addonId, qty]) => {
      const addon = addons.find(a => a._id === addonId);
      return {
        addonId,
        quantity: qty,
        name: addon?.name || 'Addon',
        price: addon?.price || 0
      };
    });

    onConfirm({
      variantId: selectedVariantId || undefined,
      addons: chosenAddons,
      quantity,
      notes: notes || undefined
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name} size="md">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-zinc-900 guest-ordering">
        {/* Item description */}
        {item.description && (
          <p className="text-xs text-zinc-500 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100/60 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Variants Selection */}
        {variants && variants.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Choose Size / Variant</h4>
            <div className="space-y-2">
              {variants.map((v) => (
                <label
                  key={v._id}
                  className="flex items-center justify-between p-3.5 bg-white border border-zinc-100 rounded-xl cursor-pointer hover:border-[#6311f4]/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="customizer-variant"
                      value={v._id}
                      checked={selectedVariantId === v._id}
                      onChange={() => setSelectedVariantId(v._id)}
                      className="radio radio-xs radio-primary w-4.5 h-4.5 text-[#6311f4] border-zinc-300 bg-zinc-50 focus:ring-[#6311f4]"
                    />
                    <span className="text-xs font-bold text-zinc-800">{v.name}</span>
                  </div>
                  <span className="text-xs font-black text-zinc-950">₹{v.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Addons Selection */}
        {addons && addons.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Addons / Customizations</h4>
            <div className="space-y-2">
              {addons.map((a) => {
                const isSelected = !!selectedAddons[a._id];
                const qty = selectedAddons[a._id] || 0;

                return (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-3.5 bg-white border border-zinc-100 rounded-xl hover:border-[#6311f4]/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleAddon(a._id)}
                        className="checkbox checkbox-xs checkbox-primary w-4.5 h-4.5 text-[#6311f4] border-zinc-300 bg-zinc-50 rounded focus:ring-[#6311f4]"
                      />
                      <span className="text-xs font-bold text-zinc-800">{a.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-zinc-950">₹{a.price}</span>
                      {isSelected && (
                        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-lg p-1">
                          <button
                            onClick={() => handleAddonQty(a._id, -1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold rounded"
                          >
                            -
                          </button>
                          <span className="text-[11px] font-extrabold w-4 text-center">{qty}</span>
                          <button
                            onClick={() => handleAddonQty(a._id, 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold rounded"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Special Instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., no onion, extra spicy, sauce on side"
            className="w-full bg-white border border-zinc-100 rounded-xl p-3.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#6311f4] h-16 resize-none"
          />
        </div>

        {/* Stepper Quantity selection */}
        <div className="flex items-center justify-between border-t border-zinc-100/60 pt-4">
          <span className="text-xs font-bold text-zinc-700">Quantity</span>
          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl p-1 px-2.5">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-black rounded-lg transition-all"
            >
              -
            </button>
            <span className="font-extrabold text-xs w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-black rounded-lg transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-zinc-100/60 flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 bg-zinc-50 border-zinc-100 text-zinc-500 rounded-xl text-xs py-2.5"
          >
            Cancel
          </Button>
          <button
            onClick={handleAdd}
            disabled={confirmLoading}
            className="flex-1 bg-[#6311f4] hover:bg-[#520dd4] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg shadow-[#6311f4]/15 active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
          >
            {confirmLoading ? 'Adding...' : `Add Item - ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
