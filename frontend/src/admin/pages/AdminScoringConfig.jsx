import { useMemo, useState } from "react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"
import { formatScore, safeNumber, uid } from "../adminUtils"

const FIELD_OPTIONS = [
  { value: "collegeTier", label: "college_tier" },
  { value: "district", label: "district" },
  { value: "isRural", label: "is_rural" },
  { value: "isFirstGen", label: "is_first_gen" },
  { value: "jobDensityIndex", label: "job_density_index" },
  { value: "cgpa", label: "cgpa" },
]

const OP_OPTIONS = [
  { value: "==", label: "==" },
  { value: "!=", label: "!=" },
  { value: ">=", label: ">=" },
  { value: "<=", label: "<=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
]

function Toggle({ value, onChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Active shortlisting model</div>
        <div className="text-xl font-black text-gray-900 tracking-tight mt-1">
          {value === "equitable" ? "Custom Equitable" : "Baseline Absolute"} <span className="text-gray-300 font-black">active</span>
        </div>
        <div className="text-sm text-gray-500 font-medium mt-1">This propagates across the whole admin dashboard.</div>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
        <button
          type="button"
          onClick={() => onChange("baseline")}
          className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            value === "baseline" ? "text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {value === "baseline" && <span className="absolute inset-0 bg-white rounded-lg shadow-sm" />}
          <span className="relative z-10">Baseline Absolute</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("equitable")}
          className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            value === "equitable" ? "text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {value === "equitable" && <span className="absolute inset-0 bg-white rounded-lg shadow-sm" />}
          <span className="relative z-10">Custom Equitable</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminScoringConfig() {
  const {
    state,
    weightsTotal,
    setActiveShortlistingModel,
    updateBaselineWeights,
    setAdjustmentCap,
    addOpportunityRule,
    updateOpportunityRule,
    deleteOpportunityRule,
  } = useAdmin()

  const [preview, setPreview] = useState({
    skillsCount: 6,
    cgpa: 7.8,
    projectsCount: 3,
    internshipsCount: 1,
    certificationsCount: 2,
    experienceMonths: 12,
  })

  const [showAdd, setShowAdd] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    field: "collegeTier",
    op: "==",
    value: "Tier3",
    points: 5,
  })

  const [savedAt, setSavedAt] = useState(null)

  const previewScore = useMemo(() => {
    const total = weightsTotal || 1
    const w = Object.fromEntries(Object.entries(state.baselineWeights).map(([k, v]) => [k, safeNumber(v, 0) / total]))
    const skillsNorm = Math.min(100, (safeNumber(preview.skillsCount, 0) / 8) * 100)
    const cgpaNorm = Math.min(100, (safeNumber(preview.cgpa, 0) / 10) * 100)
    const projectsNorm = Math.min(100, (safeNumber(preview.projectsCount, 0) / 6) * 100)
    const internshipsNorm = Math.min(100, (safeNumber(preview.internshipsCount, 0) / 2) * 100)
    const certNorm = Math.min(100, (safeNumber(preview.certificationsCount, 0) / 4) * 100)
    const expNorm = Math.min(100, (safeNumber(preview.experienceMonths, 0) / 36) * 100)

    return (
      skillsNorm * w.skillsMatch +
      cgpaNorm * w.cgpa +
      projectsNorm * w.projects +
      internshipsNorm * w.internships +
      certNorm * w.certifications +
      expNorm * w.experienceMonths
    )
  }, [preview, state.baselineWeights, weightsTotal])

  function saveConfiguration() {
    setSavedAt(new Date().toISOString())
  }

  function addRule() {
    if (!newRule.name.trim()) return
    addOpportunityRule({
      id: uid("rule"),
      name: newRule.name.trim(),
      field: newRule.field,
      op: newRule.op,
      value: newRule.value,
      points: safeNumber(newRule.points, 0),
      active: true,
    })
    setNewRule({ name: "", field: "collegeTier", op: "==", value: "Tier3", points: 5 })
    setShowAdd(false)
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Scoring Configuration</h1>
        <p className="text-gray-500 font-medium mt-1">Define baseline weights and opportunity credit rules (auditable).</p>
      </div>

      <Card className="p-6">
        <Toggle value={state.activeShortlistingModel} onChange={setActiveShortlistingModel} />
      </Card>

      {weightsTotal !== 100 && (
        <Card className="p-5 border-primary/20 bg-primary/5">
          <div className="font-black text-gray-900">Warning: baseline weights must sum to 100%.</div>
          <div className="text-sm text-gray-600 font-medium mt-1">
            Current total: <span className="font-black text-primary">{weightsTotal}%</span>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-gray-900 font-black tracking-tight">Baseline scoring weights</div>
              <div className="text-gray-500 font-medium text-sm mt-1">Must sum to 100%.</div>
            </div>
            <Badge variant="outline" className="border-gray-200 text-gray-700">
              Total: <span className={`${weightsTotal === 100 ? "text-gray-900" : "text-primary"} ml-1 font-black`}>{weightsTotal}%</span>
            </Badge>
          </div>

          <div className="space-y-4">
            <WeightRow label="Skills Match" value={state.baselineWeights.skillsMatch} onChange={(v) => updateBaselineWeights({ skillsMatch: v })} />
            <WeightRow label="CGPA" value={state.baselineWeights.cgpa} onChange={(v) => updateBaselineWeights({ cgpa: v })} />
            <WeightRow label="Projects" value={state.baselineWeights.projects} onChange={(v) => updateBaselineWeights({ projects: v })} />
            <WeightRow label="Internships" value={state.baselineWeights.internships} onChange={(v) => updateBaselineWeights({ internships: v })} />
            <WeightRow label="Certifications" value={state.baselineWeights.certifications} onChange={(v) => updateBaselineWeights({ certifications: v })} />
            <WeightRow label="Experience Months" value={state.baselineWeights.experienceMonths} onChange={(v) => updateBaselineWeights({ experienceMonths: v })} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-gray-900 font-black tracking-tight">Live preview</div>
          <div className="text-gray-500 font-medium text-sm mt-1">
            If weights are saved, a candidate with inputs below would score:
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <Num label="X skills" value={preview.skillsCount} onChange={(v) => setPreview((p) => ({ ...p, skillsCount: v }))} />
            <Num label="Y CGPA" value={preview.cgpa} step="0.1" onChange={(v) => setPreview((p) => ({ ...p, cgpa: v }))} />
            <Num label="Z projects" value={preview.projectsCount} onChange={(v) => setPreview((p) => ({ ...p, projectsCount: v }))} />
            <Num label="Internships" value={preview.internshipsCount} onChange={(v) => setPreview((p) => ({ ...p, internshipsCount: v }))} />
            <Num label="Certifications" value={preview.certificationsCount} onChange={(v) => setPreview((p) => ({ ...p, certificationsCount: v }))} />
            <Num label="Exp months" value={preview.experienceMonths} onChange={(v) => setPreview((p) => ({ ...p, experienceMonths: v }))} />
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Predicted baseline score</div>
              <div className="text-4xl font-black tracking-tighter text-gray-900 mt-1">{formatScore(previewScore, 1)}</div>
            </div>
            <Badge variant="outline" className="border-gray-200 text-gray-700">
              Threshold: <span className="ml-1 text-gray-900 font-black">≥ {state.shortlistThreshold}</span>
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-gray-900 font-black tracking-tight">Opportunity credit rules</div>
            <div className="text-gray-500 font-medium text-sm mt-1">Each rule adds auditable points when conditions match.</div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Hard cap</span>
              <input
                type="number"
                value={state.opportunity.adjustmentCap}
                onChange={(e) => setAdjustmentCap(e.target.value)}
                className="w-24 h-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-black text-sm text-gray-900 px-3"
                min={0}
                max={100}
              />
              <span className="text-sm font-bold text-gray-500">pts</span>
            </label>
            <Button variant="outline" size="sm" className="h-10 text-sm" onClick={() => setShowAdd((v) => !v)}>
              + Add Rule
            </Button>
          </div>
        </div>

        {showAdd && (
          <div className="mt-5 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="grid md:grid-cols-6 gap-3 items-end">
              <Text label="Rule Name" value={newRule.name} onChange={(v) => setNewRule((r) => ({ ...r, name: v }))} className="md:col-span-2" />
              <Select label="Field" value={newRule.field} onChange={(v) => setNewRule((r) => ({ ...r, field: v }))} options={FIELD_OPTIONS} />
              <Select label="Operator" value={newRule.op} onChange={(v) => setNewRule((r) => ({ ...r, op: v }))} options={OP_OPTIONS} />
              <Text label="Value" value={newRule.value} onChange={(v) => setNewRule((r) => ({ ...r, value: v }))} />
              <Num label="Credit pts" value={newRule.points} onChange={(v) => setNewRule((r) => ({ ...r, points: v }))} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={addRule}>Add</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Rule Name</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Condition</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Credit Points</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Active</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {state.opportunity.rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-bold text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {String(r.field)} {String(r.op)} {String(r.value)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={r.points}
                      onChange={(e) => updateOpportunityRule(r.id, { points: safeNumber(e.target.value, 0) })}
                      className="w-28 h-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-black text-sm text-gray-900 px-3"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => updateOpportunityRule(r.id, { active: !r.active })}
                      className={`w-12 h-7 rounded-full border relative transition-colors ${
                        r.active ? "bg-positive/20 border-positive/20" : "bg-gray-200 border-gray-300"
                      }`}
                      aria-label={`Toggle ${r.name}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                          r.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => deleteOpportunityRule(r.id)}
                      className="text-primary font-black hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {state.opportunity.rules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 font-bold">No rules yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-xs font-semibold text-gray-500">
            Maximum total adjustment allowed:{" "}
            <span className="font-black text-gray-900">{state.opportunity.adjustmentCap}</span> pts
          </div>
          <div className="flex items-center gap-2">
            {savedAt && (
              <Badge variant="outline" className="border-gray-200 text-gray-700">
                Saved {new Date(savedAt).toLocaleTimeString()}
              </Badge>
            )}
            <Button onClick={saveConfiguration} className="shadow-lg shadow-primary/20">
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function WeightRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
      <div className="font-black text-gray-900">{label}</div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(safeNumber(e.target.value, 0))}
          className="w-24 h-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-black text-sm text-gray-900 px-3"
          min={0}
          max={100}
        />
        <span className="text-sm font-black text-gray-500">%</span>
      </div>
    </div>
  )
}

function Num({ label, value, onChange, step, className }) {
  return (
    <label className={className}>
      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(safeNumber(e.target.value, 0))}
        className="w-full h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-black text-sm text-gray-900 px-3"
      />
    </label>
  )
}

function Text({ label, value, onChange, className }) {
  return (
    <label className={className}>
      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-900 px-3"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-900 px-3"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

