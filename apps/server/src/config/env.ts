const PORT = Number(process.env.PORT ?? 4000)
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173"
const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me"
const DATABASE_URL = process.env.DATABASE_URL ?? ""
const NODE_ENV = process.env.NODE_ENV ?? "development"

export const env = {
    port: PORT,
    webOrigin: WEB_ORIGIN,
    sessionSecret: SESSION_SECRET,
    databaseUrl: DATABASE_URL,
    isProd: NODE_ENV === "production"
}