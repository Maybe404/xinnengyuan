import {
  Activity,
  ArrowLeftRight,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useStore, type PageKey } from "@/store"
import { cn } from "@/lib/utils"

const NAV: {
  section: string
  items: { key: PageKey; label: string; icon: typeof LayoutDashboard; badge?: number }[]
}[] = [
  {
    section: "情报",
    items: [
      { key: "overview", label: "情报总览", icon: LayoutDashboard, badge: 3 },
      { key: "verify", label: "项目核验台", icon: ShieldCheck },
    ],
  },
  {
    section: "研究",
    items: [
      { key: "compare", label: "区域机会对比", icon: ArrowLeftRight },
      { key: "decision", label: "布局决策案", icon: Activity },
    ],
  },
  {
    section: "响应",
    items: [{ key: "updates", label: "变化与更新", icon: Zap }],
  },
]

export function Sidebar() {
  const { page, setPage, stage } = useStore()
  return (
    <aside className="glass-deep relative z-10 flex h-screen w-[228px] shrink-0 flex-col overflow-hidden rounded-none border-x-0 border-y-0 border-l-0">
      <div className="px-6 pt-7 pb-5">
        <div className="text-[26px] leading-none font-semibold tracking-[0.32em] text-foreground">
          观澜
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">新能源产业情报研究台</div>
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
                const badge =
                  item.key === "overview" ? 3 : item.key === "updates" && stage !== "idle" && stage !== "confirmed" ? 1 : undefined
                return (
                  <button
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition-all duration-200 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring/40",
                      active
                        ? "bg-white/85 text-foreground font-medium shadow-[0_1px_3px_oklch(0.4_0.03_260/0.12),inset_0_1px_0_oklch(1_0_0/0.8)]"
                        : "text-muted-foreground hover:bg-white/45 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 transition-colors",
                        active ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                      )}
                    />
                    {item.label}
                    {badge !== undefined && (
                      <Badge className="ml-auto h-4.5 min-w-4.5 px-1 tabular">{badge}</Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-foreground/[0.06] px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
        内部资料库已接入
        <br />
        <span className="text-muted-foreground/70">演示数据 · 部分为模拟</span>
      </div>
    </aside>
  )
}
