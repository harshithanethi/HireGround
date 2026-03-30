import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/ScoreRing'
import { Button } from '../components/ui/Button'
import { Printer, CheckCircle2, Landmark, MapPin, Download } from 'lucide-react'

export default function FairnessPassport() {
  const { id } = useParams()

  const dummyData = {
    id: `HG-2025-00${id || '91'}`,
    name: 'Aarav Nair',
    role: 'Frontend Engineer',
    date: '30 October 2025',
    district: 'Wayanad',
    state: 'Kerala',
    area: 'Rural',
    connectivity: 'Low / 3G Dominant',
    collegeTier: 'Tier-3 (State / Unranked)',
    firstGen: 'Yes',
    experience: '3 Years',
    ceos: 89,
    raw: 68,
    credit: 21,
    rank: 'Top 10%',
    skills: ['React', 'JavaScript', 'Tailwind', 'RESTful APIs', 'Node.js', 'PostgreSQL', 'Framer Motion'],
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-black text-gray-900 tracking-tight">Official Record</h1>
         <div className="flex gap-3">
           <Button variant="outline" className="text-xs h-9 gap-2 shadow-sm font-bold">
             <Printer size={14} /> Print
           </Button>
           <Button variant="secondary" className="text-xs h-9 gap-2 bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-white transition-colors">
             <Download size={14} /> Export PDF
           </Button>
         </div>
      </div>

      {/* PASSPORT DOCUMENT */}
      <Card className="p-0 border-gray-200 overflow-hidden rounded-none sm:rounded-2xl shadow-xl shadow-gray-200/50 bg-white">
        
        {/* Document Header */}
        <div className="border-b-4 border-primary px-8 py-10 bg-gray-50/50 relative">
          <div className="absolute top-10 right-8 text-right">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Passport ID</div>
             <div className="font-mono text-lg font-bold text-gray-900 bg-white border border-gray-200 px-3 py-1 shadow-inner inline-block">{dummyData.id}</div>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
             <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-black text-xl shadow-md">H</div>
             <h2 className="text-xl font-black tracking-tight uppercase text-gray-900">HireGround <span className="text-primary opacity-80">Platform</span></h2>
          </div>
          <h3 className="text-5xl font-black text-gray-900 mt-6 tracking-tighter">{dummyData.name}</h3>
          <div className="flex items-center gap-4 mt-3">
             <span className="text-lg font-bold text-gray-600">{dummyData.role}</span>
             <span className="text-gray-300">•</span>
             <span className="text-sm font-bold text-gray-500">{dummyData.date}</span>
             {dummyData.ceos >= 75 && (
               <>
                 <span className="text-gray-300">•</span>
                 <span className="inline-flex items-center gap-1 bg-positive/10 text-positive px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm"><CheckCircle2 size={12} /> Eligible</span>
               </>
             )}
          </div>
        </div>

        {/* Score Hero */}
        <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 gap-8">
          <div className="flex items-center gap-8">
            <ScoreRing score={dummyData.ceos} size={140} strokeWidth={12} />
            <div>
              <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Final CEOS Metric</div>
              <div className="text-4xl font-black text-gray-900 leading-none">{dummyData.ceos}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:w-1/2">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Raw Base</div>
              <div className="text-xl font-bold text-gray-700">{dummyData.raw}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Opportunity Credit</div>
              <div className="text-xl font-black text-secondary">+{dummyData.credit}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Performance Bracket</div>
              <div className="text-sm font-bold text-gray-900 py-1.5 px-3 bg-gray-100 inline-block">{dummyData.rank}</div>
            </div>
          </div>
        </div>

        {/* Environmental Context */}
        <div className="px-8 py-10 bg-gray-50/50">
          <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
            <MapPin size={16} className="text-primary" /> Environmental Context Signatures
          </h4>
          
          <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Locale</span>
              <span className="font-bold text-gray-900">{dummyData.district}, {dummyData.state}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Area Class</span>
              <span className="font-bold text-gray-900">{dummyData.area}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Digital Infrastructure</span>
              <span className="font-bold text-gray-900">{dummyData.connectivity}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">College Tier Ranking</span>
              <span className="font-bold text-primary">{dummyData.collegeTier}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">First-Gen Graduate</span>
              <span className="font-bold text-gray-900">{dummyData.firstGen}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience Level</span>
              <span className="font-bold text-gray-900">{dummyData.experience}</span>
            </div>
          </div>
        </div>

        {/* Applied Opportunity Credits */}
        <div className="px-8 py-10">
          <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
            <Landmark size={16} className="text-secondary" /> Applied Opportunity Credit Computations
          </h4>
          
          <div className="space-y-4">
            <div className="bg-secondary/5 border-l-4 border-secondary p-4 flex gap-4 text-sm">
              <div className="font-black text-lg text-secondary min-w-[36px]">+12</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Rural Macro-economy Adjustment (Wayanad)</div>
                <div className="text-gray-600 leading-snug">Wayanad district indicates 4× fewer IT sector jobs per capita compared to national median. (Source: DPIIT 2023 Employment Data)</div>
              </div>
            </div>
            <div className="bg-secondary/5 border-l-4 border-secondary p-4 flex gap-4 text-sm">
              <div className="font-black text-lg text-secondary min-w-[36px]">+7</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Institution Tier Adjustment (Tier-3)</div>
                <div className="text-gray-600 leading-snug">College not ranked in top 200. Automatically adjusts expected resume keyword density to reflect non-standard curricula. (Source: NIRF 2024 Rankings)</div>
              </div>
            </div>
            <div className="bg-secondary/5 border-l-4 border-secondary p-4 flex gap-4 text-sm">
              <div className="font-black text-lg text-secondary min-w-[36px]">+2</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">First-Generation Modifier</div>
                <div className="text-gray-600 leading-snug">Self-reported structural gap in corporate networking and mentorship availability.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Explanation */}
        <div className="px-8 py-10 border-t border-gray-100 bg-white">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h5 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Extracted Skill Signatures</h5>
              <div className="flex flex-wrap gap-2">
                {dummyData.skills.map((s, i) => (
                  <span key={i} className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Algorithmic Assessment Summary</h5>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Candidate demonstrates strong front-end competencies. While baseline keyword matching penalized non-standard project phrasing and institution lack-of-prestige, the CEOS credit engine successfully normalized these factors against systemic regional averages. Candidate's core capabilities map reliably to the top 10% of the applicant pool when controlling for environment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-gray-900 text-white p-6 text-[10px] font-medium leading-relaxed uppercase tracking-wider text-center flex flex-col sm:flex-row justify-between items-center opacity-90">
          <span className="mb-2 sm:mb-0">Generated by HireGround CEOS v1.2</span>
          <span>Algorithmic output • Requires human recruiter review • Zero Demographic Biometrics Used</span>
        </div>
      </Card>
      
      <div className="pb-12 text-center">
        <Link to="/dashboard" className="text-primary font-bold hover:underline text-sm">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}