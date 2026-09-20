import { Router } from "express"
import type { ApiError, PublicUser, Role } from "@homie/shared"
import { prisma } from "../db"
import { hashPassword, verifyPassword } from "../lib/password"
import { requireAuth } from "../middleware/requireAuth"

export const authRouter = Router()

authRouter.post("/register", async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body ?? {}

        if (!name || !email || !password || !role) {
            const body: ApiError = {
                code: "MISSING_FIELDS",
                message: "name, email, password and role are required"
            }
            return res.status(400).json(body)
        }

        if (role !== "LANDLORD" && role !== "TENANT") {
            const body: ApiError = {
                code: "INVALID_ROLE",
                message: "role must be LANDLORD or TENANT"
            }
            return res.status(400).json(body)
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            const body: ApiError = {
                code: "EMAIL_TAKEN",
                message: "An account with this email already exists"
            }
            return res.status(409).json(body)
        }

        const passwordHash = await hashPassword(password)
        const user = await prisma.user.create({
            data: { name, email, password: passwordHash, role: role as Role }
        })

        req.session.userId = user.id

        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        res.status(201).json(publicUser)
    } catch (err) {
        next(err)
    }
})

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body ?? {}

        if (!email || !password) {
            const body: ApiError = { code: "MISSING_FIELDS", message: "email and password are required" }
            return res.status(400).json(body)
        }

        const user = await prisma.user.findUnique({ where: { email } })

        const valid = user ? await verifyPassword(password, user.password) : false
        if (!user || !valid) {
            const body: ApiError = { code: "INVALID_CREDENTIALS", message: "Incorrect email or password" }
            return res.status(401).json(body)
        }

        req.session.userId = user.id

        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        res.json(publicUser)
    } catch (err) {
        next(err)
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
        const user = await prisma.user.findUnique({ where: { id: req.session.userId } })
        if (!user) {
            const body: ApiError = { code: "UNAUTHENTICATED", message: "You must be logged in" }
            return res.status(401).json(body)
        }

        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        res.json(publicUser)
    } catch (err) {
        next(err)
    }
})