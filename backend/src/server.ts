import { app } from './app.js'
import { env } from './config/env.js'
import { startKeepalive } from './lib/keepalive.js'

app.listen(env.APP_PORT, () => {
  console.log(`Backend running on http://localhost:${env.APP_PORT}`)
  const selfUrl = env.SELF_URL || `http://localhost:${env.APP_PORT}`
  startKeepalive(selfUrl)
})
