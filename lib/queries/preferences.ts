import { useQuery, useMutation, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import type { GenerationDefaults } from "./types";

export function useGenerationDefaults(): UseQueryResult<GenerationDefaults | null, Error> {
  const { data: session } = useSession();

  return useQuery<GenerationDefaults | null, Error>({
    queryKey: ["generation-defaults"],
    queryFn: async () => {
      const res = await fetch("/api/preferences");
      if (!res.ok) throw new Error("Failed to fetch preferences");
      const data = await res.json();
      const prefs = data.preferences;
      if (!prefs || !prefs.defaultPattern) return null;
      return {
        defaultPattern: prefs.defaultPattern ?? null,
        defaultPatternPresetId: prefs.defaultPatternPresetId ?? null,
        defaultDuration: prefs.defaultDuration ?? null,
        defaultTotalMarks: prefs.defaultTotalMarks ?? null,
        defaultGenerationMode: prefs.defaultGenerationMode ?? null,
        defaultStrategy: prefs.defaultStrategy ?? null,
        defaultGenerateSolution: prefs.defaultGenerateSolution ?? false,
      };
    },
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveGenerationDefaults() {
  return useMutation({
    mutationFn: async (defaults: Partial<GenerationDefaults>) => {
      const res = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaults),
      });
      if (!res.ok) throw new Error("Failed to save generation defaults");
      return res.json();
    },
  });
}
