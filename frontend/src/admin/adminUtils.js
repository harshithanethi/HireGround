import { cn } from "../lib/utils"

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function formatPct(n, digits = 1) {
  if (!Number.isFinite(n)) return "—"
  return `${n.toFixed(digits)}%`
}

export function formatScore(n, digits = 1) {
  if (!Number.isFinite(n)) return "—"
  return n.toFixed(digits)
}

export function safeNumber(value, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function serializeCsvRow(values) {
  return values
    .map((v) => {
      const s = v == null ? "" : String(v)
      const escaped = s.replaceAll('"', '""')
      return `"${escaped}"`
    })
    .join(",")
}

export function downloadTextFile(filename, text, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function scoreLabel(scoreOutOf100) {
  if (!Number.isFinite(scoreOutOf100)) return "—"
  if (scoreOutOf100 < 50) return "Poor"
  if (scoreOutOf100 < 70) return "Fair"
  if (scoreOutOf100 < 85) return "Good"
  return "Excellent"
}

export function cxStatDelta(deltaPct) {
  const isPos = Number.isFinite(deltaPct) && deltaPct > 0
  const isNeg = Number.isFinite(deltaPct) && deltaPct < 0
  return cn(
    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border",
    isPos && "bg-positive/10 text-positive border-positive/20",
    isNeg && "bg-primary/10 text-primary border-primary/20",
    !isPos && !isNeg && "bg-gray-100 text-gray-600 border-gray-200"
  )
}

