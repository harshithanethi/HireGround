import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export function BiasWarning({ score, config }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newAlerts = [];
    
    if (score < 0.60) {
      newAlerts.push({
        id: 'red-unacceptable',
        type: 'error',
        message: 'Fairness score below 0.60 — High risk of systemic bias.',
        icon: AlertCircle
      });
    }

    if (config.toggles.collegeOpportunity && config.weights.collegeOpportunity === 'high' && 
       (!config.toggles.districtDensity || config.weights.districtDensity === 'low')) {
       newAlerts.push({
         id: 'yellow-tier',
         type: 'warning',
         message: 'Heavy reliance on college tier may disadvantage rural applicants.',
         icon: AlertTriangle
       });
    }

    if (score >= 0.75 && newAlerts.length === 0) {
      newAlerts.push({
        id: 'green-safe',
        type: 'success',
        message: 'Configuration is within fair hiring guidelines.',
        icon: CheckCircle2
      });
    }

    setAlerts(newAlerts);
  }, [score, config]);

  const dismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 w-full mb-6">
      <AnimatePresence>
        {alerts.map(alert => {
          const Icon = alert.icon;
          let bgColor = 'bg-white border-gray-200';
          let textColor = 'text-gray-900';
          let iconColor = 'text-gray-500';

          if (alert.type === 'error') {
            bgColor = 'bg-red-50 border-red-200';
            textColor = 'text-red-900';
            iconColor = 'text-red-600';
          } else if (alert.type === 'warning') {
            bgColor = 'bg-amber-50 border-amber-200';
            textColor = 'text-amber-900';
            iconColor = 'text-amber-600';
          } else if (alert.type === 'success') {
            bgColor = 'bg-emerald-50 border-emerald-200';
            textColor = 'text-emerald-900';
            iconColor = 'text-emerald-600';
          }

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, height: 0 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${bgColor} shadow-sm`}
            >
              <Icon className={`mt-0.5 flex-shrink-0 ${iconColor}`} size={18} />
              <div className={`flex-1 text-sm font-bold leading-relaxed ${textColor}`}>
                {alert.message}
              </div>
              <button onClick={() => dismiss(alert.id)} className={`p-1 hover:bg-black/5 rounded-md transition-colors opacity-60 hover:opacity-100 ${textColor}`}>
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
