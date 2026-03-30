import { motion } from 'framer-motion'
import { HeroNav } from '../components/HeroNav'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/ScoreRing'
import { Badge } from '../components/ui/Badge'
import { ArrowUp, MapPin, Zap, Shield, FileText, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'

export default function Hero() {
  return (
    <PageTransition className="min-h-screen bg-white">
      <HeroNav />

      {/* SECTION 1 - HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-12 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-[96px] font-black text-primary leading-[0.9] tracking-tighter mb-8"
            >
              Hire for potential.<br />Not just credentials.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-700 max-w-2xl leading-relaxed font-medium mb-10"
            >
              HireGround's CEOS model corrects for rural infrastructure gaps, college tier inequity, and district job scarcity giving every resume a fair, explainable score.
            </motion.p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 my-16" />

        {/* Product Showcase Mosaic */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 grid sm:grid-cols-2 gap-6 items-stretch"
          >
            <Card hoverEffect className="p-6 h-full border-2 border-primary">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">Priya Sharma</h3>
                  <p className="text-gray-500 text-sm">Full Stack Developer</p>
                </div>
                <ScoreRing score={85} size={54} strokeWidth={5} />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="credit">+12 Rural</Badge>
                <Badge variant="credit">+7 Tier-3</Badge>
                <Badge variant="outline">Thrissur</Badge>
              </div>
              <div className="text-xs font-bold text-positive flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-positive" />
                CEOS Shortlist #3
              </div>
            </Card>

            <Card hoverEffect className="p-6 bg-gray-50/50 border-2 border-primary h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Rahul V.</h3>
                  <p className="text-gray-500 text-sm">Data Analyst</p>
                </div>
                <ScoreRing score={68} size={54} strokeWidth={5} />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="neutral">Metro Hub</Badge>
                <Badge variant="neutral">Tier-1 IT</Badge>
              </div>
              <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                Raw baseline applies
              </div>
            </Card>
          </motion.div>

          <Card hoverEffect className="p-6 bg-gray-50/50 border-2 border-primary h-full">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Stop letting keywords decide shortlists.
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Our Opportunity Credit engine maps applicants to real-world socio-economic data (DPIIT, NIRF) instantly. Find hidden gems structurally disadvantaged by standard AI parsers.
            </p>
          </Card>
        </div>

        {/* BUTTON BELOW ALL CARDS */}
        <div className="flex justify-center mt-12">
          <Link to="/app">
            <Button variant="primary" size="lg" className="rounded-full px-10 shadow-xl">
              Launch Platform
            </Button>
          </Link>
        </div>
      </section>

      {/* SECTION 2 - HOW IT WORKS */}
      <section className="bg-gray-50 py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-16 text-center">How It Works</h2>

          <div className="relative flex flex-col md:flex-row justify-between items-start">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-primary/30 z-0" />
            {/* Connecting Line Mobile */}
            <div className="block md:hidden absolute top-[28px] bottom-[28px] left-[28px] w-[2px] border-l-2 border-dashed border-primary/30 z-0" />

            {[
              { num: 1, title: "Upload Resume", desc: "Extract skills, experience, education" },
              { num: 2, title: "Map to Context", desc: "District job density, college tier" },
              { num: 3, title: "Baseline Score", desc: "Standard ML extraction & matching" },
              { num: 4, title: "Opportunity Credit", desc: "Adds offset for structural gaps" },
              { num: 5, title: "Final CEOS", desc: "Fair, explainable rank" },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex md:flex-col items-start md:items-center gap-6 md:gap-4 mb-10 md:mb-0 md:w-1/5 text-left md:text-center px-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                  {step.num}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-500 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - STAT REPORT */}
      <section className="bg-primary text-white py-20" id="results">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 bg-primary">
            {[
              { stat: "2,400+", label: "Evaluated" },
              { stat: "+11 pts", label: "Avg Credit" },
              { stat: "28%", label: "Rural Shortlist" },
              { stat: "0.87", label: "Fairness Score" },
              { stat: "640+", label: "Districts Mapped" }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">{s.stat}</div>
                <div className="text-white/80 font-bold text-sm tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - RESULTS TABLE */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">The CEOS Difference</h2>
          <Card className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-5 px-6 font-bold text-gray-500 w-1/3 text-sm tracking-wider uppercase">Metric</th>
                  <th className="py-5 px-6 font-bold text-gray-500 text-sm tracking-wider uppercase relative">Uniform Model</th>
                  <th className="py-5 px-6 font-black text-primary text-sm tracking-wider uppercase bg-primary/5">HireGround CEOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 font-bold">Rural shortlist share</td>
                  <td className="py-5 px-6 text-gray-500">12%</td>
                  <td className="py-5 px-6 font-bold text-gray-900 bg-primary/5">
                    28% <span className="text-positive ml-2 inline-flex items-center"><ArrowUp size={14} className="mr-0.5" /> 133%</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 font-bold">Top talent preserved</td>
                  <td className="py-5 px-6 text-gray-500">95%</td>
                  <td className="py-5 px-6 font-bold text-gray-900 bg-primary/5">94%</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 font-bold">Fairness score</td>
                  <td className="py-5 px-6 text-gray-500">0.62</td>
                  <td className="py-5 px-6 font-bold text-gray-900 bg-primary/5">
                    0.87 <span className="text-positive ml-2 inline-flex items-center"><ArrowUp size={14} className="mr-0.5" /> 40%</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 font-bold">Explainability</td>
                  <td className="py-5 px-6 text-gray-500">Black Box</td>
                  <td className="py-5 px-6 font-bold text-gray-900 bg-primary/5 text-secondary flex items-center gap-1.5 break-words">
                    <FileText size={16} /> Passport per candidate
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* SECTION 5 - FEATURE BENTO */}
      <section className="bg-primary py-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hoverEffect className="p-8 bg-white border-2 border-white">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Opportunity Credit Engine</h3>
              <p className="text-gray-500 leading-relaxed">Dynamically adds localized credit points to baseline scores based on structural disadvantages.</p>
            </Card>

            <Card hoverEffect className="p-8 bg-white border-8 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">India-Specific Context</h3>
              <p className="text-gray-500 leading-relaxed">Powered by DPIIT index, TRAI broadband statistics, and NIRF college tier mappings.</p>
            </Card>

            <Card hoverEffect className="p-8 bg-white border-8 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Bias-Safe & Compliant</h3>
              <p className="text-gray-500 leading-relaxed">Relies strictly on environmental signals. No demographic factors like gender or religion are extracted.</p>
            </Card>

            <Card hoverEffect className="p-8 bg-white border-8 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Fairness Passport</h3>
              <p className="text-gray-500 leading-relaxed">Every candidate gets a government-grade report explaining exactly how their score was calculated.</p>
            </Card>

            <Card hoverEffect className="p-8 bg-white border-2 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ArrowUp size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Side-by-side Impact</h3>
              <p className="text-gray-500 leading-relaxed">Compare standard raw LLM outputs against CEOS adjusted scoring right in the dashboard.</p>
            </Card>

            <Card hoverEffect className="p-8 bg-white border-2 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Offline Edge Capable</h3>
              <p className="text-gray-500 leading-relaxed">Runs effectively in low bandwidth Indian areas, synchronizing batch scores natively.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black">H</div>
            <span className="font-black tracking-tight text-xl text-gray-900">HireGround</span>
          </div>
          <div className="text-sm font-bold text-gray-400">
            Fair hiring infrastructure for India.
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}
