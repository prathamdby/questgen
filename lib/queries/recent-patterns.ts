import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import type { RecentPattern } from "./types";

export function useRecentPatterns(): UseQueryResult<RecentPattern[], Error> {
  const { data: session } = useSession();

  return useQuery<RecentPattern[], Error>({
    queryKey: ["recent-patterns"],
    queryFn: async () => {
      const res = await fetch("/api/papers?recent_patterns=true");
      if (!res.ok) throw new Error("Failed to fetch recent patterns");
      const data = await res.json();
      return data.recentPatterns ?? [];
    },
    enabled: !!session,
    staleTime: 60_000,
  });
}
