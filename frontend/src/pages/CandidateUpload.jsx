import { useState, useRef } from 'react'
import axios from 'axios'
import { API_BASE, DISTRICT_INDEX, COLLEGE_TIERS } from '../data/mockData'

const STEPS = ['Resume', 'Background', 'Context', 'Review']

const DISTRICTS = Object.keys(DISTRICT_INDEX)

export default function CandidateUpload() {
  const [step, setStep] = useState(0)
  const [resumeFile, setResumeFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    location: '', collegeType: '', collegeName: '',
    internetAccess: '', resourceAccess: '',
    firstGen: false, disability: false, workedWhileStudying: false,
    extraContext: '',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.docx'))) {
      setResumeFile(f); setStep(1)
    } else setError('Only PDF or DOCX accepted')
  }

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const data = new FormData()
      data.append('resume', resumeFile)
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)))
      // await axios.post(`${API_BASE}/api/candidate/upload`, data)
      await new Promise(r => setTimeout(r, 1400)) // mock delay
      setSubmitted(true)
    } catch {
      setError('Submission failed. Check your connection and retry.')
    } finally { setLoading(false) }
  }

  const inputCls = "w-full bg-[#0a0b18] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#f59e0b]/50 transition-all text-sm"
  const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2"
  const checkCls = (active) => `w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0
    ${active ? 'bg-[#f59e0b] border-[#f59e0b]' : 'border-white/20 hover:border-[#f59e0b]/40'}`

  // ── Opportunity credit preview ──
  const distIdx = DISTRICT_INDEX[form.location] || null
  const collegeBoost = form.collegeType ? COLLEGE_TIERS[form.collegeType]?.boost || 0 : 0
  const firstGenBoost = form.firstGen ? 5 : 0
  const internetBoost = form.internetAccess === 'none' ? 6 : form.internetAccess === 'limited' ? 3 : 0
  const disabilityBoost = form.disability ? 5 : 0
  const districtBoost = distIdx !== null ? Math.round((100 - distIdx) * 0.12) : 0
  const totalCredit = collegeBoost + firstGenBoost + internetBoost + disabilityBoost + districtBoost

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 border-2 border-[#f59e0b]/30 flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-white mb-3">Application Received</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-2">Our Opportunity Credit engine has assessed your context. Your <span className="text-[#f59e0b]">Fairness Passport</span> will be ready within 24 hours.</p>
        <div className="mt-6 bg-[#0a0b18] border border-white/8 rounded-2xl p-5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Estimated Opportunity Credit</p>
          <p className="text-4xl font-black text-[#f59e0b]">+{totalCredit}</p>
          <p className="text-white/30 text-xs mt-1">will be applied to your base score</p>
        </div>
        <button onClick={() => { setSubmitted(false); setStep(0); setResumeFile(null); setForm({ name:'',email:'',phone:'',location:'',collegeType:'',collegeName:'',internetAccess:'',resourceAccess:'',firstGen:false,disability:false,workedWhileStudying:false,extraContext:'' }) }}
          className="mt-6 px-5 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white text-sm transition-all">
          Submit another →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-6 py-12">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-bold text-[#f59e0b]/60 uppercase tracking-widest mb-3">Candidate Portal</p>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">Apply with <br /><span className="text-[#f59e0b]">Context.</span></h1>
          <p className="text-white/35 text-sm mt-3 leading-relaxed max-w-md">We evaluate what you achieved given what you had access to. Not just credentials — trajectory.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${i === step ? 'text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20' :
                  i < step ? 'text-white/50' : 'text-white/15'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black
                  ${i < step ? 'bg-[#f59e0b] text-[#04050f]' : i === step ? 'border-2 border-[#f59e0b] text-[#f59e0b]' : 'border border-white/15 text-white/20'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-px mx-1 ${i < step ? 'bg-[#f59e0b]/40' : 'bg-white/8'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Resume upload ── */}
        {step === 0 && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`relative border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
              ${dragging ? 'border-[#f59e0b] bg-[#f59e0b]/5 scale-[1.01]' : 'border-white/8 hover:border-[#f59e0b]/30 hover:bg-white/[0.01]'}`}>
            <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { const f=e.target.files[0]; if(f){setResumeFile(f);setStep(1)} }} />
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-5 transition-all
              ${dragging ? 'border-[#f59e0b]/40 bg-[#f59e0b]/10' : 'border-white/8 bg-white/[0.02] group-hover:border-[#f59e0b]/20'}`}>
              📄
            </div>
            <p className="text-white font-bold text-lg mb-1">Drop your resume here</p>
            <p className="text-white/25 text-sm">PDF or DOCX · Max 5MB</p>
            {error && <p className="mt-4 text-red-400/80 text-xs bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/10">{error}</p>}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[9px] font-bold text-emerald-400/60 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
              Encrypted
            </div>
          </div>
        )}

        {/* ── STEP 1: Basic info ── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* File chip */}
            <div className="flex items-center gap-3 bg-[#0a0b18] border border-white/8 rounded-xl px-4 py-3">
              <span className="text-xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{resumeFile?.name}</p>
                <p className="text-white/25 text-xs">{(resumeFile?.size/1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => { setResumeFile(null); setStep(0) }} className="text-xs text-white/20 hover:text-red-400 transition-colors">Remove</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Full Name *</label><input className={inputCls} placeholder="Priya Rajan" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
              <div><label className={labelCls}>Email *</label><input className={inputCls} placeholder="you@email.com" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
            </div>
            <div><label className={labelCls}>Phone (optional)</label><input className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>set('phone',e.target.value)} /></div>
            <div>
              <label className={labelCls}>Current City / District</label>
              <input className={inputCls} list="districts" placeholder="e.g. Ariyalur, TN" value={form.location} onChange={e=>set('location',e.target.value)} />
              <datalist id="districts">{DISTRICTS.map(d=><option key={d} value={d}/>)}</datalist>
              {form.location && DISTRICT_INDEX[form.location] !== undefined && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-white/30">District Opportunity Index:</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-500" style={{width: `${DISTRICT_INDEX[form.location]}%`}} />
                  </div>
                  <span className={`font-bold ${DISTRICT_INDEX[form.location] < 40 ? 'text-red-400' : DISTRICT_INDEX[form.location] < 70 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {DISTRICT_INDEX[form.location]}/100
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>College / Institution *</label>
                <input className={inputCls} placeholder="Govt. Arts College, Ariyalur" value={form.collegeName} onChange={e=>set('collegeName',e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Institution Type *</label>
                <select className={inputCls} value={form.collegeType} onChange={e=>set('collegeType',e.target.value)}>
                  <option value="">Select type...</option>
                  {Object.entries(COLLEGE_TIERS).map(([k,v])=>
                    <option key={k} value={k}>{v.label}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => step > 0 && setStep(s=>s-1)} className="px-5 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white text-sm transition-all">← Back</button>
              <button onClick={() => { if(!form.name||!form.email||!form.collegeType){setError('Please fill required fields');return}; setError(''); setStep(2) }}
                className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#04050f] font-bold text-sm transition-all shadow-lg shadow-[#f59e0b]/10">
                Continue →
              </button>
            </div>
            {error && <p className="text-red-400/70 text-xs">{error}</p>}
          </div>
        )}

        {/* ── STEP 2: Context fields ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-[#0a0b18] border border-[#f59e0b]/10 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">⚖️</span>
                <p className="text-white font-bold text-sm">Opportunity Context</p>
                <span className="ml-auto text-[9px] text-[#f59e0b]/60 uppercase tracking-widest">Used for fair scoring</span>
              </div>

              <div>
                <label className={labelCls}>Internet Access Growing Up</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:'reliable',l:'Reliable broadband'},{v:'limited',l:'Mobile data only'},{v:'none',l:'Rarely had access'}].map(o=>(
                    <button key={o.v} onClick={()=>set('internetAccess',o.v)}
                      className={`py-3 rounded-xl text-xs font-medium border transition-all text-center
                        ${form.internetAccess===o.v ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]' : 'border-white/8 text-white/30 hover:border-white/20 hover:text-white/60'}`}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Access to Resources (coaching, mentors, devices)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:'high',l:'Premium — coaching & mentors'},{v:'medium',l:'Some access'},{v:'low',l:'Self-taught, minimal'}].map(o=>(
                    <button key={o.v} onClick={()=>set('resourceAccess',o.v)}
                      className={`py-3 rounded-xl text-xs font-medium border transition-all text-center
                        ${form.resourceAccess===o.v ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]' : 'border-white/8 text-white/30 hover:border-white/20 hover:text-white/60'}`}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {k:'firstGen',l:'First-generation college student'},
                  {k:'disability',l:'Person with disability'},
                  {k:'workedWhileStudying',l:'Worked while studying to support family'},
                ].map(({k,l}) => (
                  <div key={k} className="flex items-center gap-3 cursor-pointer" onClick={()=>set(k,!form[k])}>
                    <div className={checkCls(form[k])}>{form[k]&&<span className="text-[#04050f] text-xs font-black">✓</span>}</div>
                    <span className="text-sm text-white/60">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Anything else you'd like us to know? (optional)</label>
              <textarea className={inputCls+' resize-none'} rows={3}
                placeholder="Caring for family, remote location challenges, language barriers..."
                value={form.extraContext} onChange={e=>set('extraContext',e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="px-5 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white text-sm transition-all">← Back</button>
              <button onClick={()=>setStep(3)} className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#04050f] font-bold text-sm transition-all shadow-lg shadow-[#f59e0b]/10">
                Review Application →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Credit preview */}
            <div className="bg-[#0a0b18] border border-[#f59e0b]/20 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Estimated Opportunity Credit Breakdown</p>
              <div className="space-y-2.5">
                {[
                  { label: 'District opportunity gap', val: districtBoost, active: districtBoost > 0 },
                  { label: 'College type adjustment', val: collegeBoost, active: collegeBoost > 0 },
                  { label: 'First-generation status', val: firstGenBoost, active: form.firstGen },
                  { label: 'Internet access gap', val: internetBoost, active: internetBoost > 0 },
                  { label: 'Disability adjustment', val: disabilityBoost, active: form.disability },
                ].map(item => (
                  <div key={item.label} className={`flex items-center justify-between transition-all ${!item.active ? 'opacity-20' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-[#f59e0b]' : 'bg-white/10'}`} />
                      <span className="text-xs text-white/50">{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${item.active ? 'text-[#f59e0b]' : 'text-white/20'}`}>
                      {item.val > 0 ? `+${item.val}` : item.val}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/60">Total Opportunity Credit</span>
                  <span className="text-xl font-black text-[#f59e0b]">+{totalCredit}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#0a0b18] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Your Application</p>
              {[
                { l: 'Name', v: form.name },
                { l: 'Email', v: form.email },
                { l: 'Location', v: form.location },
                { l: 'College', v: form.collegeName },
                { l: 'First-gen', v: form.firstGen ? 'Yes' : 'No' },
                { l: 'Resume', v: resumeFile?.name },
              ].map(row => (
                <div key={row.l} className="flex items-center justify-between">
                  <span className="text-xs text-white/25">{row.l}</span>
                  <span className="text-xs text-white/70 font-medium">{row.v || '—'}</span>
                </div>
              ))}
            </div>

            {error && <p className="text-red-400/70 text-xs">{error}</p>}

            <div className="flex gap-3">
              <button onClick={()=>setStep(2)} className="px-5 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white text-sm transition-all">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#04050f] font-black text-sm transition-all shadow-lg shadow-[#f59e0b]/15 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting...</> : 'Submit Application ↑'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}