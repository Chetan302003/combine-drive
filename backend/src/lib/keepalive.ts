import { prisma } from '../config/prisma.js'

const INTERVAL_MS = 14 * 60 * 1000 // 14 minutes – just under Render's 15-min idle cutoff

export interface KeepaliveState {
  isRunning: boolean
  selfUrl: string
  healthUrl: string
  intervalMinutes: number
  totalPings: number
  lastPingAt: string | null
  lastPingStatus: 'ok' | 'error' | null
  lastPingLatencyMs: number | null
  lastPingError: string | null
  lastDbStatus: 'ok' | 'error' | null
  lastDbLatencyMs: number | null
  lastDbError: string | null
}

const state: KeepaliveState = {
  isRunning: false,
  selfUrl: '',
  healthUrl: '',
  intervalMinutes: 14,
  totalPings: 0,
  lastPingAt: null,
  lastPingStatus: null,
  lastPingLatencyMs: null,
  lastPingError: null,
  lastDbStatus: null,
  lastDbLatencyMs: null,
  lastDbError: null,
}

let intervalTimer: NodeJS.Timeout | null = null

/**
 * Triggers an immediate keepalive ping (both HTTP self-ping and DB SELECT 1 query).
 * Can be called manually from Settings page or automatically by interval.
 */
export async function performKeepalivePing(): Promise<{
  success: boolean
  pingStatus: number | null
  pingLatencyMs: number | null
  pingError?: string
  dbStatus: 'ok' | 'error'
  dbLatencyMs: number | null
  dbError?: string
  timestamp: string
}> {
  const targetUrl = state.healthUrl || 'http://localhost:4000/health'
  let pingStatus: number | null = null
  let pingLatencyMs: number | null = null
  let pingError: string | undefined = undefined

  // 1. HTTP ping to keep Render web service awake
  const pingStart = Date.now()
  try {
    const res = await fetch(targetUrl, { signal: AbortSignal.timeout(10000) })
    pingLatencyMs = Date.now() - pingStart
    pingStatus = res.status
    state.lastPingStatus = res.ok ? 'ok' : 'error'
    state.lastPingLatencyMs = pingLatencyMs
    state.lastPingError = res.ok ? null : `HTTP ${res.status}`
  } catch (err: any) {
    pingLatencyMs = Date.now() - pingStart
    pingError = err.message || 'Ping failed'
    state.lastPingStatus = 'error'
    state.lastPingLatencyMs = pingLatencyMs
    state.lastPingError = pingError || null
  }

  // 2. DB ping to prevent Aiven MySQL idle disconnect/shutdown
  let dbStatus: 'ok' | 'error' = 'ok'
  let dbLatencyMs: number | null = null
  let dbError: string | undefined = undefined

  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - dbStart
    dbStatus = 'ok'
    state.lastDbStatus = 'ok'
    state.lastDbLatencyMs = dbLatencyMs
    state.lastDbError = null
  } catch (err: any) {
    dbLatencyMs = Date.now() - dbStart
    dbStatus = 'error'
    dbError = err.message || 'Database ping failed'
    state.lastDbStatus = 'error'
    state.lastDbLatencyMs = dbLatencyMs
    state.lastDbError = dbError || null
  }

  const now = new Date().toISOString()
  state.lastPingAt = now
  state.totalPings += 1

  return {
    success: (pingStatus !== null && pingStatus >= 200 && pingStatus < 400) && dbStatus === 'ok',
    pingStatus,
    pingLatencyMs,
    pingError,
    dbStatus,
    dbLatencyMs,
    dbError,
    timestamp: now,
  }
}

/**
 * Returns current snapshot of keepalive state.
 */
export function getKeepaliveState(): KeepaliveState {
  return { ...state }
}

/**
 * Starts a periodic keepalive loop that:
 *  1. Pings the backend's own /health endpoint so Render doesn't spin the service down.
 *  2. Runs a lightweight DB query so Aiven's free-tier MySQL doesn't go idle.
 */
export function startKeepalive(selfUrl: string): void {
  const cleanUrl = selfUrl.replace(/\/$/, '')
  state.selfUrl = cleanUrl
  state.healthUrl = `${cleanUrl}/health`

  // In production (or if explicitly enabled), activate the recurring background bot
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_KEEPALIVE === 'true') {
    state.isRunning = true
    console.log(`[uptime-bot] Started – pinging ${state.healthUrl} every ${state.intervalMinutes} min`)

    if (intervalTimer) clearInterval(intervalTimer)

    intervalTimer = setInterval(async () => {
      try {
        const result = await performKeepalivePing()
        console.log(`[uptime-bot] Ping completed: Render=${result.pingStatus} (${result.pingLatencyMs}ms), Aiven DB=${result.dbStatus} (${result.dbLatencyMs}ms)`)
      } catch (err) {
        console.warn('[uptime-bot] Ping cycle error:', (err as Error).message)
      }
    }, INTERVAL_MS)
  } else {
    state.isRunning = false
    console.log(`[uptime-bot] Initialized in ${process.env.NODE_ENV || 'development'} mode for manual triggers (${state.healthUrl})`)
  }
}
