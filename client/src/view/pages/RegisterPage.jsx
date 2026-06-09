import { useState, useEffect, useRef, useCallback } from "react";

// ─── INLINE STYLES (FoodMesh dark theme) ─────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0a0b0d;
    --bg2:     #111318;
    --bg3:     #16191f;
    --bg4:     #1d2026;
    --border:  #2a2d35;
    --border2: #363a45;
    --text:    #e8eaf0;
    --text2:   #9aa0b0;
    --text3:   #5c6270;
    --accent:  #3b82f6;
    --accent2: #1d4ed8;
    --green:   #10b981;
    --red:     #ef4444;
    --amber:   #f59e0b;
    --purple:  #8b5cf6;
    --radius:  10px;
    --radius2: 6px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  html, body, #root {
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── LAYOUT ── */
  .reg-root {
    display: flex;
    min-height: 100vh;
  }

  /* ── LEFT PANEL ── */
  .reg-left {
    width: 420px;
    min-width: 420px;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 48px 40px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  .left-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 48px; }
  .logo-mark {
    width: 36px; height: 36px;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; color: #fff; flex-shrink: 0;
  }
  .logo-name { font-size: 18px; font-weight: 800; letter-spacing: -.4px; }
  .logo-tag  { font-size: 10px; color: var(--text3); }

  .left-heading {
    font-size: 26px; font-weight: 800;
    letter-spacing: -.6px; line-height: 1.25;
    margin-bottom: 10px;
  }
  .left-sub {
    font-size: 13px; color: var(--text2);
    line-height: 1.6; margin-bottom: 36px;
  }

  .benefit-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px; }
  .benefit-item { display: flex; align-items: flex-start; gap: 12px; }
  .benefit-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0; margin-top: 1px;
  }
  .benefit-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .benefit-desc  { font-size: 11.5px; color: var(--text3); line-height: 1.4; }

  .trust-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
  .trust-badge {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--bg3);
    font-size: 10.5px; color: var(--text2); font-weight: 500;
  }
  .trust-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

  /* ── RIGHT PANEL ── */
  .reg-right {
    flex: 1; overflow-y: auto;
    padding: 48px 56px;
    display: flex; flex-direction: column; align-items: center;
  }

  .reg-card {
    width: 100%; max-width: 560px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 36px 36px;
    animation: fadeUp .3s ease;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  .card-heading { font-size: 20px; font-weight: 800; letter-spacing: -.4px; margin-bottom: 4px; }
  .card-sub     { font-size: 12.5px; color: var(--text2); margin-bottom: 28px; line-height: 1.5; }

  /* section labels */
  .form-section-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .6px; color: var(--text3);
    margin: 20px 0 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .form-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── FORM FIELDS ── */
  .field-row { display: flex; gap: 12px; }
  .field-row > * { flex: 1; min-width: 0; }
  .field { margin-bottom: 14px; }
  .field-label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 11.5px; font-weight: 600; color: var(--text2);
    margin-bottom: 6px;
  }
  .field-label-text { display: flex; align-items: center; gap: 5px; }
  .field-hint { font-size: 10.5px; color: var(--text3); font-weight: 400; }

  .input-wrap { position: relative; }
  .fm-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius2);
    padding: 9px 12px;
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    font-family: inherit;
  }
  .fm-input::placeholder { color: var(--text3); }
  .fm-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
  .fm-input.error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(239,68,68,.1); }
  .fm-input.success { border-color: var(--green); }
  .fm-input.with-icon-r { padding-right: 38px; }
  .fm-input.with-icon-l { padding-left: 38px; }

  .input-icon-r {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    color: var(--text3); cursor: pointer; display: flex; align-items: center;
    transition: color .15s;
  }
  .input-icon-r:hover { color: var(--text2); }
  .input-icon-l {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--text3); display: flex; align-items: center;
  }
  .input-status {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    font-size: 13px;
  }

  .field-error { font-size: 11px; color: var(--red); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
  .field-success { font-size: 11px; color: var(--green); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
  .field-info { font-size: 11px; color: var(--text3); margin-top: 4px; }

  /* phone */
  .phone-wrap { display: flex; gap: 0; }
  .country-sel {
    background: var(--bg3); border: 1px solid var(--border);
    border-right: none; border-radius: var(--radius2) 0 0 var(--radius2);
    padding: 9px 10px; font-size: 12px; color: var(--text2);
    cursor: pointer; display: flex; align-items: center; gap: 4px;
    white-space: nowrap; flex-shrink: 0; transition: border-color .15s;
  }
  .country-sel:focus { outline: none; border-color: var(--accent); }
  .phone-wrap .fm-input { border-radius: 0 var(--radius2) var(--radius2) 0; }

  /* slug preview */
  .slug-preview {
    margin-top: 6px; padding: 7px 10px;
    background: rgba(59,130,246,.07); border: 1px solid rgba(59,130,246,.2);
    border-radius: var(--radius2); font-size: 11.5px; color: var(--text2);
    display: flex; align-items: center; gap: 6px;
  }
  .slug-preview .accent { color: var(--accent); font-weight: 600; }

  /* ── PASSWORD STRENGTH ── */
  .pw-strength { margin-top: 8px; }
  .pw-bars { display: flex; gap: 4px; margin-bottom: 6px; }
  .pw-bar {
    flex: 1; height: 3px; border-radius: 3px;
    background: var(--border); transition: background .3s;
  }
  .pw-bar.filled-weak   { background: var(--red); }
  .pw-bar.filled-medium { background: var(--amber); }
  .pw-bar.filled-strong { background: var(--green); }
  .pw-bar.filled-vstrong{ background: var(--teal, #06b6d4); }
  .pw-label { font-size: 11px; font-weight: 600; }
  .pw-criteria { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .pw-crit {
    display: flex; align-items: center; gap: 4px;
    font-size: 10.5px; color: var(--text3); transition: color .2s;
  }
  .pw-crit.met { color: var(--green); }
  .pw-crit-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; transition: all .2s;
  }
  .pw-crit.met .pw-crit-dot { background: var(--green); border-color: var(--green); color: #fff; }

  /* ── CHECKBOX ── */
  .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin: 18px 0; }
  .custom-checkbox {
    width: 16px; height: 16px; border-radius: 4px;
    border: 1.5px solid var(--border2); background: var(--bg3);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; margin-top: 1px; transition: all .15s;
  }
  .custom-checkbox.checked { background: var(--accent); border-color: var(--accent); }
  .checkbox-label { font-size: 12px; color: var(--text2); line-height: 1.5; }
  .checkbox-label a { color: var(--accent); text-decoration: none; }
  .checkbox-label a:hover { text-decoration: underline; }

  /* ── SUBMIT BUTTON ── */
  .submit-btn {
    width: 100%; padding: 13px;
    border-radius: var(--radius2); border: none;
    background: var(--accent); color: #fff;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: -.2px;
  }
  .submit-btn:hover:not(:disabled) { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,.35); }
  .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  /* spinner */
  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── DIVIDER ── */
  .or-divider {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px; color: var(--text3); margin: 16px 0;
  }
  .or-divider::before, .or-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── FOOTER LINKS ── */
  .card-footer {
    text-align: center; margin-top: 20px;
    font-size: 12px; color: var(--text3);
  }
  .card-footer a {
    color: var(--accent); text-decoration: none; font-weight: 600;
  }
  .card-footer a:hover { text-decoration: underline; }

  /* ── TOAST ── */
  .toast-container {
    position: fixed; top: 20px; right: 20px; z-index: 999;
    display: flex; flex-direction: column; gap: 8px;
  }
  .toast {
    padding: 12px 16px; border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg2); color: var(--text);
    font-size: 12.5px; font-weight: 500;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
    animation: slideToast .25s ease;
    max-width: 320px;
  }
  @keyframes slideToast { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  .toast.success { border-color: rgba(16,185,129,.3); }
  .toast.error   { border-color: rgba(239,68,68,.3); }

  /* ── SUCCESS SCREEN ── */
  .success-screen {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center; padding: 40px 20px;
    gap: 14px; animation: fadeUp .4s ease;
  }
  .success-circle {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(16,185,129,.15); border: 2px solid var(--green);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; animation: pop .4s ease;
  }
  @keyframes pop { 0%{transform:scale(.5)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }

  /* ── API ERROR BANNER ── */
  .api-error {
    padding: 10px 14px; border-radius: var(--radius2);
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.3);
    color: var(--red); font-size: 12px; margin-bottom: 16px;
    display: flex; align-items: flex-start; gap: 8px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .reg-left { display: none; }
    .reg-right { padding: 24px 20px; }
    .reg-card  { padding: 24px 22px; }
  }
`;

// ─── VALIDATION HELPERS ───────────────────────────────────────────────────────

function validateField(name, value, formData) {
  switch (name) {
    case "firstName":
    case "lastName":
      if (!value.trim()) return "Required";
      if (value.trim().length < 2) return "Minimum 2 characters";
      return null;
    case "email":
      if (!value.trim()) return "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return null;
    case "phone":
      if (!value.trim()) return "Required";
      if (!/^\d{7,15}$/.test(value.replace(/\s/g, ""))) return "Enter a valid phone number";
      return null;
    case "password":
      if (!value) return "Required";
      if (value.length < 8) return "Minimum 8 characters";
      return null;
    case "confirmPassword":
      if (!value) return "Required";
      if (value !== formData.password) return "Passwords do not match";
      return null;
    case "restaurantName":
      if (!value.trim()) return "Required";
      if (value.trim().length < 2) return "Minimum 2 characters";
      return null;
    case "slug":
      if (!value.trim()) return "Required";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return "Only lowercase letters, numbers, and hyphens";
      if (value.length < 3) return "Minimum 3 characters";
      return null;
    default:
      return null;
  }
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", bars: 0 };
  const checks = {
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    length:  pw.length >= 8,
  };
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 2) return { score: 1, label: "Weak",      bars: 1, checks, color: "var(--red)"   };
  if (passed === 3) return { score: 2, label: "Medium",   bars: 2, checks, color: "var(--amber)" };
  if (passed === 4) return { score: 3, label: "Strong",   bars: 3, checks, color: "var(--green)" };
  return              { score: 4, label: "Very Strong", bars: 4, checks, color: "#06b6d4"       };
}

function toSlug(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
       style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IEye     = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IEyeOff  = () => <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />;
const ICheck   = () => <Ico size={10} d="M20 6L9 17l-5-5" />;
const IAlert   = () => <Ico size={12} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const IChevD   = () => <Ico size={10} d="M6 9l6 6 6-6" />;
const ISpinner = () => <div className="spinner" />;
const IArrow   = () => <Ico d="M5 12h14M12 5l7 7-7 7" />;

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontSize: 15 }}>{t.type === "success" ? "✅" : "❌"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── BENEFITS DATA ────────────────────────────────────────────────────────────

const BENEFITS = [
  { icon: "📦", bg: "rgba(59,130,246,.15)", title: "Order Aggregation",      desc: "All channels — Swiggy, Zomato, ONDC, Website — in one command center."    },
  { icon: "🏪", bg: "rgba(139,92,246,.15)", title: "Multi-Outlet Control",   desc: "Manage 1 to 10,000+ outlets from a single enterprise dashboard."           },
  { icon: "📊", bg: "rgba(16,185,129,.15)", title: "Real-Time Analytics",    desc: "Live revenue, SLA tracking, and AI-powered operational intelligence."      },
  { icon: "👥", bg: "rgba(245,158,11,.15)", title: "CRM & Loyalty",          desc: "Build lasting relationships with automated loyalty programs."               },
  { icon: "💳", bg: "rgba(6,182,212,.15)",  title: "Finance & Procurement",  desc: "End-to-end cash flow, P&L, vendor management and costing."                 },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { toasts, add: addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: "",
    restaurantName: "", slug: "",
  });
  const [errors,    setErrors]    = useState({});
  const [touched,   setTouched]   = useState({});
  const [showPw,    setShowPw]    = useState(false);
  const [showCPw,   setShowCPw]   = useState(false);
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState("");
  const [success,   setSuccess]   = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  // Mock uniqueness check state
  const [emailUnique, setEmailUnique] = useState(null); // null | true | false
  const [slugUnique,  setSlugUnique]  = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingSlug,  setCheckingSlug]  = useState(false);

  const emailTimerRef = useRef(null);
  const slugTimerRef  = useRef(null);
  const firstRef      = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  // ── Auto-generate slug from restaurant name ──
  useEffect(() => {
    if (!slugEdited && formData.restaurantName) {
      const generated = toSlug(formData.restaurantName);
      setFormData(f => ({ ...f, slug: generated }));
    }
  }, [formData.restaurantName, slugEdited]);

  // ── Debounced email uniqueness check ──
  useEffect(() => {
    if (!formData.email || errors.email) return;
    clearTimeout(emailTimerRef.current);
    setEmailUnique(null);
    setCheckingEmail(true);
    emailTimerRef.current = setTimeout(() => {
      // Mock: emails containing "taken" are already registered
      const taken = formData.email.toLowerCase().includes("taken");
      setEmailUnique(!taken);
      setCheckingEmail(false);
      if (taken) setErrors(e => ({ ...e, email: "This email is already registered" }));
      else setErrors(e => { const n = { ...e }; if (n.email === "This email is already registered") delete n.email; return n; });
    }, 700);
    return () => clearTimeout(emailTimerRef.current);
  }, [formData.email]);

  // ── Debounced slug uniqueness check ──
  useEffect(() => {
    if (!formData.slug || errors.slug) return;
    clearTimeout(slugTimerRef.current);
    setSlugUnique(null);
    setCheckingSlug(true);
    slugTimerRef.current = setTimeout(() => {
      const taken = formData.slug.toLowerCase().includes("taken");
      setSlugUnique(!taken);
      setCheckingSlug(false);
      if (taken) setErrors(e => ({ ...e, slug: "This URL is already taken" }));
      else setErrors(e => { const n = { ...e }; if (n.slug === "This URL is already taken") delete n.slug; return n; });
    }, 700);
    return () => clearTimeout(slugTimerRef.current);
  }, [formData.slug]);

  // ── Field change ──
  const handleChange = (field, value) => {
    setFormData(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value, { ...formData, [field]: value });
      setErrors(e => ({ ...e, [field]: err }));
    }
    if (field === "slug") setSlugEdited(true);
  };

  // ── Field blur ──
  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    const err = validateField(field, formData[field], formData);
    setErrors(e => ({ ...e, [field]: err }));
  };

  // ── Validate all ──
  const validateAll = () => {
    const fields = ["firstName","lastName","email","phone","password","confirmPassword","restaurantName","slug"];
    const errs = {};
    fields.forEach(f => {
      const e = validateField(f, formData[f], formData);
      if (e) errs[f] = e;
    });
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map(f => [f, true])));
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateAll()) return;
    if (!agreed) { addToast("Please agree to the Terms of Service", "error"); return; }
    if (emailUnique === false || slugUnique === false) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1800));

      // Mock: simulate a 409 for demo if name is "Error"
      if (formData.firstName.toLowerCase() === "error") {
        throw { response: { status: 409, data: { message: "Email already exists" } } };
      }

      // Success
      setSuccess(true);
      addToast("Workspace created successfully! Redirecting…", "success");
      // In real app: store tokens, redirect to /dashboard
    } catch (err) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message;
      if (status === 409) setApiError(msg || "A conflict occurred. Please check your email or workspace URL.");
      else if (status === 400) setApiError("Validation failed. Please review your inputs.");
      else setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(formData.password);

  const barClass = (i) => {
    if (i >= pwStrength.bars) return "pw-bar";
    const map = ["","filled-weak","filled-medium","filled-strong","filled-vstrong"];
    return `pw-bar ${map[pwStrength.score]}`;
  };

  const inputClass = (field, extra = "") => {
    const base = `fm-input ${extra}`;
    if (!touched[field]) return base;
    if (errors[field]) return `${base} error`;
    return `${base} success`;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <ToastContainer toasts={toasts} />

      <div className="reg-root">
        {/* ════ LEFT PANEL ════ */}
        <div className="reg-left">
          <div className="left-logo">
            <div className="logo-mark">FM</div>
            <div>
              <div className="logo-name">FoodMesh</div>
              <div className="logo-tag">Restaurant Operating System</div>
            </div>
          </div>

          <div className="left-heading">The Complete<br/>Restaurant OS</div>
          <p className="left-sub">
            Manage orders, inventory, CRM, finance, staff, and analytics from one powerful platform built for modern restaurants.
          </p>

          <div className="benefit-list">
            {BENEFITS.map((b, i) => (
              <div key={i} className="benefit-item">
                <div className="benefit-icon" style={{ background: b.bg }}>{b.icon}</div>
                <div>
                  <div className="benefit-title">{b.title}</div>
                  <div className="benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="trust-row">
            {["SSL Secured","GDPR Compliant","Enterprise Security","Multi-Tenant"].map(t => (
              <div key={t} className="trust-badge">
                <div className="trust-dot" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="reg-right">
          <div className="reg-card">
            {success ? (
              <div className="success-screen">
                <div className="success-circle">✅</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Workspace Created!</div>
                <div style={{ fontSize: 13, color: "var(--text2)", maxWidth: 320 }}>
                  Welcome to FoodMesh, <strong>{formData.firstName}</strong>!
                  Your restaurant workspace <strong style={{ color: "var(--accent)" }}>foodmesh.app/{formData.slug}</strong> is ready.
                </div>
                <button className="submit-btn" style={{ maxWidth: 240, marginTop: 8 }}
                        onClick={() => window.location.href = "/dashboard"}>
                  Go to Dashboard <IArrow />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="card-heading">Create Your Restaurant Workspace</div>
                <div className="card-sub">
                  Start managing your entire restaurant business from one platform.
                </div>

                {apiError && (
                  <div className="api-error">
                    <IAlert />
                    {apiError}
                  </div>
                )}

                {/* ── OWNER INFO ── */}
                <div className="form-section-label">Owner Information</div>

                <div className="field-row">
                  <div className="field">
                    <div className="field-label"><span className="field-label-text">First Name</span></div>
                    <div className="input-wrap">
                      <input ref={firstRef} className={inputClass("firstName")}
                             placeholder="Arjun" value={formData.firstName}
                             onChange={e => handleChange("firstName", e.target.value)}
                             onBlur={() => handleBlur("firstName")} />
                    </div>
                    {touched.firstName && errors.firstName && <div className="field-error"><IAlert />{errors.firstName}</div>}
                  </div>

                  <div className="field">
                    <div className="field-label"><span className="field-label-text">Last Name</span></div>
                    <div className="input-wrap">
                      <input className={inputClass("lastName")}
                             placeholder="Mehta" value={formData.lastName}
                             onChange={e => handleChange("lastName", e.target.value)}
                             onBlur={() => handleBlur("lastName")} />
                    </div>
                    {touched.lastName && errors.lastName && <div className="field-error"><IAlert />{errors.lastName}</div>}
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">
                    <span className="field-label-text">Email Address</span>
                    {checkingEmail && <span style={{ fontSize: 10, color: "var(--text3)" }}>Checking…</span>}
                    {!checkingEmail && emailUnique === true && touched.email && !errors.email &&
                      <span style={{ fontSize: 10, color: "var(--green)" }}>✓ Available</span>}
                  </div>
                  <div className="input-wrap">
                    <input className={inputClass("email", "with-icon-r")} type="email"
                           placeholder="arjun@spicegarden.com" value={formData.email}
                           onChange={e => handleChange("email", e.target.value)}
                           onBlur={() => handleBlur("email")} />
                    {touched.email && !errors.email && emailUnique === true &&
                      <span className="input-status">✅</span>}
                    {touched.email && errors.email &&
                      <span className="input-status">❌</span>}
                  </div>
                  {touched.email && errors.email && <div className="field-error"><IAlert />{errors.email}</div>}
                </div>

                <div className="field">
                  <div className="field-label"><span className="field-label-text">Phone Number</span></div>
                  <div className="phone-wrap">
                    <div className="country-sel">
                      🇮🇳 +91 <IChevD />
                    </div>
                    <input className={inputClass("phone") + " with-icon-r"}
                           placeholder="98765 43210" value={formData.phone} type="tel"
                           onChange={e => handleChange("phone", e.target.value)}
                           onBlur={() => handleBlur("phone")} />
                  </div>
                  {touched.phone && errors.phone && <div className="field-error"><IAlert />{errors.phone}</div>}
                </div>

                <div className="field-row">
                  <div className="field">
                    <div className="field-label"><span className="field-label-text">Password</span></div>
                    <div className="input-wrap">
                      <input className={inputClass("password", "with-icon-r")}
                             type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                             value={formData.password}
                             onChange={e => handleChange("password", e.target.value)}
                             onBlur={() => handleBlur("password")} />
                      <span className="input-icon-r" onClick={() => setShowPw(p => !p)}>
                        {showPw ? <IEyeOff /> : <IEye />}
                      </span>
                    </div>
                    {touched.password && errors.password && <div className="field-error"><IAlert />{errors.password}</div>}

                    {formData.password && (
                      <div className="pw-strength">
                        <div className="pw-bars">
                          {[0,1,2,3].map(i => <div key={i} className={barClass(i)} />)}
                        </div>
                        <div className="pw-criteria">
                          {[
                            ["upper",   "Uppercase"],
                            ["lower",   "Lowercase"],
                            ["number",  "Number"],
                            ["special", "Special char"],
                            ["length",  "8+ chars"],
                          ].map(([k, label]) => (
                            <div key={k} className={`pw-crit${pwStrength.checks?.[k] ? " met" : ""}`}>
                              <div className="pw-crit-dot">
                                {pwStrength.checks?.[k] && <ICheck />}
                              </div>
                              {label}
                            </div>
                          ))}
                        </div>
                        <div className="pw-label" style={{ color: pwStrength.color, marginTop: 6 }}>
                          {pwStrength.label}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="field">
                    <div className="field-label"><span className="field-label-text">Confirm Password</span></div>
                    <div className="input-wrap">
                      <input className={inputClass("confirmPassword", "with-icon-r")}
                             type={showCPw ? "text" : "password"} placeholder="Re-enter password"
                             value={formData.confirmPassword}
                             onChange={e => handleChange("confirmPassword", e.target.value)}
                             onBlur={() => handleBlur("confirmPassword")} />
                      <span className="input-icon-r" onClick={() => setShowCPw(p => !p)}>
                        {showCPw ? <IEyeOff /> : <IEye />}
                      </span>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword &&
                      <div className="field-error"><IAlert />{errors.confirmPassword}</div>}
                    {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword &&
                      <div className="field-success">✓ Passwords match</div>}
                  </div>
                </div>

                {/* ── RESTAURANT INFO ── */}
                <div className="form-section-label">Restaurant Information</div>

                <div className="field">
                  <div className="field-label"><span className="field-label-text">Restaurant / Company Name</span></div>
                  <div className="input-wrap">
                    <input className={inputClass("restaurantName")} placeholder="Spice Garden Restaurants"
                           value={formData.restaurantName}
                           onChange={e => handleChange("restaurantName", e.target.value)}
                           onBlur={() => handleBlur("restaurantName")} />
                  </div>
                  {touched.restaurantName && errors.restaurantName &&
                    <div className="field-error"><IAlert />{errors.restaurantName}</div>}
                </div>

                <div className="field">
                  <div className="field-label">
                    <span className="field-label-text">
                      Workspace URL
                      <span className="field-hint">(auto-generated)</span>
                    </span>
                    {checkingSlug && <span style={{ fontSize: 10, color: "var(--text3)" }}>Checking…</span>}
                    {!checkingSlug && slugUnique === true && touched.slug && !errors.slug &&
                      <span style={{ fontSize: 10, color: "var(--green)" }}>✓ Available</span>}
                  </div>
                  <div className="input-wrap">
                    <input className={inputClass("slug", "with-icon-r")} placeholder="spice-garden"
                           value={formData.slug}
                           onChange={e => handleChange("slug", e.target.value)}
                           onBlur={() => handleBlur("slug")} />
                    {touched.slug && !errors.slug && slugUnique === true &&
                      <span className="input-status">✅</span>}
                    {touched.slug && errors.slug &&
                      <span className="input-status">❌</span>}
                  </div>
                  {touched.slug && errors.slug && <div className="field-error"><IAlert />{errors.slug}</div>}
                  {formData.slug && !errors.slug && (
                    <div className="slug-preview">
                      🌐 Your workspace:&nbsp;
                      <span className="accent">foodmesh.app/{formData.slug}</span>
                    </div>
                  )}
                </div>

                {/* ── TERMS ── */}
                <div className="checkbox-row">
                  <div className={`custom-checkbox${agreed ? " checked" : ""}`}
                       onClick={() => setAgreed(a => !a)}>
                    {agreed && <ICheck />}
                  </div>
                  <div className="checkbox-label">
                    I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                    FoodMesh will process your data in accordance with GDPR.
                  </div>
                </div>

                {/* ── SUBMIT ── */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <><ISpinner /> Creating Workspace…</>
                  ) : (
                    <>Create Restaurant Workspace <IArrow /></>
                  )}
                </button>

                {/* ── TRUST ROW ── */}
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
                  {["🔒 SSL Secured","🇪🇺 GDPR Compliant","🏢 Enterprise Security"].map(t => (
                    <span key={t} style={{ fontSize: 11, color: "var(--text3)" }}>{t}</span>
                  ))}
                </div>

                <div className="card-footer">
                  Already have an account? <a href="/login">Sign In</a>
                </div>
              </form>
            )}
          </div>

          {/* bottom spacing */}
          <div style={{ height: 40 }} />
        </div>
      </div>
    </>
  );
}