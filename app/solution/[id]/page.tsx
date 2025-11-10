import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeSolution } from "@/lib/serialize-paper";
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
    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        paper: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!solution || solution.userId !== session.user.id) {
      notFound();
    }

    const transformedSolution = serializeSolution(solution);

    return <SolutionClient initialSolution={transformedSolution} />;
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
