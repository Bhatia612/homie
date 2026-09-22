import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { PublicUser, Role } from "@homie/shared"
import * as authApi from "../api/auth"
import { ApiRequestError } from "../api/client"

interface AuthContextValue {
    user: PublicUser | null
    loading: boolean
    register: (input: {
        name: string
        email: string
        password: string
        role: Role
    }) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authApi
            .getMe()
            .then((u) => setUser(u))
            .catch((err: unknown) => {
                if (err instanceof ApiRequestError && err.status === 401) {
                    setUser(null)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    async function register(input: {
        name: string
        email: string
        password: string
        role: Role
    }) {
        const u = await authApi.register(input)
        setUser(u)
    }

    async function login(email: string, password: string) {
        const u = await authApi.login(email, password)
        setUser(u)
    }

    async function logout() {
        await authApi.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return ctx
}