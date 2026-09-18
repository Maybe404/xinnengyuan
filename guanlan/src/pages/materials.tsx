import * as React from "react"
import { ExternalLink, FileWarning, Quote, Radio } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { RunPipeline } from "@/components/run-pipeline"
import { MAT_TABS, PROP_BADGE, SOURCES, VERIFY_BADGE, type DataProp, type MatType } from "@/data"
import { useStore, useToast } from "@/store"

export function Materials() {
  const toast = useToast()
  const { materials, openEvidence, importMaterial, topic, setPage, hydrateDemoPack } = useStore()
  const [tab, setTab] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [importing, setImporting] = React.useState(false)
  const [draft, setDraft] = React.useState({
    title: "",
    type: "政策" as MatType,
    prop: "真实公开" as DataProp,
    source: "",
    url: "",
    excerpt: "",
    region: topic.scope[0] ?? "江苏",
  })

  const list = materials.filter(
    (m) =>
      (tab === "all" || m.type === tab) &&
      (query === "" || m.title.includes(query) || m.source.includes(query) || m.region.includes(query))
  )
  const open = materials.find((m) => m.id === openId) ?? null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">情报资料</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            本专题 {materials.length} 份（去重后）· 转载按共同原始出处归组 · 解析完成前不可用于研究 · 模拟资料不计入真实统计
          </p>
        </div>
        <Button variant="glass" size="sm" onClick={() => setImporting(true)}>
          导入资料
        </Button>
      </div>

      {materials.length === 0 ? (
        <RunPipeline
          page="materials"
          variant="inline"
          title="载入并解析演示资料包"
          lead="当前专题还没有资料。解析完成后才会出现清单、证据与信源检查，才能进入比较和研究。"
          cta="载入演示资料包并解析"
          rerunLabel="重新载入"
          onComplete={() => hydrateDemoPack()}
          steps={[
            {
              state: "searching",
              title: "扫描演示资料包",
              desc: "只纳入本专题范围，不是全网监测",
              log: `topic=${topic.id}`,
            },
            {
              state: "connecting",
              title: "按原始出处去重",
              desc: "转载归组到共同原始出处",
              log: "dedupe by source",
            },
            {
              state: "working",
              title: "抽取事实与定位",
              desc: "解析失败不伪造识别结果",
              log: "facts pending verify",
            },
            {
              state: "solving",
              title: "纳入专题",
              desc: "完成后开放清单与核验",
              log: "pack ready",
            },
          ]}
        >
          <p className="text-[13px] text-muted-foreground">资料已纳入，正在打开清单。</p>
        </RunPipeline>
      ) : (
        <>
      <div className="flex flex-wrap items-center gap-3 rise">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标题 / 来源 / 区域…"
          className="glass h-9 w-64 rounded-full px-4 text-[13px] outline-none placeholder:text-muted-foreground/60 focus:!border-primary/40"
        />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            {MAT_TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card className="rise overflow-hidden p-0" style={{ animationDelay: "80ms" }}>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
              <FileWarning className="size-6 opacity-50" />
              <p className="text-[13px]">
                {query || tab !== "all" ? "无匹配结果 —— 调整筛选或清空搜索" : "尚无资料"}
              </p>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-foreground/[0.07] text-left text-[11.5px] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">标题</th>
                  <th className="px-3 py-3 font-medium">类型</th>
                  <th className="px-3 py-3 font-medium">属性</th>
                  <th className="px-3 py-3 font-medium">区域</th>
                  <th className="px-3 py-3 font-medium">发布</th>
                  <th className="px-5 py-3 text-right font-medium">证据</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m, i) => (
                  <tr
                    key={m.id}
                    onClick={() => setOpenId(m.id)}
                    className="cursor-pointer border-b border-foreground/[0.045] transition-colors last:border-0 hover:bg-inset rise"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium">{m.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {m.id} · {m.source}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{m.type}</td>
                    <td className="px-3 py-3">
                      <Badge variant={PROP_BADGE[m.prop]}>{m.prop}</Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{m.region}</td>
                    <td className="px-3 py-3 tabular text-muted-foreground">{m.published}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-[11.5px] text-muted-foreground tabular">{m.facts.length} 条</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="rise">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <Radio className="size-4 text-primary" />
            核心信源检查
          </CardTitle>
          <CardDescription>
            「分析新增资料」只处理本专题已导入内容，不是全网监测。失败不把状态写成无变化。
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-foreground/[0.07] text-left text-[11px] text-muted-foreground">
                <th className="px-5 py-2 font-medium">机构</th>
                <th className="px-3 py-2 font-medium">主题</th>
                <th className="px-3 py-2 font-medium">频率</th>
                <th className="px-3 py-2 font-medium">最近成功</th>
                <th className="px-3 py-2 font-medium">下次检查</th>
                <th className="px-5 py-2 font-medium">最近结果</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.org} className="border-b border-foreground/[0.045] last:border-0">
                  <td className="px-5 py-2">
                    <div className="font-medium">{s.org}</div>
                    <div className="text-[11px] text-muted-foreground">{s.url}</div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{s.topic}</td>
                  <td className="px-3 py-2">{s.freq}</td>
                  <td className="px-3 py-2 tabular">{s.lastOk}</td>
                  <td className="px-3 py-2 tabular">{s.next}</td>
                  <td className="px-5 py-2">
                    <Badge
                      variant={s.status === "检查失败" ? "violet" : s.status === "无变化" ? "secondary" : "default"}
                    >
                      {s.status}
                    </Badge>
                    <span className="ml-2 text-[11px] text-muted-foreground">{s.lastResult}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 点击行查看原文片段 · 点证据可打开核验侧栏 · 仅保存 URL 不算已读取全文
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const hit = materials.find((m) => m.facts.some((f) => f.state === "待核验"))
            if (!hit) {
              toast("当前列表没有待核验事实，可直接进入比较")
              setPage("compare")
              return
            }
            const i = hit.facts.findIndex((f) => f.state === "待核验")
            openEvidence({ materialId: hit.id, factIndex: i })
          }}
        >
          核验下一条待核验
        </Button>
        <Button size="sm" onClick={() => setPage("compare")}>
          下一步：区域比较
        </Button>
      </div>
        </>
      )}

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
        {open && (
          <SheetContent className="w-[520px]">
            <SheetHeader>
              <SheetTitle>{open.title}</SheetTitle>
              <SheetDescription>
                {open.id} · {open.type} · {open.source} · 发布 {open.published} · 对象：{open.object}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant={PROP_BADGE[open.prop]}>{open.prop}</Badge>
                <Badge variant="outline">{open.region}</Badge>
                <Badge variant="outline">
                  <ExternalLink className="size-2.5" />
                  {open.url ? "来源 URL 已登记" : "以已保存快照为准"}
                </Badge>
              </div>

              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">原文片段</h4>
                <div className="rounded-xl bg-inset p-3.5 text-[12.5px] leading-relaxed">
                  <Quote className="mb-1.5 size-3.5 text-muted-foreground/50" />
                  {open.excerpt}
                  <div className="mt-2 text-[11px] text-muted-foreground">定位：{open.loc}</div>
                </div>
              </section>

              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">提取事实与证据</h4>
                <div className="space-y-2">
                  {open.facts.map((f, i) => (
                    <button
                      key={f.text}
                      onClick={() => {
                        setOpenId(null)
                        openEvidence({ materialId: open.id, factIndex: i })
                      }}
                      className="w-full rounded-xl bg-inset p-3 text-left hover:bg-inset"
                    >
                      <div className="flex items-start gap-2">
                        <Badge variant={VERIFY_BADGE[f.state]} className="mt-0.5 shrink-0">
                          {f.state}
                        </Badge>
                        <p className="text-[12.5px] leading-relaxed">{f.text}</p>
                      </div>
                      {f.result && (
                        <p className="mt-1.5 pl-1 text-[11px] text-muted-foreground">核验结果：{f.result}</p>
                      )}
                      <p className="mt-1 text-[11px] text-primary">打开证据侧栏并核验 →</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </SheetContent>
        )}
      </Sheet>

      <Sheet open={importing} onOpenChange={setImporting}>
        <SheetContent className="w-[480px]">
          <SheetHeader>
            <SheetTitle>导入资料</SheetTitle>
            <SheetDescription>
              首期支持粘贴文本 / 登记来源。单次一份。不能解析扫描件时请补文本，不伪造识别结果。
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <label className="block text-[12px] text-muted-foreground">
              标题
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="mt-1 h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[13px]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[12px] text-muted-foreground">
                类型
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value as MatType })}
                  className="mt-1 h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[13px]"
                >
                  {MAT_TABS.filter((t) => t.key !== "all").map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[12px] text-muted-foreground">
                数据属性
                <select
                  value={draft.prop}
                  onChange={(e) => setDraft({ ...draft, prop: e.target.value as DataProp })}
                  className="mt-1 h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[13px]"
                >
                  <option>真实公开</option>
                  <option>真实内部</option>
                  <option>模拟</option>
                </select>
              </label>
            </div>
            <label className="block text-[12px] text-muted-foreground">
              来源 / 发布主体
              <input
                value={draft.source}
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                className="mt-1 h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[13px]"
              />
            </label>
            <label className="block text-[12px] text-muted-foreground">
              来源 URL（可选；仅 URL 不算已读全文）
              <input
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                className="mt-1 h-8 w-full rounded-lg border border-foreground/10 bg-inset px-2 text-[13px]"
              />
            </label>
            <label className="block text-[12px] text-muted-foreground">
              原文文本（必填）
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                rows={5}
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-inset px-2 py-1.5 text-[13px]"
              />
            </label>
            <Button
              onClick={() => {
                if (!draft.title.trim() || !draft.source.trim() || draft.excerpt.trim().length < 10) {
                  toast("标题、来源和至少 10 字原文为必填")
                  return
                }
                const id = `M-IMP-${Date.now().toString().slice(-6)}`
                importMaterial({
                  id,
                  title: draft.title.trim(),
                  type: draft.type,
                  prop: draft.prop,
                  source: draft.source.trim(),
                  url: draft.url.trim() || undefined,
                  published: "未知",
                  region: draft.region,
                  object: topic.name,
                  excerpt: draft.excerpt.trim(),
                  loc: "粘贴文本 · 段落 1",
                  facts: [{ text: draft.excerpt.trim().slice(0, 80), state: "待核验" }],
                })
                setImporting(false)
                toast(`${id} 已纳入本专题 · 状态：可用 · 证据待核验`)
                openEvidence({ materialId: id, factIndex: 0 })
              }}
            >
              保存并纳入专题
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
