import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/ScoreRing'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle2, Copy } from 'lucide-react'

function FactorBar({ label, value, max = 100, colorClass = "bg-primary" }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-bold mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900">{value}</span>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass} rounded-full`} 
        />
      </div>
    </div>
  )
}

export default function ComparisonView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Model Comparison</h1>
          <p className="text-gray-500 font-medium mt-1">Aarav Nair • Frontend Engineer</p>
        </div>
      </div>

      {/* Amber Impact Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-1">CEOS Rescue Triggered</h3>
          <p className="text-gray-600 font-medium">
            This candidate fails standard parsing models due to college name mismatch and low keyword density. 
            The <strong className="text-gray-900">CEOS Model</strong> identifies structural disadvantages (Rural district + Tier-3 college) and applies a <strong className="text-secondary">+21 Opportunity Credit</strong>, pushing them over the shortlist threshold.
          </p>
        </div>
      </motion.div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 pt-4">
        {/* Left: Uniform Model */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-400">Standard Model</h2>
            <Badge variant="neutral" className="uppercase tracking-widest text-[10px]">Rejected</Badge>
          </div>
          <Card className="p-8 border-gray-200 bg-gray-50/50">
            <div className="flex flex-col items-center mb-10">
              <ScoreRing score={68} size={100} strokeWidth={8} />
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Base Score</div>
                <div className="text-xs text-gray-400 mt-1">Fails 75.0 threshold</div>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-200 pt-6">
              <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Factor Breakdown</h4>
              <FactorBar label="Keyword Match" value={72} colorClass="bg-gray-400" />
              <FactorBar label="Experience Depth" value={65} colorClass="bg-gray-400" />
              <FactorBar label="Education Prestigate" value={40} colorClass="bg-gray-400" />
              
              <div className="h-px bg-gray-200 my-4" />
              <div className="flex justify-between font-bold text-gray-500">
                <span>Final Output</span>
                <span>68</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: CEOS Model */}
        <div className="space-y-6 relative">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-900">HireGround CEOS <span className="text-primary">*</span></h2>
            <Badge variant="rescued" className="uppercase tracking-widest text-[10px] gap-1"><CheckCircle2 size={12}/> Recommended</Badge>
          </div>
          <Card className="p-8 border-primary/20 shadow-[0_8px_32px_rgba(220,38,38,0.08)] relative overflow-hidden">
            {/* Red accent top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
            
            <div className="flex flex-col items-center mb-10 mt-2">
              <ScoreRing score={89} size={100} strokeWidth={8} />
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-primary uppercase tracking-widest">Adjusted Score</div>
                <div className="text-xs text-gray-500 mt-1">Passes 75.0 threshold</div>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Factor Breakdown</h4>
              <FactorBar label="Raw Baseline" value={68} colorClass="bg-gray-300" />
              
              <div className="bg-secondary/5 -mx-4 px-4 py-4 rounded-xl border border-secondary/10 relative">
                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-secondary/20 rounded-full flex items-center justify-center text-[10px] font-black text-secondary">+</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="text-secondary"><Copy size={14} /></span> Opportunity Credit
                  </span>
                  <span className="font-black text-secondary">+21</span>
                </div>
                <div className="space-y-1 mt-3">
                  <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Rural Base (Wayanad)</span><span>+12</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">Tier-3 Institution</span><span>+7</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span className="font-bold">First-Gen Graduate</span><span>+2</span></div>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between font-black text-xl text-gray-900">
                <span>Final Output</span>
                <span>89</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="pt-8 flex justify-end">
        <Link to="/passport/1">
          <Button size="lg" className="shadow-lg shadow-primary/20">Generate Fairness Passport →</Button>
        </Link>
      </div>
    </div>
  )
}