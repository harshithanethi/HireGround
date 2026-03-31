import { useMemo } from "react"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"
import { cxStatDelta, formatPct, formatScore, scoreLabel } from "../adminUtils"
import { DecisionBadge } from "../components/AdminBadges"

function pct(n, d) {
  if (!d) return 0
  return (n / d) * 100
}

function deltaPct(fromPct, toPct) {
  if (!Number.isFinite(fromPct) || fromPct === 0) return Infinity
  return ((toPct - fromPct) / fromPct) * 100
}

export default function AdminHome() {
  const { computedCandidates, state } = useAdmin()

  const stats = useMemo(() => {
    const total = computedCandidates.length
    const baselineShortlisted = computedCandidates.filter((c) => c.derived.baselineDecision === "Shortlisted").length
    const equitableShortlisted = computedCandidates.filter((c) => c.derived.equitableDecision === "Shortlisted").length

    const baselineShortlistedRows = computedCandidates.filter((c) => c.derived.baselineDecision === "Shortlisted")
    const equitableShortlistedRows = computedCandidates.filter((c) => c.derived.equitableDecision === "Shortlisted")

    const baselineRuralPct = pct(baselineShortlistedRows.filter((c) => c.isRural).length, baselineShortlistedRows.length)
    const equitableRuralPct = pct(equitableShortlistedRows.filter((c) => c.isRural).length, equitableShortlistedRows.length)
    const ruralDelta = deltaPct(baselineRuralPct, equitableRuralPct)

    // CEOS proxy (0-100): combines representation target adherence and "talent preservation"
    const topN = Math.min(8, total)
    const topByBaseline = [...computedCandidates]
      .sort((a, b) => b.scoring.baselineScore - a.scoring.baselineScore)
      .slice(0, topN)
      .map((c) => c.id)
    const equitableShortIds = new Set(equitableShortlistedRows.map((c) => c.id))
    const kept = topByBaseline.filter((id) => equitableShortIds.has(id)).length
    const topTalentPreservation = topN ? (kept / topN) * 100 : 0

    const constraintFloors = state.constraints.filter((c) => c.active && c.type === "Representation Target")
    const floorScores = constraintFloors.map((floor) => {
      const current = floor.targetField === "isRural"
        ? equitableRuralPct
        : floor.targetField === "isFirstGen"
          ? pct(equitableShortlistedRows.filter((c) => c.isFirstGen).length, equitableShortlistedRows.length)
          : 0
      const target = floor.targetPct ?? 0
      if (!target) return 1
      return Math.min(1, current / target)
    })
    const representationScore = floorScores.length ? (floorScores.reduce((a, b) => a + b, 0) / floorScores.length) * 100 : 100
    const ceos = Math.min(100, 0.55 * representationScore + 0.45 * topTalentPreservation)

    const pendingReview = computedCandidates.filter((c) => c.admin.status === "under_review" || c.admin.status === "flagged").length

    return {
      total,
      baselineShortlisted,
      equitableShortlisted,
      baselineRuralPct,
      equitableRuralPct,
      ruralDelta,
      ceos,
      ceosLabel: scoreLabel(ceos),
      topTalentPreservation,
      pendingReview,
    }
  }, [computedCandidates, state.constraints])

  const recent = useMemo(() => {
    return [...computedCandidates]
      .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
      .slice(0, 10)
  }, [computedCandidates])

  const activeDecisionKey = state.activeShortlistingModel === "equitable" ? "equitableDecision" : "baselineDecision"
  const activeScoreKey = state.activeShortlistingModel === "equitable" ? "finalScore" : "baselineScore"

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Overview of processing, fairness impact, and pending actions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Total processed</div>
          <div className="text-3xl font-black tracking-tighter text-gray-900">{stats.total}</div>
          <div className="text-gray-400 font-medium mt-1 text-xs">Cohort size (mock)</div>
        </Card>

        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Shortlisted</div>
          <div className="text-2xl font-black tracking-tighter text-gray-900">
            {stats.equitableShortlisted} <span className="text-gray-300 font-black">/</span> {stats.baselineShortlisted}
          </div>
          <div className="text-gray-400 font-medium mt-1 text-xs">Equitable vs Baseline</div>
        </Card>

        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Rural representation</div>
          <div className="text-lg font-black tracking-tight text-gray-900">
            {formatPct(stats.baselineRuralPct)} <span className="text-gray-300 font-black">→</span> {formatPct(stats.equitableRuralPct)}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={cxStatDelta(stats.ruralDelta)}>
              {Number.isFinite(stats.ruralDelta) ? `${stats.ruralDelta > 0 ? "+" : ""}${stats.ruralDelta.toFixed(0)}%` : "+∞%"}
            </span>
            <span className="text-gray-400 font-medium text-xs">delta</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">CEOS Score</div>
          <div className="text-3xl font-black tracking-tighter text-gray-900">
            {formatScore(stats.ceos, 1)} <span className="text-gray-400 text-base font-black">/ 100</span>
          </div>
          <div className="mt-1">
            <Badge variant={stats.ceosLabel === "Excellent" ? "success" : stats.ceosLabel === "Good" ? "outline" : stats.ceosLabel === "Fair" ? "warning" : "danger"}>
              {stats.ceosLabel}
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Top talent kept</div>
          <div className="text-3xl font-black tracking-tighter text-gray-900">{formatScore(stats.topTalentPreservation, 1)}%</div>
          <div className="text-gray-400 font-medium mt-1 text-xs">Preservation rate</div>
        </Card>

        <Card className="p-5">
          <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Pending review</div>
          <div className="text-3xl font-black tracking-tighter text-primary">{stats.pendingReview}</div>
          <div className="text-gray-400 font-medium mt-1 text-xs">Under review / flagged</div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-900 font-black tracking-tight">Recent activity</div>
            <div className="text-gray-500 font-medium text-sm">Last 10 candidates processed.</div>
          </div>
          <Badge variant="outline" className="border-gray-200 text-gray-700">
            Showing: <span className="ml-1 text-gray-900">{state.activeShortlistingModel === "equitable" ? "Equitable" : "Baseline"}</span>
          </Badge>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map((c) => (
            <div key={c.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-bold text-gray-900 truncate">
                  {c.name} <span className="text-gray-300 font-black">•</span>{" "}
                  <span className="text-xs font-bold text-gray-500">{c.id}</span>
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-1">
                  Final score: <span className="text-gray-900 font-black">{formatScore(c.scoring[activeScoreKey], 1)}</span>{" "}
                  <span className="text-gray-300 font-black">•</span> Rank shift{" "}
                  <span className="font-black text-gray-900">{c.derived.rankShift}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="outline" className="border-gray-200 text-gray-700 font-mono text-[11px]">
                  {c.derived.rankShift}
                </Badge>
                <DecisionBadge decision={c.derived[activeDecisionKey]} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

