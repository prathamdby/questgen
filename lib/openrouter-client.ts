/**
 * OpenRouter API client for question paper generation
 */

import { getStoredApiKey } from "./openrouter-auth";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const PRIMARY_MODEL = "google/gemini-2.0-flash-exp:free";
const FALLBACK_MODEL = "mistralai/mistral-small-3.2-24b-instruct:free";

interface GeneratePaperParams {
  paperName: string;
  paperPattern: string;
  duration: string;
  totalMarks: string;
  files: File[];
}

interface RegeneratePaperParams {
  paperName: string;
  paperPattern: string;
  duration: string;
  totalMarks: string;
  previousContent: string;
  instructions?: string;
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{
        type: string;
        text?: string;
        image_url?: { url: string };
        file?: { filename: string; file_data: string };
      }>;
}

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
 * Convert File to base64 data URL
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Clean markdown content by removing code fence wrappers
 */
function cleanMarkdownContent(content: string): string {
  let cleaned = content.trim();

  // Remove opening code fence (```markdown, ```md, or just ```)
  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/i, "");

  // Remove closing code fence
  cleaned = cleaned.replace(/\n```\s*$/i, "");

  return cleaned.trim();
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

/**
 * Build user message with multimodal content
 */
async function buildUserMessage(
  files: File[],
): Promise<OpenRouterMessage["content"]> {
  const contentParts: Array<{
    type: string;
    text?: string;
    image_url?: { url: string };
    file?: { filename: string; file_data: string };
  }> = [];

  // Add text instruction
  contentParts.push({
    type: "text",
    text: "Based on the following materials, generate the question paper as specified:",
  });

  // Add files
  for (const file of files) {
    const base64Data = await fileToBase64(file);

    if (file.type.startsWith("image/")) {
      // Handle images - use image_url content type
      contentParts.push({
        type: "image_url",
        image_url: {
          url: base64Data,
        },
      });
    } else if (file.type === "application/pdf") {
      // Handle PDFs - use file content type per OpenRouter docs
      contentParts.push({
        type: "file",
        file: {
          filename: file.name,
          file_data: base64Data,
        },
      });
    }
  }

  return contentParts;
}

/**
 * Helper to call OpenRouter API with a specific model
 * Returns structured response with success/error details
 */
async function callOpenRouter(
  model: string,
  messages: OpenRouterMessage[],
  apiKey: string,
): Promise<
  | { success: true; content: string }
  | { success: false; error: string; isOverloaded: boolean }
> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Question Paper Generator",
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error?.message ||
        `API request failed: ${response.status} ${response.statusText}`;

      // Detect overload conditions
      const isOverloaded =
        response.status === 429 ||
        response.status === 529 ||
        errorMessage.toLowerCase().includes("overloaded") ||
        errorMessage.toLowerCase().includes("capacity") ||
        errorMessage.toLowerCase().includes("rate limit");

      return {
        success: false,
        error: errorMessage,
        isOverloaded,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content received from the API.",
        isOverloaded: false,
      };
    }

    // Clean the content to remove any code fence wrappers
    const cleanedContent = cleanMarkdownContent(content);

    return {
      success: true,
      content: cleanedContent,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      isOverloaded: false,
    };
  }
}

/**
 * Generate question paper using OpenRouter
 */
export async function generateQuestionPaper(
  params: GeneratePaperParams,
): Promise<
  { success: true; content: string } | { success: false; error: string }
> {
  try {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
      return {
        success: false,
        error: "No API key found. Please sign in again.",
      };
    }

    if (params.files.length === 0) {
      return {
        success: false,
        error: "At least one file is required.",
      };
    }

    // Build messages
    const systemPrompt = buildSystemPrompt(
      params.paperName,
      params.paperPattern,
      params.duration,
      params.totalMarks,
    );

    const userContent = await buildUserMessage(params.files);

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userContent,
      },
    ];

    // Try primary model first
    const primaryResult = await callOpenRouter(PRIMARY_MODEL, messages, apiKey);

    if (primaryResult.success) {
      return primaryResult;
    }

    // If primary model is overloaded, try fallback
    if (primaryResult.isOverloaded) {
      const fallbackResult = await callOpenRouter(
        FALLBACK_MODEL,
        messages,
        apiKey,
      );

      if (fallbackResult.success) {
        return fallbackResult;
      }

      // Both models failed
      return {
        success: false,
        error: `Primary model (${PRIMARY_MODEL}): ${primaryResult.error}. Fallback model (${FALLBACK_MODEL}): ${fallbackResult.error}`,
      };
    }

    // Primary model failed for non-overload reason
    return {
      success: false,
      error: primaryResult.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function regenerateQuestionPaper(
  params: RegeneratePaperParams,
): Promise<
  { success: true; content: string } | { success: false; error: string }
> {
  try {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
      return {
        success: false,
        error: "No API key found. Please sign in again.",
      };
    }

    const normalizedInstructions = params.instructions?.trim();

    const systemPrompt = buildSystemPrompt(
      params.paperName,
      params.paperPattern,
      params.duration,
      params.totalMarks,
    );

    const instructionSummary = normalizedInstructions
      ? `Apply the following regeneration instructions while keeping the existing structure and metadata intact:\n${normalizedInstructions}`
      : "No additional user instructions were provided. Refresh the paper while preserving the structure, tone, and difficulty implied by the metadata.";

    const userMessage: OpenRouterMessage["content"] = [
      {
        type: "text",
        text: [
          "Regenerate the question paper using the specifications above.",
          "Maintain the same section structure, formatting, and metadata.",
          instructionSummary,
          "Use the previous paper version below purely as context. Produce a refreshed paper that fully complies with the authoritative metadata and marks budget.",
        ].join("\n\n"),
      },
      {
        type: "text",
        text: `Previous paper content:\n${params.previousContent}`,
      },
    ];

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    // Try primary model first
    const primaryResult = await callOpenRouter(PRIMARY_MODEL, messages, apiKey);

    if (primaryResult.success) {
      return primaryResult;
    }

    // If primary model is overloaded, try fallback
    if (primaryResult.isOverloaded) {
      const fallbackResult = await callOpenRouter(
        FALLBACK_MODEL,
        messages,
        apiKey,
      );

      if (fallbackResult.success) {
        return fallbackResult;
      }

      // Both models failed
      return {
        success: false,
        error: `Primary model (${PRIMARY_MODEL}): ${primaryResult.error}. Fallback model (${FALLBACK_MODEL}): ${fallbackResult.error}`,
      };
    }

    // Primary model failed for non-overload reason
    return {
      success: false,
      error: primaryResult.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
