export interface GeneratePaperParams {
  paperName: string;
  paperPattern: string;
  duration: string;
  totalMarks: string;
  files: File[];
}

export interface RegeneratePaperParams {
  paperName: string;
  paperPattern: string;
  duration: string;
  totalMarks: string;
  previousContent: string;
  instructions?: string;
}

type GeneratePaperResult =
  | { success: true; content: string }
  | { success: false; error: string };

type RegeneratePaperResult =
  | { success: true; content: string }
  | { success: false; error: string };

export async function generateQuestionPaper(
  params: GeneratePaperParams,
): Promise<GeneratePaperResult> {
  if (params.files.length === 0) {
    return {
      success: false,
      error: "At least one file is required to generate a paper.",
    };
  }

  const formData = new FormData();
  formData.append("paperName", params.paperName);
  formData.append("paperPattern", params.paperPattern);
  formData.append("duration", params.duration);
  formData.append("totalMarks", params.totalMarks);

  params.files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await fetch("/api/genai/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && typeof data.error === "string" && data.error.trim()) ||
        `Failed to generate paper (${response.status}).`;

      return {
        success: false,
        error: errorMessage,
      };
    }

    const content = data?.content;

    if (!content || typeof content !== "string") {
      return {
        success: false,
        error: "The AI response did not include any content.",
      };
    }

    return {
      success: true,
      content,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating the paper.",
    };
  }
}

export async function regenerateQuestionPaper(
  params: RegeneratePaperParams,
): Promise<RegeneratePaperResult> {
  try {
    const response = await fetch("/api/genai/regenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && typeof data.error === "string" && data.error.trim()) ||
        `Failed to regenerate paper (${response.status}).`;

      return {
        success: false,
        error: errorMessage,
      };
    }

    const content = data?.content;

    if (!content || typeof content !== "string") {
      return {
        success: false,
        error: "The AI response did not include any content.",
      };
    }

    return {
      success: true,
      content,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while regenerating the paper.",
    };
  }
}
