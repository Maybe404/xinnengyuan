import { CreateTopicDialog } from "@/components/create-topic-dialog"
import { EvidenceSheet } from "@/components/evidence-sheet"
import { Sidebar } from "@/components/sidebar"
import { Capability } from "@/pages/capability"
import { Compare } from "@/pages/compare"
import { Materials } from "@/pages/materials"
import { Report } from "@/pages/report"
import { Research } from "@/pages/research"
import { Topic } from "@/pages/topic"
import { Updates } from "@/pages/updates"
import { StoreProvider, ToastProvider, useStore } from "@/store"
import { ThemeProvider } from "@/theme"

function Main() {
  const { page, createOpen, setCreateOpen } = useStore()
  return (
    <>
      <div className="ambient-scene flex h-screen overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1160px] px-8 pt-6 pb-16">
            <div key={page} className="rise">
              {page === "topic" && <Topic />}
              {page === "materials" && <Materials />}
              {page === "compare" && <Compare />}
              {page === "research" && <Research />}
              {page === "report" && <Report />}
              {page === "updates" && <Updates />}
              {page === "capability" && <Capability />}
            </div>
          </div>
        </main>
      </div>
      <EvidenceSheet />
      <CreateTopicDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <ToastProvider>
          <Main />
        </ToastProvider>
      </StoreProvider>
    </ThemeProvider>
  )
}
