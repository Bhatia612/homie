import type { PublicUser, Role } from "@homie/shared"
import { prisma } from "../db"
import { hashPassword, verifyPassword } from "../lib/password"

export class AuthError extends Error {
    code: string
    status: number
    constructor(status: number, code: string, message: string) {
        super(message)
        this.name = "AuthError"
        this.status = status
        this.code = code
    }
}

function toPublicUser(user: {
    id: string
    name: string
    email: string
    role: Role
}): PublicUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function registerUser(input: {
    name: string
    email: string
    password: string
    role: Role
}): Promise<PublicUser> {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) {
        throw new AuthError(409, "EMAIL_TAKEN", "An account with this email already exists")
    }

    const passwordHash = await hashPassword(input.password)
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: passwordHash,
            role: input.role
        }
    })

    return toPublicUser(user)
}

export async function authenticateUser(
    email: string,
    password: string
): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { email } })
    const valid = user ? await verifyPassword(password, user.password) : false

    if (!user || !valid) {
        throw new AuthError(401, "INVALID_CREDENTIALS", "Incorrect email or password")
    }

    return toPublicUser(user)
}

export async function getUserById(id: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? toPublicUser(user) : null
}