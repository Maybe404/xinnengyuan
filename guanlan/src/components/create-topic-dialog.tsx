import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useStore, useToast } from "@/store"

export function CreateTopicDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { createTopic } = useStore()
  const toast = useToast()
  const [form, setForm] = React.useState({
    name: "",
    question: "",
    stage: "初步研究",
    period: "2026-09-01 ~ 2026-12-31",
    deadline: "2026-12-31",
  })

  const field =
    "mt-1 h-9 w-full rounded-xl border border-foreground/10 bg-inset px-3 text-[13px] outline-none focus:border-primary/40"

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建专题</DialogTitle>
          <DialogDescription>
            业务方向固定为新能源场站配套储能。比较范围演示基线为江苏、浙江、广东。保存后进入该专题工作台，不会带入上一专题结论。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="text-[12px] text-muted-foreground">
            专题名称（1–60 字）
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
              placeholder="例如：盐城沿海场站配储论证"
            />
          </label>
          <label className="text-[12px] text-muted-foreground">
            决策问题（10–1000 字）
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-xl border border-foreground/10 bg-inset px-3 py-2 text-[13px] outline-none focus:border-primary/40"
              placeholder="要回答哪一个区域研究或场站论证问题？"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[12px] text-muted-foreground">
              目标阶段
              <input
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className={field}
              />
            </label>
            <label className="text-[12px] text-muted-foreground">
              研究截止
              <input
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className={field}
              />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (form.name.trim().length < 1 || form.name.trim().length > 60) {
                toast("专题名称需 1–60 字")
                return
              }
              if (form.question.trim().length < 10) {
                toast("决策问题至少 10 字")
                return
              }
              const rec = createTopic({ ...form, period: `${form.deadline.slice(0, 4)}-01-01 ~ ${form.deadline}` })
              setForm({
                name: "",
                question: "",
                stage: "初步研究",
                period: "2026-09-01 ~ 2026-12-31",
                deadline: "2026-12-31",
              })
              onOpenChange(false)
              toast(`已保存专题 ${rec.id}，当前没有资料，研究显示为草稿`)
            }}
          >
            保存并打开
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
