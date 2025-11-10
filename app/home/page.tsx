import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializePaper } from "@/lib/serialize-paper";
import type { SessionData, TransformedPaper } from "@/lib/types";
import { HomeClient } from "@/components/home/HomeClient";
import { PaperCardSkeleton } from "@/components/home/PaperCardSkeleton";

async function HomeContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  try {
    const papers = await prisma.paper.findMany({
      where: { userId: session.user.id },
      include: {
        files: true,
        solution: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transformedPapers: TransformedPaper[] = papers.map(serializePaper);

    const sessionData: SessionData = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    };

    return (
      <HomeClient initialPapers={transformedPapers} session={sessionData} />
    );
  } catch (error) {
    console.error("Failed to load home data:", error);
    throw error;
  }
}

function HomeFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <PaperCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
