import * as React from "react"
import {
  CircleCheck,
  CircleDashed,
  Info,
  Lightbulb,
  ListChecks,
  Settings2,
  ShieldCheck,
} from "lucide-react"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { ACTIONS, CONDITIONS_R, RESEARCH, TIER_BADGE, VERSION_HISTORY, materialStats, researchConclusion } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const nvConfig = {
  n: { label: "声量 N", color: "var(--chart-4)" },
  v: { label: "V 支持", color: "var(--chart-1)" },
} satisfies ChartConfig

export function Research() {
  const { stage, setPage, topic, openEvidence, materials, regions } = useStore()
  const confirmed = stage === "confirmed" && !!topic.currentVersion
  const pending = stage === "pending" && !!topic.currentVersion
  const isDraftTopic = !topic.currentVersion
  const concl = isDraftTopic
    ? {
        fact: "如东 300MW 光伏基地存量增配招标 45MW/90MWh（M-006）；1-8 月累计限发约 3.2%，7-8 月午间升至 6.8%（M-017）。",
        inference: "本专题尚无已确认版本。现有资料支持进入配储方案论证，但租赁收益归属未测算，档位按「条件进入」草稿表达。",
        hypothesis: "租赁模式收益可归集成商（待测算，不计入基准）。",
      }
    : researchConclusion(confirmed, pending)
  const version = isDraftTopic ? "研究草稿" : confirmed ? "v1.5" : "v1.4"
  const stats = materialStats(materials)
  const [showDiff, setShowDiff] = React.useState(false)

  const cite = (id: string) => (
    <button
      className="mx-0.5 text-primary underline decoration-primary/40 underline-offset-2"
      onClick={() => openEvidence({ materialId: id, factIndex: 0 })}
    >
      {id}
    </button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-semibold tracking-tight">
            深度研究
            <Badge variant={confirmed ? "default" : pending ? "amber" : "secondary"} className="text-[11.5px]">
              {version}
              {pending && " · 存在待确认 v1.5"}
            </Badge>
            <Badge variant={confirmed || pending ? "violet" : "sky"} className="text-[11.5px]">
              {pending ? "含情景研判（待确认）" : "混合数据 · 部分情景研判"}
            </Badge>
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {RESEARCH.target} · 预生成演示内容，如实标注，非实时 AI 分析
          </p>
        </div>
        {pending && (
          <button
            onClick={() => setPage("updates")}
            className="text-[12px] text-amber-700 underline decoration-amber-400/60 underline-offset-4 hover:decoration-amber-500"
          >
            前往动态跟踪确认 v1.5 →
          </button>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage("compare")}>
            返回比较
          </Button>
          <Button size="sm" onClick={() => setPage("report")}>
            预览报告并审查
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["已纳入资料", `${materials.length} 份`],
          ["已核验事实", `${stats.verified} / ${stats.facts}`],
          ["比较区域", regions.map((r) => r.name).join("、") || "—"],
          ["能力快照", topic.capabilityVersion],
        ].map(([k, v]) => (
          <div key={k} className="glass rounded-2xl px-4 py-3">
            <div className="text-[11px] text-muted-foreground">{k}</div>
            <div className="mt-1 text-[13px] font-medium">{v}</div>
          </div>
        ))}
      </div>

      <RunPipeline
        page="research"
        title="生成深度研究"
        lead="先联网检索公开规则与已导入资料，再做数据分析与能力匹配，最后写出档位、结论与图表。演示流水线，结论来自预生成稿件。"
        cta="开始生成研究报告"
        rerunLabel="重新生成研究"
        blocked={materials.length === 0}
        blockedHint="没有可用资料时不能生成研究。请先解析情报资料。"
        blockedActionLabel="去情报资料"
        onBlockedAction={() => setPage("materials")}
        steps={[
          {
            state: "searching",
            title: "联网检索公开规则与电价",
            desc: "对齐三省政策、电价口径；检索范围是本专题已导入资料，不是全网抓取",
            log: "hit M-001 · M-010 · peak-valley 0.61",
          },
          {
            state: "connecting",
            title: "关联场站与配储对象",
            desc: "把招标、限发与跟踪场站对上同一观察窗口",
            log: `objects=${RESEARCH.config.station}`,
          },
          {
            state: "working",
            title: "核验证据与口径冲突",
            desc: "已核验支持计入 V；冲突单列，不静默抹平",
            log: "M-009 vs M-010 price basis",
          },
          {
            state: "solving",
            title: "供需与七维数据分析",
            desc: "按必要条件判定档位，未知不写成没有机会",
            log: "tiers by necessary conditions",
          },
          {
            state: "weaving",
            title: "匹配企业能力快照",
            desc: "引用 CAP 版本字段，不引用会被覆盖的活档案",
            log: `cap=${topic.capabilityVersion}`,
          },
          {
            state: "composing",
            title: "撰写研究草稿与图表",
            desc: "事实 / 推断 / 假设分列，并输出配置方向",
            log: "draft composed · charts ready",
          },
        ]}
      >

      {/* 三省档位 */}
      <Card className="rise">
        <CardHeader>
          <CardTitle>建议档位（按必要条件规则判定）</CardTitle>
          <CardDescription>
            先处理已知阻断 → 再判断关键未知 → 最后确认档位；未知不直接归类为没有机会
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {RESEARCH.tiers.map((t) => (
            <div key={t.region} className="rounded-xl bg-inset p-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold">{t.region}</span>
                <Badge variant={TIER_BADGE[t.tier]}>{t.tier}</Badge>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{t.note}</p>
              {confirmed && t.region === "江苏" && (
                <p className="mt-1 text-[11px] font-medium text-primary">
                  v1.5 更新：新政情景确认单列，建议推进节奏加快（触发条件 ③ 已处理）
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        {/* 结论三层 */}
        <Card className="rise" style={{ animationDelay: "90ms" }}>
          <CardHeader>
            <CardTitle>关键结论（{version}）· 三层性质分列</CardTitle>
            <CardDescription>事实 / 推断 / 假设不混排 · 关键判断可下钻定位证据（A03 必过项）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3 rounded-xl bg-sky-500/[0.06] px-3.5 py-3">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-sky-600" />
              <div>
                <Badge variant="sky" className="mb-1">事实 · 有信源</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">
                  {isDraftTopic ? (
                    concl.fact
                  ) : (
                    <>
                      江苏大工业峰谷价差现行 0.61 元/kWh（{cite("M-010")} 官方附表）；
                      {pending || confirmed
                        ? "新政征求意见稿拟进一步拉大价差（"
                        : "竞争方 X 华东降价 8%（"}
                      {pending || confirmed ? cite("M-001") : cite("M-015")}
                      {pending || confirmed ? "，未生效）。" : "，双源印证）。"}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-primary/[0.06] px-3.5 py-3">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <Badge className="mb-1">推断 · 有推理链</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">{concl.inference}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-violet-500/[0.06] px-3.5 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-violet-600" />
              <div>
                <Badge variant="violet" className="mb-1">假设 · 待验证</Badge>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">{concl.hypothesis}</p>
              </div>
            </div>

            <div className="pt-1.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-amber-700">
                <ShieldCheck className="size-3.5" />
                成立条件与退出线
              </div>
              {CONDITIONS_R.map((c) => (
                <div key={c} className="rounded-lg bg-inset px-3 py-1.5 text-[12px] leading-relaxed text-foreground/80">
                  {c}
                </div>
              ))}
            </div>

            <p className="flex items-start gap-2 pt-1 text-[11px] leading-relaxed text-muted-foreground">
              <CircleDashed className="mt-0.5 size-3 shrink-0" />
              更新触发条件：电价规则修订、项目阶段证据变化、能力字段变更、竞争价格变化 —— 触发后进入动态跟踪影响分析。
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3.5">
          {/* 配置方案方向 */}
          <Card className="rise" style={{ animationDelay: "160ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Settings2 className="size-4 text-primary" />
                配置方案方向 · {RESEARCH.config.station}
              </CardTitle>
              <CardDescription>
                用于下一步技术经济论证，不替代工程设计、投标技术书或最终投资测算
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[12.5px]">
              {[
                ["功率区间", RESEARCH.config.power],
                ["时长", RESEARCH.config.hours],
                ["技术倾向", RESEARCH.config.tech],
                ["服务模式", RESEARCH.config.service],
                ["经济性前提", RESEARCH.config.economy],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-inset px-3 py-2 leading-relaxed">
                  <span className="font-medium text-foreground">{k}：</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
              <div className="rounded-lg bg-violet-500/[0.06] px-3 py-2 leading-relaxed">
                <span className="font-medium text-violet-700">待定项（数据不足，不填 0）：</span>
                <span className="text-muted-foreground">{RESEARCH.config.pending.join(" · ")}</span>
              </div>
            </CardContent>
          </Card>

          {/* 下一步行动 */}
          <Card className="rise" style={{ animationDelay: "230ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <ListChecks className="size-4 text-primary" />
                下一步行动
              </CardTitle>
              <CardDescription>行动完成不自动核验证据、不自动更改研究档位</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {ACTIONS.map((a2) => (
                <div
                  key={a2.text}
                  className="flex flex-wrap items-center gap-2 rounded-lg bg-inset px-3 py-2 text-[12.5px]"
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      a2.state === "处理中" ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                  />
                  <span className="min-w-0 flex-1">{a2.text}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {a2.owner} · {a2.due}
                  </span>
                  <Badge variant={a2.state === "处理中" ? "sky" : "secondary"}>{a2.state}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 版本历史 */}
      <Card className="rise">
        <CardHeader>
          <CardTitle>研究版本</CardTitle>
          <CardDescription>
            草稿 → 待确认 → 已确认 → 历史只读 · 确认锁结论与当时依据（含能力快照）· 任意两版差异可对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {(isDraftTopic ? [{ ver: "草稿", state: "研究草稿", date: "—", note: "无已确认版本，不展示正式结论" }] : VERSION_HISTORY).map(
              (v) => {
              const isCurrent =
                (v.ver === "v1.5" && (confirmed || pending)) || (v.ver === "v1.4" && !confirmed && !pending)
              const displayState =
                v.ver === "v1.5" ? (confirmed ? "已确认（当前）" : pending ? "待确认" : "草稿") : v.state
              return (
                <div key={v.ver} className="flex items-center gap-2 text-[12px]">
                  <span className={cn("font-semibold tabular", isCurrent ? "text-primary" : "text-foreground/70")}>
                    {v.ver}
                  </span>
                  <Badge
                    variant={
                      v.ver === "v1.5"
                        ? confirmed
                          ? "default"
                          : "amber"
                        : isCurrent
                          ? "default"
                          : "secondary"
                    }
                  >
                    {displayState}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {v.date} · {v.note}
                  </span>
                </div>
              )
            })}
          </div>
          {topic.currentVersion && (
            <button
              className="mt-3 text-[12.5px] text-primary underline underline-offset-4"
              onClick={() => setShowDiff((v) => !v)}
            >
              {showDiff ? "收起版本差异" : "对比 v1.4 与 v1.5"}
            </button>
          )}
          {showDiff && (
            <div className="mt-3 grid gap-2 rounded-xl bg-inset p-3 text-[12px] leading-relaxed md:grid-cols-2">
              <div>
                <div className="font-semibold">v1.4 已确认</div>
                基准电价 0.61；江苏优先跟进；如东 40–50MW / 2h 锂电基准。
              </div>
              <div>
                <div className="font-semibold">v1.5 {confirmed ? "已确认" : "待确认"}</div>
                新政情景单列（未计入基准）；档位注释更新；正式版本在确认前不被覆盖。
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rise">
        <CardHeader>
          <CardTitle>图表分析 · 声量与核验证据</CardTitle>
          <CardDescription>生成后才展示 · N 为登记声量，V 为已核验支持，二者不可互换</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={nvConfig} className="h-44 w-full aspect-auto">
            <BarChart
              data={regions.map((r) => ({ name: r.name, n: r.n, v: r.v.support }))}
              margin={{ left: -18, right: 8, top: 4 }}
            >
              <CartesianGrid vertical={false} className="chart-grid" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
              <ChartTooltip cursor={{ fill: "oklch(0.5 0.03 260 / 0.05)" }} content={<ChartTooltipContent />} />
              <Bar dataKey="v" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="n" fill="var(--chart-4)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 本页含预生成演示内容 · 混合数据：真实公开资料 + 明确标注的模拟内部资料 · 部分结论标为「情景研判」
      </p>
      </RunPipeline>
    </div>
  )
}
