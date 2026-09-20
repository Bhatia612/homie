import type { Request, Response, NextFunction } from "express"
import type { ApiError } from "@homie/shared"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId) {
        const body: ApiError = { code: "UNAUTHENTICATED", message: "You must be logged in" }
        return res.status(401).json(body)
    }
    next()
}