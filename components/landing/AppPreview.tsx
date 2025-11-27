import {
  Search,
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export function AppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[1000px] perspective-[2000px] select-none pointer-events-none sm:pointer-events-auto">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] dark:opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl"></div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-[#09090b] shadow-2xl transition-all duration-500 ease-out sm:rotate-x-[10deg] sm:hover:rotate-x-0 sm:hover:scale-[1.02]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Window Chrome */}
        <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-[#09090b] px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex h-6 w-full max-w-[400px] items-center justify-center rounded-md bg-[#18181b] text-[10px] font-medium text-zinc-500">
            questgen.app/home
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex h-[550px] flex-col bg-[#09090b] text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Your Quests
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage and organize your generated quests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-10 items-center rounded-lg border border-white/5 bg-[#18181b] px-3 text-sm text-zinc-500 sm:flex sm:w-64">
                <Search className="mr-2 h-4 w-4 opacity-50" />
                <span>Search papers...</span>
              </div>
              <div className="flex h-10 items-center rounded-lg bg-white px-4 text-sm font-medium text-black shadow-sm transition-colors hover:bg-zinc-200">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create New</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex gap-2">
              <div className="flex h-9 items-center rounded-md bg-[#18181b] px-4 text-sm font-medium text-white ring-1 ring-white/10">
                All Papers
              </div>
              <div className="flex h-9 items-center rounded-md px-4 text-sm font-medium text-zinc-500 transition-colors hover:bg-[#18181b] hover:text-zinc-300">
                Mathematics
              </div>
              <div className="flex h-9 items-center rounded-md px-4 text-sm font-medium text-zinc-500 transition-colors hover:bg-[#18181b] hover:text-zinc-300">
                Physics
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-[#18181b] p-1">
              <div className="rounded-md bg-[#27272a] p-1.5 text-white shadow-sm">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="p-1.5 text-zinc-500 hover:text-zinc-300">
                <List className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-hidden p-8 pt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="group relative rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm transition-all hover:border-white/10 hover:shadow-md hover:shadow-black/20">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e293b] text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <button className="text-zinc-600 hover:text-zinc-300">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-[15px] font-semibold text-white">
                  Mathematics Final
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Calculus & Algebra · 100 marks
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 rounded-full bg-[#052e16] px-2 py-0.5 text-[10px] font-medium text-green-400 border border-green-900/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    2h ago
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm transition-all hover:border-white/10 hover:shadow-md hover:shadow-black/20">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b0764]/50 text-purple-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <button className="text-zinc-600 hover:text-zinc-300">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-[15px] font-semibold text-white">Physics Quiz</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Mechanics · 50 marks
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 rounded-full bg-[#052e16] px-2 py-0.5 text-[10px] font-medium text-green-400 border border-green-900/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    5h ago
                  </span>
                </div>
              </div>

              {/* Card 3 (Processing) */}
              <div className="group relative rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm transition-all hover:border-white/10 hover:shadow-md hover:shadow-black/20">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#451a03]/50 text-amber-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <button className="text-zinc-600 hover:text-zinc-300">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-[15px] font-semibold text-white">
                  History Midterm
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  World War II · 75 marks
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 rounded-full bg-[#451a03]/50 px-2 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-900/30">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                    Generating...
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Just now
                  </span>
                </div>
              </div>
            </div>

            {/* Empty grid lines/placeholders for depth */}
            <div className="mt-6 grid gap-6 opacity-20 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-40 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30"></div>
              <div className="hidden h-40 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 sm:block"></div>
              <div className="hidden h-40 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 lg:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
