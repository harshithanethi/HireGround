import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export function Card({ className, hoverEffect = false, children, ...props }) {
  return (
    <motion.div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden",
        hoverEffect && "hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(220,38,38,0.1)] transition-all",
        className
      )}
      whileHover={hoverEffect ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}
