import type { PublicUser, Role } from "@homie/shared"
import { apiFetch } from "./client"

export function getMe() {
    return apiFetch<PublicUser>("/api/auth/me")
}

export function register(input: {
    name: string
    email: string
    password: string
    role: Role
}) {
    return apiFetch<PublicUser>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input)
    })
}

export function login(email: string, password: string) {
    return apiFetch<PublicUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    })
}

export function logout() {
    return apiFetch<void>("/api/auth/logout", { method: "POST" })
}