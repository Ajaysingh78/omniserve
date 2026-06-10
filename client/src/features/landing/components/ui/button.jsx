export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800",
    secondary:
      "bg-slate-200 text-slate-900 hover:bg-slate-300",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}