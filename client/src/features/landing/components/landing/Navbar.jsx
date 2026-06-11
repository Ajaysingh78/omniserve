import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";

export default function Navbar() {
  const navItems = [
    { name: "Products", path: "/products" },
    { name: "Solutions", path: "/solutions" },
    { name: "About", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-2xl bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600" />
          <span className="text-xl font-bold text-slate-900">
            FoodMesh
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ">
          <NavLink to="/login" >
            <Button variant="ghost" className="border-2 ">
              Login
            </Button>
          </NavLink>

          <NavLink to="/register">
            <Button>
              Book Demo
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}




// import { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import { Button } from "../ui/button";
// import {
//   Zap, ChevronDown, ArrowRight,
//   Tablet, ShoppingBag, Package, Truck, Users, Star,
//   MessageCircle, BarChart2, Building2, Building, Cloud,
//   ClipboardList, Award, Network, BookOpen, Video,
//   GraduationCap, PenLine, TrendingUp, HelpCircle, X,
// } from "lucide-react";

// // ── Announcement bar ──────────────────────────────────────────────────────────
// function AnnouncementBar() {
//   const [visible, setVisible] = useState(true);
//   if (!visible) return null;
//   return (
//     <div className="relative flex items-center justify-center gap-2.5 bg-blue-700 px-6 py-2 text-center text-xs text-blue-200">
//       <span className="rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-xs font-medium text-white">
//         New
//       </span>
//       <span>
//         <strong className="font-medium text-white">FoodMesh v3.0 is here</strong>
//         {" — "}WhatsApp ordering, AI inventory forecasting, and multi-outlet sync.
//       </span>
//       <a href="#" className="inline-flex items-center gap-1 text-blue-300 hover:text-white transition-colors">
//         Read the changelog <ArrowRight size={11} />
//       </a>
//       <button
//         onClick={() => setVisible(false)}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
//         aria-label="Dismiss announcement"
//       >
//         <X size={15} />
//       </button>
//     </div>
//   );
// }

// // ── Mega menu item ────────────────────────────────────────────────────────────
// function MegaItem({ icon: Icon, title, desc, badge }) {
//   return (
//     <a
//       href="#"
//       className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50"
//     >
//       <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
//         <Icon size={15} />
//       </div>
//       <div className="min-w-0">
//         <p className="flex items-center gap-1.5 text-[13px] font-medium text-gray-900 leading-tight">
//           {title}
//           {badge && (
//             <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-px text-[10px] font-medium text-blue-700">
//               {badge}
//             </span>
//           )}
//         </p>
//         <p className="mt-0.5 text-xs text-gray-500 leading-snug">{desc}</p>
//       </div>
//     </a>
//   );
// }

// // ── Column label ─────────────────────────────────────────────────────────────
// function ColLabel({ children }) {
//   return (
//     <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
//       {children}
//     </p>
//   );
// }

// // ── Promo card ────────────────────────────────────────────────────────────────
// function PromoCard({ title, desc, link }) {
//   return (
//     <div className="rounded-xl bg-gray-50 p-4">
//       <p className="text-[13px] font-medium text-gray-900">{title}</p>
//       <p className="mt-1 text-xs text-gray-500 leading-relaxed">{desc}</p>
//       <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
//         {link} <ArrowRight size={11} />
//       </a>
//     </div>
//   );
// }

// // ── Product mega menu ─────────────────────────────────────────────────────────
// function ProductMenu() {
//   return (
//     <div className="grid grid-cols-3 gap-6">
//       <div>
//         <ColLabel>Core platform</ColLabel>
//         <MegaItem icon={Tablet} title="Order aggregation" desc="Zomato, Swiggy, and your own channels, unified" />
//         <MegaItem icon={ShoppingBag} title="Offline POS" desc="Full POS that works without internet" badge="v3" />
//         <MegaItem icon={Package} title="Inventory management" desc="Real-time stock with recipe-based depletion" />
//         <MegaItem icon={Truck} title="Procurement" desc="Automate purchase orders and vendor management" />
//       </div>
//       <div>
//         <ColLabel>Growth tools</ColLabel>
//         <MegaItem icon={Users} title="CRM" desc="Customer profiles, segments, and lifetime value" />
//         <MegaItem icon={Star} title="Loyalty programs" desc="Points, tiers, and referrals that drive repeat visits" />
//         <MegaItem icon={MessageCircle} title="WhatsApp ordering" desc="Orders directly from WhatsApp, no app needed" badge="New" />
//         <MegaItem icon={BarChart2} title="Analytics" desc="Menu performance, peak hours, and forecasting" />
//       </div>
//       <div className="flex flex-col gap-3">
//         <PromoCard
//           title="See it in action"
//           desc="Walk through a live FoodMesh dashboard — no sign-up required."
//           link="Take a 3-min tour"
//         />
//         <PromoCard
//           title="What's new in v3.0"
//           desc="AI inventory forecasting, WhatsApp ordering, and faster outlet sync."
//           link="Read changelog"
//         />
//         <div className="mt-auto flex gap-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
//           {["All features", "API reference", "System status"].map((l) => (
//             <a key={l} href="#" className="hover:text-blue-600 transition-colors">{l}</a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Solutions mega menu ───────────────────────────────────────────────────────
// function SolutionsMenu() {
//   return (
//     <div className="grid grid-cols-3 gap-6">
//       <div className="col-span-2">
//         <ColLabel>By restaurant type</ColLabel>
//         <div className="grid grid-cols-2 gap-1">
//           <MegaItem icon={Building2} title="Single outlet" desc="Launch fast, manage everything in one place" />
//           <MegaItem icon={Building} title="Multi-outlet chain" desc="Centralised control across all locations" />
//           <MegaItem icon={Cloud} title="Cloud kitchen" desc="Delivery-first operations, zero dine-in overhead" />
//           <MegaItem icon={ClipboardList} title="QSR & fast food" desc="High-volume, speed-optimised workflows" />
//           <MegaItem icon={Award} title="Fine dining" desc="Table management, detailed analytics, CRM" />
//           <MegaItem icon={Network} title="Franchise" desc="Standardised ops across franchisee locations" />
//         </div>
//       </div>
//       <div>
//         <ColLabel>Featured case study</ColLabel>
//         <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
//           <div className="mb-3 flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
//               <Building2 size={16} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="text-[13px] font-medium text-gray-900">Burger Republic</p>
//               <p className="text-[11px] text-gray-400">12 outlets · Franchise</p>
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 leading-relaxed mb-3">
//             "WhatsApp ordering added 18% to our monthly revenue in the first quarter."
//           </p>
//           <div className="mb-3 flex gap-4">
//             {[["+ 18%", "Revenue"], ["40%", "Loyalty enrol"], ["2 days", "To go live"]].map(([v, l]) => (
//               <div key={l}>
//                 <p className="text-[15px] font-semibold text-gray-900">{v}</p>
//                 <p className="text-[10px] text-gray-400">{l}</p>
//               </div>
//             ))}
//           </div>
//           <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
//             Read full story <ArrowRight size={11} />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Resources mega menu ───────────────────────────────────────────────────────
// function ResourcesMenu() {
//   return (
//     <div className="grid grid-cols-3 gap-6">
//       <div>
//         <ColLabel>Learn</ColLabel>
//         <MegaItem icon={BookOpen} title="Documentation" desc="Guides, API references, and integration docs" />
//         <MegaItem icon={Video} title="Webinars" desc="Live and on-demand sessions from our team" />
//         <MegaItem icon={GraduationCap} title="FoodMesh Academy" desc="Structured courses to get the most from your OS" />
//       </div>
//       <div>
//         <ColLabel>Explore</ColLabel>
//         <MegaItem icon={PenLine} title="Blog" desc="Restaurant ops, tech trends, and growth tactics" />
//         <MegaItem icon={TrendingUp} title="Case studies" desc="How real restaurants improved with FoodMesh" />
//         <MegaItem icon={HelpCircle} title="Help centre" desc="Answers, troubleshooting, and support tickets" />
//       </div>
//       <div>
//         <ColLabel>Latest from the blog</ColLabel>
//         <div className="space-y-1">
//           {[
//             { cat: "Operations · 5 min", title: "How to cut food wastage by 30% using recipe costing" },
//             { cat: "Growth · 8 min", title: "Building a loyalty programme that actually drives repeat visits" },
//           ].map((post) => (
//             <a key={post.title} href="#" className="block rounded-xl p-3 hover:bg-gray-50 transition-colors">
//               <p className="text-[11px] text-gray-400 mb-1">{post.cat}</p>
//               <p className="text-[13px] font-medium text-gray-900 leading-snug">{post.title}</p>
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Nav dropdown button ───────────────────────────────────────────────────────
// function NavDropBtn({ label, isOpen, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] transition-colors ${
//         isOpen
//           ? "bg-gray-100 text-gray-900"
//           : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//       }`}
//     >
//       {label}
//       <ChevronDown
//         size={13}
//         className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//       />
//     </button>
//   );
// }

// // ── Mega menu shell ───────────────────────────────────────────────────────────
// function MegaMenu({ children, isOpen }) {
//   if (!isOpen) return null;
//   return (
//     <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white shadow-lg">
//       <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
//     </div>
//   );
// }

// // ── Main Navbar ───────────────────────────────────────────────────────────────
// const navItems = [
//   { name: "Products", path: "/products" },
//   { name: "Solutions", path: "/solutions" },
//   { name: "About", path: "/about" },
//   { name: "Resources", path: "/resources" },
//   { name: "Contact", path: "/contact" },
// ];

// export default function Navbar() {
//   const [open, setOpen] = useState(null); // "product" | "solutions" | "resources" | null
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navRef = useRef(null);

//   // Scroll shadow
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // Click-outside to close
//   useEffect(() => {
//     const handler = (e) => {
//       if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const toggle = (key) => setOpen((prev) => (prev === key ? null : key));

//   return (
//     <header
//       className={`sticky top-0 z-50 transition-shadow duration-200 ${
//         scrolled ? "shadow-md" : ""
//       }`}
//     >
//       <AnnouncementBar />

//       <div
//         ref={navRef}
//         className="relative border-b border-gray-200 bg-white/95 backdrop-blur-md"
//       >
//         <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-4 px-6">

//           {/* ── Logo ── */}
//           <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
//             <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-blue-600">
//               <Zap size={15} className="text-white" />
//             </div>
//             <span className="text-[16px] font-semibold text-gray-900">
//               Food<span className="text-blue-600">Mesh</span>
//             </span>
//           </NavLink>

//           {/* ── Divider ── */}
//           <div className="h-5 w-px flex-shrink-0 bg-gray-200" aria-hidden="true" />

//           {/* ── Desktop nav ── */}
//           <nav className="hidden flex-1 items-center gap-0.5 md:flex">
//             <NavDropBtn label="Product" isOpen={open === "product"} onClick={() => toggle("product")} />
//             <NavDropBtn label="Solutions" isOpen={open === "solutions"} onClick={() => toggle("solutions")} />
//             {/* <NavLink
//               to="/pricing"
//               className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
//             >
//               Pricing
//             </NavLink> */}
//             <NavDropBtn label="Resources" isOpen={open === "resources"} onClick={() => toggle("resources")} />
//             <NavLink
//               to="/about"
//               className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
//             >
//               About
//             </NavLink>
//           </nav>

//           {/* ── Right actions ── */}
//           <div className="hidden items-center gap-2 md:flex">
//             {/* Search */}
//             {/* <button className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-400 hover:border-gray-300 transition-colors">
//               <Search size={12} />
//               <span>Search…</span>
//               <kbd className="ml-2 rounded border border-gray-200 bg-white px-1.5 py-px text-[10px] text-gray-400">
//                 ⌘K
//               </kbd>
//             </button> */}

//             <NavLink to="/login">
//               <Button
//                 variant="ghost"
//                 className="h-8 border border-gray-200 px-4 text-[13px] font-normal text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//               >
//                 Log in
//               </Button>
//             </NavLink>

//             <NavLink to="/demo">
//               <Button className="h-8 gap-1.5 bg-blue-600 px-4 text-[13px] font-medium text-white hover:bg-blue-700">
//                 Book a demo
//                 <ArrowRight size={13} />
//               </Button>
//             </NavLink>
//           </div>

//           {/* ── Mobile hamburger ── */}
//           <button
//             className="ml-auto flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
//             onClick={() => setMobileOpen(!mobileOpen)}
//             aria-label="Toggle menu"
//           >
//             {mobileOpen ? <X size={20} /> : (
//               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M3 10h14M3 5h14M3 15h14" />
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* ── Mega menus ── */}
//         <MegaMenu isOpen={open === "product"}><ProductMenu /></MegaMenu>
//         <MegaMenu isOpen={open === "solutions"}><SolutionsMenu /></MegaMenu>
//         <MegaMenu isOpen={open === "resources"}><ResourcesMenu /></MegaMenu>

//         {/* ── Mobile menu ── */}
//         {mobileOpen && (
//           <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
//             <nav className="flex flex-col gap-1">
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setMobileOpen(false)}
//                   className={({ isActive }) =>
//                     `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                       isActive
//                         ? "bg-blue-50 text-blue-600"
//                         : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                     }`
//                   }
//                 >
//                   {item.name}
//                 </NavLink>
//               ))}
//             </nav>
//             <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
//               <NavLink to="/login">
//                 <Button variant="ghost" className="w-full justify-center border border-gray-200 text-sm">
//                   Log in
//                 </Button>
//               </NavLink>
//               <NavLink to="/demo">
//                 <Button className="w-full justify-center gap-1.5 bg-blue-600 text-sm text-white hover:bg-blue-700">
//                   Book a demo <ArrowRight size={13} />
//                 </Button>
//               </NavLink>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }