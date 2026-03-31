import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"
import { CollegeTierBadge, StatusBadge, YesNoBadge } from "../components/AdminBadges"
import { downloadTextFile, formatScore, serializeCsvRow } from "../adminUtils"
import { ArrowUpDown, Search } from "lucide-react"

const PAGE_SIZE = 10

function normalizeStatus(status) {
  const s = (status || "").toLowerCase()
  if (s === "shortlisted") return "shortlisted"
  if (s === "rejected") return "rejected"
  if (s === "flagged") return "flagged"
  return "under_review"
}

function compare(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b))
}

export default function AdminCandidates() {
  const navigate = useNavigate()
  const { computedCandidates, bulkUpdateStatus } = useAdmin()

  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [ruralFilter, setRuralFilter] = useState("all")
  const [firstGenFilter, setFirstGenFilter] = useState("all")
  const [q, setQ] = useState("")
  const [baselineMin, setBaselineMin] = useState(0)
  const [baselineMax, setBaselineMax] = useState(100)
  const [finalMin, setFinalMin] = useState(0)
  const [finalMax, setFinalMax] = useState(100)
  const [sortKey, setSortKey] = useState("processedAt")
  const [sortDir, setSortDir] = useState("desc")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(() => new Set())

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const filtered = computedCandidates.filter((c) => {
      const st = normalizeStatus(c.admin.status)
      if (statusFilter !== "all" && st !== statusFilter) return false
      if (tierFilter !== "all" && c.collegeTier !== tierFilter) return false
      if (ruralFilter === "rural" && !c.isRural) return false
      if (ruralFilter === "urban" && c.isRural) return false
      if (firstGenFilter === "yes" && !c.isFirstGen) return false
      if (firstGenFilter === "no" && c.isFirstGen) return false
      if (c.scoring.baselineScore < baselineMin || c.scoring.baselineScore > baselineMax) return false
      if (c.scoring.finalScore < finalMin || c.scoring.finalScore > finalMax) return false
      if (!needle) return true
      return c.name.toLowerCase().includes(needle) || c.id.toLowerCase().includes(needle)
    })

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const av = getSortValue(a, sortKey)
      const bv = getSortValue(b, sortKey)
      return compare(av, bv) * dir
    })
    return sorted
  }, [computedCandidates, statusFilter, tierFilter, ruralFilter, firstGenFilter, q, baselineMin, baselineMax, finalMin, finalMax, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows = useMemo(() => {
    const p = Math.min(page, pageCount)
    const start = (p - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, page, pageCount])

  function toggleSort(key) {
    setPage(1)
    setSortKey((prev) => {
      if (prev !== key) {
        setSortDir("desc")
        return key
      }
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      return prev
    })
  }

  function toggleSelected(id) {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage(checked) {
    setSelected((s) => {
      const next = new Set(s)
      for (const r of pageRows) {
        if (checked) next.add(r.id)
        else next.delete(r.id)
      }
      return next
    })
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function exportSelected() {
    const ids = Array.from(selected)
    const selectedRows = rows.filter((r) => ids.includes(r.id))
    const header = serializeCsvRow([
      "candidate_id",
      "name",
      "college_tier",
      "district",
      "is_rural",
      "is_first_gen",
      "baseline_score",
      "final_score",
      "rank_shift",
      "ceos_group_score",
      "status",
    ])
    const lines = [header, ...selectedRows.map((c) => serializeCsvRow([
      c.id,
      c.name,
      c.collegeTier,
      c.district,
      c.isRural,
      c.isFirstGen,
      formatScore(c.scoring.baselineScore, 1),
      formatScore(c.scoring.finalScore, 1),
      c.derived.rankShift,
      formatScore(c.derived.ceosGroupScore, 1),
      c.admin.status,
    ]))]
    downloadTextFile("hireground_candidates_selected.csv", lines.join("\n"), "text/csv;charset=utf-8")
  }

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))
  const anySelected = selected.size > 0

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Candidates</h1>
          <p className="text-gray-500 font-medium mt-1">Sortable, filterable list with auditable scoring fields.</p>
        </div>
        <Badge variant="outline" className="border-gray-200 text-gray-700 w-max">
          Total: <span className="ml-1 text-gray-900">{rows.length}</span>
        </Badge>
      </div>

      <Card className="p-5">
        <div className="grid md:grid-cols-5 gap-4">
          <label className="md:col-span-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Search</div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
                placeholder="Search by name or candidate ID"
                className="w-full pl-9 pr-3 h-11 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-900"
              />
            </div>
          </label>

          <FilterSelect label="Status" value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }}
            options={[
              { value: "all", label: "All" },
              { value: "shortlisted", label: "Shortlisted" },
              { value: "rejected", label: "Rejected" },
              { value: "under_review", label: "Under Review" },
              { value: "flagged", label: "Flagged" },
            ]}
          />

          <FilterSelect label="College Tier" value={tierFilter} onChange={(v) => { setTierFilter(v); setPage(1) }}
            options={[
              { value: "all", label: "All" },
              { value: "Tier1", label: "Tier1" },
              { value: "Tier2", label: "Tier2" },
              { value: "Tier3", label: "Tier3" },
            ]}
          />

          <FilterSelect label="Rural" value={ruralFilter} onChange={(v) => { setRuralFilter(v); setPage(1) }}
            options={[
              { value: "all", label: "All" },
              { value: "rural", label: "Rural" },
              { value: "urban", label: "Urban" },
            ]}
          />

          <FilterSelect label="First-Gen" value={firstGenFilter} onChange={(v) => { setFirstGenFilter(v); setPage(1) }}
            options={[
              { value: "all", label: "All" },
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <RangeFilter
            title="Baseline score range"
            min={baselineMin}
            max={baselineMax}
            setMin={(v) => { setBaselineMin(v); setPage(1) }}
            setMax={(v) => { setBaselineMax(v); setPage(1) }}
          />
          <RangeFilter
            title="Final (Equitable) score range"
            min={finalMin}
            max={finalMax}
            setMin={(v) => { setFinalMin(v); setPage(1) }}
            setMax={(v) => { setFinalMax(v); setPage(1) }}
          />
        </div>
      </Card>

      {anySelected && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="font-bold text-gray-900">
              {selected.size} selected
              <span className="text-gray-400 font-black mx-2">•</span>
              <button onClick={clearSelection} className="text-primary font-black hover:underline text-sm">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="h-9 text-sm" onClick={() => { bulkUpdateStatus(Array.from(selected), "shortlisted"); clearSelection() }}>
                Mark as Shortlisted
              </Button>
              <Button size="sm" variant="outline" className="h-9 text-sm" onClick={() => { bulkUpdateStatus(Array.from(selected), "rejected"); clearSelection() }}>
                Mark as Rejected
              </Button>
              <Button size="sm" variant="secondary" className="h-9 text-sm bg-secondary/10 text-secondary border-transparent hover:bg-secondary hover:text-white transition-colors" onClick={exportSelected}>
                Export selected (CSV)
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <Th className="w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={(e) => toggleAllOnPage(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label="Select all on page"
                  />
                </Th>
                <SortableTh label="Candidate" active={sortKey === "candidate"} onClick={() => toggleSort("candidate")} />
                <SortableTh label="College Tier" active={sortKey === "collegeTier"} onClick={() => toggleSort("collegeTier")} />
                <SortableTh label="District" active={sortKey === "district"} onClick={() => toggleSort("district")} />
                <SortableTh label="Rural" active={sortKey === "isRural"} onClick={() => toggleSort("isRural")} />
                <SortableTh label="First-Gen" active={sortKey === "isFirstGen"} onClick={() => toggleSort("isFirstGen")} />
                <SortableTh label="Baseline" active={sortKey === "baselineScore"} onClick={() => toggleSort("baselineScore")} />
                <SortableTh label="Final" active={sortKey === "finalScore"} onClick={() => toggleSort("finalScore")} />
                <SortableTh label="Rank Shift" active={sortKey === "rankShift"} onClick={() => toggleSort("rankShift")} />
                <SortableTh label="CEOS Group" active={sortKey === "ceosGroupScore"} onClick={() => toggleSort("ceosGroupScore")} />
                <SortableTh label="Status" active={sortKey === "status"} onClick={() => toggleSort("status")} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageRows.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin/candidates/${encodeURIComponent(c.id)}`)}
                  className="hover:bg-gray-50/80 cursor-pointer"
                >
                  <Td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelected(c.id)}
                      className="h-4 w-4 rounded border-gray-300"
                      aria-label={`Select ${c.id}`}
                    />
                  </Td>
                  <Td>
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs font-semibold text-gray-500">{c.id}</div>
                  </Td>
                  <Td><CollegeTierBadge tier={c.collegeTier} /></Td>
                  <Td className="text-gray-700 font-semibold">{c.district}</Td>
                  <Td><YesNoBadge value={c.isRural} /></Td>
                  <Td><YesNoBadge value={c.isFirstGen} /></Td>
                  <Td className="font-black text-gray-900">{formatScore(c.scoring.baselineScore, 1)}</Td>
                  <Td className="font-black text-gray-900">{formatScore(c.scoring.finalScore, 1)}</Td>
                  <Td>
                    <Badge variant="outline" className="border-gray-200 text-gray-700 font-mono text-[11px]">
                      {c.derived.rankShift}
                    </Badge>
                  </Td>
                  <Td className="font-black text-gray-900">{formatScore(c.derived.ceosGroupScore, 1)}</Td>
                  <Td><StatusBadge status={c.admin.status} /></Td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-10 text-center text-gray-500 font-bold">
                    No candidates match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-sm font-bold text-gray-500">
            Page <span className="text-gray-900 font-black">{page}</span> of{" "}
            <span className="text-gray-900 font-black">{pageCount}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-sm" disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getSortValue(c, key) {
  if (key === "candidate") return `${c.id} ${c.name}`
  if (key === "collegeTier") return c.collegeTier
  if (key === "district") return c.district
  if (key === "isRural") return c.isRural ? 1 : 0
  if (key === "isFirstGen") return c.isFirstGen ? 1 : 0
  if (key === "baselineScore") return c.scoring.baselineScore
  if (key === "finalScore") return c.scoring.finalScore
  if (key === "rankShift") return c.derived.equitableRank - c.derived.baselineRank
  if (key === "ceosGroupScore") return c.derived.ceosGroupScore
  if (key === "status") return normalizeStatus(c.admin.status)
  if (key === "processedAt") return new Date(c.processedAt).getTime()
  return ""
}

function Th({ children, className }) {
  return (
    <th className={`px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest ${className || ""}`}>
      {children}
    </th>
  )
}

function SortableTh({ label, onClick, active }) {
  return (
    <Th>
      <button
        onClick={(e) => { e.preventDefault(); onClick() }}
        className={`inline-flex items-center gap-2 hover:text-gray-900 transition-colors ${active ? "text-gray-900" : "text-gray-500"}`}
        type="button"
      >
        {label}
        <ArrowUpDown size={14} className={active ? "text-primary" : "text-gray-300"} />
      </button>
    </Th>
  )
}

function Td({ children, className, ...props }) {
  return (
    <td {...props} className={`px-4 py-3 align-middle ${className || ""}`}>
      {children}
    </td>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</div>
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

function RangeFilter({ title, min, max, setMin, setMax }) {
  const safeMin = Math.min(min, max)
  const safeMax = Math.max(min, max)

  return (
    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black text-gray-500 uppercase tracking-widest">{title}</div>
        <Badge variant="outline" className="border-gray-200 text-gray-700 font-mono text-[11px]">
          {safeMin}–{safeMax}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Min</div>
          <input
            type="range"
            min={0}
            max={100}
            value={safeMin}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Max</div>
          <input
            type="range"
            min={0}
            max={100}
            value={safeMax}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

