import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { ControlPanel } from '../components/fairness/ControlPanel';
import { ImpactDashboard } from '../components/fairness/ImpactDashboard';
import { BiasWarning } from '../components/fairness/BiasWarning';
import { DualComparison } from '../components/fairness/DualComparison';
import { CandidatePassport } from '../components/fairness/CandidatePassport';
import { MOCK_POOL, simulateSelection, PRESETS } from '../lib/fairnessEngine';

export default function FairnessPlatform() {
  const [config, setConfig] = useState(PRESETS.balanced);
  const [activePreset, setActivePreset] = useState('balanced');
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [poolSize, setPoolSize] = useState(250);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [currentResult, setCurrentResult] = useState(null);
  const [balancedResult, setBalancedResult] = useState(null);
  
  const simulationTimeoutRef = useRef(null);

  useEffect(() => {
    const runSimulation = () => {
      setIsSimulating(true);
      if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
      
      simulationTimeoutRef.current = setTimeout(() => {
        const result = simulateSelection(MOCK_POOL, config, poolSize, 12);
        const balanced = simulateSelection(MOCK_POOL, PRESETS.balanced, poolSize, 12);
        
        setCurrentResult(result);
        setBalancedResult(balanced);
        setIsSimulating(false);
      }, simulationMode ? 150 : 0);
    };

    runSimulation();
    return () => { if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current); }
  }, [config, poolSize, simulationMode]);

  if (!currentResult || !balancedResult) return null;

  const score = parseFloat(currentResult.metrics.fairnessScore);
  
  let guardrailState = 'safe';
  if (score < 0.60) guardrailState = 'unacceptable';
  else if (score >= 0.60 && score < 0.75) guardrailState = 'borderline';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mt-24 font-sans text-gray-900">
      
      {/* Top Configuration Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setSimulationMode(!simulationMode)}
               className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-colors ${simulationMode ? 'bg-primary' : 'bg-gray-200'}`}
             >
                <motion.div 
                  layout
                  className="w-4 h-4 bg-white rounded-full absolute"
                  animate={{ left: simulationMode ? '1.25rem' : '0.25rem' }}
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                />
             </button>
             <span className="text-sm font-bold text-gray-700">Simulation Mode</span>
             {simulationMode && <span className="text-[10px] font-black tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase ml-2 border border-primary/20">Active</span>}
          </div>
          
          <AnimatePresence>
            {simulationMode && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-3 overflow-hidden ml-4 pl-4 border-l border-gray-200"
              >
                <span className="text-xs font-medium text-gray-500">Pool Size:</span>
                <input 
                  type="range" 
                  min="50" max="500" step="10"
                  value={poolSize}
                  onChange={(e) => setPoolSize(parseInt(e.target.value))}
                  className="w-32 accent-primary"
                />
                <span className="text-xs font-bold w-8 text-right text-primary">{poolSize}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          {isSimulating && (
             <div className="flex items-center gap-2 text-primary text-xs font-bold mr-4">
                <Loader2 size={14} className="animate-spin" />
                SIMULATING...
             </div>
          )}

          {/* Fairness Guardrail Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors
            ${guardrailState === 'safe' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
            ${guardrailState === 'borderline' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
            ${guardrailState === 'unacceptable' ? 'bg-red-50 border-red-200 text-red-700' : ''}
          `}>
             {guardrailState === 'safe' && <ShieldCheck size={16} />}
             {guardrailState === 'borderline' && <AlertTriangle size={16} />}
             {guardrailState === 'unacceptable' && <ShieldAlert size={16} />}
             <span className="text-sm font-bold capitalize">
               {guardrailState === 'safe' ? 'Fairness Safe' : guardrailState === 'borderline' ? 'Borderline' : 'Unacceptable'}
             </span>
             <span className="text-xs font-black ml-1 opacity-70">
                {score.toFixed(2)}
             </span>
          </div>

          <div className="relative group">
            <button 
              disabled={guardrailState === 'unacceptable'}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm
                ${guardrailState === 'unacceptable' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
                }
              `}
            >
              <Send size={16} /> Publish Shortlist
            </button>
            {guardrailState === 'unacceptable' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                Resolve fairness issues before publishing.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-[360px] border-r border-gray-200 bg-white p-6 flex flex-col h-full overflow-y-auto shrink-0 shadow-sm z-0">
           <ControlPanel 
              config={config} 
              setConfig={setConfig} 
              activePreset={activePreset} 
              setActivePreset={setActivePreset} 
           />
        </aside>

        {/* Right Dashboard Area */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
           <div className="max-w-[1200px] mx-auto pb-24">
              
              <BiasWarning 
                 score={score} 
                 config={config} 
              />
              
              <ImpactDashboard 
                 metrics={currentResult.metrics} 
                 isSimulating={isSimulating}
              />
              
              <DualComparison 
                 currentShortlist={currentResult.shortlist} 
                 balancedShortlist={balancedResult.shortlist}
                 onCandidateClick={setSelectedCandidate}
              />
              
           </div>
        </section>

      </div>

      {selectedCandidate && (
        <CandidatePassport 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}

    </div>
  );
}
