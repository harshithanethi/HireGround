import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-gray-50",
    outline: "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  }
  
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}
