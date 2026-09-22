import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { RiHome5Line, RiCheckLine, RiArrowLeftSLine } from "@remixicon/react"
import type { Role } from "@homie/shared"
import { useAuth } from "../auth/AuthContext"
import { ApiRequestError } from "../api/client"
import { TextField } from "../components/TextField"

type Step = "role" | "details"

const roleCopy: Record<Role, { title: string; subtitle: string }> = {
    LANDLORD: { title: "I'm a Landlord", subtitle: "I own or manage a property" },
    TENANT: { title: "I'm a Tenant", subtitle: "I rent a place" }
}

export function WelcomePage() {
    const { user, register } = useAuth()
    const [step, setStep] = useState<Step>("role")
    const [role, setRole] = useState<Role | null>(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) return <Navigate to="/dashboard" replace />

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!role) return
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }
        setError(null)
        setSubmitting(true)
        try {
            await register({ name, email, password, role })
        } catch (err) {
            const message =
                err instanceof ApiRequestError ? err.message : "Something went wrong"
            setError(message)
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen font-sans lg:grid lg:grid-cols-2">
            <aside className="relative hidden flex-col justify-between bg-ink-950 p-12 lg:flex">
                <div className="flex items-center gap-2 text-white">
                    <RiHome5Line size={28} className="text-brand-500" />
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
                    <div className="mb-10 flex items-center gap-2 lg:hidden">
                        <RiHome5Line size={28} className="text-brand-600" />
                        <span className="text-2xl font-bold tracking-tight text-cloud-900">
                            Homie
                        </span>
                    </div>

                    {step === "role" && (
                        <div>
                            <h1 className="text-3xl font-bold">Welcome to Homie</h1>
                            <p className="mt-2 text-cloud-500">
                                Let's get you set up. First, tell us who you are.
                            </p>

                            <div className="mt-8 flex flex-col gap-3">
                                {(Object.keys(roleCopy) as Role[]).map((r) => {
                                    const active = role === r
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition ${active
                                                    ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
                                                    : "border-cloud-200 hover:border-cloud-400"
                                                }`}
                                        >
                                            <span>
                                                <span className="block text-sm font-semibold text-cloud-900">
                                                    {roleCopy[r].title}
                                                </span>
                                                <span className="mt-0.5 block text-xs text-cloud-400">
                                                    {roleCopy[r].subtitle}
                                                </span>
                                            </span>
                                            {active && <RiCheckLine size={20} className="text-brand-600" />}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                type="button"
                                disabled={!role}
                                onClick={() => setStep("details")}
                                className="mt-8 w-full rounded-xl bg-cloud-900 px-5 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                Continue
                            </button>

                            <p className="mt-6 text-center text-sm text-cloud-500">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    )}

                    {step === "details" && role && (
                        <form onSubmit={handleSubmit} noValidate>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("role")
                                    setError(null)
                                }}
                                className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-cloud-500 transition hover:text-cloud-700"
                            >
                                <RiArrowLeftSLine size={18} /> Back
                            </button>

                            <h1 className="text-3xl font-bold">
                                Create your {role === "LANDLORD" ? "landlord" : "tenant"} account
                            </h1>
                            <p className="mt-2 text-cloud-500">Just a few details to get started.</p>

                            <div className="mt-8 flex flex-col gap-4">
                                <TextField
                                    id="name"
                                    label="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    required
                                />
                                <TextField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                                <TextField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Creating account..." : "Create account"}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    )
}