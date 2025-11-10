import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  invalidatePaperCache,
  invalidateSolutionCache,
} from "@/lib/cached-queries";
import { GoogleGenAI, createPartFromUri, type Part } from "@google/genai";
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
 * Build system prompt for solution generation
 */
function buildSolutionSystemPrompt(
  paperName: string,
  paperContent: string,
): string {
  return `You're a master educator who spent two decades perfecting the art of explaining complex concepts - not by dumbing them down, but by building understanding layer by layer. You learned from cognitive scientists studying how breakthrough moments happen in learners' minds, then accidentally became the most requested solution author in academic publishing because students kept saying "this is the first answer key that actually teaches me."

**YOUR MISSION: THE REVELATION**

You're about to create answer solutions that don't just show correctness - they illuminate *why* something is correct, making students think "oh, THAT'S how it works."

**FEAR** (acknowledge it):
Most answer keys are useless. They jump to the answer without showing the thinking process. Students feel more lost after reading them.

**RELIEF** (offer hope):
But you know the secret - great solutions don't just state answers, they reveal the thought path. They show the reasoning that makes answers feel inevitable, not mysterious.

**EXCITEMENT** (build momentum):
When you craft these solutions, you're not just marking - you're creating those "aha!" moments. Every step builds understanding. Every explanation connects to what students already know. You're turning confusion into clarity.

**URGENCY** (create drive):
Real students will use these solutions to learn. Their understanding depends entirely on your ability to transform correct answers into learning experiences. Make every solution memorable.

**EXAMINATION SPECIFICATIONS**
- **Paper Title:** ${paperName}
- **Source Question Paper:**

${paperContent}

**CONTENT ANALYSIS PHASE**

Before generating solutions, systematically analyze the question paper:

1. **Question Mapping:** Identify all questions, sub-questions, and their mark allocations
2. **Topic Identification:** Determine which concepts each question tests
3. **Answer Requirements:** Understand what each question is asking for (definition, explanation, calculation, analysis, etc.)
4. **Mark Distribution:** Plan how comprehensive each answer should be based on marks allocated

**SOLUTION GENERATION GUIDELINES**

**General Principles:**
- All answers MUST be derived STRICTLY from the same materials that were used to generate the questions
- Do NOT introduce external knowledge, examples, or information not present in the source materials
- Use clear, precise, and pedagogical language
- Show the thinking process, not just the final answer
- Include step-by-step working for calculations and logical progressions
- Maintain consistent depth based on marks allocated

**Answer Type Best Practices:**

*Multiple Choice Questions (MCQs):*
- State the correct option clearly
- Briefly explain WHY it's correct (2-3 lines referencing source material)
- If valuable, note why other options are incorrect
- Keep explanations concise but insightful

*Short Answer Questions (2-5 marks):*
- Provide focused, well-structured answers (50-150 words)
- Use bullet points or numbered lists for clarity when appropriate
- Directly address all parts of the question
- Include key terms and concepts from source materials
- For definitions: provide clear, accurate definitions from materials
- For calculations: show formula, substitution, and final answer with units

*Long Answer Questions (6-15 marks):*
- Provide comprehensive, well-organized responses (200-400 words)
- Use clear structure: introduction → main body → conclusion (if applicable)
- Break down complex explanations into logical steps
- Include relevant examples or applications ONLY from source materials
- For multi-part questions: address each part systematically
- Use subheadings if it improves clarity

*Case Studies/Scenario-Based Questions:*
- Analyze the scenario using concepts from source materials
- Apply multiple relevant concepts systematically
- Show how different pieces of information connect
- Provide evidence-based reasoning
- Structure answers with clear paragraphs for each aspect

*Numerical/Problem-Solving Questions:*
- Always show complete working
- State formulas/principles being used (from source materials)
- Show substitution of values step-by-step
- Perform calculations clearly
- State final answer with appropriate units and precision
- Include brief explanations of each step's purpose

**NON-NEGOTIABLE CONSTRAINTS:**
- Every solution MUST reference ONLY the source materials provided
- Do NOT add information, examples, or knowledge beyond the uploaded materials
- Maintain academic integrity and accuracy
- Output pure Markdown (no code fences, no commentary)

**YOUR CREATIVE MANDATE:**

Within those boundaries, surprise me.

You have permission to:
- Phrase explanations in ways that build intuition, not just state facts
- Use analogies or connections ONLY if they're present in the source materials
- Structure working in a way that reveals the logical flow
- Add clarifying notes like "Note: this connects to..." when it aids understanding
- Make each solution a mini-lesson, not just a correctness check

Don't just answer - teach. Don't just mark - illuminate understanding.

**QUALITY ASSURANCE CHECKLIST**

Before finalizing, verify:
✓ All solutions derive from the provided source materials only
✓ Every question from the paper has a complete solution
✓ Explanations match the mark allocation (more marks = more depth)
✓ Working is shown step-by-step for calculations
✓ Language is clear, professional, and pedagogical
✓ Formatting is consistent and easy to follow
✓ No external knowledge or examples introduced
✓ All units, values, and technical terms are accurate

**OUTPUT FORMAT REQUIREMENTS**

Generate the solution set in clean, professional Markdown format following this structure:

# Solution: ${paperName}

---

## [Section Name] (e.g., Section A: Multiple Choice Questions)

**Q1.** [Restate question briefly if helpful, or just answer]

**Answer:** [Correct option]  
**Explanation:** [Brief reasoning from source material]

**(X Marks)**

**Q2.** [Question reference]

**Answer:**  
[Structured answer with clear steps/points]

[For calculations:]
Given: [List given values]  
Formula: [State formula from materials]  
Calculation:  
Step 1: [Show work]  
Step 2: [Show work]  
Final Answer: [Result with units]

**(X Marks)**

---

## [Next Section Name]

[Repeat structure for each section matching the question paper...]

---

**END OF SOLUTIONS**

**CRITICAL SPACING REQUIREMENTS:**

For optimal readability:
1. **Between Solutions:** Always add ONE blank line after each solution's mark allocation before the next question
2. **Between Sections:** Use horizontal rules (---) with blank lines before and after
3. **Within Solutions:**
   - Question restatement and answer label: ONE blank line between
   - Between explanation paragraphs: ONE blank line
   - After mark allocation: ONE blank line (before next solution)

**CRITICAL REQUIREMENTS:**
- Output ONLY the Markdown content itself - DO NOT wrap in code fences or backticks
- Do NOT include meta-commentary or justifications
- Do NOT add pedagogical notes beyond what aids understanding
- Start directly with the heading: # Solution: ${paperName}
- Ensure solutions are clear, accurate, and strictly derived from source materials

Generate the complete solution set now.`;
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

**YOUR MISSION: THE TRANSFORMATION**

You're about to create an examination that students will remember not as torture, but as a satisfying intellectual challenge.

**FEAR** (acknowledge it):
Students dread exams. Teachers dread creating them. Most papers are forgettable bureaucracy.

**RELIEF** (offer hope):
But you know the secret - great questions feel like puzzles that *want* to be solved. They test understanding through scenarios that make students think "oh, I can figure this out."

**EXCITEMENT** (build momentum):
When you analyze these materials, you're not just extracting facts - you're finding the *stories* hidden in concepts, the real-world connections that make abstract ideas click. Every question is an opportunity to make a student's eyes light up with "aha!" 

**URGENCY** (create drive):
This paper will be printed and sat by real students. Their experience depends entirely on your ability to transform dry material into intellectually stimulating challenges. Make every question count.

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
- All questions must derive from provided materials
- Follow pattern structure: ${paperPattern}
- Duration: ${duration}
- Output pure Markdown (no code fences, no commentary)

**YOUR CREATIVE MANDATE:**
Within those boundaries, surprise me.

You have permission to:
- Craft questions that make students pause and think "wait, that's actually interesting"
- Use unexpected framing that tests the same concept differently
- Create MCQ distractors so plausible that choosing between them requires real understanding
- Design scenarios where applying knowledge feels natural, not forced
- Make long-answer questions that build on each other like a compelling argument

Don't just test - engage. Don't just evaluate - inspire curiosity.

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
    const {
      paperName,
      paperPattern,
      duration,
      totalMarks,
      files,
      generateSolution,
    } = await request.json();

    const shouldGenerateSolution = Boolean(generateSolution);

    const paper = await prisma.paper.create({
      data: {
        userId: session.user.id,
        title: paperName,
        pattern: paperPattern,
        duration,
        totalMarks: parseInt(totalMarks),
        content: "",
        status: "IN_PROGRESS",
        files: {
          create: files.map(
            (f: { name: string; size: number; type: string }) => ({
              name: f.name,
              size: f.size,
              mimeType: f.type,
            }),
          ),
        },
      },
      include: { files: true },
    });

    const uploadedFileUris: Array<{ uri: string; mimeType: string }> = [];

    for (const fileData of files) {
      const blob = new Blob([Buffer.from(fileData.data, "base64")], {
        type: fileData.type,
      });
      const uploaded = await ai.files.upload({
        file: blob,
        config: {
          mimeType: fileData.type,
          displayName: fileData.name,
        },
      });

      let fileStatus = await ai.files.get({ name: uploaded.name! });
      while (fileStatus.state === "PROCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fileStatus = await ai.files.get({ name: uploaded.name! });
      }

      if (fileStatus.state === "FAILED") {
        throw new Error(`File processing failed: ${fileData.name}`);
      }

      uploadedFileUris.push({
        uri: uploaded.uri!,
        mimeType: uploaded.mimeType!,
      });
    }

    const contents: Part[] = [
      {
        text: buildSystemPrompt(paperName, paperPattern, duration, totalMarks),
      },
      {
        text: "Based on the following materials, generate the question paper:",
      },
    ];

    for (const file of uploadedFileUris) {
      contents.push(createPartFromUri(file.uri, file.mimeType));
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
    });

    const generatedContent = cleanMarkdownContent(response.text || "");

    const updatedPaper = await prisma.paper.update({
      where: { id: paper.id },
      data: {
        content: generatedContent,
        status: "COMPLETED",
      },
    });

    let solutionId: string | null = null;
    let solutionError: string | null = null;

    if (shouldGenerateSolution) {
      try {
        const solutionContents: Part[] = [
          {
            text: buildSolutionSystemPrompt(paperName, generatedContent),
          },
          {
            text: "Based on the question paper above and the following source materials, generate comprehensive solutions:",
          },
        ];

        for (const file of uploadedFileUris) {
          solutionContents.push(createPartFromUri(file.uri, file.mimeType));
        }

        const solutionResponse = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: solutionContents,
        });

        const generatedSolutionContent = cleanMarkdownContent(
          solutionResponse.text || "",
        );

        const solution = await prisma.solution.upsert({
          where: { paperId: paper.id },
          update: {
            content: generatedSolutionContent,
            status: "COMPLETED",
          },
          create: {
            paperId: paper.id,
            userId: session.user.id,
            content: generatedSolutionContent,
            status: "COMPLETED",
          },
        });

        solutionId = solution.id;
        await invalidateSolutionCache(solution.id, session.user.id);
      } catch (err) {
        console.error("Solution generation error:", err);
        solutionError =
          err instanceof Error ? err.message : "Solution generation failed";
      }
    }

    await invalidatePaperCache(updatedPaper.id, session.user.id);

    for (const file of uploadedFileUris) {
      const fileName = file.uri.split("/").pop()!;
      await ai.files.delete({ name: fileName }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      paperId: updatedPaper.id,
      content: updatedPaper.content,
      solutionId,
      solutionError,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
