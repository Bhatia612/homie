import { Router } from "express"
import type { HealthResponse } from "@homie/shared"

export const healthRouter = Router()

healthRouter.get("/health", (_req, res) => {
    const body: HealthResponse = {
        status: "ok",
        service: "homie-server",
        time: new Date().toISOString()
    }
    res.json(body)
})