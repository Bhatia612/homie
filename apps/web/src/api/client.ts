import type { ApiError } from "@homie/shared"

const BASE_URL = import.meta.env.VITE_API_URL ?? ""

export class ApiRequestError extends Error {
  code: string
  status: number

  constructor(status: number, error: ApiError) {
    super(error.message)
    this.name = "ApiRequestError"
    this.code = error.code
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  })

  if (res.status === 204) {
    return undefined as T
  }

  const data = await res.json()

  if (!res.ok) {
    throw new ApiRequestError(res.status, data as ApiError)
  }

  return data as T
}