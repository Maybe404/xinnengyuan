import { ArrowRight, CircleAlert, Clock, FileText, GitCompare, KeyRound, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HISTORY_EVENTS, TOPIC, TOPIC_STATS, VERSION_HISTORY } from "@/data"
import { useStore } from "@/store"

export function Topic() {
  const { setPage, stage } = useStore()
  const pending = stage === "pending"

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">业务专题</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {TOPIC.id} · {TOPIC.owner} · 研究截止 {TOPIC.deadline}
        </p>
      </div>

      <Card className="rise">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{TOPIC.name}</CardTitle>
            <Badge variant="sky">{TOPIC.stage}</Badge>
            <Badge variant={pending ? "amber" : "secondary"}>
              当前研究版本：{pending ? "v1.4（待确认 v1.5）" : TOPIC.currentVersion}
            </Badge>
          </div>
          <CardDescription>{TOPIC.question}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12.5px] md:grid-cols-3">
          {[
            ["比较范围", TOPIC.scope.join(" · ")],
            ["研究时段", TOPIC.period],
            ["目标阶段", TOPIC.stage],
            ["判断标准版本", TOPIC.criteriaVersion],
            ["能力版本", TOPIC.capabilityVersion],
            ["声量窗口", "最近 30 天（截止日为窗口末日）"],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-muted-foreground">{k}：</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {TOPIC_STATS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setPage(s.target as never)}
            className="glass spec-top group rounded-2xl p-4.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_oklch(0.5_0.03_260/0.13)] rise"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-[28px] leading-none font-semibold tracking-tight tabular">
              {s.value}
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground/85">
              {s.sub}
              <ArrowRight className="ml-1 inline size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <Card className="rise" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle>待核验与缺口事项</CardTitle>
            <CardDescription>核验确认须实际执行，不能以预置标签替代（A13 现场必过项）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {[
              { icon: FileText, text: "M-001 江苏分时电价新政：原文与生效条件核验", tone: "amber" },
              { icon: CircleAlert, text: "电价口径冲突待裁决：M-009（0.65）vs M-010（0.61）", tone: "violet" },
              { icon: KeyRound, text: "浙江容量补偿适用性：目标场站逐站确认", tone: "amber" },
              { icon: Clock, text: "舟山调度约束文件未导入（资料缺口）", tone: "amber" },
              { icon: Layers, text: "响水扩建场地条件为模拟情景，需实地复核后替换", tone: "violet" },
            ].map((row) => (
              <div
                key={row.text}
                className="flex items-start gap-2.5 rounded-lg bg-white/50 px-3 py-2 text-[12.5px] leading-relaxed"
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
            <div className="space-y-0">
              {HISTORY_EVENTS.slice(0, 3).map((e) => (
                <div key={e.time} className="border-b border-foreground/[0.055] py-2.5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] tabular text-muted-foreground">{e.time}</span>
                    <span className="text-[12.5px] font-medium">{e.title}</span>
                    <Badge variant={e.tone} className="ml-auto shrink-0">{e.impact}</Badge>
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
          </CardContent>
        </Card>
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 演示环境 · 含真实公开资料与模拟业务数据 · 模拟资料不计入真实声量 / 证据统计 · 预生成研究内容均如实标注
      </p>
    </div>
  )
}
