import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCachedSolution } from "@/lib/cached-queries";
import { SolutionClient } from "@/components/solution/SolutionClient";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";

interface SolutionPageProps {
  params: Promise<{ id: string }>;
}

async function SolutionContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  try {
    const solution = await getCachedSolution(id, session.user.id);

    if (!solution) {
      notFound();
    }

    return <SolutionClient initialSolution={solution} />;
  } catch (error) {
    console.error("Failed to fetch solution:", error);
    throw error;
  }
}

export default function SolutionPage({ params }: SolutionPageProps) {
  return (
    <Suspense fallback={<PaperDetailSkeleton />}>
      <SolutionContent params={params} />
    </Suspense>
  );
}
