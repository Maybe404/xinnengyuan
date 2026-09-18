import { Activity, ArrowLeftRight, FileText, FolderOpen, Landmark, Moon, ScrollText, Sun, Zap } from "lucide-react"

import { TopicMenu } from "@/components/topic-menu"
import { Badge } from "@/components/ui/badge"
import { useStore, type PageKey } from "@/store"
import { useTheme } from "@/theme"
import { cn } from "@/lib/utils"

const NAV: {
  section: string
  items: { key: PageKey; label: string; icon: typeof FolderOpen }[]
}[] = [
  {
    section: "研究单元",
    items: [
      { key: "topic", label: "业务专题", icon: FolderOpen },
      { key: "materials", label: "情报资料", icon: FileText },
    ],
  },
  {
    section: "研究",
    items: [
      { key: "compare", label: "区域比较", icon: ArrowLeftRight },
      { key: "research", label: "深度研究", icon: Activity },
      { key: "report", label: "报告审查", icon: ScrollText },
    ],
  },
  {
    section: "响应与支撑",
    items: [
      { key: "updates", label: "动态跟踪", icon: Zap },
      { key: "capability", label: "企业能力档案", icon: Landmark },
    ],
  },
]

export function Sidebar() {
  const { page, setPage, stage, topic, versionNote } = useStore()
  const { theme, toggleTheme } = useTheme()
  const pendingUpdate = stage === "pending"
  return (
    <aside className="glass-deep relative z-10 flex h-screen w-[228px] shrink-0 flex-col overflow-hidden rounded-none border-x-0 border-y-0 border-l-0">
      <div className="px-6 pt-7 pb-3">
        <div className="text-[26px] leading-none font-semibold tracking-[0.32em] text-foreground">
          观澜
        </div>
        <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          新能源场站配套储能
          <br />
          产业情报与决策研究台
        </div>
      </div>

      <div className="px-3.5 pb-3">
        <div className="px-3 pb-1.5 text-[10.5px] font-medium tracking-[0.18em] text-muted-foreground/70">
          当前专题
        </div>
        <TopicMenu />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3.5 pb-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="px-3 pt-1 pb-1.5 text-[10.5px] font-medium tracking-[0.18em] text-muted-foreground/70">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = page === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition-all duration-200 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring/40",
                      active
                        ? "bg-white/85 text-foreground font-medium shadow-[0_1px_3px_oklch(0.4_0.03_260/0.12),inset_0_1px_0_oklch(1_0_0/0.8)] dark:bg-white/12 dark:shadow-none"
                        : "text-muted-foreground hover:bg-white/45 hover:text-foreground dark:hover:bg-white/8"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 transition-colors",
                        active ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                      )}
                    />
                    {item.label}
                    {item.key === "updates" && pendingUpdate && (
                      <Badge className="ml-auto h-4.5 min-w-4.5 px-1 tabular">!</Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-foreground/[0.06] px-4 py-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="mb-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-[12.5px] text-muted-foreground transition-colors hover:bg-white/45 hover:text-foreground dark:hover:bg-white/8"
        >
          {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          {theme === "dark" ? "浅色模式" : "深色模式"}
        </button>
        <div className="px-2 text-[11px] leading-relaxed text-muted-foreground">
          {topic.id} · 截止 {topic.deadline}
          <br />
          {versionNote}
          <br />
          <span className="text-muted-foreground/70">演示环境 · 含真实公开资料与模拟业务数据</span>
        </div>
      </div>
    </aside>
  )
}
