import { Badge } from "../../components/ui/Badge"

export function CollegeTierBadge({ tier }) {
  if (tier === "Tier1") return <Badge variant="outline" className="border-gray-200 text-gray-700">Tier1</Badge>
  if (tier === "Tier2") return <Badge variant="warning">Tier2</Badge>
  return <Badge variant="danger">Tier3</Badge>
}

export function YesNoBadge({ value, yesLabel = "Yes", noLabel = "No" }) {
  return value ? (
    <Badge variant="success">{yesLabel}</Badge>
  ) : (
    <Badge variant="neutral" className="bg-gray-100 text-gray-700 border-gray-200">{noLabel}</Badge>
  )
}

export function StatusBadge({ status }) {
  const s = (status || "").toLowerCase()
  if (s === "shortlisted") return <Badge variant="success">Shortlisted</Badge>
  if (s === "rejected") return <Badge variant="danger">Rejected</Badge>
  if (s === "flagged") return <Badge variant="warning">Flagged</Badge>
  if (s === "under_review" || s === "review") return <Badge variant="outline">Under Review</Badge>
  return <Badge variant="neutral">—</Badge>
}

export function DecisionBadge({ decision }) {
  if (decision === "Shortlisted") return <Badge variant="success">Shortlisted</Badge>
  return <Badge variant="danger">Rejected</Badge>
}

