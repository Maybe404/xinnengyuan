import * as React from "react"
import { CircleCheck, CircleDashed } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CHAIN_STAGES, PROJECTS, type ProjStatus, type Project } from "@/data"
import { cn } from "@/lib/utils"

const STATUS_BADGE: Record<ProjStatus, "default" | "amber" | "secondary"> = {
  ok: "default",
  risk: "amber",
  new: "secondary",
}

function ChainStrip({ chain, compact }: { chain: Project["chain"]; compact?: boolean }) {
  const done = chain.filter(Boolean).length
  return (
    <div className="flex items-center gap-1">
      {chain.map((ok, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              ok
                ? "bg-primary/10 text-primary"
                : i === done
                  ? "bg-amber-500/12 text-amber-700"
                  : "bg-foreground/[0.05] text-muted-foreground/60"
            )}
          >
            {ok ? <CircleCheck className="size-3" /> : <CircleDashed className="size-3" />}
            {compact ? CHAIN_STAGES[i].slice(0, 2) : CHAIN_STAGES[i]}
          </div>
          {i < chain.length - 1 && (
            <span className={cn("h-px w-3", ok ? "bg-primary/30" : "bg-foreground/10")} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export function Verify() {
  const [filter, setFilter] = React.useState<"all" | ProjStatus>("all")
  const [open, setOpen] = React.useState<Project | null>(null)

  const counts = {
    all: PROJECTS.length,
    risk: PROJECTS.filter((p) => p.status === "risk").length,
    ok: PROJECTS.filter((p) => p.status === "ok").length,
    new: PROJECTS.filter((p) => p.status === "new").length,
  }
  const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.status === filter)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">项目核验台</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          签约 ≠ 投产。每个项目沿四段核验链推进，全部走通才算「真实落地」。
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as never)}>
        <TabsList>
          <TabsTrigger value="all">全部 {counts.all}</TabsTrigger>
          <TabsTrigger value="risk">进展存疑 {counts.risk}</TabsTrigger>
          <TabsTrigger value="ok">已核验 {counts.ok}</TabsTrigger>
          <TabsTrigger value="new">新入库 {counts.new}</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="rise overflow-hidden p-0">
        <CardContent className="p-0">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-foreground/[0.07] text-left text-[11.5px] text-muted-foreground">
                <th className="px-5 py-3 font-medium">项目</th>
                <th className="px-3 py-3 font-medium">区域</th>
                <th className="px-3 py-3 font-medium">规模</th>
                <th className="px-3 py-3 font-medium">核验进度</th>
                <th className="px-3 py-3 font-medium">最新信源动作</th>
                <th className="px-5 py-3 text-right font-medium">判定</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, idx) => (
                <tr
                  key={p.name}
                  onClick={() => setOpen(p)}
                  className="cursor-pointer border-b border-foreground/[0.045] transition-colors last:border-0 hover:bg-white/50 rise"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      入库 30 天 · 核验 {p.chain.filter(Boolean).length}/4 段
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground">{p.region}</td>
                  <td className="px-3 py-3.5 tabular text-muted-foreground">{p.scale}</td>
                  <td className="px-3 py-3.5">
                    <ChainStrip chain={p.chain} compact />
                  </td>
                  <td className="px-3 py-3.5 text-[12px] text-muted-foreground">{p.lastAction}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge variant={STATUS_BADGE[p.status]}>{p.statusLabel}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 演示说明：项目清单为模拟数据，核验链规则与信源结构为方案设计内容
      </p>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{open.name}</SheetTitle>
              <SheetDescription>
                {open.region} · {open.scale} · 状态：{open.statusLabel}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5">
              <section>
                <h4 className="mb-2.5 text-[12px] font-semibold tracking-wide text-primary">四段核验链</h4>
                <ChainStrip chain={open.chain} />
                <p className="mt-3 text-[12.5px] leading-relaxed text-foreground/80">
                  {open.chain.every(Boolean)
                    ? "四段全部走通，判定为真实落地，可作为区域需求证据进入决策案。"
                    : "核验未走通 —— 签约 ≠ 投产，暂不能作为区域需求证据。没有发现项目证据 ≠ 判定没有市场需求，仅标注「资料不足」。"}
                </p>
              </section>
              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">信源动作留痕</h4>
                <div className="rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
                  {open.lastAction}（自动归集 + 人工复核双通道）
                </div>
                <div className="mt-2 rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
                  判定由信源核验规则自动给出，人工可申诉复核，全部动作留痕可追溯。
                </div>
              </section>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
