export interface PastPaperStrategy {
  id: string;
  label: string;
  description: string;
  promptDirective: string;
}

export const pastPaperStrategies: PastPaperStrategy[] = [
  {
    id: "most-frequent",
    label: "Most Frequent",
    description:
      "Focus on topics and question types that appear most often across past papers.",
    promptDirective:
      "Prioritize topics, question formats, and knowledge checkpoints that appear most frequently across the uploaded past papers. Ensure the new paper mirrors the common distribution of marks and question styles discovered in those frequently recurring patterns.",
  },
  {
    id: "least-frequent",
    label: "Least Frequent",
    description:
      "Target topics and patterns that rarely appear but are still relevant.",
    promptDirective:
      "Identify the least represented topics and question archetypes within the past papers. Elevate those overlooked concepts with fresh questions that remain faithful to the source materials while diversifying coverage.",
  },
  {
    id: "hardest",
    label: "Hardest",
    description:
      "Emphasize the most challenging questions and complex topics from past papers.",
    promptDirective:
      "Extract the most demanding problem types, higher-order reasoning tasks, and multi-step analytical prompts from the past papers. Reimagine them to maintain difficulty while avoiding duplication and ensuring clarity.",
  },
  {
    id: "easiest",
    label: "Easiest",
    description:
      "Select simpler questions and foundational topics for accessible assessment.",
    promptDirective:
      "Highlight foundational concepts, introductory skills, and straightforward recall questions that appear in the past papers. Use them to craft a confidence-building paper with clear language and approachable difficulty.",
  },
  {
    id: "balanced-mix",
    label: "Balanced Mix",
    description:
      "Combine frequent, infrequent, hard, and easy elements for comprehensive coverage.",
    promptDirective:
      "Blend the most common and rare topics, pairing a spectrum of easy through challenging question types. Ensure the final paper feels holistic while respecting the original pattern and total marks.",
  },
  {
    id: "progressive-difficulty",
    label: "Progressive Difficulty",
    description:
      "Structure questions from easiest to hardest based on past paper patterns.",
    promptDirective:
      "Organize the paper so that each section or sequence builds in complexity. Start with the most approachable prompts identified in past papers and escalate toward the most demanding, maintaining coherence with the provided pattern.",
  },
];
