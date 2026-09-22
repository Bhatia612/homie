import { useAuth } from "../auth/AuthContext"

export function DashboardPage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-ink-950 p-8 font-sans text-cloud-100">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2 text-cloud-400">
                Logged in as {user?.name} ({user?.role})
            </p>
            <button
                onClick={() => logout()}
                className="mt-6 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
                Log out
            </button>
        </div>
    )
}