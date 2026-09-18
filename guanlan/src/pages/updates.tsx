import * as React from "react"
import { Bot, History, Sparkles, UserCheck } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { EVENT_STEPS, HISTORY, SCORE_TREND_BASE } from "@/data"
import { useStore, useToast } from "@/store"
import { cn } from "@/lib/utils"

const trendConfig = {
  score: { label: "江苏机会分", color: "var(--chart-1)" },
} satisfies ChartConfig

const WHO_META = {
  sys: { label: "自动", icon: Bot, badge: "secondary" as const },
  ai: { label: "自动", icon: Bot, badge: "sky" as const },
  human: { label: "人工复核", icon: UserCheck, badge: "default" as const },
}

export function Updates() {
  const { stage, setStage, setPage } = useStore()
  const toast = useToast()
  // 重挂载（切换页面再回来）时按 store 的 stage 恢复进度：
  // pending = 自动链路已走完、等待人工确认；confirmed = 全部完成
  const [visibleSteps, setVisibleSteps] = React.useState(() =>
    stage === "pending"
      ? EVENT_STEPS.length - 1
      : stage === "confirmed"
        ? EVENT_STEPS.length
        : 0
  )
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const running = stage === "running"

  const fire = () => {
    if (running) return
    setStage("running")
    setVisibleSteps(0)
    toast("模拟事件已触发：正在执行研究更新链路…")
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const autoSteps = EVENT_STEPS.length - 1 // 最后一步是人工确认
    for (let i = 1; i <= autoSteps; i++) {
      timersRef.current.push(
        setTimeout(() => {
          setVisibleSteps(i)
          if (i === autoSteps) setStage("pending")
        }, i * 1150)
      )
    }
    // 人工确认按钮出现后，用户点击触发 confirmed（见下）
  }

  const confirm = () => {
    setVisibleSteps(EVENT_STEPS.length)
    setStage("confirmed")
    toast(
      <>
        <b className="font-semibold">v1.5 已确认生效</b>
        <span className="ml-1 text-muted-foreground">草稿 → 待确认 → 已确认，全程留痕</span>
      </>
    )
  }

  const showConfirmBtn = stage === "pending"

  const trendData = React.useMemo(() => {
    if (stage === "idle" || stage === "running") return SCORE_TREND_BASE
    return [...SCORE_TREND_BASE, { date: "09-18", score: 8.6, new: true }]
  }, [stage])

  const lastVisible = visibleSteps > 0 ? EVENT_STEPS[visibleSteps - 1] : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">变化与更新</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          重要变化出现后，系统自动触发研究复核 → 结论版本化更新（草稿 → 待确认 → 已确认），全程留痕
        </p>
      </div>

      <div className="glass-deep spec-top relative flex flex-wrap items-center gap-6 overflow-hidden rounded-2xl p-6 rise">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(30rem 12rem at 85% 20%, oklch(0.58 0.19 258 / 0.12), transparent 65%)",
          }}
        />
        <div className="relative">
          <h3 className="text-[17px] font-semibold tracking-tight">现场演示：模拟一条重要变化</h3>
          <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-muted-foreground">
            点击触发「江苏发布新版分时电价政策」，观察研究链路如何响应、决策案如何从 v1.4 更新到 v1.5。
          </p>
        </div>
        <Button
          className="relative ml-auto"
          size="lg"
          disabled={running}
          onClick={stage === "confirmed" ? () => setPage("decision") : fire}
        >
          {stage === "confirmed" ? (
            <>查看已确认的 v1.5 决策案</>
          ) : running ? (
            <>链路执行中…</>
          ) : (
            <>
              <Sparkles />
              {stage === "pending" ? "重新触发模拟事件" : "触发模拟事件"}
            </>
          )}
        </Button>
      </div>

      {(visibleSteps > 0 || stage === "confirmed") && (
        <Card className="rise">
          <CardHeader>
            <CardTitle>本次事件触发的更新链路</CardTitle>
            <CardDescription>每一步标注「自动 / 人工」与依据，可逐条溯源</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0 pl-1">
              {EVENT_STEPS.slice(0, visibleSteps).map((s, i) => {
                const who = WHO_META[s.who]
                const isLast = i === visibleSteps - 1
                const isHuman = s.who === "human"
                return (
                  <div key={i} className="relative flex gap-4 pb-5 last:pb-0 rise">
                    <div className="relative flex flex-col items-center">
                      <span
                        className={cn(
                          "z-10 flex size-7 items-center justify-center rounded-full",
                          isHuman
                            ? "bg-primary text-primary-foreground shadow-[0_2px_8px_oklch(0.58_0.19_258/0.35)]"
                            : "glass !bg-white/80 text-primary"
                        )}
                      >
                        <who.icon className="size-3.5" />
                      </span>
                      {!isLast && <span className="mt-1 w-px flex-1 bg-foreground/10" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold">{s.title}</span>
                        <Badge variant={who.badge}>{who.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                      {isHuman && (
                        <div className="mt-1 text-[11px] text-muted-foreground/70">
                          确认人：张远（战略部）· 2026-09-18 16:42 · 依据范围：政策原文 §4、电价历史台账
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {showConfirmBtn && (
                <div className="rise flex items-center gap-3 rounded-xl bg-amber-500/[0.07] px-4 py-3">
                  <div className="text-[12.5px] leading-relaxed text-amber-800">
                    v1.5 待确认 —— 确认表示业务方接受本版研究表达（非全部事实已核实）；未确认前 v1.4 仍为当前版本。
                  </div>
                  <Button size="sm" className="ml-auto shrink-0" onClick={confirm}>
                    <UserCheck />
                    确认 v1.5
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Card className="rise xl:col-span-3">
          <CardHeader>
            <CardTitle>江苏机会分走势</CardTitle>
            <CardDescription>
              {stage === "idle" || stage === "running"
                ? "当前 8.2 · 模拟事件确认后，新评分 8.6 将体现在图上"
                : "09-18：新版分时电价政策确认生效，机会分 8.2 → 8.6（盈利空间 71 → 79）"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-40 w-full aspect-auto">
              <AreaChart data={trendData} margin={{ left: -14, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} className="chart-grid" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} dy={6} />
                <YAxis domain={[6.5, 9]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="score"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#trendFill)"
                  dot={{ r: 3, fill: "var(--chart-1)", fillOpacity: 1 }}
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rise xl:col-span-2">
          <CardHeader>
            <CardTitle>历史更新留痕</CardTitle>
            <CardDescription>结论的每次变化都可见、可追责</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {HISTORY.map((h) => (
              <div key={h.time} className="border-b border-foreground/[0.055] py-3 last:border-0">
                <div className="flex items-center gap-2">
                  <History className="size-3.5 text-muted-foreground/60" />
                  <span className="text-[11px] tabular text-muted-foreground">{h.time}</span>
                  <span className="text-[13px] font-semibold">{h.title}</span>
                  <Badge variant={h.tone} className="ml-auto shrink-0">
                    {h.impact}
                  </Badge>
                </div>
                <p className="mt-1 pl-6 text-[12px] leading-relaxed text-muted-foreground">
                  {h.desc}
                </p>
              </div>
            ))}
            {lastVisible && visibleSteps < EVENT_STEPS.length && (
              <div className="mt-1 text-center text-[11px] text-muted-foreground/60">
                链路执行中 · 已完成 {visibleSteps}/{EVENT_STEPS.length} 步
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
