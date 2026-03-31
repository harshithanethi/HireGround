import { useMemo, useState } from "react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"
import { formatPct, safeNumber, uid } from "../adminUtils"

const TYPE_OPTIONS = [
  "Representation Target",
  "Score Credit Multiplier",
  "Hard Filter",
]

const TARGET_FIELDS = [
  { value: "isRural", label: "is_rural" },
  { value: "isFirstGen", label: "is_first_gen" },
  { value: "collegeTier", label: "college_tier" },
  { value: "jobDensityIndex", label: "job_density_index" },
  { value: "cgpa", label: "cgpa" },
  { value: "district", label: "district" },
]

const OPS = ["==", "!=", ">=", "<=", ">", "<"]

function evalCond(left, op, right) {
  if (op === "==") return left === right
  if (op === "!=") return left !== right
  const ln = Number(left)
  const rn = Number(right)
  if (!Number.isFinite(ln) || !Number.isFinite(rn)) return false
  if (op === ">=") return ln >= rn
  if (op === "<=") return ln <= rn
  if (op === ">") return ln > rn
  if (op === "<") return ln < rn
  return false
}

function getValue(candidate, field) {
  if (field === "isRural") return candidate.isRural
  if (field === "isFirstGen") return candidate.isFirstGen
  if (field === "collegeTier") return candidate.collegeTier
  if (field === "jobDensityIndex") return candidate.jobDensityIndex
  if (field === "cgpa") return candidate.resume?.cgpa
  if (field === "district") return candidate.district
  return candidate[field]
}

export default function AdminConstraints() {
  const { state, computedCandidates, addConstraint, updateConstraint, deleteConstraint } = useAdmin()
  const [editingId, setEditingId] = useState(null)

  const equitableShortlisted = useMemo(
    () => computedCandidates.filter((c) => c.derived.equitableDecision === "Shortlisted"),
    [computedCandidates]
  )

  const constraintRows = useMemo(() => {
    return state.constraints.map((c) => {
      let currentLabel = "—"
      let met = true

      if (c.type === "Representation Target") {
        const match = equitableShortlisted.filter((cand) => evalCond(getValue(cand, c.targetField), c.op, c.value))
        const pct = equitableShortlisted.length ? (match.length / equitableShortlisted.length) * 100 : 0
        currentLabel = `${formatPct(pct, 1)}`
        met = safeNumber(pct, 0) >= safeNumber(c.targetPct, 0)
      }

      return { ...c, currentLabel, met }
    })
  }, [state.constraints, equitableShortlisted])

  const [draft, setDraft] = useState({
    name: "",
    description: "",
    type: "Representation Target",
    targetField: "isRural",
    op: "==",
    value: true,
    enforcement: "advisory",
    active: true,
    targetPct: 25,
    creditPoints: 4,
  })

  function resetDraft() {
    setDraft({
      name: "",
      description: "",
      type: "Representation Target",
      targetField: "isRural",
      op: "==",
      value: true,
      enforcement: "advisory",
      active: true,
      targetPct: 25,
      creditPoints: 4,
    })
  }

  function submit() {
    if (!draft.name.trim()) return

    const base = {
      id: uid("constraint"),
      name: draft.name.trim(),
      description: draft.description.trim(),
      type: draft.type,
      targetField: draft.targetField,
      op: draft.op,
      value: coerceValue(draft.value),
      enforcement: draft.enforcement,
      active: Boolean(draft.active),
    }

    if (draft.type === "Representation Target") {
      addConstraint({
        ...base,
        targetPct: safeNumber(draft.targetPct, 0),
        targetValueLabel: `≥ ${safeNumber(draft.targetPct, 0)}% of shortlist`,
      })
    } else if (draft.type === "Score Credit Multiplier") {
      addConstraint({ ...base, creditPoints: safeNumber(draft.creditPoints, 0) })
    } else {
      addConstraint(base)
    }

    resetDraft()
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Social Constraints</h1>
        <p className="text-gray-500 font-medium mt-1">Equity goals and protected group targets (soft constraints + optional hard enforcement).</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-gray-900 font-black tracking-tight">Active constraints</div>
            <div className="text-gray-500 font-medium text-sm mt-1">Current values computed against the equitable shortlist.</div>
          </div>
          <Badge variant="outline" className="border-gray-200 text-gray-700">
            Equitable shortlisted: <span className="ml-1 text-gray-900 font-black">{equitableShortlisted.length}</span>
          </Badge>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Constraint Name</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Type</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Target Group</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Target Value</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Current Value</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Enforcement</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Active</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Edit / Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {constraintRows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    {c.description ? <div className="text-xs font-medium text-gray-500 mt-0.5">{c.description}</div> : null}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-gray-200 text-gray-700">{c.type}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {String(c.targetField)} {String(c.op)} {String(c.value)}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {c.type === "Representation Target" ? c.targetValueLabel : c.type === "Score Credit Multiplier" ? `+${safeNumber(c.creditPoints, 0)} pts` : "Hard filter"}
                  </td>
                  <td className="px-4 py-3">
                    {c.type === "Representation Target" ? (
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900">{c.currentLabel}</span>
                        <span className={`text-xs font-black ${c.met ? "text-positive" : "text-secondary"}`}>{c.met ? "✅" : "⚠️"}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-bold">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => updateConstraint(c.id, { enforcement: c.enforcement === "hard" ? "advisory" : "hard" })}
                      className={`w-12 h-7 rounded-full border relative transition-colors ${
                        c.enforcement === "hard" ? "bg-primary/20 border-primary/20" : "bg-gray-200 border-gray-300"
                      }`}
                      aria-label={`Toggle enforcement for ${c.name}`}
                      title={c.enforcement === "hard" ? "Hard" : "Advisory"}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                          c.enforcement === "hard" ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => updateConstraint(c.id, { active: !c.active })}
                      className={`w-12 h-7 rounded-full border relative transition-colors ${
                        c.active ? "bg-positive/20 border-positive/20" : "bg-gray-200 border-gray-300"
                      }`}
                      aria-label={`Toggle active for ${c.name}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                          c.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingId((v) => (v === c.id ? null : c.id))}
                        className="text-gray-900 font-black hover:underline"
                      >
                        {editingId === c.id ? "Close" : "Edit"}
                      </button>
                      <button type="button" onClick={() => deleteConstraint(c.id)} className="text-primary font-black hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {constraintRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-bold">No constraints yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <EditConstraint
              constraint={state.constraints.find((c) => c.id === editingId)}
              onChange={(patch) => updateConstraint(editingId, patch)}
            />
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="text-gray-900 font-black tracking-tight">Add constraint</div>
        <div className="text-gray-500 font-medium text-sm mt-1">Create a new equity goal or policy.</div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Text label="Constraint Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} />
          <Select label="Type" value={draft.type} onChange={(v) => setDraft((d) => ({ ...d, type: v }))} options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
          <Text label="Description / Rationale" value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} className="md:col-span-2" />
          <Select label="Target Field" value={draft.targetField} onChange={(v) => setDraft((d) => ({ ...d, targetField: v }))} options={TARGET_FIELDS} />
          <Select label="Operator" value={draft.op} onChange={(v) => setDraft((d) => ({ ...d, op: v }))} options={OPS.map((o) => ({ value: o, label: o }))} />
          <Text label="Value" value={String(draft.value)} onChange={(v) => setDraft((d) => ({ ...d, value: v }))} />
          <Select
            label="Enforcement mode"
            value={draft.enforcement}
            onChange={(v) => setDraft((d) => ({ ...d, enforcement: v }))}
            options={[
              { value: "advisory", label: "Advisory (shows warning)" },
              { value: "hard", label: "Hard (blocks shortlist if violated)" },
            ]}
          />

          {draft.type === "Representation Target" && (
            <Num label="Target Value (% of shortlist)" value={draft.targetPct} onChange={(v) => setDraft((d) => ({ ...d, targetPct: v }))} />
          )}

          {draft.type === "Score Credit Multiplier" && (
            <Num label="Credit points" value={draft.creditPoints} onChange={(v) => setDraft((d) => ({ ...d, creditPoints: v }))} />
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <Button onClick={submit} className="shadow-lg shadow-primary/20">Add Constraint</Button>
          <Button variant="outline" onClick={resetDraft}>Reset</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-gray-900 font-black tracking-tight">Constraint audit log</div>
        <div className="text-gray-500 font-medium text-sm mt-1">Read-only history of changes.</div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Action</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Constraint</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Admin ID</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {state.constraintAuditLog.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3"><Badge variant="outline" className="border-gray-200 text-gray-700">{l.action}</Badge></td>
                  <td className="px-4 py-3 font-bold text-gray-900">{l.constraintName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{l.adminId}</td>
                  <td className="px-4 py-3 font-bold text-gray-700">{new Date(l.at).toLocaleString()}</td>
                </tr>
              ))}
              {state.constraintAuditLog.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-bold">No audit entries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function coerceValue(v) {
  if (v === "true") return true
  if (v === "false") return false
  const n = Number(v)
  if (Number.isFinite(n) && String(v).trim() !== "") return n
  return v
}

function EditConstraint({ constraint, onChange }) {
  if (!constraint) return null
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Text label="Constraint Name" value={constraint.name} onChange={(v) => onChange({ name: v })} />
      <Select label="Type" value={constraint.type} onChange={(v) => onChange({ type: v })} options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
      <Text label="Description / Rationale" value={constraint.description || ""} onChange={(v) => onChange({ description: v })} className="md:col-span-2" />
      <Select label="Target Field" value={constraint.targetField} onChange={(v) => onChange({ targetField: v })} options={TARGET_FIELDS} />
      <Select label="Operator" value={constraint.op} onChange={(v) => onChange({ op: v })} options={OPS.map((o) => ({ value: o, label: o }))} />
      <Text label="Value" value={String(constraint.value)} onChange={(v) => onChange({ value: coerceValue(v) })} />
      {constraint.type === "Representation Target" && (
        <Num label="Target % (shortlist)" value={constraint.targetPct ?? 0} onChange={(v) => onChange({ targetPct: v, targetValueLabel: `≥ ${v}% of shortlist` })} />
      )}
      {constraint.type === "Score Credit Multiplier" && (
        <Num label="Credit points" value={constraint.creditPoints ?? 0} onChange={(v) => onChange({ creditPoints: v })} />
      )}
    </div>
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

function Num({ label, value, onChange }) {
  return (
    <label>
      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(safeNumber(e.target.value, 0))}
        className="w-full h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-black text-sm text-gray-900 px-3"
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

