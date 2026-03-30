import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FileUp, CheckCircle2, ChevronRight, File } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function CandidateUpload() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const navigate = useNavigate()

  const resumeInputRef = useRef(null);
  const certInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null)
  const [certFile, setCertFile] = useState(null)

  const nextStep = () => {
    setDirection(1)
    if (step < 5) setStep(step + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    if (step > 1) setStep(step - 1)
  }

  const finish = () => {
    navigate('/candidate')
  }

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 w-full p-4 md:p-8">
      {/* Header & Step Indicator */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Upload Candidate</h1>
            <p className="text-gray-500 font-medium mt-1">Submit resume and map socio-economic context.</p>
          </div>
          <div className="hidden sm:flex bg-gray-100 p-1.5 rounded-full items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex items-center text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${step >= i ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}>
                {step > i ? <CheckCircle2 size={16} className="mr-1" /> : <span className="mr-1">{i}.</span>}
                {i === 1 ? 'Info' : i === 2 ? 'Context' : i === 3 ? 'Resume' : i === 4 ? 'Income' : 'Review'}
              </div>
            ))}
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <Card className="min-h-[400px] flex flex-col relative overflow-hidden bg-white mt-10 shadow-[0_4px_40px_rgba(0,0,0,0.04)]">
        <div className="flex-1 p-8 md:p-12 relative">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Basic Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Aarav Nair" defaultValue="Aarav Nair" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="aarav@email.com" defaultValue="aarav@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role Applied For</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Frontend Engineer" defaultValue="Frontend Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="3" defaultValue="3" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Environmental Context</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">District / Local Area</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Wayanad" defaultValue="Wayanad" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Area Classification</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-medium">
                      <option>Rural</option>
                      <option>Semi-rural</option>
                      <option>Urban</option>
                      <option>Metro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Institution / College Tier</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-medium">
                      <option>Tier 3 (State / Unranked)</option>
                      <option>Tier 2 (Private / State Top)</option>
                      <option>Tier 1 (NIT / BITS)</option>
                      <option>IIT / IIM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First-Gen Graduate</label>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                        <input type="radio" name="firstgen" className="w-4 h-4 text-primary focus:ring-primary" defaultChecked /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                        <input type="radio" name="firstgen" className="w-4 h-4 text-primary focus:ring-primary" /> No
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6 flex flex-col h-full"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Upload Resume</h2>
                <p className="text-gray-500 mb-6 font-medium">PDF or DOCX (Max 5MB). Parsed securely on edge.</p>

                <input type="file" className="hidden" ref={resumeInputRef} onChange={(e) => setResumeFile(e.target.files[0])} accept=".pdf,.docx,.doc" />

                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl flex-1 flex flex-col items-center justify-center p-12 transition-colors cursor-pointer group
                    ${resumeFile ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-gray-50'}
                  `}
                >
                  {resumeFile ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-1">{resumeFile.name}</h3>
                      <p className="text-sm text-primary/70 font-medium">Click to select a different file</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <FileUp size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Click to browse local files</h3>
                      <p className="text-sm text-gray-500 font-medium">or drag and drop resume here</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6 flex flex-col h-full"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Income Certificate</h2>
                <p className="text-gray-500 mb-6 font-medium">Please upload valid government income certificate or relevant proof (Optional).</p>

                <input type="file" className="hidden" ref={certInputRef} onChange={(e) => setCertFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />

                <div
                  onClick={() => certInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl flex-1 flex flex-col items-center justify-center p-12 transition-colors cursor-pointer group
                    ${certFile ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-gray-50'}
                  `}
                >
                  {certFile ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-1">{certFile.name}</h3>
                      <p className="text-sm text-primary/70 font-medium">Click to select a different file</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <FileUp size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Click to select certificate</h3>
                      <p className="text-sm text-gray-500 font-medium">PDF or Image accepted</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-positive/10 text-positive flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Ready for Processing</h2>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                  Aarav's profile is ready. HireGround will extract skills and apply CEOS balancing against uniform baselines.
                </p>

                <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-xl text-left">
                  <h4 className="font-bold text-gray-900 mb-1">Opportunity Credit Generation</h4>
                  <p className="text-sm text-gray-600">
                    Credits will be auto-calculated from district job density (DPIIT), college tier (NIRF), and connectivity index (TRAI).
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 mx-auto max-w-md">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
                    <File className="text-gray-400" />
                    <div>
                      <div className="font-bold text-gray-900 line-clamp-1">{resumeFile ? resumeFile.name : 'aarav_nair_resume.pdf'}</div>
                      <div className="text-xs text-gray-500">Resume • Parsed offline</div>
                    </div>
                  </div>
                  {certFile && (
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
                      <File className="text-gray-400" />
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{certFile.name}</div>
                        <div className="text-xs text-gray-500">Income Certificate • Verified locally</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-6 flex justify-between items-center px-12 z-20">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1} className={step === 1 ? 'opacity-0' : ''}>
            Back
          </Button>

          {step < 5 ? (
            <Button onClick={nextStep} className="gap-2 px-8">
              Next Step <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={finish} className="gap-2 px-8 shadow-lg shadow-primary/20">
              Run Extraction
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}