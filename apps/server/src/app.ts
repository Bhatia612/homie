import express from "express"
import cors from "cors"
import type { ApiError } from "@homie/shared"
import { env } from "./env"
import { healthRouter } from "./routes/health"

export function createApp() {
    const app = express()

    app.use(
        cors({
            origin: env.webOrigin,
            credentials: true
        })
    )

    app.use(express.json())

    app.use("/api", healthRouter)

    app.use((_req, res) => {
        const body: ApiError = { code: "NOT_FOUND", message: "Route not found" }
        res.status(404).json(body)
    })

    app.use(
        (
            err: unknown,
            _req: express.Request,
            res: express.Response,
            _next: express.NextFunction
        ) => {
            console.error(err)
            const body: ApiError = { code: "INTERNAL", message: "Something went wrong" }
            res.status(500).json(body)
        }
    )

    return app
}