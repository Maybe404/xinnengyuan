import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

export type PageKey = "overview" | "verify" | "compare" | "decision" | "updates"

export type EventStage = "idle" | "running" | "pending" | "confirmed"

interface Store {
  page: PageKey
  setPage: (p: PageKey) => void
  stage: EventStage
  setStage: (s: EventStage) => void
  version: string
  versionNote: string
}

const Ctx = React.createContext<Store | null>(null)

export function useStore() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("useStore outside provider")
  return ctx
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [page, setPageRaw] = React.useState<PageKey>("overview")
  const [stage, setStage] = React.useState<EventStage>("idle")

  const version = stage === "confirmed" ? "v1.5" : "v1.4"
  const versionNote =
    stage === "confirmed"
      ? "已确认 · 2026-09-18"
      : stage === "pending"
        ? "存在待复核事项（v1.5 待确认）"
        : "已确认 · 2026-09-12"

  const setPage = React.useCallback((p: PageKey) => {
    setPageRaw(p)
  }, [])

  const value = React.useMemo(
    () => ({ page, setPage, stage, setStage, version, versionNote }),
    [page, setPage, stage, version, versionNote]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// ---- glass toast ----

interface ToastItem {
  id: number
  msg: React.ReactNode
}

const ToastCtx = React.createContext<{
  toast: (msg: React.ReactNode) => void
} | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error("useToast outside provider")
  return ctx.toast
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const idRef = React.useRef(0)

  const toast = React.useCallback((msg: React.ReactNode) => {
    const id = ++idRef.current
    setItems((prev) => [...prev.slice(-2), { id, msg }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const value = React.useMemo(() => ({ toast }), [toast])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-7 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "glass-deep flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] shadow-2xl rise"
            )}
          >
            <CheckCircle2 className="size-3.5 text-primary" />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ---- count-up hook ----

export function useCountUp(target: number, duration = 1100) {
  const [val, setVal] = React.useState(0)
  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setVal(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}
