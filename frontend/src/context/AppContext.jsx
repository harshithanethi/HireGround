import { createContext, useContext, useState } from 'react';
import { API_BASE } from "../config/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [candidateResult, setCandidateResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // You can also add job config state here
  const [jobConfig, setJobConfig] = useState({
    title: "Frontend Engineer",
    required_skills: ["React", "JavaScript", "Tailwind"],
    preferred_skills: ["Node.js", "PostgreSQL"],
  });

  const processResume = async (file, environmentalContext = null) => {
    setIsProcessing(true);
    setError(null);
    try {
      const token = localStorage.getItem("hg_access_token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const fd = new FormData();
      fd.append("file", file);
      
      const parsedRes = await fetch(`${API_BASE}/v1/parse-resume`, {
        method: "POST",
        headers: authHeaders,
        body: fd,
      });
      if (!parsedRes.ok) throw new Error("Failed to parse resume: " + await parsedRes.text());
      const parsed = await parsedRes.json();

      // Overwrite context if specified in UI step 2
      if (environmentalContext) {
        if (environmentalContext.district) parsed.district = environmentalContext.district;
        if (environmentalContext.tier) {
          if (environmentalContext.tier.includes('Tier 3')) parsed.college_tier = 'Tier3';
          else if (environmentalContext.tier.includes('Tier 2')) parsed.college_tier = 'Tier2';
          else parsed.college_tier = 'Tier1';
        }
        if (environmentalContext.firstGen) {
          parsed.first_gen_flag = environmentalContext.firstGen === 'Yes';
        }
      }

      const scoreRes = await fetch(`${API_BASE}/v1/score-single`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          parsed,
          job: jobConfig,
        }),
      });
      
      if (!scoreRes.ok) throw new Error("Failed to score resume: " + await scoreRes.text());
      const scored = await scoreRes.json();
      
      // Save result and original parsed text for the UI to consume safely
      setCandidateResult({
        ...scored.result,
        parsed_data: parsed,
      });
      return true;
    } catch (e) {
      console.error(e);
      setError(e.message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppContext.Provider value={{ candidateResult, isProcessing, error, processResume, jobConfig, setJobConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
