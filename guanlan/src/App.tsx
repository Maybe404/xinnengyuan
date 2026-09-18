import { Sidebar } from "@/components/sidebar"
import { Capability } from "@/pages/capability"
import { Compare } from "@/pages/compare"
import { Materials } from "@/pages/materials"
import { Research } from "@/pages/research"
import { Topic } from "@/pages/topic"
import { Updates } from "@/pages/updates"
import { StoreProvider, ToastProvider, useStore } from "@/store"

function Main() {
  const { page } = useStore()
  return (
    <div className="ambient-scene flex h-screen overflow-hidden">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        <div key={page} className="mx-auto max-w-[1160px] px-8 pt-9 pb-16 rise">
          {page === "topic" && <Topic />}
          {page === "materials" && <Materials />}
          {page === "compare" && <Compare />}
          {page === "research" && <Research />}
          {page === "updates" && <Updates />}
          {page === "capability" && <Capability />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Main />
      </ToastProvider>
    </StoreProvider>
  )
}
