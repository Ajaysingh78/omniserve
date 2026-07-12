import React from 'react';

export default function CategoryChips({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4.5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200 border cursor-pointer ${
          selectedCategoryId === 'all'
            ? 'bg-[#6311f4] border-[#6311f4] text-white shadow-md shadow-[#6311f4]/15'
            : 'bg-white border-zinc-100 text-zinc-700 hover:border-zinc-200'
        }`}
      >
        All Dishes
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelectCategory(cat._id)}
          className={`px-4.5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200 border cursor-pointer ${
            selectedCategoryId === cat._id
              ? 'bg-[#6311f4] border-[#6311f4] text-white shadow-md shadow-[#6311f4]/15'
              : 'bg-white border-zinc-100 text-zinc-700 hover:border-zinc-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
