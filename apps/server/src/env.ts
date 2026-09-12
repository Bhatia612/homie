const PORT = Number(process.env.PORT ?? 4000)
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173"

export const env = {
    port: PORT,
    webOrigin: WEB_ORIGIN
}