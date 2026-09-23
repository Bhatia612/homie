import type { Tenancy, Province } from "@homie/shared"
import { apiFetch } from "./client"

export function listTenancies() {
    return apiFetch<Tenancy[]>("/api/tenancies")
}

export function getTenancy(id: string) {
    return apiFetch<Tenancy>(`/api/tenancies/${id}`)
}

export function createTenancy(input: {
    addressLine: string
    unit?: string
    city: string
    province: Province
}) {
    return apiFetch<Tenancy>("/api/tenancies", {
        method: "POST",
        body: JSON.stringify(input)
    })
}