import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowUpRight, ChevronRight, Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CONF_META, FEEDS, HYPE, KPIS, SOURCE_MIX, type FeedItem } from "@/data"
import { useCountUp, useStore, useToast } from "@/store"
import { cn } from "@/lib/utils"

const sparkConfig = {
  v: { label: "走势", color: "var(--chart-1)" },
} satisfies ChartConfig

const hypeConfig = {
  verified: { label: "经核验的真实需求信号", color: "var(--chart-1)" },
  hype: { label: "媒体热度", color: "var(--chart-4)" },
} satisfies ChartConfig

const mixConfig = SOURCE_MIX.reduce((acc, s) => {
  acc[s.name] = { label: s.name }
  return acc
}, {} as ChartConfig)

function Sparkline({ data, tone }: { data: number[]; tone?: string }) {
  const points = data.map((v, i) => ({ i, v }))
  return (
    <ChartContainer config={sparkConfig} className="h-9 w-full aspect-auto">
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone ?? "var(--chart-1)"} stopOpacity={0.28} />
            <stop offset="100%" stopColor={tone ?? "var(--chart-1)"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="v"
          stroke={tone ?? "var(--chart-1)"}
          strokeWidth={1.8}
          fill="url(#sparkFill)"
          isAnimationActive
          animationDuration={1200}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function KpiCard({ kpi, index }: { kpi: (typeof KPIS)[number]; index: number }) {
  const { setPage } = useStore()
  const val = useCountUp(kpi.value, 900 + index * 150)
  const isFloat = !Number.isInteger(kpi.value)
  return (
    <button
      onClick={() => kpi.target && setPage(kpi.target as never)}
      className="glass spec-top group relative flex flex-col items-start gap-1 rounded-2xl p-4.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_oklch(0.5_0.03_260/0.13)] rise"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="text-xs text-muted-foreground">{kpi.label}</div>
      <div className="flex w-full items-end justify-between gap-2">
        <div className="text-[30px] leading-none font-semibold tracking-tight tabular">
          {isFloat ? val.toFixed(1) : Math.round(val)}
        </div>
        <div className="w-24 opacity-90">
          <Sparkline data={kpi.spark} />
        </div>
      </div>
      <div
        className={cn(
          "text-[11px]",
          kpi.footTone === "up" && "text-primary",
          kpi.footTone === "amber" && "text-amber-600",
          kpi.footTone === "muted" && "text-muted-foreground"
        )}
      >
        {kpi.footTone === "amber" && "• "}
        {kpi.foot}
        {kpi.target && (
          <ChevronRight className="ml-0.5 inline size-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-70" />
        )}
      </div>
    </button>
  )
}

function FeedRow({ item, onOpen }: { item: FeedItem; onOpen: () => void }) {
  const meta = CONF_META[item.conf]
  return (
    <button
      onClick={onOpen}
      className="group flex w-full items-start gap-3.5 border-b border-foreground/[0.055] px-1 py-3.5 text-left transition-colors last:border-0 hover:bg-white/45"
    >
      <span
        className={cn(
          "mt-[7px] size-1.5 shrink-0 rounded-full",
          item.hot ? "bg-amber-500" : "bg-primary/70"
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-medium">{item.title}</span>
          {item.hot && (
            <Badge variant="amber" className="shrink-0">
              <Flame className="size-2.5" />
              高优先级
            </Badge>
          )}
        </div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">
          {item.channel} · {item.meta}
        </div>
      </div>
      <Badge variant={meta.badge} className="mt-0.5 shrink-0">
        {meta.label}
      </Badge>
    </button>
  )
}

export function Overview() {
  const { setPage } = useStore()
  const toast = useToast()
  const [open, setOpen] = React.useState<FeedItem | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">情报总览</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          外部情报与内部资料的统一入口 · 今日自动归集 47 条，3 条高优先级待研
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {KPIS.map((k, i) => (
          <KpiCard key={k.key} kpi={k} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Card className="xl:col-span-3 rise" style={{ animationDelay: "120ms" }}>
          <CardHeader>
            <CardTitle>今日情报流</CardTitle>
            <CardDescription>点击任意条目，查看信源核验与交叉印证详情</CardDescription>
          </CardHeader>
          <CardContent>
            {FEEDS.map((f) => (
              <FeedRow key={f.id} item={f} onOpen={() => setOpen(f)} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-3.5 xl:col-span-2">
          <Card className="rise" style={{ animationDelay: "190ms" }}>
            <CardHeader>
              <CardTitle>热度真伪扫描</CardTitle>
              <CardDescription>政策热度 ≠ 真实需求 · 差距越大越要警惕「虚热」</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={hypeConfig} className="h-44 w-full aspect-auto">
                <BarChart data={HYPE} layout="vertical" margin={{ left: 4, right: 10 }} barGap={2}>
                  <CartesianGrid horizontal={false} strokeDasharray="0" className="chart-grid" />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={132}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip cursor={{ fill: "oklch(0.5 0.03 260 / 0.05)" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="verified" name="核验信号" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={9} isAnimationActive animationDuration={1100} />
                  <Bar dataKey="hype" name="媒体热度" fill="var(--chart-4)" radius={[0, 4, 4, 0]} barSize={9} isAnimationActive animationDuration={1300} />
                </BarChart>
              </ChartContainer>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                深色 = 经核验的真实需求信号；浅色 = 媒体热度。独立储能（山东）热度 88 但核验信号仅 21，典型「虚热」。
              </p>
            </CardContent>
          </Card>

          <Card className="rise" style={{ animationDelay: "260ms" }}>
            <CardHeader>
              <CardTitle>内外信源结构</CardTitle>
              <CardDescription>每条结论平均引用 3.2 个信源，交叉印证后方可进入决策案</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-5">
              <ChartContainer config={mixConfig} className="mx-auto aspect-square h-32 w-32">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={SOURCE_MIX}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={30}
                    outerRadius={52}
                    paddingAngle={3}
                    strokeWidth={0}
                    isAnimationActive
                    animationDuration={1100}
                  >
                    {SOURCE_MIX.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex-1 space-y-1.5">
                {SOURCE_MIX.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-[11.5px]">
                    <span className="size-2 shrink-0 rounded-[3px]" style={{ background: s.fill }} />
                    <span className="flex-1 text-muted-foreground">{s.name}</span>
                    <span className="font-medium tabular">{s.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{open.title}</SheetTitle>
              <SheetDescription>
                {open.channel} · {open.meta}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5">
              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">信源核验</h4>
                <div className="rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
                  {open.cross}
                </div>
                <div className="mt-2 rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
                  核验方式：证据从「待核验」到「已核验」须由显式动作触发 —— 人工查证原文 / 第二独立来源印证 / 实地确认，操作人与方式自动留痕。<b>有出处 ≠ 自动已核验。</b>
                </div>
              </section>
              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">研究备注</h4>
                <p className="text-[13px] leading-relaxed text-foreground/85">{open.note}</p>
              </section>
              <section className="flex gap-2.5 pt-1">
                <Button onClick={() => { setOpen(null); setPage("updates") }}>
                  查看触发的更新 <ArrowUpRight />
                </Button>
                <Button variant="outline" onClick={() => toast("已加入深度研究队列（演示）")}>
                  加入深度研究
                </Button>
              </section>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
