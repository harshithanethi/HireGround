import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"
import { CollegeTierBadge, StatusBadge, YesNoBadge, DecisionBadge } from "../components/AdminBadges"
import { formatScore } from "../adminUtils"
import { ChevronLeft, Info } from "lucide-react"

function Toggle({ value, onChange, leftLabel, rightLabel, tooltip }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Score system</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-sm font-black text-gray-900 tracking-tight">
            {value === "baseline" ? "Baseline Absolute Scoring" : "Custom Equitable Scoring"}
          </div>
          <span title={tooltip} className="text-gray-400 hover:text-gray-900 transition-colors cursor-help">
            <Info size={16} />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs font-black ${value === "baseline" ? "text-primary" : "text-gray-400"}`}>{leftLabel}</span>
        <button
          type="button"
          onClick={() => onChange(value === "baseline" ? "equitable" : "baseline")}
          className={`relative w-14 h-8 rounded-full border transition-colors ${
            value === "equitable" ? "bg-primary border-primary/30" : "bg-gray-200 border-gray-300"
          }`}
          aria-label="Toggle scoring system"
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
              value === "equitable" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-xs font-black ${value === "equitable" ? "text-primary" : "text-gray-400"}`}>{rightLabel}</span>
      </div>
    </div>
  )
}

export default function AdminCandidateDetail() {
  const { id: rawId } = useParams()
  const id = decodeURIComponent(rawId || "")
  const { computedCandidates, state, updateCandidateAdmin } = useAdmin()

  const candidate = useMemo(() => computedCandidates.find((c) => c.id === id), [computedCandidates, id])
  const [panelModel, setPanelModel] = useState("equitable") // baseline | equitable

  const [draftStatus, setDraftStatus] = useState(candidate?.admin.status ?? "under_review")
  const [draftNotes, setDraftNotes] = useState(candidate?.admin.notes ?? "")
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    if (!candidate) return
    setDraftStatus(candidate.admin.status)
    setDraftNotes(candidate.admin.notes || "")
  }, [candidate])

  if (!candidate) {
    return (
      <div className="px-6 md:px-10 py-8 max-w-screen-xl mx-auto">
        <Card className="p-8">
          <div className="text-2xl font-black text-gray-900">Candidate not found</div>
          <div className="text-gray-500 font-medium mt-2">No candidate matches ID: {id}</div>
          <div className="mt-6">
            <Link to="/admin/candidates">
              <Button variant="outline" className="gap-2">
                <ChevronLeft size={16} /> Back to candidates
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const tooltip =
    "Baseline uses resume signals only. Custom Equitable adds auditable opportunity credits (e.g., rural district, low job density, Tier-3) with an adjustment cap — no demographic proxies."

  const shownScore = panelModel === "baseline" ? candidate.scoring.baselineScore : candidate.scoring.finalScore
  const shownDecision = panelModel === "baseline" ? candidate.derived.baselineDecision : candidate.derived.equitableDecision
  const shownRank = panelModel === "baseline" ? candidate.derived.baselineRank : candidate.derived.equitableRank

  const fairness = {
    baseline: candidate.scoring.baselineScore,
    adjustment: candidate.scoring.contextAdjustment,
    final: candidate.scoring.finalScore,
  }

  const weightsTotal = Object.values(state.baselineWeights).reduce((a, b) => a + Number(b || 0), 0)

  function saveAdmin() {
    updateCandidateAdmin(candidate.id, { status: draftStatus, notes: draftNotes })
    const t = new Date().toISOString()
    setSavedAt(t)
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/candidates" className="text-primary font-black hover:underline inline-flex items-center gap-2">
          <ChevronLeft size={16} /> Back to candidates
        </Link>
        <Badge variant="outline" className="border-gray-200 text-gray-700">
          Active shortlisting model:{" "}
          <span className="ml-1 text-gray-900">{state.activeShortlistingModel === "equitable" ? "Custom Equitable" : "Baseline Absolute"}</span>
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Resume & Profile */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-2xl font-black text-gray-900 tracking-tight truncate">{candidate.name}</div>
                <div className="text-xs font-semibold text-gray-500 mt-1">{candidate.id}</div>
                <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500 font-bold">College</div>
                  <div className="text-gray-900 font-bold">{candidate.college}</div>
                  <div className="text-gray-500 font-bold">District</div>
                  <div className="text-gray-900 font-bold">{candidate.district}</div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <CollegeTierBadge tier={candidate.collegeTier} />
                  <YesNoBadge value={candidate.isRural} yesLabel="Rural" noLabel="Urban" />
                  <YesNoBadge value={candidate.isFirstGen} yesLabel="First-Gen" noLabel="Not First-Gen" />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Shown</div>
                <div className="text-4xl font-black tracking-tighter text-gray-900 mt-1">{formatScore(shownScore, 1)}</div>
                <div className="mt-2 flex justify-end">
                  <DecisionBadge decision={shownDecision} />
                </div>
                <div className="mt-2 text-xs font-semibold text-gray-500">Batch rank: #{shownRank}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-900 font-black tracking-tight">Parsed resume fields</div>
              <Badge variant="outline" className="border-gray-200 text-gray-700">
                Baseline weights total: <span className={`${weightsTotal === 100 ? "text-gray-900" : "text-primary"} ml-1 font-black`}>{weightsTotal}%</span>
              </Badge>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {candidate.resume.skills.map((s) => (
                    <span key={s} className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Metric label="Projects" value={candidate.resume.projectsCount} />
                <Metric label="Internships" value={candidate.resume.internshipsCount} />
                <Metric label="Certifications" value={candidate.resume.certificationsCount} />
                <Metric label="CGPA" value={candidate.resume.cgpa} />
                <Metric label="Experience months" value={candidate.resume.experienceMonths} className="col-span-2" />
              </div>

              <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="font-black text-gray-900">View Raw Resume Text</div>
                  <div className="text-xs font-bold text-gray-500 group-open:text-primary">Toggle</div>
                </summary>
                <div className="mt-3">
                  <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700 bg-white border border-gray-100 rounded-2xl p-4 shadow-inner">
                    {candidate.resume.rawText || "—"}
                  </pre>
                </div>
              </details>
            </div>
          </Card>
        </div>

        {/* RIGHT: Scoring Breakdown */}
        <div className="space-y-6">
          <Card className="p-6">
            <Toggle
              value={panelModel}
              onChange={setPanelModel}
              leftLabel="Baseline"
              rightLabel="Equitable"
              tooltip={tooltip}
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-gray-900 font-black tracking-tight">Fairness passport</div>
                <div className="text-gray-500 font-medium text-sm mt-1">Always visible and auditable (regardless of toggle).</div>
              </div>
              <Badge variant="outline" className="border-gray-200 text-gray-700">
                CEOS group: <span className="ml-1 text-gray-900 font-black">{formatScore(candidate.derived.ceosGroupScore, 1)}</span>
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <MiniStat label="Baseline Score" value={formatScore(fairness.baseline, 1)} />
              <MiniStat label="Context Adjustment" value={`${fairness.adjustment >= 0 ? "+" : ""}${formatScore(fairness.adjustment, 0)}`} accent="secondary" />
              <MiniStat label="Final Score" value={formatScore(fairness.final, 1)} accent="primary" />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Rank shift</div>
                <div className="text-4xl font-black tracking-tighter text-gray-900 mt-1">{candidate.derived.rankShift}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Baseline vs Equitable</div>
                <div className="mt-2 flex gap-2 justify-end">
                  <DecisionBadge decision={candidate.derived.baselineDecision} />
                  <DecisionBadge decision={candidate.derived.equitableDecision} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Adjustment breakdown</div>
              <div className="space-y-2">
                {candidate.scoring.adjustmentBreakdown.length === 0 && (
                  <div className="text-sm font-bold text-gray-500">No adjustments applied.</div>
                )}
                {candidate.scoring.adjustmentBreakdown.map((row, idx) => (
                  <div key={`${row.label}_${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                    <div className="font-bold text-gray-900">{row.label}</div>
                    <Badge variant="credit" className="bg-secondary/10 text-secondary border-transparent font-black">
                      +{formatScore(row.points, 0)} pts
                    </Badge>
                  </div>
                ))}
                <div className="pt-2 text-xs font-semibold text-gray-500">
                  Total adjustment applied:{" "}
                  <span className="font-black text-gray-900">
                    {fairness.adjustment >= 0 ? "+" : ""}
                    {formatScore(fairness.adjustment, 0)}
                  </span>{" "}
                  pts
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-gray-900 font-black tracking-tight">Side-by-side comparison</div>
            <div className="text-gray-500 font-medium text-sm mt-1">Simple, text-only comparison table.</div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Metric</th>
                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Baseline Model</th>
                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Equitable Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-900">Score</td>
                    <td className="px-4 py-3 font-black text-gray-900">{formatScore(candidate.scoring.baselineScore, 1)}</td>
                    <td className="px-4 py-3 font-black text-gray-900">{formatScore(candidate.scoring.finalScore, 1)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-900">Shortlist Decision</td>
                    <td className="px-4 py-3"><DecisionBadge decision={candidate.derived.baselineDecision} /></td>
                    <td className="px-4 py-3"><DecisionBadge decision={candidate.derived.equitableDecision} /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-900">Batch Rank</td>
                    <td className="px-4 py-3 font-black text-gray-900">#{candidate.derived.baselineRank}</td>
                    <td className="px-4 py-3 font-black text-gray-900">#{candidate.derived.equitableRank}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-gray-900 font-black tracking-tight">Admin decision</div>
                <div className="text-gray-500 font-medium text-sm mt-1">Human-in-the-loop status and notes.</div>
              </div>
              <StatusBadge status={candidate.admin.status} />
            </div>

            <div className="mt-5 grid gap-4">
              <label>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Change status</div>
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value)}
                  className="w-full h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-900 px-3"
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="under_review">Under Review</option>
                  <option value="flagged">Flagged</option>
                </select>
              </label>

              <label>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Admin notes</div>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="Add rationale, concerns, or follow-ups…"
                  className="w-full min-h-[110px] rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-900 p-3"
                />
              </label>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-xs font-semibold text-gray-500">
                  Last admin action:{" "}
                  <span className="font-black text-gray-900">{new Date(candidate.admin.lastActionAt).toLocaleString()}</span>{" "}
                  <span className="text-gray-300 font-black mx-2">•</span>
                  <span className="font-black text-gray-700">{candidate.admin.lastActionBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  {savedAt && (
                    <Badge variant="outline" className="border-gray-200 text-gray-700">
                      Saved {new Date(savedAt).toLocaleTimeString()}
                    </Badge>
                  )}
                  <Button onClick={saveAdmin} className="shadow-lg shadow-primary/20">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, className }) {
  return (
    <div className={`p-4 rounded-2xl bg-gray-50 border border-gray-100 ${className || ""}`}>
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-lg font-black text-gray-900">{value ?? "—"}</div>
    </div>
  )
}

function MiniStat({ label, value, accent }) {
  const color = accent === "primary" ? "text-primary" : accent === "secondary" ? "text-secondary" : "text-gray-900"
  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-100">
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</div>
      <div className={`text-2xl font-black tracking-tighter mt-1 ${color}`}>{value}</div>
    </div>
  )
}

