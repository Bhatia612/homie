import { useState } from "react"
import type { Role } from "@homie/shared"

export default function App() {
  const [selected, setSelected] = useState<Role | null>(null)

  return (
    <div className="min-h-screen font-sans lg:grid lg:grid-cols-2">
      <aside className="relative hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-2 text-white">
          <HomeMark className="text-brand-500" />
          <span className="text-3xl font-bold tracking-tight">Homie</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            A shared rental record for landlords and tenants.
          </h2>
          <div className="mt-8 space-y-1 text-lg text-cloud-400">
            <p>Everything documented.</p>
            <p>Everyone informed.</p>
            <p>Nothing lost.</p>
          </div>
        </div>

        <p className="text-sm text-cloud-500">
          Same home. Different goals. One platform.
        </p>
      </aside>

      <main className="flex min-h-screen flex-col justify-center bg-white px-6 py-12 text-cloud-900 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2 text-brand-600 lg:hidden">
            <HomeMark />
            <span className="text-2xl font-bold tracking-tight text-cloud-900">
              Homie
            </span>
          </div>

          <h1 className="text-3xl font-bold">Welcome to Homie</h1>
          <p className="mt-2 text-cloud-500">
            Let's get you set up. First, tell us who you are.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => setSelected("LANDLORD")}
              className={`w-full rounded-xl px-5 py-4 text-left text-sm font-semibold transition ${
                selected === "LANDLORD"
                  ? "bg-brand-600 text-white ring-2 ring-brand-600 ring-offset-2"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              }`}
            >
              I'm a Landlord
              <span className="mt-0.5 block text-xs font-normal opacity-90">
                I own or manage a property
              </span>
            </button>

            <button
              onClick={() => setSelected("TENANT")}
              className={`w-full rounded-xl border px-5 py-4 text-left text-sm font-semibold transition ${
                selected === "TENANT"
                  ? "border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-600 ring-offset-2"
                  : "border-cloud-200 text-cloud-700 hover:border-cloud-400"
              }`}
            >
              I'm a Tenant
              <span className="mt-0.5 block text-xs font-normal text-cloud-400">
                I rent a place
              </span>
            </button>
          </div>

          <button
            disabled={!selected}
            className="mt-8 w-full rounded-xl bg-cloud-900 px-5 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  )
}

function HomeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}