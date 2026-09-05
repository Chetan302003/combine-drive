import { prisma } from '../config/prisma.js'

const INTERVAL_MS = 14 * 60 * 1000 // 14 minutes – just under Render's 15-min idle cutoff

/**
 * Starts a periodic keepalive loop that:
 *  1. Pings the backend's own /health endpoint so Render doesn't spin the service down.
 *  2. Runs a lightweight DB query so Aiven's free-tier MySQL doesn't go idle.
 *
 * Only runs in production.
 */
export function startKeepalive(selfUrl: string): void {
  if (process.env.NODE_ENV !== 'production') return

  const healthUrl = `${selfUrl.replace(/\/$/, '')}/health`

  console.log(`[keepalive] Started – pinging ${healthUrl} every ${INTERVAL_MS / 60_000} min`)

  setInterval(async () => {
    // 1. Self-ping to prevent Render spin-down
    try {
      const res = await fetch(healthUrl)
      console.log(`[keepalive] Health ping → ${res.status}`)
    } catch (err) {
      console.warn('[keepalive] Health ping failed:', (err as Error).message)
    }

    // 2. Lightweight DB query to prevent Aiven MySQL idle shutdown
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('[keepalive] DB ping → ok')
    } catch (err) {
      console.warn('[keepalive] DB ping failed:', (err as Error).message)
    }
  }, INTERVAL_MS)
}
