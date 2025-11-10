import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCachedPaper } from "@/lib/cached-queries";
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
    const paper = await getCachedPaper(id, session.user.id);

    if (!paper) {
      notFound();
    }

    return <PaperClient initialPaper={paper} />;
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
