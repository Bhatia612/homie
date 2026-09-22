import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/" replace />
    return <>{children}</>
}