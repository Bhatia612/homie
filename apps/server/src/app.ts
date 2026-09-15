import express from "express"
import cors from "cors"
import type { ApiError } from "@homie/shared"
import { env } from "./config/env"
import { sessionMiddleware } from "./config/session"
import { healthRouter } from "./routes/health"
import { authRouter } from "./routes/auth"

export function createApp() {
    const app = express()

    if (env.isProd) {
        app.set("trust proxy", 1)
    }

    app.use(
        cors({
            origin: env.webOrigin,
            credentials: true
        })
    )

    app.use(express.json())
    app.use(sessionMiddleware)

    app.use("/api", healthRouter)
    app.use("/api/auth", authRouter)

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