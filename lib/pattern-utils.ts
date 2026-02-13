export interface PatternMarksAnalysis {
  total: number;
  lines: Array<{ text: string; marks: number }>;
}

export function analyzePatternMarks(
  pattern: string,
): PatternMarksAnalysis | null {
  const lines = pattern
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const markRegex = /(\d+(?:\.\d+)?)\s*(?:marks?|pts?|points?)/gi;
  const entries: Array<{ text: string; marks: number }> = [];
  let total = 0;

  for (const line of lines) {
    let match: RegExpExecArray | null = null;
    let lineTotal = 0;

    while ((match = markRegex.exec(line)) !== null) {
      const value = parseFloat(match[1]);
      if (!Number.isNaN(value)) {
        lineTotal += value;
      }
    }

    if (lineTotal > 0) {
      total += lineTotal;
      entries.push({ text: line, marks: lineTotal });
    }

    markRegex.lastIndex = 0;
  }

  if (entries.length === 0) {
    return null;
  }

  return {
    total,
    lines: entries,
  };
}

export function suggestDuration(totalMarks: number): string {
  if (totalMarks <= 25) return "30 minutes";
  if (totalMarks <= 50) return "1 hour";
  if (totalMarks <= 75) return "2 hours";
  return "3 hours";
}
