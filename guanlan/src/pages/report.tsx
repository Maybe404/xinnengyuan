import * as React from "react"
import { FileSearch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONDITIONS_R, RESEARCH, TIER_BADGE, researchConclusion } from "@/data"
import { useStore, useToast } from "@/store"

export function Report() {
  const {
    topic,
    stage,
    setStage,
    setPage,
    version,
    markReviewed,
    openEvidence,
    regions,
    isPageReady,
  } = useStore()
  const toast = useToast()
  const [note, setNote] = React.useState("已核阅建议档位、配置方向与待核验清单。同意将 v1.5 提交确认，待核验事项继续展示。")

  const confirmed = stage === "confirmed"
  const pending = stage === "pending"
  const concl = researchConclusion(confirmed, pending || !topic.currentVersion)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">研究报告 · 预览与审查</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {topic.name} · {version} · 预生成演示文稿，供领导审阅，不自动批准投资
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage("research")}>
            返回深度研究
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast("演示环境请用浏览器打印（⌘P），本期不生成外部文件")
            }}
          >
            打印预览
          </Button>
        </div>
      </div>

      {!isPageReady("research") ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-amber-500/[0.08] px-5 py-4 text-[12.5px] text-amber-900 dark:text-amber-200">
          报告预览依赖已生成的研究草稿。封面信息随专题带出，结论与图表在生成后自动带入，无需再汇编。
          <Button size="sm" variant="outline" onClick={() => setPage("research")}>
            去生成深度研究
          </Button>
        </div>
      ) : null}

      <Card className="rise">
        <CardHeader>
          <CardTitle>封面信息</CardTitle>
          <CardDescription>成果标题统一为观澜 · 含真实公开资料与模拟业务数据</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-[13px] md:grid-cols-2">
          {[
            ["成果名称", `观澜 · ${topic.name}`],
            ["决策问题", topic.question],
            ["比较范围", topic.scope.join("、")],
            ["研究版本", version],
            ["能力版本", topic.capabilityVersion],
            ["判断标准", topic.criteriaVersion],
            ["负责人", topic.owner],
            ["数据属性", "混合数据 · 部分情景研判"],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-muted-foreground">{k}：</span>
              {v}
            </div>
          ))}
        </CardContent>
      </Card>

      {isPageReady("research") && (
        <>
      <Card className="rise">
        <CardHeader>
          <CardTitle>结论摘要</CardTitle>
          <CardDescription>事实 / 推断 / 假设分列 · 点击编号可追溯原文</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-[13px] leading-relaxed">
          <div className="flex flex-wrap gap-2">
            {RESEARCH.tiers.map((t) => (
              <Badge key={t.region} variant={TIER_BADGE[t.tier]}>
                {t.region} · {t.tier}
              </Badge>
            ))}
          </div>
          <p>
            <span className="font-medium">事实：</span>
            {concl.fact}{" "}
            <button className="text-primary underline underline-offset-2" onClick={() => openEvidence({ materialId: "M-010", factIndex: 0 })}>
              打开 M-010
            </button>
          </p>
          <p>
            <span className="font-medium">推断：</span>
            {concl.inference}
          </p>
          <p>
            <span className="font-medium">假设：</span>
            {concl.hypothesis}
          </p>
          <div>
            <div className="mb-1 font-medium">配置方向 · {RESEARCH.config.station}</div>
            <p className="text-muted-foreground">
              {RESEARCH.config.power}；{RESEARCH.config.hours}；{RESEARCH.config.tech}
            </p>
          </div>
          <div>
            <div className="mb-1 font-medium">成立条件</div>
            {CONDITIONS_R.map((c) => (
              <p key={c} className="text-muted-foreground">
                {c}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rise">
        <CardHeader>
          <CardTitle>图表与比较要点</CardTitle>
          <CardDescription>声量登记量 ≠ 全网热度；不计算真实率</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          {regions.map((r) => (
            <div key={r.key} className="rounded-xl bg-inset p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.name}</span>
                <Badge variant={TIER_BADGE[r.tier]}>{r.tier}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground tabular">
                N={r.n} · V 支持 {r.v.support} / 反驳 {r.v.refute} · U={r.u}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{r.tierNote}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rise">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <FileSearch className="size-4 text-primary" />
            审查意见
          </CardTitle>
          <CardDescription>
            确认 = 接受本版研究表达，不等于全部事实已核实。待核验事项确认后不会自动变成已核验。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-foreground/10 bg-inset px-3 py-2 text-[13px] outline-none focus:border-primary/40"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                markReviewed()
                toast("已退回草稿 · 正式版本未覆盖")
                setPage("research")
              }}
            >
              退回草稿
            </Button>
            <Button
              onClick={() => {
                if (note.trim().length < 10) {
                  toast("审查说明至少 10 字")
                  return
                }
                markReviewed()
                if (topic.currentVersion) setStage("pending")
                toast("审查完成 · 已形成待确认版本，请到动态跟踪确认")
                setPage("updates")
              }}
            >
              提交审查并去确认版本
            </Button>
          </div>
          {confirmed && <p className="text-[12px] text-muted-foreground">当前正式版本已是 v1.5，可继续演示变化分析。</p>}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}
