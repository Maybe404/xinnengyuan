import * as React from "react"
import { CircleCheck, RotateCcw } from "lucide-react"
import { ThinkingOrb, type OrbState } from "thinking-orbs"

import { Button } from "@/components/ui/button"
import { type PageKey, useStore } from "@/store"
import { cn } from "@/lib/utils"

export interface PipelineStep {
  state: OrbState
  title: string
  desc: string
  log: string
}

export function RunPipeline({
  page,
  title,
  lead,
  cta,
  steps,
  blocked,
  blockedHint,
  onBlockedAction,
  blockedActionLabel,
  onComplete,
  onStart,
  onRerun,
  children,
  rerunLabel = "重新执行",
  variant = "hero",
  forceReady,
}: {
  page: PageKey
  title: string
  lead: string
  cta: string
  steps: PipelineStep[]
  blocked?: boolean
  blockedHint?: string
  onBlockedAction?: () => void
  blockedActionLabel?: string
  onComplete?: () => void
  onStart?: () => void
  onRerun?: () => void
  children: React.ReactNode
  rerunLabel?: string
  variant?: "hero" | "inline"
  forceReady?: boolean
}) {
  const { isPageReady, markPageReady, clearPageReady } = useStore()
  const ready = forceReady || isPageReady(page)
  const [idx, setIdx] = React.useState(-1)
  const running = idx >= 0 && !ready
  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete

  React.useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => {
      if (idx >= steps.length - 1) {
        markPageReady(page)
        onCompleteRef.current?.()
        setIdx(-1)
        return
      }
      setIdx((n) => n + 1)
    }, 1200)
    return () => window.clearTimeout(t)
  }, [running, idx, steps.length, markPageReady, page])

  const start = () => {
    if (blocked) return
    onStart?.()
    setIdx(0)
  }

  const rerun = () => {
    onRerun?.()
    clearPageReady(page)
    setIdx(0)
  }

  const current = steps[Math.max(0, idx)] ?? steps[0]
  const inline = variant === "inline"

  if (ready) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={rerun}>
            <RotateCcw className="size-3.5" />
            {rerunLabel}
          </Button>
        </div>
        {children}
      </div>
    )
  }

  if (running) {
    return (
      <div className="glass-deep spec-top relative overflow-hidden rounded-2xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <ThinkingOrb state={current.state} size={64} theme="auto" />
          <div>
            <div className="text-[15px] font-semibold tracking-tight">{current.title}</div>
            <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-muted-foreground">{current.desc}</p>
          </div>
        </div>
        <ol className="mx-auto mt-7 max-w-lg space-y-2">
          {steps.map((s, i) => {
            const done = i < idx
            const active = i === idx
            return (
              <li
                key={s.title}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-2 text-left",
                  active ? "bg-inset" : "bg-muted/50"
                )}
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                  {done ? (
                    <CircleCheck className="size-4 text-primary" />
                  ) : active ? (
                    <ThinkingOrb state={s.state} size={20} theme="auto" />
                  ) : (
                    <span className="size-2 rounded-full bg-foreground/15" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className={cn("text-[12.5px] font-medium", !active && !done && "text-muted-foreground")}>
                    {s.title}
                  </div>
                  {(active || done) && (
                    <p className="mt-0.5 font-mono text-[11px] leading-relaxed text-muted-foreground">{s.log}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          演示流水线 · 结论来自预生成稿件，不是实时大模型输出，也不显示虚假百分比
        </p>
      </div>
    )
  }

  if (blocked) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-amber-500/[0.08] px-5 py-4">
        <ThinkingOrb state="breathing" size={20} theme="auto" paused />
        <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-amber-900 dark:text-amber-200">{blockedHint}</p>
        {onBlockedAction && (
          <Button size="sm" variant="outline" onClick={onBlockedAction}>
            {blockedActionLabel}
          </Button>
        )}
      </div>
    )
  }

  if (inline) {
    return (
      <div className="glass-deep spec-top flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4">
        <ThinkingOrb state="breathing" size={64} theme="auto" />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold tracking-tight">{title}</div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{lead}</p>
        </div>
        <Button onClick={start}>{cta}</Button>
      </div>
    )
  }

  return (
    <div className="glass-deep spec-top rounded-2xl px-6 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <ThinkingOrb state="breathing" size={64} theme="auto" />
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">{lead}</p>
        </div>
        <Button size="lg" onClick={start}>
          {cta}
        </Button>
      </div>
    </div>
  )
}
