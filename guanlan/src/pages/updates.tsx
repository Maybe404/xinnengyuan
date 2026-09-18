import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Bot, History, Sparkles, UserCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { EVENT_STEPS_7, HISTORY_EVENTS, VERSION_HISTORY } from "@/data"
import { useStore, useToast } from "@/store"
import { cn } from "@/lib/utils"

const trendConfig = {
  v: { label: "江苏已核验支持证据 V", color: "var(--chart-1)" },
} satisfies ChartConfig

// 证据累计走势（演示）——事件确认后 V 增加
const TREND = [
  { week: "W1", v: 4 },
  { week: "W2", v: 5 },
  { week: "W3", v: 6 },
  { week: "W4", v: 7 },
  { week: "W5", v: 8 },
]

const WHO_META = {
  sys: { label: "自动", icon: Bot, badge: "secondary" as const },
  ai: { label: "影响分析", icon: Bot, badge: "sky" as const },
  human: { label: "人工", icon: UserCheck, badge: "default" as const },
}

export function Updates() {
  const { stage, setStage, setPage } = useStore()
  const toast = useToast()
  const [visibleSteps, setVisibleSteps] = React.useState(() =>
    stage === "pending"
      ? EVENT_STEPS_7.length - 1
      : stage === "confirmed"
        ? EVENT_STEPS_7.length
        : 0
  )
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  React.useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const running = stage === "running"
  const pending = stage === "pending"
  const confirmed = stage === "confirmed"

  const fire = () => {
    if (running) return
    setStage("running")
    setVisibleSteps(0)
    toast("事件已触发：分析新增资料（仅本专题已导入内容）…")
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    const autoSteps = EVENT_STEPS_7.length - 1
    for (let i = 1; i <= autoSteps; i++) {
      timersRef.current.push(
        setTimeout(() => {
          setVisibleSteps(i)
          if (i === autoSteps) setStage("pending")
        }, i * 1100)
      )
    }
  }

  const confirm = () => {
    setVisibleSteps(EVENT_STEPS_7.length)
    setStage("confirmed")
    toast(
      <>
        <b className="font-semibold">v1.5 已确认</b>
        <span className="ml-1 text-muted-foreground">v1.4 转为只读历史 · 重复提交不产生重复版本</span>
      </>
    )
  }

  const showConfirm = pending
  const trendData = confirmed ? [...TREND, { week: "W6", v: 9 }] : TREND

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">动态跟踪</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          新增资料 / 证据变化 / 阶段调整 / 能力变更 → 依赖反查 → 影响分析 → 待确认版本 → 人工确认（A08/A09 现场必过）
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
          <h3 className="text-[17px] font-semibold tracking-tight">现场演示：导入重要新资料</h3>
          <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-muted-foreground">
            模拟导入「江苏分时电价新政征求意见稿（M-001）」—— 观察依赖反查、影响分析、待确认版本与确认流程。
          </p>
        </div>
        <Button
          className="relative ml-auto"
          size="lg"
          disabled={running}
          onClick={confirmed ? () => setPage("research") : fire}
        >
          {confirmed ? (
            <>查看已确认的 v1.5 研究</>
          ) : running ? (
            <>影响分析中…</>
          ) : (
            <>
              <Sparkles />
              {pending ? "重新触发（当前 v1.5 待确认）" : "导入模拟新资料"}
            </>
          )}
        </Button>
      </div>

      {(visibleSteps > 0 || confirmed) && (
        <Card className="rise">
          <CardHeader>
            <CardTitle>本次事件的更新链路</CardTitle>
            <CardDescription>事件类型：新增资料 · 来源：M-001（真实公开）· 处理状态：{confirmed ? "已处理" : pending ? "待处理" : "分析中"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {EVENT_STEPS_7.slice(0, visibleSteps).map((s, i) => {
                const who = WHO_META[s.who]
                const isLast = i === visibleSteps - 1 && !confirmed
                return (
                  <div key={i} className="relative flex gap-4 pb-5 last:pb-0 rise">
                    <div className="relative flex flex-col items-center">
                      <span
                        className={cn(
                          "z-10 flex size-7 items-center justify-center rounded-full",
                          s.who === "human"
                            ? "bg-primary text-primary-foreground shadow-[0_2px_8px_oklch(0.58_0.19_258/0.35)]"
                            : "glass !bg-white/80 text-primary"
                        )}
                      >
                        <who.icon className="size-3.5" />
                      </span>
                      {!isLast && <span className="mt-1 w-px flex-1 bg-foreground/10" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13.5px] font-semibold">{s.title}</span>
                        <Badge variant={who.badge}>{who.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{s.desc}</p>
                      {s.who === "human" && confirmed && (
                        <div className="mt-1 text-[11px] text-muted-foreground/70">
                          操作：张远（战略研究）· 2026-09-18 · v1.5 确认时间留痕 · 旧版引用快照可查
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {showConfirm && (
                <div className="rise flex flex-wrap items-center gap-3 rounded-xl bg-amber-500/[0.07] px-4 py-3">
                  <div className="min-w-56 flex-1 text-[12.5px] leading-relaxed text-amber-800">
                    v1.5 待确认 —— 确认 = 接受本版研究表达（非全部事实已核实）；确认前 v1.4 仍为当前正式版本，待核验事项继续展示。
                  </div>
                  <Button size="sm" className="shrink-0" onClick={confirm}>
                    <UserCheck />
                    确认 v1.5（拟确认版本 · 变更摘要：新政情景单列 + 档位注释更新）
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
            <CardTitle>证据 V 累计走势（江苏 · 支持计数）</CardTitle>
            <CardDescription>
              {confirmed
                ? "09-18：新政原文核验完成，V 8 → 9（支持计数 +1）"
                : "当前 V=8 · 模拟事件确认后，新政原文核验将使 V +1"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-36 w-full aspect-auto">
              <AreaChart data={trendData} margin={{ left: -26, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="vFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} className="chart-grid" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} dy={6} />
                <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="v"
                  name="V 支持"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#vFill)"
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
            <CardTitle>历史事件留痕</CardTitle>
            <CardDescription>无影响的新资料也记录入库与分析结果，不生成空版本</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {HISTORY_EVENTS.map((e) => (
              <div key={e.time} className="border-b border-foreground/[0.055] py-3 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <History className="size-3.5 text-muted-foreground/60" />
                  <span className="text-[11px] tabular text-muted-foreground">{e.time}</span>
                  <span className="text-[12.5px] font-semibold">{e.title}</span>
                  <Badge variant={e.tone} className="ml-auto shrink-0">
                    {e.impact}
                  </Badge>
                </div>
                <p className="mt-1 pl-6 text-[12px] leading-relaxed text-muted-foreground">{e.desc}</p>
              </div>
            ))}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {VERSION_HISTORY.map((v) => (
                <span key={v.ver} className="tabular">
                  {v.ver}·{v.ver === "v1.5" ? (confirmed ? "已确认" : pending ? "待确认" : "草稿") : v.state}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
