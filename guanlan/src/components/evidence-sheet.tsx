import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { PROP_BADGE, VERIFY_BADGE, factKey } from "@/data"
import { useStore, useToast, type VerifyRecord } from "@/store"

const METHODS = ["原文人工查证", "第二独立来源印证", "内部资料交叉", "实地确认"] as const
const RESULTS = ["支持事实", "反驳事实", "适用范围不同", "仍无法判断"] as const

export function EvidenceSheet() {
  const {
    evidence,
    closeEvidence,
    materials,
    applyFact,
    submitVerify,
    verifies,
  } = useStore()
  const toast = useToast()
  const material = evidence ? materials.find((m) => m.id === evidence.materialId) : undefined
  const fact =
    material && evidence ? applyFact(material, evidence.factIndex) : undefined
  const existing =
    material && evidence ? verifies[factKey(material.id, evidence.factIndex)] : undefined

  const [methods, setMethods] = React.useState<string[]>(["原文人工查证"])
  const [result, setResult] = React.useState<string>("支持事实")
  const [scope, setScope] = React.useState("声明范围内：对象、时点与计价口径已核对")
  const [note, setNote] = React.useState("")

  React.useEffect(() => {
    if (!evidence) return
    setMethods(existing?.methods ?? ["原文人工查证"])
    setResult(existing?.result ?? "支持事实")
    setScope(existing?.scope ?? "声明范围内：对象、时点与计价口径已核对")
    setNote(existing?.note ?? "")
  }, [evidence, existing])

  const toggleMethod = (m: string) => {
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  const submit = () => {
    if (!material || !evidence) return
    if (methods.length === 0) {
      toast("请至少选择一种核验方式")
      return
    }
    if (note.trim().length < 10) {
      toast("核验说明至少 10 字")
      return
    }
    const rec: VerifyRecord = {
      state: result === "仍无法判断" ? "待核验" : "已核验",
      result,
      methods,
      scope,
      note: note.trim(),
      who: "演示账号 · 张远",
      at: new Date().toLocaleString("zh-CN", { hour12: false, timeZone: "Asia/Shanghai" }),
    }
    submitVerify(factKey(material.id, evidence.factIndex), rec)
    toast(
      <>
        核验已保存 · {rec.state} / {result} · 不自动改写正式研究建议
      </>
    )
  }

  return (
    <Sheet open={!!evidence} onOpenChange={(v) => !v && closeEvidence()}>
      {material && fact ? (
        <SheetContent className="w-[540px]">
          <SheetHeader>
            <SheetTitle>证据侧栏</SheetTitle>
            <SheetDescription>
              {material.id} · {material.title}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={PROP_BADGE[material.prop]}>{material.prop}</Badge>
              <Badge variant={VERIFY_BADGE[fact.state]}>{fact.state}</Badge>
              {fact.result && <Badge variant="outline">结果：{fact.result}</Badge>}
            </div>

            <section>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">事实</h4>
              <p className="rounded-xl bg-inset p-3.5 text-[12.5px] leading-relaxed">{fact.text}</p>
            </section>

            <section>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">引用原文</h4>
              <div className="rounded-xl bg-inset p-3.5 text-[12.5px] leading-relaxed">
                {material.excerpt}
                <div className="mt-2 text-[11px] text-muted-foreground">
                  定位：{material.loc} · 来源：{material.source}
                  {material.url ? ` · ${material.url}` : " · 无独立 URL，以已保存快照为准"}
                </div>
              </div>
            </section>

            <section className="text-[12px] leading-relaxed text-muted-foreground">
              对象：{material.object} · 区域：{material.region} · 发布：{material.published}
              <br />
              已核验 = 在声明范围内完成核对，不等于支持原判断。三省政策核验不可用模拟资料替代。
            </section>

            {existing && (
              <section className="rounded-xl bg-primary/[0.06] p-3 text-[12px] leading-relaxed">
                最近核验：{existing.at} · {existing.who}
                <br />
                方式：{existing.methods.join(" / ")} · 范围：{existing.scope}
                <br />
                说明：{existing.note}
              </section>
            )}

            <section className="space-y-2.5 rounded-xl border border-foreground/8 bg-inset p-3.5">
              <h4 className="text-[12px] font-semibold tracking-wide text-primary">确认核验</h4>
              <div className="flex flex-wrap gap-1.5">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMethod(m)}
                    className={
                      methods.includes(m)
                        ? "rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-medium text-primary"
                        : "rounded-full bg-inset px-2.5 py-1 text-[11px] text-muted-foreground"
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
              <label className="block text-[11.5px] text-muted-foreground">
                核验结果
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="mt-1 block h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[12.5px]"
                >
                  {RESULTS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="block text-[11.5px] text-muted-foreground">
                核验范围
                <input
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="mt-1 block h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[12.5px]"
                />
              </label>
              <label className="block text-[11.5px] text-muted-foreground">
                说明（≥10 字）
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-foreground/10 bg-inset px-2 py-1.5 text-[12.5px]"
                  placeholder="核对了哪一段、适用对象与时点，以及为何得出该结果"
                />
              </label>
              <Button onClick={submit}>提交核验</Button>
              <p className="text-[11px] text-muted-foreground">
                核验成功后同步证据状态；正式研究建议需在动态跟踪中人工确认，不会被自动改写。
              </p>
            </section>
          </div>
        </SheetContent>
      ) : (
        <SheetContent className="w-[480px]">
          <SheetHeader>
            <SheetTitle>证据侧栏</SheetTitle>
            <SheetDescription>该资料不在当前专题范围内，切换专题后再追溯，避免带入旧专题结论。</SheetDescription>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}
