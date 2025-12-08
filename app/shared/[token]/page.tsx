import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SharedPaperView } from "@/components/shared/SharedPaperView";
import { SharedSolutionView } from "@/components/shared/SharedSolutionView";
import { SharedExpired } from "@/components/shared/SharedExpired";

interface SharedPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: SharedPageProps) {
  const { token } = await params;

  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      paper: { select: { title: true } },
      solution: { include: { paper: { select: { title: true } } } },
    },
  });

  if (!shareLink) return { title: "Not Found" };

  const title =
    shareLink.paper?.title ||
    shareLink.solution?.paper?.title ||
    "Shared Content";

  return {
    title: `${title} | QuestGen`,
    description: `View shared ${shareLink.paperId ? "question paper" : "solution"}: ${title}`,
  };
}

export default async function SharedPage({ params }: SharedPageProps) {
  const { token } = await params;

  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      user: { select: { name: true } },
      paper: {
        select: {
          title: true,
          pattern: true,
          duration: true,
          totalMarks: true,
          content: true,
          createdAt: true,
        },
      },
      solution: {
        include: {
          paper: {
            select: {
              title: true,
              pattern: true,
              duration: true,
              totalMarks: true,
            },
          },
        },
      },
    },
  });

  if (!shareLink) {
    notFound();
  }

  if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
    return <SharedExpired />;
  }

  const ownerFirstName = shareLink.user.name?.split(" ")[0] || "Someone";

  if (shareLink.paper) {
    return (
      <SharedPaperView paper={shareLink.paper} ownerName={ownerFirstName} />
    );
  }

  if (shareLink.solution) {
    return (
      <SharedSolutionView
        solution={shareLink.solution}
        ownerName={ownerFirstName}
      />
    );
  }

  notFound();
}
