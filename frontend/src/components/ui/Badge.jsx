import { cn } from "../../lib/utils"

export function Badge({ children, variant = "neutral", className }) {
  const variants = {
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
    rescued: "bg-primary text-white border-primary",
    credit: "bg-secondary text-white border-secondary",
    fair: "bg-positive text-white border-positive",
    outline: "bg-white text-gray-700 border-gray-200 border",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
