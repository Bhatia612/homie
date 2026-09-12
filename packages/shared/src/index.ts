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