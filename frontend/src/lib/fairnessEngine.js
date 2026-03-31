// Seeded random for consistent candidate generation
const createSeededRandom = (seed) => {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

const random = createSeededRandom(12345);

const FIRST_NAMES = ["Aarav", "Priya", "Rahul", "Neha", "Vikram", "Sneha", "Karan", "Anjali", "Rohan", "Pooja", "Amit", "Kavita", "Suresh", "Divya", "Rajesh", "Meera", "Sanjay", "Ritu", "Deepak", "Swati"];
const LAST_NAMES = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Deshmukh", "Joshi", "Naidu", "Yadav", "Verma", "Rao", "Reddy", "Das", "Chauhan", "Nair"];

const generateCandidates = (size = 500) => {
  const pool = [];
  for (let i = 0; i < size; i++) {
    const isRural = random() > 0.65; // ~35% Rural
    const tierRaw = random();
    let collegeTier = 1;
    if (tierRaw > 0.3) collegeTier = 2; // 50% Tier 2
    if (tierRaw > 0.8) collegeTier = 3; // 20% Tier 3
    
    // Rural candidates are more likely to be first-gen and have lower infrastructure scores
    const firstGenProb = isRural ? 0.6 : 0.2;
    const firstGen = random() < firstGenProb;
    
    // Infrastructure decile (1-10, lower is worse)
    const infBase = isRural ? 2 : 6;
    let infrastructureDecile = infBase + Math.floor(random() * 4);
    if (infrastructureDecile > 10) infrastructureDecile = 10;

    // Base score (0-100) - slightly correlated to tier/infra to simulate systemic bias in historical data
    let baseScore = 65 + Math.floor(random() * 20); // 65-84
    if (collegeTier === 1) baseScore += Math.floor(random() * 10) + 5; // Tier 1 bump
    if (infrastructureDecile < 4) baseScore -= Math.floor(random() * 8); // Low infra penalty
    
    if (baseScore > 98) baseScore = 98;
    
    pool.push({
      id: `CAND-${2000 + i}`,
      name: `${FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]}`,
      region: isRural ? "Rural" : "Urban",
      collegeTier,
      firstGen,
      infrastructureDecile,
      baseScore,
      avatar: `https://i.pravatar.cc/150?u=${i + 123}`,
      // Added for detailed passport breakdown
      skillsScore: Math.floor(baseScore * 0.6),
      experienceScore: baseScore - Math.floor(baseScore * 0.6),
    });
  }
  return pool;
};

export const MOCK_POOL = generateCandidates(500);

export const WEIGHT_MULTIPLIERS = {
  low: 0.5,
  medium: 1.0,
  high: 2.0,
};

// Calculates opportunity credits and final selection
export const simulateSelection = (pool, config, poolLimit, shortlistSize = 10) => {
  // Use a subset of the pool based on the slider
  const activePool = pool.slice(0, poolLimit);

  // 1. Calculate Opportunity Credits
  const scoredPool = activePool.map(cand => {
    let credits = 0;
    const creditsBreakdown = [];

    // District Job Density (Rewards Rural)
    if (config.toggles.districtDensity) {
      if (cand.region === "Rural") {
        const bonus = 4 * WEIGHT_MULTIPLIERS[config.weights.districtDensity];
        credits += bonus;
        creditsBreakdown.push({ label: "District Job Density Bonus", value: bonus, reason: "Rural District" });
      }
    }

    // College Opportunity Index (Rewards Tier 2 & 3)
    if (config.toggles.collegeOpportunity) {
      if (cand.collegeTier === 2) {
        const bonus = 2 * WEIGHT_MULTIPLIERS[config.weights.collegeOpportunity];
        credits += bonus;
        creditsBreakdown.push({ label: "College Opportunity", value: bonus, reason: "Tier 2 Institution" });
      } else if (cand.collegeTier === 3) {
        const bonus = 5 * WEIGHT_MULTIPLIERS[config.weights.collegeOpportunity];
        credits += bonus;
        creditsBreakdown.push({ label: "College Opportunity", value: bonus, reason: "Tier 3 Institution" });
      }
    }

    // Infrastructure Score (Rewards lower deciles)
    if (config.toggles.infrastructure) {
      if (cand.infrastructureDecile <= 5) {
        // More bonus for lower infrastructure
        const bonus = (6 - cand.infrastructureDecile) * 1.5 * WEIGHT_MULTIPLIERS[config.weights.infrastructure];
        credits += bonus;
        creditsBreakdown.push({ label: "Infrastructure Adjustment", value: bonus, reason: `Decile ${cand.infrastructureDecile}` });
      }
    }

    // First-Generation Graduate
    if (config.toggles.firstGen) {
      if (cand.firstGen) {
        const bonus = 3 * WEIGHT_MULTIPLIERS[config.weights.firstGen];
        credits += bonus;
        creditsBreakdown.push({ label: "First-Gen Uplift", value: bonus, reason: "First to attend college" });
      }
    }

    return {
      ...cand,
      opportunityCredits: credits,
      creditsBreakdown,
      finalScore: cand.baseScore + credits
    };
  });

  // 2. Sort DESC by finalScore
  const sortedPool = [...scoredPool].sort((a, b) => b.finalScore - a.finalScore);
  
  // 3. Extract Top K
  const shortlist = sortedPool.slice(0, shortlistSize);

  // 4. Calculate Aggregate Metrics for the Shortlist
  let ruralCount = 0;
  let firstGenCount = 0;
  let tier1 = 0, tier2 = 0, tier3 = 0;
  let totalCEOS = 0; // Simple average of (rural? + tier2/3? + firstGen?) normalized

  shortlist.forEach(c => {
    if (c.region === "Rural") ruralCount++;
    if (c.firstGen) firstGenCount++;
    if (c.collegeTier === 1) tier1++;
    if (c.collegeTier === 2) tier2++;
    if (c.collegeTier === 3) tier3++;
    
    // CEOS Calculation for candidate map
    let ceos = 0;
    if (c.region === "Rural") ceos += 0.3;
    if (c.collegeTier === 2) ceos += 0.1;
    if (c.collegeTier === 3) ceos += 0.3;
    if (c.firstGen) ceos += 0.4;
    totalCEOS += ceos;
  });

  const ruralPercent = (ruralCount / shortlistSize) * 100;
  const avgCEOS = totalCEOS / shortlistSize;

  // Calculate Global Fairness Score (0-1.00) based on diversity of shortlist
  // Perfect score: 40%+ Rural, mixed tiers, strong FirstGen presence.
  let fairnessScore = 0;
  // Rural rep (aiming for 30-50%)
  if (ruralPercent >= 30) fairnessScore += 0.35;
  else fairnessScore += (ruralPercent / 30) * 0.35;
  
  // Tier Rep (Not all Tier 1)
  const nonTier1Percent = ((tier2 + tier3) / shortlistSize) * 100;
  if (nonTier1Percent >= 50) fairnessScore += 0.35;
  else fairnessScore += (nonTier1Percent / 50) * 0.35;

  // First Gen Rep (Aiming for >= 20%)
  const firstGenPercent = (firstGenCount / shortlistSize) * 100;
  if (firstGenPercent >= 20) fairnessScore += 0.30;
  else fairnessScore += (firstGenPercent / 20) * 0.30;

  // Formatting final stats
  return {
    shortlist,
    metrics: {
      fairnessScore: Math.min(1.0, fairnessScore).toFixed(2),
      ruralPercent: Math.round(ruralPercent),
      urbanPercent: 100 - Math.round(ruralPercent),
      tier1Percent: Math.round((tier1 / shortlistSize) * 100),
      tier2Percent: Math.round((tier2 / shortlistSize) * 100),
      tier3Percent: Math.round((tier3 / shortlistSize) * 100),
      firstGenCount,
      avgCEOS: avgCEOS.toFixed(2)
    }
  };
};

export const PRESETS = {
  conservative: {
    toggles: { districtDensity: true, collegeOpportunity: true, infrastructure: false, firstGen: false },
    weights: { districtDensity: 'low', collegeOpportunity: 'low', infrastructure: 'low', firstGen: 'low' }
  },
  balanced: {
    toggles: { districtDensity: true, collegeOpportunity: true, infrastructure: true, firstGen: true },
    weights: { districtDensity: 'medium', collegeOpportunity: 'medium', infrastructure: 'medium', firstGen: 'medium' }
  },
  aggressive: {
    toggles: { districtDensity: true, collegeOpportunity: true, infrastructure: true, firstGen: true },
    weights: { districtDensity: 'high', collegeOpportunity: 'high', infrastructure: 'high', firstGen: 'high' }
  }
};
