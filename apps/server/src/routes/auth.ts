import { Router } from "express"
import type { ApiError, Role } from "@homie/shared"
import { requireAuth } from "../middleware/requireAuth"
import {
    registerUser,
    authenticateUser,
    getUserById,
    AuthError
} from "../services/authService"

export const authRouter = Router()

function sendError(res: import("express").Response, err: unknown, next: import("express").NextFunction) {
    if (err instanceof AuthError) {
        const body: ApiError = { code: err.code, message: err.message }
        return res.status(err.status).json(body)
    }
    next(err)
}

authRouter.post("/register", async (req, res, next) => {
    const { name, email, password, role } = req.body ?? {}
    if (!name || !email || !password || !role) {
        const body: ApiError = { code: "MISSING_FIELDS", message: "name, email, password and role are required" }
        return res.status(400).json(body)
    }
    if (role !== "LANDLORD" && role !== "TENANT") {
        const body: ApiError = { code: "INVALID_ROLE", message: "role must be LANDLORD or TENANT" }
        return res.status(400).json(body)
    }

    try {
        const user = await registerUser({ name, email, password, role: role as Role })
        req.session.userId = user.id
        res.status(201).json(user)
    } catch (err) {
        sendError(res, err, next)
    }
})

authRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
        const body: ApiError = { code: "MISSING_FIELDS", message: "email and password are required" }
        return res.status(400).json(body)
    }

    try {
        const user = await authenticateUser(email, password)
        req.session.userId = user.id
        res.json(user)
    } catch (err) {
        sendError(res, err, next)
    }
})

authRouter.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)
        res.clearCookie("connect.sid")
        res.status(204).end()
    })
})

authRouter.get("/me", requireAuth, async (req, res, next) => {
    try {
        const user = await getUserById(req.session.userId!)
        if (!user) {
            const body: ApiError = { code: "UNAUTHENTICATED", message: "You must be logged in" }
            return res.status(401).json(body)
        }
        res.json(user)
    } catch (err) {
        next(err)
    }
})