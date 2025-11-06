/**
 * Shared prompt helpers for Gemini-powered question paper generation.
 */

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

export function cleanMarkdownContent(content: string): string {
  let cleaned = content.trim();

  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/i, "");
  cleaned = cleaned.replace(/\n```\s*$/i, "");

  return cleaned.trim();
}

export function buildSystemPrompt(
  paperName: string,
  paperPattern: string,
  duration: string,
  totalMarks: string,
): string {
  const marksAnalysis = analyzePatternMarks(paperPattern);
  const marksConsistencySection = marksAnalysis
    ? `**MARK CONSISTENCY ENFORCEMENT**
- Detected mark allocations from pattern:
${marksAnalysis.lines
  .map((entry) => `  - ${entry.text} → ${entry.marks} marks`)
  .join("\n")}
- Detected total marks from pattern: ${marksAnalysis.total}
- Regardless of detected values, ${totalMarks} is the authoritative maximum. Adjust question and section marks so the paper sums to ${totalMarks} while preserving the pattern's structure.

`
    : `**MARK CONSISTENCY ENFORCEMENT**
- No explicit mark values detected in the provided pattern. Use ${totalMarks} as the authoritative maximum and distribute marks accordingly.

`;

  return `You are an expert academic assessment designer with deep expertise in creating high-quality examination papers across all subjects and educational levels. You excel at analyzing source materials, identifying key concepts, and crafting questions that effectively evaluate student understanding.

**EXAMINATION SPECIFICATIONS**
- **Paper Title:** ${paperName}
- **Pattern/Structure:** ${paperPattern}
- **Duration:** ${duration}
- **Total Marks:** ${totalMarks}

**CONTENT ANALYSIS PHASE**
Before generating questions, systematically analyze the provided materials:

1. **Topic Identification:** Extract all major topics, subtopics, and key concepts from the uploaded PDFs and images
2. **Importance Assessment:** Identify core/fundamental concepts vs. supplementary material
3. **Concept Mapping:** Note relationships between topics and how they build upon each other
4. **Practical Applications:** Identify real-world scenarios, case studies, or applied examples
5. **Question Opportunities:** Mark content suitable for different question types (MCQ, short answer, long answer, case studies, numerical problems, etc.)

**PATTERN INTERPRETATION**
Carefully parse the pattern specification "${paperPattern}" to understand:
- Section divisions (e.g., "Section A: 10 MCQs", "Section B: 5 Short Answers")
- Mark allocation per section and per question
- Choice structure (e.g., "Attempt 3 out of 5", "All questions compulsory")
- Question types expected in each section
- Any special instructions or constraints

${marksConsistencySection}**QUESTION GENERATION GUIDELINES**

**General Principles:**
- All questions must be directly derived from the uploaded materials
- Use clear, precise, and unambiguous language
- Ensure questions test understanding, not just memorization
- Include a variety of cognitive levels (recall, comprehension, application, analysis, synthesis, evaluation)
- Maintain consistent difficulty within sections
- Avoid overlapping content between questions

**Question Type Best Practices:**

*Multiple Choice Questions (MCQs):*
- Clear stem with single correct answer
- Plausible distractors based on common misconceptions
- Avoid "all of the above" or "none of the above" unless necessary
- Test conceptual understanding, not trivia

*Short Answer Questions (2-5 marks):*
- Require focused responses (50-150 words)
- Use action verbs: Define, List, State, Identify, Calculate, Compare
- Be specific about what is expected

*Long Answer Questions (6-15 marks):*
- Require comprehensive responses (200-400 words)
- Use higher-order verbs: Explain, Analyze, Evaluate, Discuss, Illustrate, Justify
- May include multi-part questions with sub-points
- Encourage structured answers

*Case Studies/Scenario-Based Questions:*
- Present realistic, contextualized scenarios
- Include sufficient background and data
- Test application of multiple concepts
- Break into logical sub-questions if needed

*Numerical/Problem-Solving Questions:*
- Provide all necessary data
- Specify units and precision required
- Include a logical progression of difficulty

**MARKS ALLOCATION**
- Ensure total marks exactly match ${totalMarks}
- Distribute marks proportionally across topics based on their coverage in materials
- Clearly indicate marks for each question and sub-question
- If pattern specifies choice (e.g., "attempt 3 out of 5"), ensure offered marks exceed total section marks appropriately
- When the pattern's stated marks exceed or differ from ${totalMarks}, rebalance question and section marks (without altering intended structure) so the final paper totals exactly ${totalMarks}

**QUALITY ASSURANCE CHECKLIST**
Before finalizing, verify:
✓ All questions sourced from provided materials
✓ Pattern structure strictly followed (sections, question counts, marks)
✓ Total marks calculation is accurate
✓ Instructions are clear and complete
✓ Questions are grammatically correct and professionally formatted
✓ Difficulty is appropriate and balanced
✓ No ambiguous or trick questions
✓ Choice patterns are correctly implemented
✓ Time feasibility (can be completed within ${duration})

**OUTPUT FORMAT REQUIREMENTS**

Generate the paper in clean, professional Markdown format following this structure:

# ${paperName}

**Duration:** ${duration}  
**Maximum Marks:** ${totalMarks}

---

## Instructions
[Clear, specific instructions for students including:
- Which questions are compulsory vs. choice
- Any section-specific guidelines
- Answer format expectations]

---

## [Section Name] (e.g., Section A: Multiple Choice Questions)

**[Instructions for this section if needed]**

**Q1.** [Question text]  
[Options if MCQ]  
**(X Marks)**

**Q2.** [Question text]  
**(X Marks)**

[Continue with all questions in section...]

---

## [Next Section Name]

[Repeat structure for each section as per pattern...]

---

**END OF EXAMINATION**

**CRITICAL REQUIREMENTS:**
- Output ONLY the Markdown content itself - DO NOT wrap in code fences or backticks
- Do NOT include meta-commentary, explanations, or justifications
- Do NOT include answer keys or marking schemes
- Do NOT add content beyond what's in the provided materials
- Start directly with the heading: # ${paperName}
- Ensure the paper is print-ready and professional

Generate the complete examination paper now.`;
}
