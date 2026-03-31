import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, UserCheck, Scale } from 'lucide-react';

export function DualComparison({ currentShortlist, balancedShortlist, onCandidateClick }) {
  const [isOpen, setIsOpen] = useState(true);

  const currentIds = new Set(currentShortlist.map(c => c.id));
  const balancedIds = new Set(balancedShortlist.map(c => c.id));

  const currentAvg = currentShortlist.reduce((acc, c) => acc + c.finalScore, 0) / (currentShortlist.length || 1);
  const balancedAvg = balancedShortlist.reduce((acc, c) => acc + c.finalScore, 0) / (balancedShortlist.length || 1);
  const delta = (currentAvg - balancedAvg).toFixed(2);
  
  const CandidateRow = ({ candidate, isUnique }) => (
    <motion.div
      layout
      onClick={() => onCandidateClick(candidate)}
      className={`flex items-center gap-3 p-3 mb-2 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm
        ${isUnique 
          ? 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400' 
          : 'bg-white border-gray-200 hover:border-gray-400'
        }
      `}
    >
      <img src={candidate.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
      <div className="flex-1 min-w-0">
        <h4 className="text-gray-900 font-bold text-sm truncate">{candidate.name}</h4>
        <div className="flex gap-2 text-xs text-gray-500 font-medium">
          <span>{candidate.region}</span> • 
          <span>Tier {candidate.collegeTier}</span>
          {candidate.firstGen && <span>• 1st Gen</span>}
        </div>
      </div>
      <div className="flex flex-col items-end justify-center px-1">
        <span className="text-xl font-black text-gray-900 leading-none">{candidate.finalScore.toFixed(0)}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Score</span>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      
      {/* Header / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Scale className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">System Comparison View</h2>
        </div>
        <div className="flex items-center gap-4">
           {isOpen ? <ChevronUp className="text-gray-500" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
        </div>
      </div>

      {/* Split Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              
              {/* Left Column: Custom */}
              <div className="p-5 flex flex-col bg-white h-[500px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <UserCheck size={16} className="text-emerald-600"/> Your Configuration
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold">Shortlist</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  <AnimatePresence>
                    {currentShortlist.map(c => (
                      <CandidateRow key={`curr-${c.id}`} candidate={c} isUnique={!balancedIds.has(c.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Balanced System Preset */}
              <div className="p-5 flex flex-col bg-gray-50/50 h-[500px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Scale size={16} className="text-indigo-600"/> System Recommended (Balanced)
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-md border border-indigo-100">Baseline</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  <AnimatePresence>
                    {balancedShortlist.map(c => (
                      <CandidateRow key={`bal-${c.id}`} candidate={c} isUnique={!currentIds.has(c.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Aggregate footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">
                <span className="inline-block w-3 h-3 rounded-sm bg-indigo-100 border border-indigo-300 mr-2 align-middle"></span>
                Highlights indicate candidates unique to that specific configuration.
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-sm font-bold">
                    <span className="text-gray-500 mr-2">Config Avg Score:</span>
                    <span className="text-gray-900 text-lg">{currentAvg.toFixed(1)}</span>
                 </div>
                 <div className="text-sm font-bold">
                    <span className="text-gray-500 mr-2">Score Delta:</span>
                    <span className={`text-lg ${parseFloat(delta) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {parseFloat(delta) > 0 ? '+' : ''}{delta}
                    </span>
                 </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
