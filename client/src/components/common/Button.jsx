import React from "react";

/**
 * Composable Button Component
 * Supports variants: primary, secondary, outline, danger, warning, ghost.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  className = "",
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs gap-1.5",
    md: "px-5 py-3 text-sm gap-2",
    lg: "px-7 py-4 text-base gap-2.5",
    pill: "px-8 py-4 rounded-full text-base gap-2",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-900 shadow-md shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30 hover:-translate-y-0.5 focus:ring-amber-400",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 focus:ring-slate-900",
    outline:
      "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white hover:-translate-y-0.5 focus:ring-slate-900",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 focus:ring-red-500",
    warning:
      "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 hover:-translate-y-0.5 focus:ring-amber-500",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}

      <span>{children}</span>

      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}

export default Button;
