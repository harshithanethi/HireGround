import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { ADMIN_MOCK_CANDIDATES } from "./mockAdminCandidates"
import { clamp, safeNumber, uid } from "./adminUtils"

const AdminContext = createContext(null)

const STORAGE_KEY = "hireground_admin_state_v1"

const DEFAULTS = {
  activeShortlistingModel: "equitable", // "baseline" | "equitable"
  shortlistThreshold: 75,
  baselineWeights: {
    skillsMatch: 35,
    cgpa: 15,
    projects: 15,
    internships: 15,
    certifications: 10,
    experienceMonths: 10,
  },
  opportunity: {
    adjustmentCap: 30,
    rules: [
      { id: "r_tier3", name: "Tier-3 college bonus", field: "collegeTier", op: "==", value: "Tier3", points: 8, active: true },
      { id: "r_rural", name: "Rural district", field: "isRural", op: "==", value: true, points: 5, active: true },
      { id: "r_firstgen", name: "First-gen learner", field: "isFirstGen", op: "==", value: true, points: 7, active: true },
      { id: "r_lowdensity", name: "Low job density", field: "jobDensityIndex", op: "<=", value: 30, points: 10, active: true },
    ],
  },
  constraints: [
    {
      id: "c_rural_floor",
      name: "Rural Representation Floor",
      description: "Maintain minimum rural representation in shortlists.",
      type: "Representation Target",
      targetField: "isRural",
      op: "==",
      value: true,
      targetValueLabel: "≥ 25% of shortlist",
      targetPct: 25,
      enforcement: "advisory", // "advisory" | "hard"
      active: true,
    },
    {
      id: "c_firstgen_floor",
      name: "First-Gen Representation Floor",
      description: "Encourage first-gen learners in shortlists.",
      type: "Representation Target",
      targetField: "isFirstGen",
      op: "==",
      value: true,
      targetValueLabel: "≥ 20% of shortlist",
      targetPct: 20,
      enforcement: "advisory",
      active: true,
    },
    {
      id: "c_custom_credit",
      name: "Custom: Low job density accelerator",
      description: "Additional credit for very low opportunity districts.",
      type: "Score Credit Multiplier",
      targetField: "jobDensityIndex",
      op: "<=",
      value: 15,
      creditPoints: 4,
      enforcement: "advisory",
      active: true,
    },
  ],
  constraintAuditLog: [
    { id: "log_1", action: "ADDED", constraintName: "Rural Representation Floor", adminId: "admin_aj", at: new Date().toISOString() },
  ],
  candidates: ADMIN_MOCK_CANDIDATES,
}

function sumWeights(weights) {
  return Object.values(weights).reduce((a, b) => a + safeNumber(b, 0), 0)
}

function computeBaselineComponents(candidate) {
  const r = candidate.resume
  const skillsCount = Array.isArray(r.skills) ? r.skills.length : 0
  const skillsNorm = clamp((skillsCount / 8) * 100, 0, 100)
  const cgpaNorm = clamp((safeNumber(r.cgpa, 0) / 10) * 100, 0, 100)
  const projectsNorm = clamp((safeNumber(r.projectsCount, 0) / 6) * 100, 0, 100)
  const internshipsNorm = clamp((safeNumber(r.internshipsCount, 0) / 2) * 100, 0, 100)
  const certNorm = clamp((safeNumber(r.certificationsCount, 0) / 4) * 100, 0, 100)
  const expNorm = clamp((safeNumber(r.experienceMonths, 0) / 36) * 100, 0, 100)

  return {
    skillsMatch: skillsNorm,
    cgpa: cgpaNorm,
    projects: projectsNorm,
    internships: internshipsNorm,
    certifications: certNorm,
    experienceMonths: expNorm,
  }
}

function computeWeightedScore(components, weights) {
  const total = sumWeights(weights)
  if (total <= 0) return 0
  const normWeights = Object.fromEntries(Object.entries(weights).map(([k, v]) => [k, safeNumber(v, 0) / total]))
  return (
    safeNumber(components.skillsMatch, 0) * normWeights.skillsMatch +
    safeNumber(components.cgpa, 0) * normWeights.cgpa +
    safeNumber(components.projects, 0) * normWeights.projects +
    safeNumber(components.internships, 0) * normWeights.internships +
    safeNumber(components.certifications, 0) * normWeights.certifications +
    safeNumber(components.experienceMonths, 0) * normWeights.experienceMonths
  )
}

function getFieldValue(candidate, field) {
  if (field === "college_tier" || field === "collegeTier") return candidate.collegeTier
  if (field === "district") return candidate.district
  if (field === "is_rural" || field === "isRural") return candidate.isRural
  if (field === "is_first_gen" || field === "isFirstGen") return candidate.isFirstGen
  if (field === "job_density_index" || field === "jobDensityIndex") return candidate.jobDensityIndex
  if (field === "cgpa") return candidate.resume?.cgpa
  return candidate[field]
}

function evalCondition(left, op, right) {
  if (op === "==") return left === right
  if (op === "!=") return left !== right
  const ln = safeNumber(left, NaN)
  const rn = safeNumber(right, NaN)
  if (!Number.isFinite(ln) || !Number.isFinite(rn)) return false
  if (op === ">=") return ln >= rn
  if (op === "<=") return ln <= rn
  if (op === ">") return ln > rn
  if (op === "<") return ln < rn
  return false
}

function deriveCandidateScoring(candidate, state) {
  const baselineComponents = computeBaselineComponents(candidate)
  const baselineScore = clamp(computeWeightedScore(baselineComponents, state.baselineWeights), 0, 100)

  const opportunityRows = []
  let opportunityPoints = 0
  for (const rule of state.opportunity.rules) {
    if (!rule.active) continue
    const left = getFieldValue(candidate, rule.field)
    const ok = evalCondition(left, rule.op, rule.value)
    if (!ok) continue
    const pts = safeNumber(rule.points, 0)
    opportunityPoints += pts
    opportunityRows.push({ label: rule.name, points: pts, source: "rule" })
  }

  // Constraint-driven custom credits (Score Credit Multiplier)
  for (const c of state.constraints) {
    if (!c.active) continue
    if (c.type !== "Score Credit Multiplier") continue
    const left = getFieldValue(candidate, c.targetField)
    const ok = evalCondition(left, c.op, c.value)
    if (!ok) continue
    const pts = safeNumber(c.creditPoints, 0)
    if (!pts) continue
    opportunityPoints += pts
    opportunityRows.push({ label: `Custom: ${c.name}`, points: pts, source: "constraint" })
  }

  const cap = clamp(safeNumber(state.opportunity.adjustmentCap, 30), 0, 100)
  const cappedAdjustment = clamp(opportunityPoints, -cap, cap)
  const finalScore = clamp(baselineScore + cappedAdjustment, 0, 100)

  return {
    baselineComponents,
    baselineScore,
    contextAdjustment: cappedAdjustment,
    finalScore,
    adjustmentBreakdown: opportunityRows,
  }
}

function rankCandidates(rows, scoreKey) {
  const sorted = [...rows].sort((a, b) => (b[scoreKey] ?? 0) - (a[scoreKey] ?? 0))
  const rankById = new Map()
  sorted.forEach((r, idx) => rankById.set(r.id, idx + 1))
  return rankById
}

function shortlistDecision(score, threshold) {
  return score >= threshold ? "Shortlisted" : "Rejected"
}

function computeModelOutputs(state) {
  const threshold = clamp(safeNumber(state.shortlistThreshold, 75), 0, 100)
  const computed = state.candidates.map((c) => {
    const s = deriveCandidateScoring(c, state)
    return { ...c, scoring: s }
  })

  const baselineRank = rankCandidates(
    computed.map((c) => ({ id: c.id, baselineScore: c.scoring.baselineScore })),
    "baselineScore"
  )
  const equitableRank = rankCandidates(
    computed.map((c) => ({ id: c.id, finalScore: c.scoring.finalScore })),
    "finalScore"
  )

  const withRanks = computed.map((c) => {
    const bRank = baselineRank.get(c.id) ?? 999
    const eRank = equitableRank.get(c.id) ?? 999
    const baselineDecision = shortlistDecision(c.scoring.baselineScore, threshold)
    const equitableDecision = shortlistDecision(c.scoring.finalScore, threshold)

    return {
      ...c,
      derived: {
        baselineRank: bRank,
        equitableRank: eRank,
        rankShift: `${bRank} → ${eRank}`,
        baselineDecision,
        equitableDecision,
      },
    }
  })

  // Group CEOS proxy: average uplift within the candidate's "opportunity group"
  const groupKey = (c) => `${c.isRural ? "R" : "U"}_${c.isFirstGen ? "F" : "N"}_${c.collegeTier}`
  const groupAgg = new Map()
  for (const c of withRanks) {
    const k = groupKey(c)
    const prev = groupAgg.get(k) ?? { n: 0, uplift: 0 }
    groupAgg.set(k, { n: prev.n + 1, uplift: prev.uplift + (c.scoring.finalScore - c.scoring.baselineScore) })
  }
  const groupCeos = new Map()
  for (const [k, v] of groupAgg.entries()) {
    const avgUplift = v.n ? v.uplift / v.n : 0
    // Map uplift (0..30) to CEOS-ish (60..95)
    const score = clamp(70 + (avgUplift / 30) * 25, 55, 96)
    groupCeos.set(k, score)
  }

  const withGroup = withRanks.map((c) => ({
    ...c,
    derived: {
      ...c.derived,
      ceosGroupScore: groupCeos.get(groupKey(c)) ?? 75,
    },
  }))

  return withGroup
}

export function AdminProvider({ children }) {
  const [state, setState] = useState(DEFAULTS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setState((s) => ({ ...s, ...parsed }))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const computedCandidates = useMemo(() => computeModelOutputs(state), [state])

  const api = useMemo(() => {
    const weightsTotal = sumWeights(state.baselineWeights)

    function setActiveShortlistingModel(model) {
      setState((s) => ({ ...s, activeShortlistingModel: model }))
    }

    function updateBaselineWeights(next) {
      setState((s) => ({ ...s, baselineWeights: { ...s.baselineWeights, ...next } }))
    }

    function setAdjustmentCap(cap) {
      setState((s) => ({ ...s, opportunity: { ...s.opportunity, adjustmentCap: safeNumber(cap, 30) } }))
    }

    function addOpportunityRule(rule) {
      setState((s) => ({ ...s, opportunity: { ...s.opportunity, rules: [...s.opportunity.rules, rule] } }))
    }

    function updateOpportunityRule(id, patch) {
      setState((s) => ({
        ...s,
        opportunity: {
          ...s.opportunity,
          rules: s.opportunity.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        },
      }))
    }

    function deleteOpportunityRule(id) {
      setState((s) => ({ ...s, opportunity: { ...s.opportunity, rules: s.opportunity.rules.filter((r) => r.id !== id) } }))
    }

    function updateCandidateAdmin(id, patch) {
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) => {
          if (c.id !== id) return c
          const nextAdmin = { ...c.admin, ...patch, lastActionAt: new Date().toISOString(), lastActionBy: "admin_aj" }
          return { ...c, admin: nextAdmin }
        }),
      }))
    }

    function bulkUpdateStatus(ids, status) {
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) => {
          if (!ids.includes(c.id)) return c
          return { ...c, admin: { ...c.admin, status, lastActionAt: new Date().toISOString(), lastActionBy: "admin_aj" } }
        }),
      }))
    }

    function addConstraint(constraint) {
      setState((s) => ({
        ...s,
        constraints: [...s.constraints, constraint],
        constraintAuditLog: [
          { id: uid("log"), action: "ADDED", constraintName: constraint.name, adminId: "admin_aj", at: new Date().toISOString() },
          ...s.constraintAuditLog,
        ],
      }))
    }

    function updateConstraint(id, patch) {
      setState((s) => ({
        ...s,
        constraints: s.constraints.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        constraintAuditLog: [
          { id: uid("log"), action: "MODIFIED", constraintName: s.constraints.find((c) => c.id === id)?.name ?? id, adminId: "admin_aj", at: new Date().toISOString() },
          ...s.constraintAuditLog,
        ],
      }))
    }

    function deleteConstraint(id) {
      setState((s) => ({
        ...s,
        constraints: s.constraints.filter((c) => c.id !== id),
        constraintAuditLog: [
          { id: uid("log"), action: "REMOVED", constraintName: s.constraints.find((c) => c.id === id)?.name ?? id, adminId: "admin_aj", at: new Date().toISOString() },
          ...s.constraintAuditLog,
        ],
      }))
    }

    return {
      state,
      computedCandidates,
      weightsTotal,
      setActiveShortlistingModel,
      updateBaselineWeights,
      setAdjustmentCap,
      addOpportunityRule,
      updateOpportunityRule,
      deleteOpportunityRule,
      updateCandidateAdmin,
      bulkUpdateStatus,
      addConstraint,
      updateConstraint,
      deleteConstraint,
    }
  }, [state])

  return <AdminContext.Provider value={api}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}

