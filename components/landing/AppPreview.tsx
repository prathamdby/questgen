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
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] dark:opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 mix-blend-multiply blur-3xl dark:mix-blend-normal"></div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-border bg-background shadow-2xl transition-all duration-500 ease-out sm:rotate-x-[10deg] sm:hover:rotate-x-0 sm:hover:scale-[1.02]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Window Chrome */}
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57] opacity-80" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] opacity-80" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] opacity-80" />
          </div>
          <div className="mx-auto flex h-6 w-full max-w-[400px] items-center justify-center rounded-md bg-background/50 text-[10px] font-medium text-muted-foreground opacity-50">
            questgen.app/home
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex h-[500px] flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Your Quests
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage and organize your generated quests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 items-center rounded-md border border-border bg-muted/30 px-3 text-sm text-muted-foreground sm:flex">
                <Search className="mr-2 h-4 w-4 opacity-50" />
                <span>Search papers...</span>
              </div>
              <div className="flex h-9 items-center rounded-md border border-border bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create New</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex gap-2">
              <div className="flex h-8 items-center rounded-md bg-muted px-2 text-xs font-medium text-foreground">
                All Papers
              </div>
              <div className="flex h-8 items-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted/50">
                Mathematics
              </div>
              <div className="flex h-8 items-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted/50">
                Physics
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <div className="rounded-sm bg-muted p-1 text-foreground shadow-sm">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="p-1 text-muted-foreground">
                <List className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-hidden bg-muted/10 p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground">
                  Mathematics Final
                </h3>
                <p className="text-xs text-muted-foreground">
                  Calculus & Algebra · 100 marks
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    2h ago
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground">Physics Quiz</h3>
                <p className="text-xs text-muted-foreground">
                  Mechanics · 50 marks
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    5h ago
                  </span>
                </div>
              </div>

              {/* Card 3 (Processing) */}
              <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground">
                  History Midterm
                </h3>
                <p className="text-xs text-muted-foreground">
                  World War II · 75 marks
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
                    Generating...
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Just now
                  </span>
                </div>
              </div>
            </div>

            {/* Empty grid lines/placeholders for depth */}
            <div className="mt-4 grid gap-4 opacity-40 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-32 rounded-lg border border-border border-dashed bg-muted/20"></div>
              <div className="hidden h-32 rounded-lg border border-border border-dashed bg-muted/20 sm:block"></div>
              <div className="hidden h-32 rounded-lg border border-border border-dashed bg-muted/20 lg:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
