import { ArrowRight, CircleAlert, Clock, FileText, GitCompare, KeyRound, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HISTORY_EVENTS, VERSION_HISTORY, materialStats } from "@/data"
import { useStore } from "@/store"

export function Topic() {
  const { setPage, stage, topic, materials, stations, regions, hydrateDemoPack } = useStore()
  const pending = stage === "pending"
  const stats = materialStats(materials)

  const cards = [
    {
      label: "已导入资料",
      value: materials.length,
      sub: `去重后 · 含 ${stats.realPublic} 份真实公开`,
      target: "materials" as const,
    },
    {
      label: "证据记录",
      value: stats.facts,
      sub: `已核验 ${stats.verified} · 待核验 ${stats.pending} · 冲突 ${stats.conflict}`,
      target: "materials" as const,
    },
    {
      label: "在跟踪场站",
      value: stations.length,
      sub: `配储项目 ${stations.reduce((n, s) => n + s.projects.length, 0)} 个`,
      target: "compare" as const,
    },
    {
      label: "声量 N / 证据 V",
      value: `${stats.n} / ${stats.vSupport}`,
      sub: "模拟资料不计入 · 登记范围内",
      target: "compare" as const,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">业务专题</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {topic.id} · {topic.owner} · 研究截止 {topic.deadline}
        </p>
      </div>

      <Card className="rise">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{topic.name}</CardTitle>
            <Badge variant="sky">{topic.stage}</Badge>
            <Badge variant={pending ? "amber" : topic.currentVersion ? "secondary" : "violet"}>
              {pending
                ? "当前研究版本：v1.4（待确认 v1.5）"
                : topic.currentVersion
                  ? `当前研究版本：${topic.currentVersion}`
                  : "尚无已确认版本 · 研究草稿"}
            </Badge>
          </div>
          <CardDescription>{topic.question}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12.5px] md:grid-cols-3">
          {[
            ["比较范围", topic.scope.join(" · ")],
            ["研究时段", topic.period],
            ["目标阶段", topic.stage],
            ["判断标准版本", topic.criteriaVersion],
            ["能力版本", topic.capabilityVersion],
            ["负责人", topic.owner],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-muted-foreground">{k}：</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {cards.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setPage(s.target)}
            className="glass spec-top group rounded-2xl p-4.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_oklch(0.5_0.03_260/0.13)] rise"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-[28px] leading-none font-semibold tracking-tight tabular">{s.value}</div>
            <div className="mt-1.5 text-[11px] text-muted-foreground/85">
              {s.sub}
              <ArrowRight className="ml-1 inline size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {materials.length === 0 && (
          <Button
            size="sm"
            variant="glass"
            onClick={() => {
              hydrateDemoPack()
              setPage("materials")
            }}
          >
            载入演示资料包
          </Button>
        )}
        <Button size="sm" onClick={() => setPage("materials")}>
          ① 补充 / 查看资料
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPage("compare")}>
          ② 比较三省图表
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPage("research")}>
          ③ 打开研究结论
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPage("report")}>
          ④ 预览并审查报告
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPage("updates")}>
          ⑤ 处理动态更新
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <Card className="rise" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle>待核验与缺口事项</CardTitle>
            <CardDescription>核验须实际执行；当前比较 {regions.map((r) => r.name).join("、")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {(topic.id === "T-2026-004"
              ? [
                  { icon: FileText, text: "如东招标尚未定标，签约阶段保持待核验" },
                  { icon: KeyRound, text: "租赁模式收益归属待测算，不计入基准" },
                  { icon: Clock, text: "午间限发 6.8% 已核验，需持续跟踪 9 月数据" },
                ]
              : materials.length === 0
                ? [{ icon: FileText, text: "尚无资料 —— 请先导入政策、电价或场站材料后再生成研究" }]
                : [
                    { icon: FileText, text: "M-001 江苏分时电价新政：原文与生效条件核验" },
                    { icon: CircleAlert, text: "电价口径冲突待裁决：M-009（0.65）vs M-010（0.61）" },
                    { icon: KeyRound, text: "浙江容量补偿适用性：目标场站逐站确认" },
                    { icon: Clock, text: "舟山调度约束文件未导入（资料缺口）" },
                    { icon: Layers, text: "响水扩建场地条件为模拟情景，需实地复核后替换" },
                  ]
            ).map((row) => (
              <div
                key={row.text}
                className="flex items-start gap-2.5 rounded-lg bg-inset px-3 py-2 text-[12.5px] leading-relaxed"
              >
                <row.icon className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                {row.text}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rise" style={{ animationDelay: "220ms" }}>
          <CardHeader>
            <CardTitle>重要更新与版本</CardTitle>
            <CardDescription>新信息产生待确认版本；确认前旧版仍为当前正式版本</CardDescription>
          </CardHeader>
          <CardContent>
            {topic.currentVersion ? (
              <div className="space-y-0">
                {HISTORY_EVENTS.slice(0, 3).map((e) => (
                  <div key={e.time} className="border-b border-foreground/[0.055] py-2.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tabular text-muted-foreground">{e.time}</span>
                      <span className="text-[12.5px] font-medium">{e.title}</span>
                      <Badge variant={e.tone} className="ml-auto shrink-0">
                        {e.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                  <GitCompare className="size-3.5" />
                  {VERSION_HISTORY.slice(0, 3).map((v) => (
                    <span key={v.ver} className="tabular">
                      {v.ver} · {v.state}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setPage("updates")}
                  className="mt-3 text-[12.5px] text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                >
                  进入动态跟踪处理待确认事项 →
                </button>
              </div>
            ) : (
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                本专题还没有已确认研究版本。导入资料并完成比较后，可在深度研究中形成草稿；确认前不展示正式结论。
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 演示环境 · 含真实公开资料与模拟业务数据 · 模拟资料不计入真实声量 / 证据统计 · 预生成研究内容均如实标注
      </p>
    </div>
  )
}
