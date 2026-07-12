import React from 'react';

export default function ProductShowcase({ src, alt }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-lp-border bg-white shadow-2xl shadow-slate-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30">
      <div className="flex items-center gap-2 border-b border-lp-border bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="aspect-[16/10] bg-slate-100 dark:bg-zinc-900">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
      </div>
    </div>
  );
}
