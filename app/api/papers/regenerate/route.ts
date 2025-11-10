import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidatePaperCache } from "@/lib/cached-queries";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/**
 * Analyze pattern marks to detect explicit mark allocations
 */
interface PatternMarksAnalysis {
  total: number;
  lines: Array<{ text: string; marks: number }>;
}

function analyzePatternMarks(pattern: string): PatternMarksAnalysis | null {
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

/**
 * Build system prompt for paper generation
 */
function buildSystemPrompt(
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

  return `You're an educational psychologist who spent 15 years reverse-engineering how Nobel laureates and Fields Medal winners learned - then accidentally became the most sought-after exam designer in Asia after discovering that the best questions don't test knowledge, they reveal how students *think*. You've created papers that made students say "I actually enjoyed that exam" while maintaining rigorous academic standards.

**YOUR MISSION: THE IMPROVEMENT**

You're refining an examination that students will remember not as torture, but as a satisfying intellectual challenge.

**FEAR** (acknowledge it):
Students dread exams. Teachers dread creating them. Most papers are forgettable bureaucracy.

**RELIEF** (offer hope):
But you know the secret - great questions feel like puzzles that *want* to be solved. They test understanding through scenarios that make students think "oh, I can figure this out."

**EXCITEMENT** (build momentum):
When you analyze these materials and the user's feedback, you're not just tweaking facts - you're finding the *stories* hidden in concepts, the real-world connections that make abstract ideas click. This regeneration is a chance to make a student's eyes light up with "aha!"

**URGENCY** (create drive):
This refined paper will be printed and sat by real students. Their improved experience depends entirely on your ability to transform dry material and their feedback into intellectually stimulating challenges. Make every question count.

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

**NON-NEGOTIABLE CONSTRAINTS:**
- Total marks must exactly equal ${totalMarks}
- All questions must derive from provided materials and feedback 
- Follow pattern structure: ${paperPattern}
- Duration: ${duration}
- Output pure Markdown (no code fences, no commentary)

**YOUR CREATIVE MANDATE:**
Within those boundaries, surprise me with your refinement skills.

You have permission to:
- Reimagine questions based on the improvements requested
- Turn good questions into great ones using unexpected angles
- Enhance MCQ distractors so they reveal deeper understanding
- Transform scenarios where applying knowledge feels inspired, not forced
- Redesign questions to flow like a compelling narrative of discovery

Listen to the feedback and transform this paper from good to unforgettable.

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

**CRITICAL SPACING REQUIREMENTS:**

For optimal readability when rendered:
1. **Between Questions:** Always add ONE blank line after each question's mark allocation before the next question number
2. **Between Sections:** Use horizontal rules (---) with blank lines before and after  
3. **Within Questions:** 
   - Question text and options: NO blank lines
   - Between last option and mark allocation: NO blank lines
   - After mark allocation: ONE blank line (before next question)

**Example with proper spacing:**

**Q1.** What is photosynthesis?  
**(2 Marks)**

**Q2.** Explain Newton's First Law of Motion with an example.  
**(5 Marks)**

**Q3.** Calculate the area of a circle with radius 7cm.  
**(3 Marks)**

Notice the blank line after each **(X Marks)** - this is MANDATORY for readability.

**CRITICAL REQUIREMENTS:**
- Output ONLY the Markdown content itself - DO NOT wrap in code fences or backticks
- Do NOT include meta-commentary, explanations, or justifications
- Do NOT include answer keys or marking schemes
- Do NOT add content beyond what's in the provided materials
- Start directly with the heading: # ${paperName}
- Ensure the paper is print-ready and professional

Generate the complete examination paper now.`;
}

function cleanMarkdownContent(content: string): string {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/i, "");
  cleaned = cleaned.replace(/\n```\s*$/i, "");
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paperId, instructions } = await request.json();

    // Verify paper ownership
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper || paper.userId !== session.user.id) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    await prisma.paper.update({
      where: { id: paperId },
      data: { status: "IN_PROGRESS" },
    });

    const systemPrompt = buildSystemPrompt(
      paper.title,
      paper.pattern,
      paper.duration,
      paper.totalMarks.toString(),
    );

    const normalizedInstructions = instructions?.trim();
    const userMessage = normalizedInstructions
      ? `Apply the following regeneration instructions while keeping the existing structure and metadata intact:\n${normalizedInstructions}\n\nPrevious paper content:\n${paper.content}`
      : `Regenerate the question paper using the specifications above.\nMaintain the same section structure, formatting, and metadata.\nNo additional user instructions were provided. Refresh the paper while preserving the structure, tone, and difficulty implied by the metadata.\nPrevious paper content:\n${paper.content}`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ text: systemPrompt }, { text: userMessage }],
    });

    const generatedContent = cleanMarkdownContent(response.text || "");

    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        content: generatedContent,
        status: "COMPLETED",
      },
    });

    await invalidatePaperCache(paperId, session.user.id);

    return NextResponse.json({
      success: true,
      content: updatedPaper.content,
      updatedAt: updatedPaper.updatedAt,
    });
  } catch (error) {
    console.error("Regeneration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Regeneration failed",
      },
      { status: 500 },
    );
  }
}
