import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Lightbulb, Activity, ShieldCheck } from 'lucide-react';

export function CandidatePassport({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: -20, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <img src={candidate.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" />
              <div>
                <h2 className="text-2xl font-black text-gray-900">{candidate.name}</h2>
                <div className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
                  <span className="text-primary">ID: {candidate.id}</span>
                  •
                  <span>Fairness Audit Log</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Scrolling Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            
            {/* 1. Context Classification Tags */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={16} /> Context Classification
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.region === 'Rural' && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold">
                    🌳 Rural District
                  </span>
                )}
                {candidate.collegeTier > 1 && (
                  <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold">
                    🏛️ Tier-{candidate.collegeTier} Institution
                  </span>
                )}
                {candidate.firstGen && (
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm font-bold">
                    🎓 First-Gen Graduate
                  </span>
                )}
                {candidate.infrastructureDecile <= 5 && (
                  <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-bold">
                    🏗️ Low Infrastructure ({candidate.infrastructureDecile}/10)
                  </span>
                )}
              </div>
            </section>

            {/* 2. Base Score Breakdown */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> Base Algorithmic Score
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-900 font-bold">{candidate.baseScore} <span className="text-gray-400 font-normal">/ 100</span></span>
                  <span className="text-gray-500 text-sm font-bold">Pre-adjustment</span>
                </div>
                {/* Visual Bar Segment */}
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.skillsScore}%` }}
                    className="h-full bg-primary border-r border-white"
                    title={`Skills Match: ${candidate.skillsScore}`}
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.experienceScore}%` }}
                    className="h-full bg-rose-300"
                    title={`Experience Level: ${candidate.experienceScore}`}
                  />
                </div>
                <div className="flex items-center gap-6 mt-3 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Skills ({candidate.skillsScore})</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-300"></div> Experience ({candidate.experienceScore})</div>
                </div>
              </div>
            </section>

            {/* 3. Opportunity Credits */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={16} /> Opportunity Credits
              </h3>
              <div className="space-y-2">
                {candidate.creditsBreakdown?.length > 0 ? (
                  candidate.creditsBreakdown.map((credit, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      key={i} 
                      className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <div className="text-gray-900 font-bold text-sm">{credit.label}</div>
                        <div className="text-gray-500 text-xs mt-0.5 font-medium">{credit.reason}</div>
                      </div>
                      <div className="text-emerald-600 font-black flex items-center gap-1">
                        +{credit.value.toFixed(1)}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic px-2 font-medium">No opportunity credits applied.</div>
                )}
              </div>
            </section>

          </div>

          {/* Footer - 4. Final Score Reasoning */}
          <div className="p-6 border-t border-indigo-100 bg-indigo-50/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-indigo-600/20">
                <span className="text-xl font-black">{candidate.finalScore.toFixed(0)}</span>
              </div>
              <div>
                <h4 className="text-indigo-900 font-bold mb-1 flex items-center gap-2">
                  <Lightbulb size={16}/> Fairness Reasoning
                </h4>
                <p className="text-indigo-800/80 text-sm leading-relaxed font-medium">
                  {candidate.opportunityCredits > 0 ? (
                    `This candidate's baseline algorithmic score was adjusted upward by ${candidate.opportunityCredits.toFixed(1)} due to contextual factors including ${candidate.region === 'Rural' ? 'regional employment constraints' : ''}${candidate.region === 'Rural' && candidate.infrastructureDecile <= 5 ? ' and ' : ''}${candidate.infrastructureDecile <= 5 ? 'infrastructure constraints in their district.' : '.'}`
                  ) : (
                    "This candidate's final score reflects their baseline algorithmic rating as no fairness opportunity credits were applicable under the current configuration."
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
