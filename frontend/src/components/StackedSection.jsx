import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function StackedSection({ children, id, className = '' }) {
  const containerRef = useRef(null);
  
  // Track this container's progression entirely through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Scale down and fade as it goes behind the next section
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.90]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={containerRef} id={id} className={`relative h-[120vh] ${className}`}>
      {/* Sticky container that stays in view for 120vh of scrolling */}
      <div className="sticky top-0 h-screen flex justify-center p-4 pt-20 pb-6 md:p-8 md:pt-20 origin-top">
        <motion.div 
          style={{ scale, opacity, y }}
          className="w-full h-full max-w-6xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden transition-shadow"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
