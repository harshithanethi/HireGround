import { Card } from '../components/ui/Card';
import { User, MapPin, GraduationCap, Building } from 'lucide-react';

export function CandidateSummary() {
  return (
    <div className="h-full flex flex-col pt-8 px-6 md:px-12 w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Profile</h2>
        <p className="text-gray-500 font-medium">Aarav Nair • Frontend Engineer Candidate</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-8 shadow-sm border border-gray-100 flex items-start gap-6 bg-gradient-to-br from-white to-gray-50">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-gray-400 shrink-0">
            AN
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Aarav Nair</h3>
            <p className="text-primary font-bold mb-4">Applying for: Frontend Engineer</p>
            
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <MapPin size={16} className="text-gray-400" /> Wayanad, Kerala
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Building size={16} className="text-gray-400" /> 3 Years Exp (Self-taught)
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <GraduationCap size={16} className="text-gray-400" /> Tier 3 State College
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <User size={16} className="text-gray-400" /> First-Gen Graduate
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-gray-100 flex flex-col justify-center bg-primary text-white">
          <div className="text-primary-100 font-bold mb-1 uppercase tracking-wider text-sm">CEOS Composite Score</div>
          <div className="text-6xl font-black mb-2 tracking-tighter">88<span className="text-2xl text-primary-200">/100</span></div>
          <div className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full text-white w-max">
            Top 12% among adjusted baselines
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex-1">
        <h4 className="font-bold text-gray-900 mb-4">Contextual Insights</h4>
        <p className="text-gray-600 leading-relaxed mb-6">
          Aarav demonstrates exceptional skill density in modern frontend technologies despite coming from a low-opportunity region. His baseline comparison with metro candidates shows a higher grit factor, having taught himself React and Node.js without formal institutional support. 
        </p>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">High Grit Indicator</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">Self-Driven Learner</span>
          <span className="px-3 py-1 bg-positive/10 text-positive rounded-full text-xs font-bold">+12% Opportunity Credit</span>
        </div>
      </div>
    </div>
  );
}
