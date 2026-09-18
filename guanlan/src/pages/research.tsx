import {
  CircleCheck,
  CircleDashed,
  Info,
  Lightbulb,
  ListChecks,
  Settings2,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ACTIONS,
  CONDITIONS_R,
  RESEARCH,
  TIER_BADGE,
  VERSION_HISTORY,
  researchConclusion,
} from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

export function Research() {
  const { stage, setPage } = useStore()
  const confirmed = stage === "confirmed"
  const pending = stage === "pending"
  const concl = researchConclusion(confirmed, pending)
  const version = confirmed ? "v1.5" : "v1.4"

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
      </div>

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
            <div key={t.region} className="rounded-xl bg-white/55 p-3.5">
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
                <p className="text-[12.5px] leading-relaxed text-foreground/85">{concl.fact}</p>
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
                <div key={c} className="rounded-lg bg-white/55 px-3 py-1.5 text-[12px] leading-relaxed text-foreground/80">
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
                <div key={k} className="rounded-lg bg-white/55 px-3 py-2 leading-relaxed">
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
                  className="flex flex-wrap items-center gap-2 rounded-lg bg-white/50 px-3 py-2 text-[12.5px]"
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
            {VERSION_HISTORY.map((v) => {
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
        </CardContent>
      </Card>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 本页含预生成演示内容 · 混合数据：真实公开资料 + 明确标注的模拟内部资料 · 部分结论标为「情景研判」
      </p>
    </div>
  )
}
