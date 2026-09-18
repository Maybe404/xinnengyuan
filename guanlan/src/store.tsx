import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import {
  MATERIALS,
  PRESET_TOPICS,
  filterMaterials,
  filterRegions,
  filterStations,
  type Material,
  type MaterialFact,
  type TopicRecord,
  type VerifyState,
} from "@/data"
import { cn } from "@/lib/utils"

export type PageKey = "topic" | "materials" | "compare" | "research" | "report" | "updates" | "capability"

export type EventStage = "idle" | "pending" | "confirmed"

export interface VerifyRecord {
  state: VerifyState
  result: string
  methods: string[]
  scope: string
  note: string
  who: string
  at: string
}

export interface EvidenceTarget {
  materialId: string
  factIndex: number
}

export interface CreateTopicInput {
  name: string
  question: string
  stage: string
  period: string
  deadline: string
}

interface Persisted {
  topicId: string
  page: PageKey
  stages: Record<string, EventStage>
  extraTopics: TopicRecord[]
  extraMaterials: Record<string, Material[]>
  verifies: Record<string, VerifyRecord>
  capEdited: boolean
  flow: FlowFlags
}

const LS_KEY = "guanlan-demo-v4"

interface FlowFlags {
  visited: Partial<Record<PageKey, boolean>>
  stationOpened: boolean
  reportOpened: boolean
  reviewed: boolean
  pageReady: Record<string, boolean>
}

function load(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Persisted
  } catch {
    return {}
  }
}

interface Store {
  page: PageKey
  setPage: (p: PageKey) => void
  topicId: string
  topics: TopicRecord[]
  topic: TopicRecord
  switchTopic: (id: string) => void
  createTopic: (input: CreateTopicInput) => TopicRecord
  stage: EventStage
  setStage: (s: EventStage) => void
  version: string
  versionNote: string
  materials: Material[]
  importMaterial: (m: Material) => void
  stations: ReturnType<typeof filterStations>
  regions: ReturnType<typeof filterRegions>
  evidence: EvidenceTarget | null
  openEvidence: (t: EvidenceTarget) => void
  closeEvidence: () => void
  verifies: Record<string, VerifyRecord>
  submitVerify: (key: string, rec: VerifyRecord) => void
  applyFact: (m: Material, i: number) => MaterialFact
  capEdited: boolean
  setCapEdited: (v: boolean) => void
  createOpen: boolean
  setCreateOpen: (v: boolean) => void
  flow: FlowFlags
  markStationOpened: () => void
  markReportOpened: () => void
  markReviewed: () => void
  isPageReady: (p: PageKey) => boolean
  markPageReady: (p: PageKey) => void
  clearPageReady: (p: PageKey) => void
  hydrateDemoPack: () => void
}

function readyKey(topicId: string, page: PageKey) {
  return `${topicId}:${page}`
}

const Ctx = React.createContext<Store | null>(null)

export function useStore() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("useStore outside provider")
  return ctx
}

const TOPIC_DEFAULT = PRESET_TOPICS[0].id

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const boot = React.useMemo(() => load(), [])
  const [page, setPageRaw] = React.useState<PageKey>(boot.page ?? "topic")
  const [topicId, setTopicId] = React.useState(boot.topicId ?? TOPIC_DEFAULT)
  const [stages, setStages] = React.useState<Record<string, EventStage>>(boot.stages ?? {})
  const [extraTopics, setExtraTopics] = React.useState<TopicRecord[]>(boot.extraTopics ?? [])
  const [extraMaterials, setExtraMaterials] = React.useState<Record<string, Material[]>>(() => {
    const raw = boot.extraMaterials as unknown
    if (!raw) return {}
    if (Array.isArray(raw)) return { [PRESET_TOPICS[0].id]: raw as Material[] }
    return raw as Record<string, Material[]>
  })
  const [verifies, setVerifies] = React.useState<Record<string, VerifyRecord>>(boot.verifies ?? {})
  const [capEdited, setCapEdited] = React.useState(boot.capEdited ?? false)
  const [evidence, setEvidence] = React.useState<EvidenceTarget | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [flow, setFlow] = React.useState<FlowFlags>(() => {
    const inherited = boot.flow as (FlowFlags & { researchReady?: Record<string, boolean> }) | undefined
    const migrated: Record<string, boolean> = { ...(inherited?.pageReady ?? {}) }
    if (inherited?.researchReady) {
      for (const [id, ok] of Object.entries(inherited.researchReady)) {
        if (ok) migrated[`${id}:research`] = true
      }
    }
    return {
      visited: { topic: true, ...(inherited?.visited ?? {}) },
      stationOpened: inherited?.stationOpened ?? false,
      reportOpened: inherited?.reportOpened ?? false,
      reviewed: inherited?.reviewed ?? false,
      pageReady: migrated,
    }
  })

  const topics = React.useMemo(() => [...PRESET_TOPICS, ...extraTopics], [extraTopics])
  const topic = topics.find((t) => t.id === topicId) ?? topics[0]
  const stage = stages[topic.id] ?? "idle"

  const materials = React.useMemo(() => {
    const scoped = [...filterMaterials(MATERIALS, topic), ...(extraMaterials[topic.id] ?? [])]
    return scoped.map((m) => ({
      ...m,
      facts: m.facts.map((f, i) => {
        const overlay = verifies[`${m.id}#${i}`]
        if (!overlay) return f
        return { ...f, state: overlay.state, result: overlay.result }
      }),
    }))
  }, [extraMaterials, topic, verifies])
  const applyFact = React.useCallback(
    (m: Material, i: number): MaterialFact => {
      return m.facts[i]
    },
    []
  )
  const stations = React.useMemo(() => filterStations(topic), [topic])
  const regions = React.useMemo(() => filterRegions(topic), [topic])

  const version = topic.currentVersion
    ? stage === "confirmed"
      ? "v1.5"
      : "v1.4"
    : "草稿"
  const versionNote =
    !topic.currentVersion
      ? "尚无已确认版本 · 研究草稿"
      : stage === "confirmed"
        ? "已确认 · 2026-09-18"
        : stage === "pending"
          ? "存在待复核事项（v1.5 待确认）"
          : "已确认 · 2026-09-12"

  React.useEffect(() => {
    const payload: Persisted = {
      topicId: topic.id,
      page,
      stages,
      extraTopics,
      extraMaterials,
      verifies,
      capEdited,
      flow,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
  }, [topic.id, page, stages, extraTopics, extraMaterials, verifies, capEdited, flow])

  const setPage = React.useCallback((p: PageKey) => {
    setPageRaw(p)
    setFlow((prev) => ({ ...prev, visited: { ...prev.visited, [p]: true } }))
  }, [])

  const switchTopic = React.useCallback((id: string) => {
    setTopicId(id)
    setEvidence(null)
  }, [])

  const createTopic = React.useCallback((input: CreateTopicInput) => {
    const id = `T-LOCAL-${Date.now().toString().slice(-6)}`
    const rec: TopicRecord = {
      id,
      name: input.name.trim(),
      question: input.question.trim(),
      scope: ["江苏", "浙江", "广东"],
      period: input.period,
      deadline: input.deadline,
      stage: input.stage,
      owner: "演示账号 · 张远（战略研究）",
      capabilityVersion: "CAP-2026-09",
      criteriaVersion: "STD-v2",
      currentVersion: null,
      materialIds: [],
      stationKeys: [],
      regionKeys: "all",
    }
    setExtraTopics((prev) => [...prev, rec])
    setTopicId(id)
    setPageRaw("topic")
    return rec
  }, [])

  const setStage = React.useCallback(
    (s: EventStage) => {
      setStages((prev) => ({ ...prev, [topic.id]: s }))
    },
    [topic.id]
  )

  const importMaterial = React.useCallback(
    (m: Material) => {
      setExtraMaterials((prev) => ({
        ...prev,
        [topic.id]: [...(prev[topic.id] ?? []), m],
      }))
    },
    [topic.id]
  )

  const openEvidence = React.useCallback((t: EvidenceTarget) => setEvidence(t), [])
  const closeEvidence = React.useCallback(() => setEvidence(null), [])

  const submitVerify = React.useCallback((key: string, rec: VerifyRecord) => {
    setVerifies((prev) => ({ ...prev, [key]: rec }))
  }, [])

  const markStationOpened = React.useCallback(() => {
    setFlow((prev) => ({ ...prev, stationOpened: true }))
  }, [])
  const markReportOpened = React.useCallback(() => {
    setFlow((prev) => ({ ...prev, reportOpened: true, visited: { ...prev.visited, report: true } }))
  }, [])
  const markReviewed = React.useCallback(() => {
    setFlow((prev) => ({ ...prev, reviewed: true }))
  }, [])
  const isPageReady = React.useCallback(
    (p: PageKey) => !!flow.pageReady[readyKey(topic.id, p)],
    [flow.pageReady, topic.id]
  )
  const markPageReady = React.useCallback(
    (p: PageKey) => {
      setFlow((prev) => ({
        ...prev,
        pageReady: { ...prev.pageReady, [readyKey(topic.id, p)]: true },
      }))
    },
    [topic.id]
  )
  const clearPageReady = React.useCallback(
    (p: PageKey) => {
      setFlow((prev) => ({
        ...prev,
        pageReady: { ...prev.pageReady, [readyKey(topic.id, p)]: false },
      }))
    },
    [topic.id]
  )
  const hydrateDemoPack = React.useCallback(() => {
    setExtraTopics((prev) =>
      prev.map((t) =>
        t.id === topic.id
          ? { ...t, materialIds: "all", stationKeys: "all", regionKeys: "all" }
          : t
      )
    )
  }, [topic.id])

  const value = React.useMemo(
    () => ({
      page,
      setPage,
      topicId: topic.id,
      topics,
      topic,
      switchTopic,
      createTopic,
      stage,
      setStage,
      version,
      versionNote,
      materials,
      importMaterial,
      stations,
      regions,
      evidence,
      openEvidence,
      closeEvidence,
      verifies,
      submitVerify,
      applyFact,
      capEdited,
      setCapEdited,
      createOpen,
      setCreateOpen,
      flow,
      markStationOpened,
      markReportOpened,
      markReviewed,
      isPageReady,
      markPageReady,
      clearPageReady,
      hydrateDemoPack,
    }),
    [
      page,
      setPage,
      topic,
      topics,
      switchTopic,
      createTopic,
      stage,
      setStage,
      version,
      versionNote,
      materials,
      importMaterial,
      stations,
      regions,
      evidence,
      openEvidence,
      closeEvidence,
      verifies,
      submitVerify,
      applyFact,
      capEdited,
      createOpen,
      flow,
      markStationOpened,
      markReportOpened,
      markReviewed,
      isPageReady,
      markPageReady,
      clearPageReady,
      hydrateDemoPack,
    ]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

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
            className={cn("glass-deep flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] shadow-2xl rise")}
          >
            <CheckCircle2 className="size-3.5 text-primary" />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

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
