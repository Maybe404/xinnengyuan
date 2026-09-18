import * as React from "react"
import { CircleAlert, CircleCheck, Info, Lightbulb, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CAPS, CONDITIONS } from "@/data"
import { useStore, useToast } from "@/store"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "机会识别",
    desc: "区域机会对比产出候选",
    tip: "机会识别：来自区域对比，每个机会分可溯源到信源。",
  },
  {
    title: "能力对齐",
    desc: "内部能力逐项过检",
    tip: "能力对齐：内部资料逐项打分，缺口显式化为成立条件。",
  },
  {
    title: "风险界定",
    desc: "成立条件与退出线",
    tip: "风险界定：每条结论配成立条件与退出线。",
  },
  {
    title: "立项论证",
    desc: "输出决策案与跟踪项",
    tip: "立项论证：版本化决策案，变化自动触发复核。",
  },
]

function CapRow({ cap, delay }: { cap: (typeof CAPS)[number]; delay: number }) {
  const [v, setV] = React.useState(0)
  React.useEffect(() => {
    const t = setTimeout(() => setV(cap.score), 120 + delay)
    return () => clearTimeout(t)
  }, [cap.score, delay])
  const ok = cap.score >= 60
  const mid = cap.score >= 45
  return (
    <div className="flex items-center gap-4 border-b border-foreground/[0.055] py-2.5 last:border-0">
      <div className="w-16 shrink-0 text-[13px] font-medium">{cap.name}</div>
      <div className="w-36 shrink-0 text-[11px] leading-tight text-muted-foreground">{cap.source}</div>
      <Progress
        value={v}
        className="flex-1"
        aria-label={cap.name}
      />
      <div
        className={cn(
          "w-6 text-right text-[12px] font-semibold tabular",
          ok ? "text-primary" : mid ? "text-amber-600" : "text-violet-600"
        )}
      >
        {cap.score}
      </div>
      <div
        className={cn(
          "w-56 shrink-0 text-[11.5px] leading-tight",
          ok ? "text-foreground/70" : mid ? "text-amber-700" : "text-violet-700"
        )}
      >
        {ok ? "✓ " : mid ? "△ " : "✕ "}
        {cap.note}
      </div>
    </div>
  )
}

export function Decision() {
  const { versionNote, stage, setPage } = useStore()
  const toast = useToast()
  const [activeStep, setActiveStep] = React.useState(0)

  const confirmed = stage === "confirmed"
  const pending = stage === "pending"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-semibold tracking-tight">
            布局决策案
            <Badge
              variant={confirmed ? "default" : pending ? "amber" : "secondary"}
              className="text-[11.5px]"
            >
              {confirmed ? "v1.5" : "v1.4"}
              {pending && " · 待确认 v1.5"}
            </Badge>
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            外部机会 × 内部能力的对齐视图 · {versionNote} · 能力快照 2026-09
          </p>
        </div>
        {pending && (
          <button
            onClick={() => setPage("updates")}
            className="text-[12px] text-amber-700 underline decoration-amber-400/60 underline-offset-4 hover:decoration-amber-500"
          >
            查看 v1.5 待确认内容 →
          </button>
        )}
      </div>

      <div className="flex items-stretch gap-1.5 rise">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            <button
              onClick={() => {
                setActiveStep(i)
                toast(s.tip)
              }}
              className={cn(
                "glass flex-1 rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5",
                activeStep === i && "!bg-primary/[0.07] !border-primary/30"
              )}
            >
              <div className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground/70">
                STEP {i + 1}
              </div>
              <div className="mt-0.5 text-[14px] font-semibold">{s.title}</div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">{s.desc}</div>
            </button>
            {i < STEPS.length - 1 && (
              <div className="self-center text-muted-foreground/40">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <Card className="rise" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle>内部能力对齐检查</CardTitle>
            <CardDescription>机会：江苏 · 工商业储能 · 信息来源与更新时间逐项标注</CardDescription>
          </CardHeader>
          <CardContent>
            {CAPS.map((c, i) => (
              <CapRow key={c.name} cap={c} delay={i * 130} />
            ))}
          </CardContent>
        </Card>

        <Card className="rise" style={{ animationDelay: "180ms" }}>
          <CardHeader>
            <CardTitle>决策结论（{confirmed ? "v1.5" : "v1.4"}）</CardTitle>
            <CardDescription>结论按性质三层分列 —— 事实 / 推断 / 假设，不混排</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3 rounded-xl bg-sky-500/[0.06] px-3.5 py-3">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-sky-600" />
              <div>
                <Badge variant="sky" className="mb-1">事实 · 有信源</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">
                  江苏工商业峰谷价差 {confirmed ? "0.72（征求意见稿）" : "0.61"} 元/kWh（省发改委）；竞争对手 X 已降价 8%（双源印证）。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-primary/[0.06] px-3.5 py-3">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <Badge className="mb-1">推断 · 有推理链</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">
                  建议
                  <b className="text-foreground">
                    {confirmed ? "加快落地江苏工商业储能" : "优先布局江苏工商业储能"}
                  </b>
                  ：需求经双信源核验为真、竞争尚未固化、渠道能力基本匹配{confirmed ? "，且盈利空间因新政上修" : ""}——推理链见下方成立条件。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-violet-500/[0.06] px-3.5 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-violet-600" />
              <div>
                <Badge variant="violet" className="mb-1">假设 · 待验证</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">
                  省级储能补贴政策延续至 2027（待验证：跟踪省财政厅年度预算公示）。
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-amber-700">
                <ShieldCheck className="size-3.5" />
                成立条件
              </div>
              {CONDITIONS.map((c) => (
                <div key={c} className="rounded-lg bg-white/55 px-3 py-1.5 text-[12px] leading-relaxed text-foreground/80">
                  {c}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] leading-relaxed text-muted-foreground">
              <CircleAlert className="mt-0.5 size-3 shrink-0" />
              本版决策案引用的企业能力评分为 2026-09 快照；能力变化不改动历史版本，只触发新版本复核。每条结论附信源数与更新时间，评审可逐条溯源。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
