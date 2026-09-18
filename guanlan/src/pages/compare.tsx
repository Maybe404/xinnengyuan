import * as React from "react"
import { ArrowRight, Scale } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DIM_NAMES, REGIONS } from "@/data"
import { useStore, useToast } from "@/store"
import { cn } from "@/lib/utils"

export function Compare() {
  const { setPage } = useStore()
  const toast = useToast()
  const [aKey, setAKey] = React.useState("js")
  const [bKey, setBKey] = React.useState("zj")

  const a = REGIONS.find((r) => r.key === aKey)!
  const b = REGIONS.find((r) => r.key === bKey)!

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

  const radarData = DIM_NAMES.map((dim, i) => ({
    dim,
    [a.name]: a.dims[i],
    [b.name]: b.dims[i],
  }))

  const radarConfig = {
    [a.name]: { label: a.name, color: "var(--chart-1)" },
    [b.name]: { label: b.name, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">区域机会对比</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          点击切换主选区域（深色），再次点击另一区域互换对比 · 机会分由五维加权得出
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5 rise">
        {REGIONS.map((r) => {
          const isA = r.key === aKey
          const isB = r.key === bKey
          return (
            <button
              key={r.key}
              onClick={() => pick(r.key)}
              className={cn(
                "glass rounded-2xl px-5 py-3 text-center transition-all duration-300 hover:-translate-y-0.5",
                isA && "!bg-primary/[0.09] !border-primary/35 shadow-[0_8px_28px_oklch(0.58_0.19_258/0.16)]",
                isB && "!bg-amber-500/[0.08] !border-amber-500/30"
              )}
            >
              <div className="text-[13.5px] font-semibold">{r.name}</div>
              <div
                className={cn(
                  "text-[22px] leading-tight font-semibold tabular",
                  isA ? "text-primary" : isB ? "text-amber-600" : "text-foreground/75"
                )}
              >
                {r.score}
              </div>
              <Badge variant={r.verdictTag} className="mt-0.5">{r.verdictLabel}</Badge>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Card className="rise xl:col-span-3">
          <CardHeader className="items-center pb-2">
            <CardTitle>五维雷达对比</CardTitle>
            <CardDescription>
              <span className="mr-3 inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" />
                {a.name}（主选）
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" />
                {b.name}（对比）
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <ChartContainer config={radarConfig} className="mx-auto aspect-square max-h-[290px] w-full">
              <RadarChart data={radarData} outerRadius="72%">
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <PolarGrid gridType="circle" radialLines={false} stroke="oklch(0.5 0.02 260 / 0.14)" />
                <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11.5, fill: "var(--muted-foreground)" }} />
                <Radar
                  name={b.name}
                  dataKey={b.name}
                  fill="var(--chart-2)"
                  fillOpacity={0.14}
                  stroke="var(--chart-2)"
                  strokeWidth={1.6}
                  dot={{ r: 3, fillOpacity: 1, fill: "var(--chart-2)" }}
                  isAnimationActive
                  animationDuration={900}
                />
                <Radar
                  name={a.name}
                  dataKey={a.name}
                  fill="var(--chart-1)"
                  fillOpacity={0.22}
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3.5, fillOpacity: 1, fill: "var(--chart-1)" }}
                  isAnimationActive
                  animationDuration={1100}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-3.5 xl:col-span-2">
          <Card className="rise">
            <CardHeader className="pb-3">
              <CardTitle>进入条件清单 · {a.name}</CardTitle>
              <CardDescription>把抽象的「机会分」翻译成具体的「要做什么」</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {a.entry.map((e) => (
                <div
                  key={e}
                  className="flex items-start gap-2 rounded-lg bg-white/50 px-3 py-2 text-[12.5px] leading-relaxed"
                >
                  <Scale className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                  {e}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="glass-deep spec-top relative rounded-2xl p-5 rise">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-primary">研究判断</span>
              <span className="text-[13px] text-muted-foreground">
                {a.name} vs {b.name}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">
              <Badge variant={a.verdictTag} className="mr-1.5 align-middle">{a.verdictLabel}</Badge>
              {a.verdict}
            </p>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
              排序规则：先过必要条件（资质 / 资金 / 合规硬门槛）→ 幸存区域按机会分排序 → 分歧时按可权衡条件人工裁定并留痕。
            </p>
            <Button className="mt-3.5" size="sm" onClick={() => { setPage("decision"); toast(`已将「${a.name}」带入布局决策案`) }}>
              带入布局决策案 <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
