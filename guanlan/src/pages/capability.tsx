import { PencilLine } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RunPipeline } from "@/components/run-pipeline"
import { CAP_FIELDS, PROP_BADGE } from "@/data"
import { useStore, useToast } from "@/store"

const GROUPS = ["场站资源", "技术", "投资建设", "运维", "关键约束"]

// 演示：能力编辑 → 受影响结论反查（A06）
const IMPACTED = [
  {
    field: "本地运维团队（江苏）",
    oldValue: "外包过渡方案（旧值）",
    newValue: "无 → 成立条件",
    conditions: "支撑条件 ① 运维本地化",
    note: "复核后保留「优先跟进」档位，理由：缺口已列为成立条件且可补足（复核记录 09-02）",
  },
]

export function Capability() {
  const toast = useToast()
  const { capEdited, setCapEdited, setPage } = useStore()
  const edited = capEdited

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">企业能力档案</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          能力版本 CAP-2026-09 · 每项记录来源与真实/模拟属性 · 结论引用字段 ID + 值 + 版本快照，不引用会覆盖的档案
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-3">
        {GROUPS.map((g, gi) => (
          <Card key={g} className="rise" style={{ animationDelay: `${gi * 70}ms` }}>
            <CardHeader className="pb-2">
              <CardTitle>{g}</CardTitle>
              <CardDescription>
                {CAP_FIELDS.filter((f) => f.group === g).length} 项字段
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {CAP_FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.name} className="rounded-lg bg-inset px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-medium">{f.name}</span>
                    <Badge variant={PROP_BADGE[f.prop]} className="ml-auto">{f.prop}</Badge>
                  </div>
                  <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                    {f.value}
                    {f.unit ? ` ${f.unit}` : ""} · 适用：{f.region}
                  </div>
                  <div className="text-[10.5px] text-muted-foreground/70">
                    来源：{f.source} · 更新 {f.updated}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <RunPipeline
        page="capability"
        variant="inline"
        title="模拟编辑并反查影响"
        lead="字段始终可见。修改被引用字段后，才跑依赖反查；无关结论不被改写。"
        cta="模拟编辑此字段"
        rerunLabel="重新反查"
        forceReady={edited}
        onRerun={() => setCapEdited(false)}
        onComplete={() => {
          setCapEdited(true)
          toast("能力字段新版本已保存（CAP-2026-09.1）· 已生成变更事件并反查依赖")
        }}
        steps={[
          {
            state: "working",
            title: "保存能力新版本",
            desc: "CAP-2026-09 → CAP-2026-09.1",
            log: "field: 本地运维团队（江苏）",
          },
          {
            state: "solving",
            title: "依赖反查",
            desc: "只列出引用该字段的结论",
            log: "1 impacted conclusion",
          },
          {
            state: "weaving",
            title: "对照成立条件",
            desc: "能力变化不必然改变建议",
            log: "retain 优先跟进 with reason",
          },
        ]}
      >
      <Card className="rise">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <PencilLine className="size-4 text-primary" />
            能力编辑与影响反查（演示 · 对应 A06）
          </CardTitle>
          <CardDescription>
            修改被引用字段 → 保存新版本 → 显示受影响结论清单（引用旧值、新值、所支持条件）；无关结论不被改写
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl bg-inset p-3.5">
            <div className="mb-2 text-[12px] font-semibold text-primary">
              受影响结论清单（1 条 · 无依赖字段不批量改写）：
            </div>
            {IMPACTED.map((m) => (
              <div key={m.field} className="space-y-1 text-[12px] leading-relaxed">
                <div>
                  <span className="text-muted-foreground">字段：</span>
                  {m.field} ·{" "}
                  <span className="text-amber-700">旧值：{m.oldValue}</span> →{" "}
                  <span className="text-primary">新值：{m.newValue}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">所支持条件：</span>
                  {m.conditions}
                </div>
                <div>
                  <span className="text-muted-foreground">复核结果：</span>
                  {m.note}
                </div>
              </div>
            ))}
            <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              能力变化不必然改变建议 —— 复核后保留原建议也需保存理由；已确认研究保留当时能力快照（v1.4 引用 CAP-2026-09）。
            </div>
            <Button className="mt-3" size="sm" variant="outline" onClick={() => setPage("updates")}>
              到动态跟踪查看变更事件
            </Button>
          </div>
        </CardContent>
      </Card>
      </RunPipeline>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 字段缺来源时标记为假设使用，不视为真实已验证能力 · 绿发场站资源为待核实协同条件，不默认已掌握三省真实资产清单
      </p>
    </div>
  )
}
