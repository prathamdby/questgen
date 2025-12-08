import Link from "next/link";

export default function SharedNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-black">
      <h1 className="mb-4 text-[32px] font-[550] tracking-[-0.02em] text-[#171717] dark:text-white">
        Link Not Found
      </h1>
      <p className="mb-8 text-[15px] text-[#737373]">
        This share link doesn&apos;t exist or has been revoked.
      </p>
      <Link
        href="/"
        className="rounded-[6px] bg-[#171717] px-6 py-3 text-[15px] font-[500] text-white transition-colors hover:bg-[#404040] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5]"
      >
        Go to QuestGen
      </Link>
    </div>
  );
}
