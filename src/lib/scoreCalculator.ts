// ─── TOEFL ITP Score Calculator ───────────────────────────────────────────────

export interface SectionScore {
  raw: number;       // number correct
  total: number;     // total questions
  scaled: number;    // ITP scaled score
  percentage: number;
}

export interface ToeflScore {
  listening: SectionScore;
  structure: SectionScore;
  reading: SectionScore;
  total: number;    // ITP total (300–677)
  level: string;    // e.g. "Upper Intermediate"
}

// ITP conversion tables (approximate)
function scaleListening(raw: number, total: number): number {
  const pct = raw / total;
  if (pct >= 0.95) return 68;
  if (pct >= 0.9)  return 65;
  if (pct >= 0.85) return 62;
  if (pct >= 0.80) return 59;
  if (pct >= 0.75) return 56;
  if (pct >= 0.70) return 53;
  if (pct >= 0.65) return 50;
  if (pct >= 0.60) return 47;
  if (pct >= 0.55) return 44;
  if (pct >= 0.50) return 41;
  if (pct >= 0.45) return 38;
  if (pct >= 0.40) return 35;
  return 31;
}

function scaleStructure(raw: number, total: number): number {
  const pct = raw / total;
  if (pct >= 0.95) return 68;
  if (pct >= 0.9)  return 65;
  if (pct >= 0.85) return 62;
  if (pct >= 0.80) return 59;
  if (pct >= 0.75) return 56;
  if (pct >= 0.70) return 53;
  if (pct >= 0.65) return 49;
  if (pct >= 0.60) return 46;
  if (pct >= 0.55) return 42;
  if (pct >= 0.50) return 39;
  if (pct >= 0.45) return 36;
  if (pct >= 0.40) return 33;
  return 29;
}

function scaleReading(raw: number, total: number): number {
  const pct = raw / total;
  if (pct >= 0.95) return 67;
  if (pct >= 0.9)  return 64;
  if (pct >= 0.85) return 61;
  if (pct >= 0.80) return 58;
  if (pct >= 0.75) return 55;
  if (pct >= 0.70) return 52;
  if (pct >= 0.65) return 48;
  if (pct >= 0.60) return 45;
  if (pct >= 0.55) return 41;
  if (pct >= 0.50) return 38;
  if (pct >= 0.45) return 34;
  if (pct >= 0.40) return 30;
  return 27;
}

function getLevel(total: number): string {
  if (total >= 627) return "Advanced — Proficient";
  if (total >= 550) return "Upper Intermediate";
  if (total >= 500) return "Intermediate";
  if (total >= 450) return "Lower Intermediate";
  return "Beginner";
}

export function calculateITPScore(
  listeningRaw: number, listeningTotal: number,
  structureRaw: number, structureTotal: number,
  readingRaw: number, readingTotal: number
): ToeflScore {
  const ls = scaleListening(listeningRaw, listeningTotal || 1);
  const ss = scaleStructure(structureRaw, structureTotal || 1);
  const rs = scaleReading(readingRaw, readingTotal || 1);
  const total = Math.round((ls + ss + rs) * (10 / 3));

  return {
    listening: {
      raw: listeningRaw,
      total: listeningTotal,
      scaled: ls,
      percentage: Math.round((listeningRaw / (listeningTotal || 1)) * 100),
    },
    structure: {
      raw: structureRaw,
      total: structureTotal,
      scaled: ss,
      percentage: Math.round((structureRaw / (structureTotal || 1)) * 100),
    },
    reading: {
      raw: readingRaw,
      total: readingTotal,
      scaled: rs,
      percentage: Math.round((readingRaw / (readingTotal || 1)) * 100),
    },
    total: Math.min(677, Math.max(310, total)),
    level: getLevel(total),
  };
}

// ─── Mock Historical Data ─────────────────────────────────────────────────────
export interface TestResult {
  id: string;
  date: string;
  examTitle: string;
  examType: "ITP" | "Diagnostic" | "Practice";
  score: ToeflScore;
  duration: number; // minutes
  certificateReady: boolean;
}

export const MOCK_TEST_RESULTS: TestResult[] = [
  {
    id: "res-001",
    date: "2024-11-10",
    examTitle: "TOEFL ITP Institutional Test #1",
    examType: "ITP",
    score: calculateITPScore(28, 40, 30, 40, 35, 50),
    duration: 115,
    certificateReady: true,
  },
  {
    id: "res-002",
    date: "2024-11-25",
    examTitle: "TOEFL ITP Institutional Test #2",
    examType: "ITP",
    score: calculateITPScore(32, 40, 33, 40, 38, 50),
    duration: 115,
    certificateReady: true,
  },
  {
    id: "res-003",
    date: "2024-12-05",
    examTitle: "Reading Section Practice",
    examType: "Practice",
    score: calculateITPScore(0, 0, 0, 0, 42, 50),
    duration: 55,
    certificateReady: false,
  },
  {
    id: "res-004",
    date: "2024-12-18",
    examTitle: "TOEFL ITP Institutional Test #3",
    examType: "ITP",
    score: calculateITPScore(35, 40, 36, 40, 44, 50),
    duration: 115,
    certificateReady: true,
  },
  {
    id: "res-005",
    date: "2025-01-08",
    examTitle: "TOEFL ITP Institutional Test #4",
    examType: "ITP",
    score: calculateITPScore(38, 40, 38, 40, 47, 50),
    duration: 115,
    certificateReady: true,
  },
];
