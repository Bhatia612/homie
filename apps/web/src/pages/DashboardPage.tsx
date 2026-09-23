import { useEffect, useState } from "react"
import { RiHome5Line, RiAddLine, RiLogoutBoxRLine, RiMapPin2Line } from "@remixicon/react"
import type { Tenancy } from "@homie/shared"
import { useAuth } from "../auth/AuthContext"
import { ApiRequestError } from "../api/client"
import { listTenancies, createTenancy } from "../api/tenancies"
import { TextField } from "../components/TextField"

type LoadState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; tenancies: Tenancy[] }

export function DashboardPage() {
    const { user, logout } = useAuth()
    const [state, setState] = useState<LoadState>({ status: "loading" })
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        listTenancies()
            .then((tenancies) => setState({ status: "ready", tenancies }))
            .catch((err: unknown) => {
                const message =
                    err instanceof ApiRequestError ? err.message : "Could not load tenancies"
                setState({ status: "error", message })
            })
    }, [])

    function handleCreated(t: Tenancy) {
        setState((prev) =>
            prev.status === "ready"
                ? { status: "ready", tenancies: [t, ...prev.tenancies] }
                : prev
        )
        setShowForm(false)
    }

    const isLandlord = user?.role === "LANDLORD"

    return (
        <div className="min-h-screen bg-cloud-50 font-sans text-cloud-900">
            <header className="border-b border-cloud-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <RiHome5Line size={24} className="text-brand-600" />
                        <span className="text-xl font-bold tracking-tight">Homie</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-cloud-500 sm:inline">{user?.name}</span>
                        <button
                            onClick={() => logout()}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-cloud-500 transition hover:bg-cloud-100 hover:text-cloud-900"
                        >
                            <RiLogoutBoxRLine size={18} />
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-10">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Hey {user?.name?.split(" ")[0]}</h1>
                        <p className="mt-1 text-cloud-500">
                            {isLandlord
                                ? "Here are the tenancies you're documenting."
                                : "Here are the tenancies you're part of."}
                        </p>
                    </div>
                    {isLandlord && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                            <RiAddLine size={18} />
                            New tenancy
                        </button>
                    )}
                </div>

                {showForm && (
                    <CreateTenancyForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
                )}

                <div className="mt-8">
                    {state.status === "loading" && (
                        <p className="text-cloud-500">Loading your tenancies...</p>
                    )}

                    {state.status === "error" && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {state.message}
                        </div>
                    )}

                    {state.status === "ready" && state.tenancies.length === 0 && (
                        <EmptyState isLandlord={isLandlord} onCreate={() => setShowForm(true)} />
                    )}

                    {state.status === "ready" && state.tenancies.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {state.tenancies.map((t) => (
                                <TenancyCard key={t.id} tenancy={t} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function TenancyCard({ tenancy }: { tenancy: Tenancy }) {
    return (
        <div className="rounded-2xl border border-cloud-200 bg-white p-5 transition hover:border-cloud-400 hover:shadow-sm">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                    <RiMapPin2Line size={20} />
                </div>
                <div>
                    <h3 className="font-semibold">
                        {tenancy.addressLine}
                        {tenancy.unit ? `, Unit ${tenancy.unit}` : ""}
                    </h3>
                    <p className="mt-0.5 text-sm text-cloud-500">
                        {tenancy.city}, {tenancy.province}
                    </p>
                </div>
            </div>
        </div>
    )
}

function EmptyState({
    isLandlord,
    onCreate
}: {
    isLandlord: boolean
    onCreate: () => void
}) {
    return (
        <div className="rounded-2xl border border-dashed border-cloud-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <RiHome5Line size={24} />
            </div>
            <h3 className="mt-4 font-semibold">No tenancies yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-cloud-500">
                {isLandlord
                    ? "Create your first tenancy to start documenting the rental record."
                    : "You'll see tenancies here once a landlord invites you."}
            </p>
            {isLandlord && (
                <button
                    onClick={onCreate}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    <RiAddLine size={18} />
                    New tenancy
                </button>
            )}
        </div>
    )
}

function CreateTenancyForm({
    onCreated,
    onCancel
}: {
    onCreated: (t: Tenancy) => void
    onCancel: () => void
}) {
    const [addressLine, setAddressLine] = useState("")
    const [unit, setUnit] = useState("")
    const [city, setCity] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const tenancy = await createTenancy({
                addressLine,
                unit: unit || undefined,
                city,
                province: "ON"
            })
            onCreated(tenancy)
        } catch (err) {
            const message =
                err instanceof ApiRequestError ? err.message : "Could not create tenancy"
            setError(message)
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-cloud-200 bg-white p-6">
            <h2 className="font-semibold">New tenancy</h2>
            <p className="mt-1 text-sm text-cloud-500">Ontario only for now. More provinces later.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <TextField
                        id="addressLine"
                        label="Street address"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        required
                    />
                </div>
                <TextField
                    id="unit"
                    label="Unit (optional)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                />
                <TextField
                    id="city"
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </div>

            {error && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mt-5 flex gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Creating..." : "Create tenancy"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-cloud-500 transition hover:bg-cloud-100 hover:text-cloud-900"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}