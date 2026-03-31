import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/ScoreRing'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { Search, Filter, MoreHorizontal, FileText, ArrowUpRight, TrendingUp, MapPin } from 'lucide-react'

// Dummy Data
const DB_CANDIDATES = [
  { id: '1', name: 'Aarav Nair', role: 'Frontend Engineer', district: 'Wayanad, KL', raw: 68, ceos: 89, credit: 21, rescued: true, tags: ['Rural', 'Tier-3', 'First-Gen'] },
  { id: '2', name: 'Sneha Patel', role: 'Data Scientist', district: 'Ahmedabad, GJ', raw: 85, ceos: 87, credit: 2, rescued: false, tags: ['Urban', 'Tier-1'] },
  { id: '3', name: 'Vikram Singh', role: 'Backend Engineer', district: 'Bikaner, RJ', raw: 62, ceos: 80, credit: 18, rescued: true, tags: ['Semi-Rural', 'Tier-2'] },
  { id: '4', name: 'Rohan Gupta', role: 'Product Manager', district: 'Mumbai, MH', raw: 92, ceos: 92, credit: 0, rescued: false, tags: ['Metro', 'Tier-1'] },
  { id: '5', name: 'Megha Reddy', role: 'UX Designer', district: 'Warangal, TG', raw: 71, ceos: 83, credit: 12, rescued: false, tags: ['Semi-Urban', 'Tier-2'] },
  { id: '6', name: 'Kiran Das', role: 'DevOps Engineer', district: 'Purulia, WB', raw: 60, ceos: 75, credit: 15, rescued: true, tags: ['Rural', 'Tier-3'] },
]

export default function RecruiterDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Talent Pipeline</h1>
          <p className="text-gray-500 font-medium mt-1">Review your latest processed applications.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={16} /> Filters
          </Button>
          <Link to="/upload">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              Upload CV
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Evaluated', value: '142', sub: '+12 this week' },
          { label: 'Avg CEOS Score', value: '78', sub: 'vs 65 Raw', isPrimary: true },
          { label: 'Rescued Status', value: '28', sub: 'Pass threshold due to credits' },
          { label: 'Total Credits', value: '+1,560', sub: 'Across pipeline' },
        ].map((stat, i) => (
          <Card key={i} className="p-5">
            <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-3xl font-black tracking-tighter ${stat.isPrimary ? 'text-primary' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <div className="text-gray-400 flex items-center gap-1 font-medium mt-1 text-xs">
              {stat.isPrimary && <TrendingUp size={12} className="text-positive" />}
              {stat.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-none">
        <button className="px-4 py-1.5 rounded-full bg-gray-900 text-white font-bold text-sm whitespace-nowrap">All Candidates</button>
        <button className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 font-bold text-sm whitespace-nowrap">Rescued Candidates</button>
        <button className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 font-bold text-sm whitespace-nowrap">First-Gen Only</button>
        <button className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 font-bold text-sm whitespace-nowrap">Rural / Semi-Rural</button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DB_CANDIDATES.map((cand, i) => (
          <motion.div
            key={cand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card hoverEffect className="relative h-full flex flex-col group">
              {/* Rescued Stripe */}
              {cand.rescued && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-500 shadow-inner">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight flex items-center gap-2">
                        {cand.name}
                        {cand.rescued && <span className="bg-primary/10 text-primary text-[10px] uppercase px-1.5 py-0.5 rounded font-black tracking-widest">Rescued</span>}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">{cand.role}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-5">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Raw</span>
                    <span className="text-xl font-bold text-gray-700">{cand.raw}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-1 px-3">
                    <div className="flex items-center gap-1 text-secondary font-black text-sm mb-1 bg-secondary/10 px-2 rounded-full">
                      +{cand.credit} Credit
                    </div>
                    <div className="w-full h-px border-t border-dashed border-gray-300" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CEOS</span>
                    <ScoreRing score={cand.ceos} size={46} strokeWidth={4} />
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-2">
                    <MapPin size={12} /> {cand.district}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.tags.map(t => (
                      <Badge key={t} variant="neutral">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link to="/compare" className="w-full">
                    <Button variant="outline" className="w-full text-xs h-9">Compare</Button>
                  </Link>
                  <Link to={`/passport/${cand.id}`} className="w-full">
                    <Button variant="secondary" className="w-full text-xs h-9 bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-white transition-colors">Passport</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}