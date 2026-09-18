import { Sidebar } from "@/components/sidebar"
import { Compare } from "@/pages/compare"
import { Decision } from "@/pages/decision"
import { Overview } from "@/pages/overview"
import { Updates } from "@/pages/updates"
import { Verify } from "@/pages/verify"
import { StoreProvider, ToastProvider, useStore } from "@/store"

function Main() {
  const { page } = useStore()
  return (
    <div className="ambient-scene flex h-screen overflow-hidden">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        <div key={page} className="mx-auto max-w-[1120px] px-8 pt-9 pb-16 rise">
          {page === "overview" && <Overview />}
          {page === "verify" && <Verify />}
          {page === "compare" && <Compare />}
          {page === "decision" && <Decision />}
          {page === "updates" && <Updates />}
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
