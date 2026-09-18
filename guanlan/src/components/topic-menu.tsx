import * as React from "react"
import { ChevronDown, Plus } from "lucide-react"

import { useStore } from "@/store"
import { cn } from "@/lib/utils"

export function TopicMenu() {
  const { topic, topics, switchTopic, setCreateOpen } = useStore()
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-foreground transition-all duration-200 outline-none",
          "bg-white/85 shadow-[0_1px_3px_oklch(0.4_0.03_260/0.12),inset_0_1px_0_oklch(1_0_0/0.8)] dark:bg-white/12 dark:shadow-none",
          "focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        <span className="min-w-0 flex-1 truncate leading-snug">{topic.name}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-primary transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-0.5 space-y-0.5">
          {topics
            .filter((t) => t.id !== topic.id)
            .map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  switchTopic(t.id)
                  setOpen(false)
                }}
                className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-muted-foreground transition-all duration-200 outline-none hover:bg-white/45 hover:text-foreground dark:hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span className="truncate text-[13.5px] leading-snug">{t.name}</span>
                <span className="mt-0.5 text-[11px] font-normal text-muted-foreground/80">
                  {t.id} · {t.currentVersion ?? "研究草稿"}
                </span>
              </button>
            ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setCreateOpen(true)
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] text-muted-foreground transition-all duration-200 outline-none hover:bg-white/45 hover:text-foreground dark:hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <Plus className="size-4 text-primary" />
            新建专题
          </button>
        </div>
      )}
    </div>
  )
}
