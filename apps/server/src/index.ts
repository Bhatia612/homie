import "dotenv/config"
import { createApp } from "./app"
import { env } from "./config/env"

const app = createApp()

app.listen(env.port, () => {
  console.log(`homie-server listening on http://localhost:${env.port}`)
})
