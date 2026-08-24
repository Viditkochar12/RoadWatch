import React from "react";

/**
 * Composable Badge Component
 * Formats severity levels and status values into color-coded tags.
 */
export function Badge({ children, variant = "default", type = "severity", className = "" }) {
  const text = String(children || "");

  // Determine variant automatically if not explicitly given
  let computedVariant = variant;
  if (variant === "default") {
    const val = text.toLowerCase();
    if (val === "high" || val === "critical" || val === "rejected") computedVariant = "danger";
    else if (val === "medium" || val === "in progress") computedVariant = "warning";
    else if (val === "low" || val === "resolved") computedVariant = "success";
    else if (val === "pending") computedVariant = "info";
    else computedVariant = "neutral";
  }

  const variantStyles = {
    danger: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const icons = {
    danger: "🔴",
    warning: "🟡",
    success: "🟢",
    info: "🔵",
    purple: "🟣",
    neutral: "⚪",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
        variantStyles[computedVariant] || variantStyles.neutral
      } ${className}`}
    >
      <span className="text-[10px]" aria-hidden="true">
        {icons[computedVariant]}
      </span>
      <span>{children}</span>
    </span>
  );
}

export default Badge;
