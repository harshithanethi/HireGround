import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppContext } from "../context/AppContext";
import { Badge } from "../components/ui/Badge";
import { API_BASE } from "../config/api";

function fmt(n) {
  if (n === null || n === undefined) return "-";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x % 1 === 0 ? String(x) : x.toFixed(2);
}

export default function BatchUpload() {
  const { jobConfig } = useAppContext();
  const [files, setFiles] = useState([]);
  const [shortlistThreshold, setShortlistThreshold] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResult, setBatchResult] = useState(null);

  const rows = useMemo(() => {
    const r = batchResult?.results ?? [];
    return [...r].sort((a, b) => (b.rank_shift ?? 0) - (a.rank_shift ?? 0));
  }, [batchResult]);

  async function scoreBatch() {
    setError(null);
    setBatchResult(null);

    if (!files?.length) {
      setError("Select at least one resume to score.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("job_title", jobConfig?.title || "Recruitment");
      fd.append("required_skills", (jobConfig?.required_skills || []).join(", "));
      fd.append("preferred_skills", (jobConfig?.preferred_skills || []).join(", "));
      fd.append("shortlist_threshold", String(shortlistThreshold));

      const token = localStorage.getItem("hg_access_token");
      const res = await fetch(`${API_BASE}/v1/score-batch-files`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBatchResult(data);
    } catch (e) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-8 px-6 md:px-12 w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Batch Upload</h2>
        <p className="text-gray-500 font-medium mt-1">
          Upload multiple resumes to show ranking shifts, CEOS and bias audit evidence.
        </p>
      </div>

      <Card className="p-6 border-gray-100 shadow-sm">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-gray-700">
            Resumes (PDF/DOCX)
            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              className="mt-2 block w-full text-sm text-gray-600"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>

          <label className="text-sm font-bold text-gray-700">
            Shortlist threshold
            <input
              type="number"
              value={shortlistThreshold}
              onChange={(e) => setShortlistThreshold(Number(e.target.value))}
              className="mt-2 block w-full max-w-[220px] text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
            />
          </label>

          <Button onClick={scoreBatch} disabled={loading} className="w-max">
            {loading ? "Scoring..." : "Score batch"}
          </Button>

          {error ? (
            <pre className="whitespace-pre-wrap rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </pre>
          ) : null}
        </div>
      </Card>

      {batchResult ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-gray-100">
              <div className="text-sm font-bold text-gray-700">CEOS (batch)</div>
              <div className="text-3xl font-black text-primary mt-2">{fmt(batchResult.fairness_summary?.ceos_batch)}</div>
            </Card>
            <Card className="p-4 border-gray-100">
              <div className="text-sm font-bold text-gray-700">Uniform → Equitable</div>
              <div className="text-xs text-gray-500 mt-1">Group-level shortlist rates</div>
              <pre className="mt-3 whitespace-pre-wrap text-[11px] bg-gray-50 border border-gray-100 p-2 rounded-lg">
                {JSON.stringify(batchResult.fairness_summary?.group_fairness ?? {}, null, 2)}
              </pre>
            </Card>
            <Card className="p-4 border-gray-100">
              <div className="text-sm font-bold text-gray-700">Bias audit</div>
              <pre className="mt-3 whitespace-pre-wrap text-[11px] bg-gray-50 border border-gray-100 p-2 rounded-lg">
                {JSON.stringify(batchResult.fairness_summary?.bias_audit ?? {}, null, 2)}
              </pre>
            </Card>
          </div>

          <Card className="p-6 border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-gray-900">Rank shifts</div>
              <Badge variant="neutral" className="uppercase tracking-widest text-[10px]">
                Showing rank shifts
              </Badge>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="p-3">Name</th>
                    <th className="p-3">Baseline rank</th>
                    <th className="p-3">Final rank</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Baseline score</th>
                    <th className="p-3">Final score</th>
                    <th className="p-3">Adjustment</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.candidate_name} className="border-t border-gray-100">
                      <td className="p-3 font-bold">{r.candidate_name}</td>
                      <td className="p-3">{r.baseline_rank}</td>
                      <td className="p-3">{r.final_rank}</td>
                      <td className="p-3">
                        <span className={r.rank_shift > 0 ? "text-positive font-bold" : r.rank_shift < 0 ? "text-red-500 font-bold" : "text-gray-500 font-bold"}>
                          {r.rank_shift > 0 ? "+" : ""}
                          {r.rank_shift}
                        </span>
                      </td>
                      <td className="p-3">{fmt(r.baseline_score)}</td>
                      <td className="p-3">{fmt(r.final_score)}</td>
                      <td className="p-3">{fmt(r.context_adjustment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

