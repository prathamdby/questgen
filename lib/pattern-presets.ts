import type { PatternPreset } from "@/components/generate/PatternPresets";

export const patternPresets: PatternPreset[] = [
  {
    id: "balanced-assessment",
    label: "Balanced Assessment",
    description: "Classic mix of objective, short, and long-form answers.",
    pattern: [
      "Section A: 10 MCQs (20 marks)",
      "Section B: 5 Short Answers (30 marks)",
      "Section C: 3 Long Answers (50 marks)",
    ].join("\n"),
  },
  {
    id: "foundation-focus",
    label: "Foundation Focus",
    description: "Prioritizes core definitions and recall for fundamentals.",
    pattern: [
      "Section A: 20 Terminology Checks (40 marks)",
      "Section B: 6 Concept Summaries (30 marks)",
      "Section C: 2 Reflection Prompts (30 marks)",
    ].join("\n"),
  },
  {
    id: "blooms-depth",
    label: "Bloom's Depth",
    description: "Progressively deeper questions from recall to analysis.",
    pattern: [
      "Section A: 8 Recall Questions (16 marks)",
      "Section B: 6 Application Problems (24 marks)",
      "Section C: 4 Analytical Essays (60 marks)",
    ].join("\n"),
  },
  {
    id: "rapid-quiz",
    label: "Rapid Quiz",
    description: "Fast-paced checkpoints for formative assessments.",
    pattern: [
      "Round 1: 15 Quick Response Questions (30 marks)",
      "Round 2: 10 Concept Checks (30 marks)",
      "Round 3: 5 Case Scenarios (40 marks)",
    ].join("\n"),
  },
  {
    id: "applied-project",
    label: "Applied Project",
    description: "Combines planning, execution, and review for projects.",
    pattern: [
      "Phase 1: Project Brief & Constraints (20 marks)",
      "Phase 2: Implementation Tasks (40 marks)",
      "Phase 3: Critical Review & Presentation (40 marks)",
    ].join("\n"),
  },
];

