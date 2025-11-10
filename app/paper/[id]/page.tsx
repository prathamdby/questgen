import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializePaper } from "@/lib/serialize-paper";
import { PaperClient } from "@/components/paper/PaperClient";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";

interface PaperPageProps {
  params: Promise<{ id: string }>;
}

async function PaperContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  try {
    const paper = await prisma.paper.findUnique({
      where: { id },
      include: {
        files: true,
        solution: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!paper || paper.userId !== session.user.id) {
      notFound();
    }

    const transformedPaper = serializePaper(paper);

    return <PaperClient initialPaper={transformedPaper} />;
  } catch (error) {
    console.error("Failed to fetch paper:", error);
    throw error;
  }
}

export default function PaperPage({ params }: PaperPageProps) {
  return (
    <Suspense fallback={<PaperDetailSkeleton />}>
      <PaperContent params={params} />
    </Suspense>
  );
}
