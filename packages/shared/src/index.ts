export type Role = "LANDLORD" | "TENANT"

export interface ApiError {
    code: string
    message: string
}

export interface HealthResponse {
    status: "ok"
    service: "homie-server"
    time: string
}


export interface PublicUser {
    id: string
    name: string
    email: string
    role: Role
}

export type Province = "ON"

export type TenancyRole = "LANDLORD" | "TENANT"

export interface TenancyMember {
    id: string
    tenancyId: string
    userId: string
    role: TenancyRole
    createdAt: string
}

export interface Tenancy {
    id: string
    addressLine: string
    unit: string | null
    city: string
    province: Province
    createdById: string
    createdAt: string
    members?: TenancyMember[]
}