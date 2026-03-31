import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FairnessPassport from '../pages/FairnessPassport';
import ComparisonView from '../pages/ComparisonView';
import { useAppContext } from '../context/AppContext';

export function EvaluationSection() {
  const [activeTab, setActiveTab] = useState('breakdown');
  const { candidateResult } = useAppContext();

  const res = candidateResult || {
    candidate_name: 'Aarav Nair',
    baseline_score: 68,
    final_score: 89,
    context_adjustment: 21,
    parsed_data: { skills: ['React & Redux', 'System Design', 'TypeScript'] },
    passport: { ceos_score: 89 }
  };

  const skillsList = res.parsed_data?.skills && res.parsed_data.skills.length > 0
    ? res.parsed_data.skills.slice(0, 3)
    : ['General Experience', 'Problem Solving', 'Communication'];

  const tabs = [
    { id: 'breakdown', label: 'Score Breakdown' },
    { id: 'compare', label: 'Model Comparison' },
    { id: 'passport', label: 'Fairness Passport' }
  ];

  return (
    <div className="h-full flex flex-col pt-8 px-6 md:px-12 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Evaluation</h2>
          <p className="text-gray-500 font-medium">Analyze candidate fit and AI fairness.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0 overflow-x-auto w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="eval-tab-indicator"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {activeTab === 'breakdown' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Match Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Hard Skills (70% Weight)</h4>
                    <div className="space-y-4">
                      {skillsList.map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold">{skill}</span>
                            <span className="text-primary font-bold">{Math.max(40, 95 - i * 15)}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/80 rounded-full" style={{ width: `${Math.max(40, 95 - i * 15)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">CEOS Context Boost</h4>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">Total Context Boost</span>
                        <span className="text-xl font-black text-primary">+{Math.round(res.context_adjustment || 0)}</span>
                      </div>
                      <p className="text-sm text-gray-600">Calculated based on educational baseline and opportunity metrics.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compare' && (
              <div className="scale-95 origin-top-left w-[105%] h-full">
                {/* Scale slightly because ComparisonView was designed as full page */}
                <ComparisonView embedded={true} />
              </div>
            )}

            {activeTab === 'passport' && (
              <div className="scale-95 origin-top-left w-[105%] h-full">
                <FairnessPassport embedded={true} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
