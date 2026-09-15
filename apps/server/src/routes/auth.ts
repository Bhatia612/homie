import { Router } from "express"
import type { ApiError, PublicUser, Role } from "@homie/shared"
import { prisma } from "../db"
import { hashPassword } from "../lib/password"

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