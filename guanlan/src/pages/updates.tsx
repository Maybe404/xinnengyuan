import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Bot, History, UserCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { RunPipeline } from "@/components/run-pipeline"
import { EVENT_STEPS_7, HISTORY_EVENTS } from "@/data"
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
  const { stage, setStage, topic } = useStore()
  const toast = useToast()
  const pending = stage === "pending"
  const confirmed = stage === "confirmed"
  const canDemoUpdate = !!topic.currentVersion

  const confirm = () => {
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
  const visibleSteps = confirmed ? EVENT_STEPS_7.length : pending ? EVENT_STEPS_7.length - 1 : 0

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">动态跟踪</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          新增资料 / 证据变化 / 阶段调整 / 能力变更 → 依赖反查 → 影响分析 → 待确认版本 → 人工确认（A08/A09 现场必过）
        </p>
      </div>

      <Card className="rise">
        <CardHeader>
          <CardTitle>历史事件留痕</CardTitle>
          <CardDescription>随专题带出。无影响的新资料也记录入库，不生成空版本。影响分析需手动触发。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {HISTORY_EVENTS.slice(0, topic.currentVersion ? HISTORY_EVENTS.length : 1).map((e) => (
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
        </CardContent>
      </Card>

      <RunPipeline
        page="updates"
        variant="inline"
        title="分析已导入的重要新资料"
        lead={
          canDemoUpdate
            ? "针对已导入的江苏分时电价新政（M-001）跑依赖反查与影响分析。预生成流水线，不是全网监测。"
            : "当前专题还没有已确认研究版本。可以扫描，但不会生成空的对照版本。"
        }
        cta={canDemoUpdate ? "分析新增资料" : "扫描资料变化"}
        rerunLabel="重新分析"
        forceReady={pending || confirmed}
        onComplete={() => {
          if (canDemoUpdate && stage === "idle") {
            setStage("pending")
            toast("已载入预生成影响分析 · v1.4 仍为当前正式版本")
          }
        }}
        steps={[
          {
            state: "searching",
            title: "扫描本专题新增资料",
            desc: "只处理已导入内容，失败不把状态写成无变化",
            log: "M-001 江苏分时电价征求意见稿",
          },
          {
            state: "working",
            title: "依赖反查",
            desc: "找出引用旧电价口径的结论、档位与成立条件",
            log: "deps: 江苏档位 · 配置经济性前提",
          },
          {
            state: "solving",
            title: "影响分析",
            desc: "新政未生效，单列情景研判，不覆盖已确认 v1.4",
            log: "impact = pending v1.5",
          },
          {
            state: "composing",
            title: "生成待确认版本",
            desc: "人工确认前，正式版本仍是上一版",
            log: canDemoUpdate ? "v1.5 pending confirm" : "no formal baseline",
          },
        ]}
      >
        <Card className="rise">
          <CardHeader>
            <CardTitle>本次事件的更新链路</CardTitle>
            <CardDescription>
              预生成演示内容 · 事件类型：新增资料 · 来源：M-001（真实公开）· 处理状态：
              {confirmed ? "已处理" : pending ? "待处理" : "待分析"}
            </CardDescription>
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
                            : "glass !bg-inset text-primary"
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

      <Card className="rise">
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
      </RunPipeline>
    </div>
  )
}
