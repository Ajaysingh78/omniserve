// import { useState, useEffect, useRef, useCallback } from "react";

// // ─── INLINE STYLES (FoodMesh dark theme) ─────────────────────────────────────
// const CSS = `
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --bg:      #0a0b0d;
//     --bg2:     #111318;
//     --bg3:     #16191f;
//     --bg4:     #1d2026;
//     --border:  #2a2d35;
//     --border2: #363a45;
//     --text:    #e8eaf0;
//     --text2:   #9aa0b0;
//     --text3:   #5c6270;
//     --accent:  #3b82f6;
//     --accent2: #1d4ed8;
//     --green:   #10b981;
//     --red:     #ef4444;
//     --amber:   #f59e0b;
//     --purple:  #8b5cf6;
//     --teal:    #06b6d4;
//     --radius:  10px;
//     --radius2: 6px;
//     font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
//   }

//   html, body, #root {
//     min-height: 100%;
//     background: var(--bg);
//     color: var(--text);
//     font-size: 13px;
//   }

//   ::-webkit-scrollbar { width: 4px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

//   /* ── ROOT LAYOUT ── */
//   .login-root {
//     display: flex;
//     min-height: 100vh;
//   }

//   /* ── LEFT PANEL ── */
//   .login-left {
//     width: 45%;
//     min-width: 380px;
//     background: var(--bg2);
//     border-right: 1px solid var(--border);
//     display: flex;
//     flex-direction: column;
//     padding: 48px 48px 36px;
//     position: sticky;
//     top: 0;
//     height: 100vh;
//     overflow: hidden;
//   }

//   /* grid overlay subtle */
//   .login-left::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background-image:
//       linear-gradient(rgba(59,130,246,.03) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(59,130,246,.03) 1px, transparent 1px);
//     background-size: 40px 40px;
//     pointer-events: none;
//   }

//   /* glow blob */
//   .left-glow {
//     position: absolute;
//     width: 340px; height: 340px;
//     border-radius: 50%;
//     background: radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 70%);
//     top: 10%; left: -80px;
//     pointer-events: none;
//   }
//   .left-glow2 {
//     position: absolute;
//     width: 240px; height: 240px;
//     border-radius: 50%;
//     background: radial-gradient(circle, rgba(139,92,246,.1) 0%, transparent 70%);
//     bottom: 15%; right: -60px;
//     pointer-events: none;
//   }

//   .left-content { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }

//   /* logo */
//   .left-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 52px; }
//   .logo-mark {
//     width: 36px; height: 36px;
//     background: linear-gradient(135deg,#3b82f6,#8b5cf6);
//     border-radius: 9px;
//     display: flex; align-items: center; justify-content: center;
//     font-weight: 800; font-size: 14px; color: #fff; flex-shrink: 0;
//     box-shadow: 0 4px 14px rgba(59,130,246,.35);
//   }
//   .logo-name  { font-size: 18px; font-weight: 800; letter-spacing: -.4px; }
//   .logo-tag   { font-size: 10px; color: var(--text3); }

//   .left-heading {
//     font-size: 28px; font-weight: 800;
//     letter-spacing: -.7px; line-height: 1.2;
//     margin-bottom: 14px;
//   }
//   .left-heading span { color: var(--accent); }
//   .left-sub {
//     font-size: 13px; color: var(--text2);
//     line-height: 1.65; margin-bottom: 36px;
//     max-width: 340px;
//   }

//   /* feature pills */
//   .feature-pills {
//     display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px;
//   }
//   .feature-pill {
//     display: flex; align-items: center; gap: 6px;
//     padding: 6px 12px; border-radius: 20px;
//     border: 1px solid var(--border);
//     background: var(--bg3);
//     font-size: 11.5px; color: var(--text2); font-weight: 500;
//     transition: all .2s;
//   }
//   .feature-pill:hover { border-color: var(--accent); color: var(--text); }
//   .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

//   /* stats */
//   .left-stats {
//     display: grid; grid-template-columns: 1fr 1fr 1fr;
//     gap: 12px; margin-bottom: 40px;
//   }
//   .stat-card {
//     background: var(--bg3); border: 1px solid var(--border);
//     border-radius: var(--radius); padding: 14px 12px; text-align: center;
//   }
//   .stat-val   { font-size: 18px; font-weight: 800; letter-spacing: -.4px; color: var(--text); }
//   .stat-label { font-size: 10px; color: var(--text3); margin-top: 3px; }

//   /* trust */
//   .trust-list { display: flex; flex-direction: column; gap: 9px; margin-top: auto; }
//   .trust-item {
//     display: flex; align-items: center; gap: 8px;
//     font-size: 11.5px; color: var(--text3);
//   }
//   .trust-check {
//     width: 18px; height: 18px; border-radius: 50%;
//     background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.25);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 9px; color: var(--green); flex-shrink: 0;
//   }

//   /* ── RIGHT PANEL ── */
//   .login-right {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     padding: 48px 40px;
//     overflow-y: auto;
//   }

//   .login-card {
//     width: 100%; max-width: 460px;
//     background: var(--bg2);
//     border: 1px solid var(--border);
//     border-radius: 16px;
//     padding: 40px;
//     animation: fadeUp .35s ease;
//     position: relative;
//   }
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(18px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   /* top accent line */
//   .login-card::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 24px; right: 24px; height: 2px;
//     background: linear-gradient(90deg, transparent, var(--accent), var(--purple), transparent);
//     border-radius: 0 0 2px 2px;
//   }

//   .card-eyebrow {
//     display: flex; align-items: center; gap: 8px;
//     font-size: 11px; font-weight: 600; color: var(--text3);
//     text-transform: uppercase; letter-spacing: .6px;
//     margin-bottom: 10px;
//   }
//   .eyebrow-dot {
//     width: 7px; height: 7px; border-radius: 50%;
//     background: var(--green); box-shadow: 0 0 6px var(--green);
//     animation: blink 2s infinite;
//   }
//   @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }

//   .card-heading { font-size: 22px; font-weight: 800; letter-spacing: -.5px; margin-bottom: 4px; }
//   .card-sub     { font-size: 12.5px; color: var(--text2); margin-bottom: 30px; }

//   /* ── DEMO CREDENTIALS ── */
//   .demo-banner {
//     padding: 10px 14px; border-radius: var(--radius2);
//     background: rgba(59,130,246,.07);
//     border: 1px solid rgba(59,130,246,.18);
//     margin-bottom: 22px;
//     font-size: 11.5px; color: var(--text2);
//     display: flex; align-items: flex-start; gap: 8px;
//   }
//   .demo-banner strong { color: var(--accent); }
//   .demo-creds { display: flex; flex-direction: column; gap: 3px; }
//   .demo-fill {
//     background: none; border: none; color: var(--accent);
//     font-size: 11px; cursor: pointer; padding: 0; text-align: left;
//     text-decoration: underline; text-underline-offset: 2px;
//     margin-top: 4px;
//   }
//   .demo-fill:hover { color: var(--text); }

//   /* ── FIELDS ── */
//   .field { margin-bottom: 16px; }
//   .field-label {
//     font-size: 11.5px; font-weight: 600; color: var(--text2);
//     margin-bottom: 6px; display: block;
//   }
//   .input-wrap { position: relative; }
//   .fm-input {
//     width: 100%;
//     background: var(--bg3);
//     border: 1px solid var(--border);
//     border-radius: var(--radius2);
//     padding: 10px 38px 10px 12px;
//     font-size: 13px; color: var(--text);
//     outline: none;
//     transition: border-color .15s, box-shadow .15s;
//     font-family: inherit;
//   }
//   .fm-input::placeholder { color: var(--text3); }
//   .fm-input:focus {
//     border-color: var(--accent);
//     box-shadow: 0 0 0 3px rgba(59,130,246,.12);
//   }
//   .fm-input.error {
//     border-color: var(--red);
//     box-shadow: 0 0 0 3px rgba(239,68,68,.1);
//   }
//   .fm-input.success { border-color: rgba(16,185,129,.5); }

//   .input-icon-r {
//     position: absolute; right: 10px; top: 50%;
//     transform: translateY(-50%);
//     color: var(--text3); cursor: pointer;
//     display: flex; align-items: center;
//     transition: color .15s;
//     background: none; border: none;
//   }
//   .input-icon-r:hover { color: var(--text2); }

//   .field-error {
//     font-size: 11px; color: var(--red); margin-top: 5px;
//     display: flex; align-items: center; gap: 4px;
//   }

//   /* ── REMEMBER + FORGOT ── */
//   .row-remember {
//     display: flex; align-items: center; justify-content: space-between;
//     margin-bottom: 22px;
//   }
//   .remember-left { display: flex; align-items: center; gap: 8px; cursor: pointer; }
//   .custom-checkbox {
//     width: 16px; height: 16px; border-radius: 4px;
//     border: 1.5px solid var(--border2);
//     background: var(--bg3);
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0; transition: all .15s;
//   }
//   .custom-checkbox.checked { background: var(--accent); border-color: var(--accent); }
//   .remember-label { font-size: 12px; color: var(--text2); }
//   .forgot-link {
//     font-size: 12px; color: var(--accent);
//     text-decoration: none; font-weight: 500;
//   }
//   .forgot-link:hover { text-decoration: underline; }

//   /* ── SUBMIT BUTTON ── */
//   .submit-btn {
//     width: 100%; padding: 12px;
//     border-radius: var(--radius2); border: none;
//     background: var(--accent); color: #fff;
//     font-size: 14px; font-weight: 700;
//     cursor: pointer; transition: all .2s;
//     display: flex; align-items: center; justify-content: center; gap: 8px;
//     letter-spacing: -.2px; position: relative; overflow: hidden;
//   }
//   .submit-btn::after {
//     content: '';
//     position: absolute; inset: 0;
//     background: linear-gradient(180deg, rgba(255,255,255,.06) 0%, transparent 100%);
//   }
//   .submit-btn:hover:not(:disabled) {
//     background: var(--accent2);
//     transform: translateY(-1px);
//     box-shadow: 0 6px 18px rgba(59,130,246,.4);
//   }
//   .submit-btn:active:not(:disabled) { transform: translateY(0); }
//   .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

//   .spinner {
//     width: 16px; height: 16px; border-radius: 50%;
//     border: 2px solid rgba(255,255,255,.3);
//     border-top-color: #fff;
//     animation: spin .6s linear infinite; flex-shrink: 0;
//   }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   /* ── OR DIVIDER ── */
//   .or-divider {
//     display: flex; align-items: center; gap: 12px;
//     font-size: 11px; color: var(--text3); margin: 20px 0;
//   }
//   .or-divider::before, .or-divider::after {
//     content: ''; flex: 1; height: 1px; background: var(--border);
//   }

//   /* ── ROLE QUICK-ACCESS ── */
//   .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
//   .role-btn {
//     padding: 9px 10px; border-radius: var(--radius2);
//     border: 1px solid var(--border); background: var(--bg3);
//     color: var(--text2); cursor: pointer; text-align: left;
//     transition: all .15s; display: flex; align-items: center; gap: 8px;
//     font-size: 11.5px; font-weight: 500;
//   }
//   .role-btn:hover { border-color: var(--border2); color: var(--text); background: var(--bg4); }
//   .role-icon { font-size: 15px; }
//   .role-sub  { font-size: 10px; color: var(--text3); margin-top: 1px; }

//   /* ── API ERROR ── */
//   .api-error {
//     padding: 11px 14px; border-radius: var(--radius2);
//     background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.3);
//     color: var(--red); font-size: 12px; margin-bottom: 18px;
//     display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
//   }

//   /* ── FOOTER LINKS ── */
//   .card-footer {
//     text-align: center; margin-top: 22px;
//     font-size: 12px; color: var(--text3);
//   }
//   .card-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
//   .card-footer a:hover { text-decoration: underline; }

//   /* ── PAGE FOOTER ── */
//   .page-footer {
//     margin-top: 24px; text-align: center;
//     font-size: 11px; color: var(--text3);
//     display: flex; align-items: center; justify-content: center;
//     flex-wrap: wrap; gap: 6px;
//   }
//   .page-footer a { color: var(--text3); text-decoration: none; }
//   .page-footer a:hover { color: var(--text2); }
//   .footer-sep { opacity: .4; }

//   /* ── SUCCESS OVERLAY ── */
//   .success-screen {
//     display: flex; flex-direction: column; align-items: center;
//     justify-content: center; text-align: center;
//     padding: 10px 0 20px; gap: 14px;
//     animation: fadeUp .4s ease;
//   }
//   .success-ring {
//     width: 64px; height: 64px; border-radius: 50%;
//     border: 2px solid var(--green);
//     background: rgba(16,185,129,.1);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 26px; animation: pop .4s ease;
//   }
//   @keyframes pop {
//     0%   { transform: scale(.4); }
//     80%  { transform: scale(1.1); }
//     100% { transform: scale(1); }
//   }
//   .role-chip {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 4px 12px; border-radius: 20px;
//     border: 1px solid rgba(59,130,246,.3);
//     background: rgba(59,130,246,.08);
//     font-size: 12px; color: var(--accent); font-weight: 600;
//   }

//   /* ── TOAST ── */
//   .toast-host {
//     position: fixed; top: 18px; right: 18px; z-index: 999;
//     display: flex; flex-direction: column; gap: 8px;
//   }
//   .toast {
//     padding: 11px 16px; border-radius: var(--radius);
//     background: var(--bg2); border: 1px solid var(--border);
//     color: var(--text); font-size: 12.5px; font-weight: 500;
//     display: flex; align-items: center; gap: 10px;
//     box-shadow: 0 10px 28px rgba(0,0,0,.45);
//     animation: toastIn .22s ease; max-width: 320px; min-width: 220px;
//   }
//   @keyframes toastIn { from { opacity:0; transform:translateX(14px); } to { opacity:1; transform:translateX(0); } }
//   .toast.success { border-color: rgba(16,185,129,.3); }
//   .toast.error   { border-color: rgba(239,68,68,.3); }
//   .toast.warning { border-color: rgba(245,158,11,.3); }

//   /* ── RESPONSIVE ── */
//   @media (max-width: 860px) {
//     .login-left  { display: none; }
//     .login-right { padding: 32px 20px; }
//     .login-card  { padding: 28px 22px; }
//   }
// `;

// // ─── ICON PRIMITIVES ─────────────────────────────────────────────────────────

// const Ico = ({ d, size = 14 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
//        style={{ flexShrink: 0 }}>
//     <path d={d} />
//   </svg>
// );

// const IEye    = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
// const IEyeOff = () => <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />;
// const IAlert  = () => <Ico size={12} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
// const IArrow  = () => <Ico d="M5 12h14M12 5l7 7-7 7" />;
// const ICheck  = () => <Ico size={9} d="M20 6L9 17l-5-5" />;
// const IEmail  = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
// const ILock   = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />;

// // ─── TOAST HOOK ───────────────────────────────────────────────────────────────

// function useToast() {
//   const [toasts, setToasts] = useState([]);
//   const add = useCallback((msg, type = "success") => {
//     const id = Date.now();
//     setToasts(t => [...t, { id, msg, type }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
//   }, []);
//   return { toasts, add };
// }

// function ToastHost({ toasts }) {
//   const icons = { success: "✅", error: "❌", warning: "⚠️" };
//   return (
//     <div className="toast-host">
//       {toasts.map(t => (
//         <div key={t.id} className={`toast ${t.type}`}>
//           <span style={{ fontSize: 15 }}>{icons[t.type] || "ℹ️"}</span>
//           {t.msg}
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── MOCK AUTH DATA ───────────────────────────────────────────────────────────

// const DEMO_ACCOUNTS = {
//   "owner@foodmesh.app":    { role: "OWNER",   name: "Arjun Mehta",    redirect: "/dashboard"        },
//   "manager@foodmesh.app":  { role: "MANAGER", name: "Priya Sharma",   redirect: "/dashboard/orders" },
//   "cashier@foodmesh.app":  { role: "CASHIER", name: "Rohan Patel",    redirect: "/pos"              },
//   "kitchen@foodmesh.app":  { role: "KITCHEN", name: "Sunita Rao",     redirect: "/kitchen-display"  },
// };

// const ROLE_COLORS = {
//   OWNER:   "#3b82f6",
//   MANAGER: "#8b5cf6",
//   CASHIER: "#f59e0b",
//   KITCHEN: "#10b981",
// };

// const QUICK_ROLES = [
//   { label: "Owner",   icon: "👑", email: "owner@foodmesh.app",   sub: "Full access"           },
//   { label: "Manager", icon: "📋", email: "manager@foodmesh.app", sub: "Orders & Operations"   },
//   { label: "Cashier", icon: "💰", email: "cashier@foodmesh.app", sub: "POS Terminal"           },
//   { label: "Kitchen", icon: "👨‍🍳", email: "kitchen@foodmesh.app", sub: "Kitchen Display"        },
// ];

// const FEATURES = [
//   { label: "Order Aggregation", color: "#3b82f6" },
//   { label: "Live Inventory",    color: "#10b981" },
//   { label: "CRM & Loyalty",     color: "#8b5cf6" },
//   { label: "Staff Management",  color: "#f59e0b" },
//   { label: "Finance & P&L",     color: "#06b6d4" },
//   { label: "Real-Time Analytics",color: "#ef4444"},
//   { label: "Multi-Outlet",      color: "#a855f7" },
//   { label: "WhatsApp Commerce", color: "#10b981" },
// ];

// const STATS = [
//   { val: "12K+",   label: "Restaurants" },
//   { val: "99.9%",  label: "Uptime"      },
//   { val: "₹420Cr", label: "GMV Monthly" },
// ];

// const TRUST = [
//   "Enterprise Security",
//   "Multi-Tenant Architecture",
//   "99.99% Uptime SLA",
//   "Secure Cloud Infrastructure",
//   "SOC2 & GDPR Compliant",
// ];

// // ─── VALIDATION ───────────────────────────────────────────────────────────────

// function validateEmail(v) {
//   if (!v.trim()) return "Email address is required";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
//   return null;
// }
// function validatePassword(v) {
//   if (!v) return "Password is required";
//   if (v.length < 6) return "Password must be at least 6 characters";
//   return null;
// }

// // ─── MOCK API ─────────────────────────────────────────────────────────────────

// async function mockLoginApi(email, password) {
//   await new Promise(r => setTimeout(r, 1500));

//   // Simulate rate limit
//   if (email.includes("rate")) throw { code: 429 };
//   // Simulate suspended
//   if (email.includes("suspended")) throw { code: 403 };
//   // Simulate server error
//   if (email.includes("error")) throw { code: 500 };

//   const account = DEMO_ACCOUNTS[email.toLowerCase()];
//   if (!account || password !== "password123") throw { code: 401 };

//   return {
//     accessToken:  "eyJ.mock.access.token." + Date.now(),
//     refreshToken: "eyJ.mock.refresh.token." + Date.now(),
//     user: {
//       id: "usr_" + Math.random().toString(36).slice(2, 9),
//       email,
//       role: account.role,
//       name: account.name,
//       tenantId: "ten_spicegarden_001",
//     },
//     redirect: account.redirect,
//   };
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// export default function LoginPage() {
//   const { toasts, add: addToast } = useToast();

//   const [email,       setEmail]       = useState("");
//   const [password,    setPassword]    = useState("");
//   const [showPw,      setShowPw]      = useState(false);
//   const [remember,    setRemember]    = useState(false);
//   const [touched,     setTouched]     = useState({ email: false, password: false });
//   const [errors,      setErrors]      = useState({ email: null, password: null });
//   const [apiError,    setApiError]    = useState("");
//   const [loading,     setLoading]     = useState(false);
//   const [loggedIn,    setLoggedIn]    = useState(false);
//   const [loggedUser,  setLoggedUser]  = useState(null);
//   const [attemptCount, setAttemptCount] = useState(0);

//   const emailRef = useRef(null);
//   useEffect(() => { emailRef.current?.focus(); }, []);

//   // ── Derived validation ──
//   const emailError    = touched.email    ? validateEmail(email)       : null;
//   const passwordError = touched.password ? validatePassword(password) : null;

//   // ── Quick-fill role ──
//   const fillRole = (roleEmail) => {
//     setEmail(roleEmail);
//     setPassword("password123");
//     setTouched({ email: true, password: true });
//     setErrors({ email: null, password: null });
//     setApiError("");
//   };

//   // ── Submit ──
//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     setTouched({ email: true, password: true });
//     setApiError("");

//     const eErr = validateEmail(email);
//     const pErr = validatePassword(password);
//     if (eErr || pErr) return;

//     if (attemptCount >= 5) {
//       setApiError("Too many failed attempts. Please wait a few minutes before trying again.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await mockLoginApi(email, password);

//       // Store tokens (in real app: use httpOnly cookie or secure storage)
//       if (remember) {
//         localStorage.setItem("fm_access_token",  result.accessToken);
//         localStorage.setItem("fm_refresh_token", result.refreshToken);
//         localStorage.setItem("fm_user",          JSON.stringify(result.user));
//       } else {
//         sessionStorage.setItem("fm_access_token",  result.accessToken);
//         sessionStorage.setItem("fm_user",          JSON.stringify(result.user));
//       }

//       setLoggedUser(result);
//       setLoggedIn(true);
//       setAttemptCount(0);
//       addToast(`Welcome back, ${result.user.name}! Redirecting…`, "success");

//       // In real app: navigate(result.redirect)
//     } catch (err) {
//       setAttemptCount(a => a + 1);
//       const code = err?.code || 500;
//       const msgs = {
//         401: "Invalid email or password. Please check your credentials.",
//         403: "Your account has been suspended. Contact support.",
//         429: "Too many login attempts. Please try again later.",
//         500: "Something went wrong on our end. Please try again.",
//       };
//       const msg = msgs[code] || msgs[500];
//       setApiError(msg);
//       addToast(
//         code === 401 ? "Invalid credentials" :
//         code === 403 ? "Account access denied" :
//         code === 429 ? "Too many login attempts" :
//         "Something went wrong",
//         code === 429 ? "warning" : "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enter key
//   const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

//   return (
//     <>
//       <style>{CSS}</style>
//       <ToastHost toasts={toasts} />

//       <div className="login-root">

//         {/* ══════════════════ LEFT PANEL ══════════════════ */}
//         <div className="login-left">
//           <div className="left-glow" />
//           <div className="left-glow2" />
//           <div className="left-content">

//             {/* Logo */}
//             <div className="left-logo">
//               <div className="logo-mark">FM</div>
//               <div>
//                 <div className="logo-name">FoodMesh</div>
//                 <div className="logo-tag">Restaurant Operating System</div>
//               </div>
//             </div>

//             {/* Heading */}
//             <div className="left-heading">
//               Run Your Restaurant<br/>
//               From <span>One Platform</span>
//             </div>
//             <p className="left-sub">
//               Orders, inventory, CRM, loyalty, staff, analytics, and finance —
//               all unified in a single enterprise-grade dashboard.
//             </p>

//             {/* Feature pills */}
//             <div className="feature-pills">
//               {FEATURES.map(f => (
//                 <div key={f.label} className="feature-pill">
//                   <div className="pill-dot" style={{ background: f.color }} />
//                   {f.label}
//                 </div>
//               ))}
//             </div>

//             {/* Stats */}
//             <div className="left-stats">
//               {STATS.map(s => (
//                 <div key={s.label} className="stat-card">
//                   <div className="stat-val">{s.val}</div>
//                   <div className="stat-label">{s.label}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Trust */}
//             <div className="trust-list">
//               {TRUST.map(t => (
//                 <div key={t} className="trust-item">
//                   <div className="trust-check">✓</div>
//                   {t}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ══════════════════ RIGHT PANEL ══════════════════ */}
//         <div className="login-right">
//           <div className="login-card" onKeyDown={handleKeyDown}>

//             {loggedIn ? (
//               /* ── SUCCESS STATE ── */
//               <div className="success-screen">
//                 <div className="success-ring">✅</div>
//                 <div style={{ fontSize: 20, fontWeight: 800 }}>Signed In Successfully</div>
//                 <div style={{ fontSize: 13, color: "var(--text2)" }}>
//                   Welcome back, <strong>{loggedUser?.user?.name}</strong>
//                 </div>
//                 <div className="role-chip">
//                   <span style={{ fontSize: 11 }}>
//                     {loggedUser?.user?.role === "OWNER"   ? "👑" :
//                      loggedUser?.user?.role === "MANAGER" ? "📋" :
//                      loggedUser?.user?.role === "CASHIER" ? "💰" : "👨‍🍳"}
//                   </span>
//                   <span style={{ color: ROLE_COLORS[loggedUser?.user?.role] }}>
//                     {loggedUser?.user?.role}
//                   </span>
//                 </div>
//                 <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>
//                   Redirecting to <strong style={{ color: "var(--accent)" }}>{loggedUser?.redirect}</strong>…
//                 </div>
//                 <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginTop: 12 }}>
//                   <div style={{
//                     height: "100%", borderRadius: 3,
//                     background: "var(--accent)",
//                     animation: "progress 2.5s linear forwards",
//                   }} />
//                 </div>
//                 <style>{`@keyframes progress { from{width:0%} to{width:100%} }`}</style>
//                 <button className="submit-btn" style={{ marginTop: 4 }}
//                         onClick={() => { setLoggedIn(false); setEmail(""); setPassword(""); setTouched({ email: false, password: false }); }}>
//                   ← Back to Login
//                 </button>
//               </div>
//             ) : (
//               /* ── LOGIN FORM ── */
//               <>
//                 <div className="card-eyebrow">
//                   <div className="eyebrow-dot" />
//                   FoodMesh Restaurant OS
//                 </div>
//                 <div className="card-heading">Welcome Back</div>
//                 <div className="card-sub">Sign in to your FoodMesh workspace</div>

//                 {/* Demo banner */}
//                 <div className="demo-banner">
//                   <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
//                   <div className="demo-creds">
//                     <div><strong>Demo mode</strong> — use password <strong>password123</strong> with any role below.</div>
//                     <button className="demo-fill" onClick={() => fillRole("owner@foodmesh.app")}>
//                       Auto-fill Owner credentials →
//                     </button>
//                   </div>
//                 </div>

//                 {/* API error */}
//                 {apiError && (
//                   <div className="api-error">
//                     <IAlert />
//                     {apiError}
//                   </div>
//                 )}

//                 {/* Email */}
//                 <div className="field">
//                   <label className="field-label" htmlFor="fm-email">Email Address</label>
//                   <div className="input-wrap">
//                     <input
//                       ref={emailRef}
//                       id="fm-email"
//                       type="email"
//                       autoComplete="email"
//                       className={`fm-input${emailError ? " error" : touched.email && !emailError ? " success" : ""}`}
//                       placeholder="owner@restaurant.com"
//                       value={email}
//                       onChange={e => { setEmail(e.target.value); setApiError(""); }}
//                       onBlur={() => setTouched(t => ({ ...t, email: true }))}
//                       aria-describedby={emailError ? "email-err" : undefined}
//                       aria-invalid={!!emailError}
//                       style={{ paddingLeft: 38 }}
//                     />
//                     <span className="input-icon-r" style={{ left: 10, right: "auto", cursor: "default" }}>
//                       <IEmail />
//                     </span>
//                   </div>
//                   {emailError && (
//                     <div className="field-error" id="email-err" role="alert">
//                       <IAlert />{emailError}
//                     </div>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="field">
//                   <label className="field-label" htmlFor="fm-pw">Password</label>
//                   <div className="input-wrap">
//                     <input
//                       id="fm-pw"
//                       type={showPw ? "text" : "password"}
//                       autoComplete="current-password"
//                       className={`fm-input${passwordError ? " error" : touched.password && !passwordError ? " success" : ""}`}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={e => { setPassword(e.target.value); setApiError(""); }}
//                       onBlur={() => setTouched(t => ({ ...t, password: true }))}
//                       aria-describedby={passwordError ? "pw-err" : undefined}
//                       aria-invalid={!!passwordError}
//                       style={{ paddingLeft: 38 }}
//                     />
//                     <span className="input-icon-r" style={{ left: 10, right: "auto", cursor: "default" }}>
//                       <ILock />
//                     </span>
//                     <button
//                       type="button"
//                       className="input-icon-r"
//                       onClick={() => setShowPw(p => !p)}
//                       aria-label={showPw ? "Hide password" : "Show password"}
//                     >
//                       {showPw ? <IEyeOff /> : <IEye />}
//                     </button>
//                   </div>
//                   {passwordError && (
//                     <div className="field-error" id="pw-err" role="alert">
//                       <IAlert />{passwordError}
//                     </div>
//                   )}
//                 </div>

//                 {/* Remember + Forgot */}
//                 <div className="row-remember">
//                   <div className="remember-left" onClick={() => setRemember(r => !r)}
//                        role="checkbox" aria-checked={remember} tabIndex={0}
//                        onKeyDown={e => e.key === " " && setRemember(r => !r)}>
//                     <div className={`custom-checkbox${remember ? " checked" : ""}`}>
//                       {remember && <ICheck />}
//                     </div>
//                     <span className="remember-label">Remember me on this device</span>
//                   </div>
//                   <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="button"
//                   className="submit-btn"
//                   disabled={loading}
//                   onClick={handleSubmit}
//                   aria-busy={loading}
//                 >
//                   {loading
//                     ? <><div className="spinner" /> Signing In…</>
//                     : <>Sign In <IArrow /></>
//                   }
//                 </button>

//                 {/* Quick role access */}
//                 <div className="or-divider">Quick Role Access</div>
//                 <div className="role-grid">
//                   {QUICK_ROLES.map(r => (
//                     <button key={r.label} className="role-btn" onClick={() => fillRole(r.email)}>
//                       <span className="role-icon">{r.icon}</span>
//                       <div>
//                         <div>{r.label}</div>
//                         <div className="role-sub">{r.sub}</div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Footer link */}
//                 <div className="card-footer">
//                   Don't have an account?{" "}
//                   <a href="/register">Create Workspace</a>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Page footer */}
//           <div className="page-footer">
//             <span>© 2026 FoodMesh Restaurant OS</span>
//             <span className="footer-sep">·</span>
//             <a href="/privacy">Privacy Policy</a>
//             <span className="footer-sep">·</span>
//             <a href="/terms">Terms of Service</a>
//             <span className="footer-sep">·</span>
//             <a href="/support">Support</a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }







const LoginPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      loginUser(data)
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/app/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Input
        placeholder="Email"
        {...register("email")}
      />

      {errors.email?.message}

      <Input
        type="password"
        placeholder="Password"
        {...register("password")}
      />

      {errors.password?.message}

      <Button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </Button>

    </form>
  );
};