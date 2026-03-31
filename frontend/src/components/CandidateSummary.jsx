import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { User, MapPin, GraduationCap, Building, ArrowRight } from 'lucide-react';

import { useAppContext } from '../context/AppContext';

export function CandidateSummary() {
  const navigate = useNavigate();
  const { candidateResult, jobConfig } = useAppContext();

  const res = candidateResult || {
    candidate_name: 'Aarav Nair',
    parsed_data: { district: 'Wayanad, Kerala', college_tier: 'Tier 3 State College', first_gen_flag: true },
    passport: { ceos_score: 88, adjustment_breakdown: [] },
    final_score: 88,
    context_adjustment: 12
  };
  const district = res.parsed_data?.district || 'Unknown District';
  const name = res.candidate_name || 'Aarav Nair';
  const initials = name.slice(0, 2).toUpperCase();
  const ceos = res.passport?.ceos_score || 88;

  return (
    <div className="h-full flex flex-col pt-8 px-6 md:px-12 w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Profile</h2>
        <p className="text-gray-500 font-medium">{name} • {jobConfig?.title || 'Frontend Engineer'} Candidate</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-8 shadow-sm border border-gray-100 flex items-start gap-6 bg-gradient-to-br from-white to-gray-50">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-gray-400 shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{name}</h3>
            <p className="text-primary font-bold mb-4">Applying for: {jobConfig?.title || 'Frontend Engineer'}</p>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <MapPin size={16} className="text-gray-400" /> {district}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Building size={16} className="text-gray-400" /> Experience extracted
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <GraduationCap size={16} className="text-gray-400" /> {res.parsed_data?.college_tier || 'Tier 3'}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <User size={16} className="text-gray-400" /> {res.parsed_data?.first_gen_flag ? 'First-Gen' : 'Standard Baseline'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-gray-100 flex flex-col justify-center bg-primary text-white">
          <div className="text-primary-100 font-bold mb-1 uppercase tracking-wider text-sm">Final Score</div>
          <div className="text-6xl font-black mb-2 tracking-tighter">{Math.round(res.final_score || ceos)}<span className="text-2xl text-primary-200">/100</span></div>
          <div className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full text-white w-max">
            CEOS Passport: {ceos.toFixed(1)}
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex-1">
        <h4 className="font-bold text-gray-900 mb-4">Contextual Insights</h4>
        <p className="text-gray-600 leading-relaxed mb-6">
          {name} demonstrates exceptional skill density despite potential structural limitations. Baseline comparison with uniform metrics shows a higher grit factor. The opportunity metrics indicate a gap bridged by {res.context_adjustment || 0} credits through HireGround's algorithmic balancing mechanism.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {res.passport?.adjustment_breakdown?.map((b, i) => (
            <span key={i} className="px-3 py-1 bg-positive/10 text-positive rounded-full text-xs font-bold">{b}</span>
          )) || <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Standard Profile</span>}
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">Skills: {res.parsed_data?.skills ? res.parsed_data.skills.slice(0,3).join(", ") : ''}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400 font-medium">Ready to review this candidate's evaluation breakdown?</p>
          <button
            onClick={() => navigate('/evaluation')}
            className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all text-sm"
          >
            Proceed to Evaluation <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}