import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { RiHome5Line } from "@remixicon/react"
import { useAuth } from "../auth/AuthContext"
import { ApiRequestError } from "../api/client"
import { TextField } from "../components/TextField"

export function LoginPage() {
    const { user, login } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) return <Navigate to="/dashboard" replace />

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await login(email, password)
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
                        Welcome back.
                    </h2>
                    <div className="mt-8 space-y-1 text-lg text-cloud-400">
                        <p>Your rental record,</p>
                        <p>right where you left it.</p>
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

                    <h1 className="text-3xl font-bold">Log in</h1>
                    <p className="mt-2 text-cloud-500">Welcome back to Homie.</p>

                    <form onSubmit={handleSubmit} noValidate className="mt-8">
                        <div className="flex flex-col gap-4">
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
                                autoComplete="current-password"
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
                            {submitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-cloud-500">
                        New to Homie?{" "}
                        <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
                            Create an account
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}