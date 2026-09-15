import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import { env } from "./env"

declare module "express-session" {
    interface SessionData {
        userId?: string
    }
}

const PgStore = connectPgSimple(session)

export const sessionMiddleware = session({
    store: new PgStore({
        conString: env.databaseUrl,
        createTableIfMissing: true
    }),
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})