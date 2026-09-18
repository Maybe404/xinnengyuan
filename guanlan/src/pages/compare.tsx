import * as React from "react"
import {
  AlertTriangle,
  ArrowLeftRight,
  CircleCheck,
  CircleDashed,
  Factory,
  Search,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  LEVEL_NUM,
  REGIONS_7,
  SEVEN_DIMS,
  STATIONS,
  TIER_BADGE,
  type RegionProfile,
  type Station,
} from "@/data"
import { useToast } from "@/store"
import { cn } from "@/lib/utils"

// ---- 雷达图：定性映射（高3/中2/低1，资料不足不绘制），非综合分 ----

function DimRadar({
  a,
  b,
  onPickDim,
}: {
  a: RegionProfile
  b: RegionProfile
  onPickDim: (dim: string) => void
}) {
  const radarData = SEVEN_DIMS.map((dim) => ({
    dim,
    [a.name]: LEVEL_NUM[a.dims[dim]],
    [b.name]: LEVEL_NUM[b.dims[dim]],
  }))
  const radarConfig = {
    [a.name]: { label: a.name, color: "var(--chart-1)" },
    [b.name]: { label: b.name, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={radarConfig} className="mx-auto aspect-square max-h-[300px] w-full">
      {/* outerRadius 收窄到 55% 给七枚中文标签留空间，防止溢出 */}
      <RadarChart data={radarData} outerRadius="55%" margin={{ top: 18, right: 42, bottom: 6, left: 42 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <PolarGrid gridType="circle" radialLines={false} stroke="oklch(0.5 0.02 260 / 0.14)" />
        <PolarAngleAxis
          dataKey="dim"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          onClick={(e) => onPickDim((e as unknown as { value?: string }).value ?? "")}
        />
        <Radar
          name={b.name}
          dataKey={b.name}
          fill="var(--chart-2)"
          fillOpacity={0.12}
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          dot={{ r: 2.5, fillOpacity: 1, fill: "var(--chart-2)" }}
          connectNulls={false}
          isAnimationActive
          animationDuration={900}
        />
        <Radar
          name={a.name}
          dataKey={a.name}
          fill="var(--chart-1)"
          fillOpacity={0.18}
          stroke="var(--chart-1)"
          strokeWidth={1.8}
          dot={{ r: 3, fillOpacity: 1, fill: "var(--chart-1)" }}
          connectNulls={false}
          isAnimationActive
          animationDuration={1100}
        />
      </RadarChart>
    </ChartContainer>
  )
}

// ---- 声量 N vs 证据 V ----

const nvConfig = {
  n: { label: "声量 N（登记记录去重）", color: "var(--chart-4)" },
  v: { label: "已核验证据 V（支持）", color: "var(--chart-1)" },
  u: { label: "待核验 U", color: "var(--chart-2)" },
} satisfies ChartConfig

// ---- 场站详情 Sheet ----

function StationSheet({ station, onClose }: { station: Station | null; onClose: () => void }) {
  const toast = useToast()
  return (
    <Sheet open={!!station} onOpenChange={(v) => !v && onClose()}>
      {station && (
        <SheetContent className="w-[540px]">
          <SheetHeader>
            <SheetTitle>{station.name}</SheetTitle>
            <SheetDescription>
              {station.region} · {station.type} {station.capacityMW}MW · 业主：{station.owner}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={station.prop === "模拟" ? "violet" : station.prop === "真实内部" ? "amber" : "default"}>
                {station.prop}
              </Badge>
              {station.prop === "模拟" && (
                <Badge variant="outline">关联结论标记为「情景研判」</Badge>
              )}
            </div>

            <section>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">并网运行与价值</h4>
              <div className="space-y-1.5 text-[12.5px] leading-relaxed">
                {[
                  ["限发情况", station.run.curtailment],
                  ["并网条件", station.run.grid],
                  ["调度方式", station.run.dispatch],
                  ["价值来源", station.value.source],
                  ["结算口径", station.value.settle],
                  ["缺口", station.value.gap],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-white/55 px-3 py-1.5">
                    <span className="text-muted-foreground">{k}：</span>
                    {v}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">配储项目</h4>
              {station.projects.length === 0 ? (
                <p className="rounded-lg bg-white/55 px-3 py-2 text-[12.5px] text-muted-foreground">
                  暂无配储项目建档 —— 资料缺口，不虚构机会
                </p>
              ) : (
                station.projects.map((p) => (
                  <div key={p.name} className="mb-2.5 rounded-xl bg-white/60 p-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold">{p.name}</span>
                      <Badge variant="outline">{p.kind}</Badge>
                      <Badge variant="sky">{p.stage}{p.stageDate && ` · ${p.stageDate}`}</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
                      <div>
                        <span className="text-muted-foreground">功率：</span>
                        {p.mw != null ? `${p.mw} MW` : "未知（空值，非 0）"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">容量：</span>
                        {p.mwh != null ? `${p.mwh} MWh` : "未知（空值，非 0）"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">名义时长：</span>
                        {p.hours != null ? `${p.hours} h（容量÷功率）` : "待测算"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">技术路线：</span>
                        {p.tech}
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1">
                      {p.evidence.map((e, i) => (
                        <React.Fragment key={e.stage}>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                              e.state === "已核验"
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/12 text-amber-700"
                            )}
                            title={`${e.src}`}
                          >
                            {e.stage}
                          </span>
                          {i < p.evidence.length - 1 && <span className="h-px w-2 bg-foreground/15" />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      阶段以证据为准：签约 ≠ 开工，开工 ≠ 投运 · 点证据名可查关联资料（{p.evidence.map((e) => e.src).filter((s) => s !== "—").join("、") || "待补充"}）
                    </p>
                  </div>
                ))
              )}
            </section>

            <section className="flex flex-wrap gap-2.5">
              <Button size="sm" onClick={() => toast("配置方案方向已带入深度研究（演示）")}>
                查看配置方案方向
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast("已列出关联结论（演示）")}>
                查看关联结论
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast("待核验事项清单已展开（演示）")}>
                查看待核验事项
              </Button>
            </section>
          </div>
        </SheetContent>
      )}
    </Sheet>
  )
}

// ---- 主页面 ----

export function Compare() {
  const [aKey, setAKey] = React.useState("js")
  const [bKey, setBKey] = React.useState("zj")
  const [station, setStation] = React.useState<Station | null>(null)
  const [dimFocus, setDimFocus] = React.useState<string | null>(null)

  const a = REGIONS_7.find((r) => r.key === aKey)!
  const b = REGIONS_7.find((r) => r.key === bKey)!

  const pick = (k: string) => {
    if (k === aKey) return
    if (k === bKey) {
      setAKey(bKey)
      setBKey(aKey)
    } else {
      setBKey(aKey)
      setAKey(k)
    }
  }

  const nvData = REGIONS_7.map((r) => ({
    name: r.name,
    n: r.n,
    v: r.v.support,
    u: r.u,
  }))

  // 背离提示：N≥5 且 V=0 且 U≥1（演示阈值，非真假判定）
  const divergence = REGIONS_7.filter((r) => r.n >= 5 && r.v.support === 0 && r.u >= 1)

  const focusRegion = dimFocus ? a : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">区域比较</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          苏浙粤七维比较 · 声量窗口：最近 30 天（截止 2026-12-31）· 跨省比较已对齐时点、对象与结算口径，不可比处已标注
        </p>
      </div>

      {/* 三省卡片：档位 + 必要条件 + N/V/U */}
      <div className="flex flex-wrap gap-3 rise">
        {REGIONS_7.map((r) => {
          const isA = r.key === aKey
          const isB = r.key === bKey
          const passed = r.necessary.filter((c) => c.state === "已核验满足").length
          return (
            <button
              key={r.key}
              onClick={() => pick(r.key)}
              className={cn(
                "glass rounded-2xl px-5.5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5",
                isA && "!bg-primary/[0.08] !border-primary/35 shadow-[0_8px_28px_oklch(0.58_0.19_258/0.16)]",
                isB && "!bg-amber-500/[0.07] !border-amber-500/30"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">{r.name}</span>
                <Badge variant={TIER_BADGE[r.tier]}>{r.tier}</Badge>
              </div>
              <div className="mt-1.5 text-[11.5px] text-muted-foreground">
                必要条件 {passed}/{r.necessary.length} 通过
              </div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground tabular">
                N={r.n} · V={r.v.support}支持/{r.v.refute}反驳 · U={r.u}
              </div>
              <div className="mt-1 max-w-52 text-[11px] leading-snug text-muted-foreground/80">
                {r.tierNote}
              </div>
            </button>
          )
        })}
      </div>

      {/* 雷达 + 维度对照 */}
      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Card className="rise xl:col-span-3">
          <CardHeader className="items-center pb-1">
            <CardTitle>七维定性对比</CardTitle>
            <CardDescription>
              <span className="mr-3 inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" />
                {a.name}（主选）
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" />
                {b.name}（对比）
              </span>
              <span className="ml-3 text-muted-foreground/70">
                高=3 / 中=2 / 低=1 · 资料不足不绘制 · 点击维度名查看依据
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <DimRadar a={a} b={b} onPickDim={(d) => d && setDimFocus(d)} />
            {focusRegion && dimFocus && (
              <div className="rise mt-1 rounded-xl bg-white/60 p-3 text-[12px] leading-relaxed">
                <div className="font-semibold text-primary">
                  {dimFocus} · {focusRegion.name}：{focusRegion.dims[dimFocus as never]}
                </div>
                <div className="mt-0.5 text-muted-foreground">
                  依据：{focusRegion.dimBasis[dimFocus as never] ?? "待补充"}
                </div>
                <button
                  className="mt-0.5 text-[11px] text-primary underline underline-offset-2"
                  onClick={() => setDimFocus(null)}
                >
                  收起
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3.5 xl:col-span-2">
          {/* 声量 vs 证据 */}
          <Card className="rise">
            <CardHeader>
              <CardTitle>声量 N 与核验证据 V</CardTitle>
              <CardDescription>
                N=窗口内登记记录（按原始事件去重）· V=已核验独立事实 · 不计算 V÷N 真实率
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={nvConfig} className="h-36 w-full aspect-auto">
                <BarChart data={nvData} margin={{ left: -22, right: 4, top: 4 }} barGap={2}>
                  <CartesianGrid vertical={false} className="chart-grid" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} dy={4} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip cursor={{ fill: "oklch(0.5 0.03 260 / 0.05)" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="v" name="V 支持" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={13} isAnimationActive animationDuration={1000} />
                  <Bar dataKey="u" name="U 待核验" fill="var(--chart-2)" radius={[4, 4, 0, 0]} barSize={13} isAnimationActive animationDuration={1150} />
                  <Bar dataKey="n" name="N 声量" fill="var(--chart-4)" radius={[4, 4, 0, 0]} barSize={13} isAnimationActive animationDuration={1300} />
                </BarChart>
              </ChartContainer>
              {divergence.length > 0 ? (
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-500/[0.08] px-3 py-2 text-[11.5px] leading-relaxed text-amber-800">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  背离提示（N≥5 且 V=0 且 U≥1）：{divergence.map((r) => r.name).join("、")} —— 声量高、证据待核验。阈值为演示提示规则，非真假判定。
                </div>
              ) : (
                <div className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                  当前无区域触发背离提示；各省均已有已核验支持证据。V 中反驳 / 范围不同计数见资料页证据记录。
                </div>
              )}
            </CardContent>
          </Card>

          {/* 必要条件 */}
          <Card className="rise">
            <CardHeader>
              <CardTitle>必要条件核查 · {a.name}</CardTitle>
              <CardDescription>未满足或未知的区域不进入优先排序，单列缺口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {a.necessary.map((c) => (
                <div key={c.name} className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 text-[12.5px]">
                  {c.state === "已核验满足" ? (
                    <CircleCheck className="size-3.5 shrink-0 text-primary" />
                  ) : (
                    <CircleDashed className="size-3.5 shrink-0 text-amber-500" />
                  )}
                  <span className="flex-1">{c.name}</span>
                  <Badge variant={c.state === "已核验满足" ? "default" : "amber"}>{c.state}</Badge>
                </div>
              ))}
              <div className="pt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                全部通过后按权衡条件人工确认排序（确认人：张远 09-11）；{a.weigh.length} 项权衡条件对照已保存理由与证据。依据不足以区分时保持并列，不强行排序。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 供需对照 + 场站列表 */}
      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Card className="rise xl:col-span-2">
          <CardHeader>
            <CardTitle>供需两侧对照 · 同一观察窗口</CardTitle>
            <CardDescription>供应商数 / 项目数 / 容量为不同指标，不可互换；市场边界不足写「待核验」</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
              <span className="font-semibold text-primary">{a.name} · 需求侧</span>
              <p className="mt-0.5 text-muted-foreground">{a.supplyDemand.demand}</p>
            </div>
            <div className="flex justify-center text-muted-foreground/50">
              <ArrowLeftRight className="size-4" />
            </div>
            <div className="rounded-xl bg-white/55 p-3 text-[12.5px] leading-relaxed">
              <span className="font-semibold text-amber-700">{a.name} · 供给/竞争侧</span>
              <p className="mt-0.5 text-muted-foreground">{a.supplyDemand.supply}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rise overflow-hidden p-0 xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>在跟踪场站 · 下钻详情</CardTitle>
            <CardDescription>场站优先级按相同规则在省内单独生成，不继承省级名次</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <div className="space-y-1">
              {STATIONS.map((s) => {
                const r = REGIONS_7.find((x) => x.name === s.region)!
                const isA = s.region === a.name
                return (
                  <button
                    key={s.key}
                    onClick={() => setStation(s)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/60",
                      isA && "bg-primary/[0.05]"
                    )}
                  >
                    <Factory className="size-4 shrink-0 text-primary/70" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {s.type} {s.capacityMW}MW · 配储项目 {s.projects.length} 个
                      </div>
                    </div>
                    <Badge variant={s.prop === "模拟" ? "violet" : s.prop === "真实内部" ? "amber" : "default"}>
                      {s.prop}
                    </Badge>
                    <Badge variant={TIER_BADGE[r.tier]} className="shrink-0">
                      {r.name} · {r.tier}
                    </Badge>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 flex items-center gap-1.5 px-3 text-[11px] text-muted-foreground">
              <Search className="size-3" />
              点击场站查看配储项目、配置参数、运行约束与阶段证据
            </p>
          </CardContent>
        </Card>
      </div>

      <StationSheet station={station} onClose={() => setStation(null)} />
    </div>
  )
}
