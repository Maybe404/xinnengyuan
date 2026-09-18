import * as React from "react"
import { ExternalLink, FileWarning, Quote } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  MATERIALS,
  MAT_TABS,
  PROP_BADGE,
  VERIFY_BADGE,
  type Material,
} from "@/data"
import { useToast } from "@/store"

export function Materials() {
  const toast = useToast()
  const [tab, setTab] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState<Material | null>(null)

  const list = MATERIALS.filter(
    (m) =>
      (tab === "all" || m.type === tab) &&
      (query === "" ||
        m.title.includes(query) ||
        m.source.includes(query) ||
        m.region.includes(query))
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">情报资料</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          已导入 42 份（去重后）· 转载按共同原始出处归组 · 同一文件修订创建新版本 · 模拟资料不计入真实统计
        </p>
      </div>

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
        <Button
          variant="glass"
          size="sm"
          className="ml-auto"
          onClick={() =>
            toast(
              <>
                导入通道（演示）：支持文本型 PDF / DOCX / TXT / 粘贴文本，单文件 ≤20MB
              </>
            )
          }
        >
          导入资料
        </Button>
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
                    onClick={() => setOpen(m)}
                    className="cursor-pointer border-b border-foreground/[0.045] transition-colors last:border-0 hover:bg-white/50 rise"
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
                      <span className="text-[11.5px] text-muted-foreground tabular">
                        {m.facts.length} 条
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <p className="text-[11.5px] text-muted-foreground">
        ◈ 点击行查看原文片段与提取事实 · 外部链接打不开时可查看已保存快照（演示中原文片段为节选）
      </p>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
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
                  原文可追溯
                </Badge>
              </div>

              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">原文片段</h4>
                <div className="rounded-xl bg-white/60 p-3.5 text-[12.5px] leading-relaxed">
                  <Quote className="mb-1.5 size-3.5 text-muted-foreground/50" />
                  {open.excerpt}
                  <div className="mt-2 text-[11px] text-muted-foreground">定位：{open.loc}</div>
                </div>
              </section>

              <section>
                <h4 className="mb-2 text-[12px] font-semibold tracking-wide text-primary">
                  提取事实与证据
                </h4>
                <div className="space-y-2">
                  {open.facts.map((f) => (
                    <div key={f.text} className="rounded-xl bg-white/55 p-3">
                      <div className="flex items-start gap-2">
                        <Badge variant={VERIFY_BADGE[f.state]} className="mt-0.5 shrink-0">
                          {f.state}
                        </Badge>
                        <p className="text-[12.5px] leading-relaxed">{f.text}</p>
                      </div>
                      {f.result && (
                        <p className="mt-1.5 pl-1 text-[11px] text-muted-foreground">
                          核验结果：{f.result}（方式：原文人工查证 / 第二独立来源印证 · 操作人：演示账号）
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  已核验 = 在声明范围内完成核对，不等于支持原判断；反驳结果计入 V 统计但不计入支持数。
                </p>
              </section>

              <section className="flex gap-2.5">
                <Button
                  onClick={() =>
                    toast(
                      <>
                        已发起核验任务（演示）—— 方式：原文人工查证 · 说明必填 ≥10 字
                      </>
                    )
                  }
                >
                  发起核验
                </Button>
                <Button variant="outline" onClick={() => toast("已加入研究队列（演示）")}>
                  关联至研究
                </Button>
              </section>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
