import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Info } from 'lucide-react';

const WEIGHT_OPTIONS = ['low', 'medium', 'high'];

export function ControlPanel({ config, setConfig, activePreset, setActivePreset }) {
  const handlePreset = (presetName, presetData) => {
    setActivePreset(presetName);
    setConfig(presetData);
  };

  const handleToggle = (key) => {
    setConfig(prev => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: !prev.toggles[key] }
    }));
    setActivePreset('custom');
  };

  const handleWeight = (key, weight) => {
    setConfig(prev => ({
      ...prev,
      weights: { ...prev.weights, [key]: weight }
    }));
    setActivePreset('custom');
  };

  const CriterionRow = ({ title, itemKey, desc }) => {
    const isOn = config.toggles[itemKey];
    const weight = config.weights[itemKey];

    return (
      <div className="p-4 border border-gray-200 bg-white shadow-sm rounded-xl space-y-3 mb-3 relative overflow-hidden">
        {isOn && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => handleToggle(itemKey)} className="text-gray-400 hover:text-primary transition-colors">
              {isOn ? <ToggleRight className="text-primary" size={24} /> : <ToggleLeft size={24} />}
            </button>
            <span className={`font-bold ${isOn ? 'text-gray-900' : 'text-gray-400'}`}>{title}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600" title={desc}>
             <Info size={16} />
          </button>
        </div>
        
        {isOn && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="flex w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1 mt-2"
          >
            {WEIGHT_OPTIONS.map(w => (
              <button
                key={w}
                onClick={() => handleWeight(itemKey, w)}
                className={`flex-1 text-xs font-bold py-1.5 capitalize rounded-md transition-all ${
                  weight === w 
                  ? 'bg-white text-primary border border-gray-200 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
                }`}
              >
                {w}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="pr-2 -mr-2">
      <h2 className="text-xl font-black text-gray-900 mb-6">Fairness Config</h2>
      
      {/* Presets */}
      <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-gray-100 border border-gray-200 rounded-xl">
        {['conservative', 'balanced', 'aggressive'].map(p => (
          <button
            key={p}
            onClick={() => handlePreset(p, require('../../lib/fairnessEngine').PRESETS[p])}
            className={`text-xs font-bold uppercase py-2 rounded-lg transition-all ${
              activePreset === p 
              ? 'bg-white text-primary shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {p.substring(0, 3)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <CriterionRow 
          itemKey="districtDensity" 
          title="District Job Density" 
          desc="Boosts candidates from regions with low employment opportunities."
        />
        <CriterionRow 
          itemKey="collegeOpportunity" 
          title="College Opp. Index" 
          desc="Normalizes scores for graduates from Tier 2/3 institutions."
        />
        <CriterionRow 
          itemKey="infrastructure" 
          title="Infrastructure Score" 
          desc="Compensates for systemic academic drag caused by poor local infrastructure."
        />
        <CriterionRow 
          itemKey="firstGen" 
          title="First-Gen Graduate" 
          desc="Rewards candidates who are the first in their family to attend college."
        />
      </div>
    </div>
  );
}
