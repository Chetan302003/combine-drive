import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GoogleLogo } from '@/components/auth/GoogleLogo'
import { BrandLogo } from '@/components/drive/BrandLogo'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import { setAuthSession, type AuthUser } from '@/lib/auth'

type AuthResponse = { accessToken: string; refreshToken: string; user: AuthUser }

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function continueWithGoogle() {
    setGoogleLoading(true)
    setError('')
    try {
      const data = await apiFetch<{ url: string }>('/auth/google/url', { skipAuth: true })
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
      setGoogleLoading(false)
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', skipAuth: true, body: JSON.stringify({ email, password }) })
      setAuthSession(data.accessToken, data.refreshToken, data.user)
      navigate('/all-files')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-11 w-11" />
          <div><h1 className="text-2xl font-extrabold">Login</h1><p className="text-sm text-slate-500">Access your Combined gateway.</p></div>
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">Email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="grid gap-2 text-sm font-semibold">Password<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
          <Button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        </form>
        <div className="mt-4 grid gap-3">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
          <Button variant="outline" disabled={googleLoading} onClick={continueWithGoogle}><GoogleLogo />{googleLoading ? 'Redirecting...' : 'Continue with Google'}</Button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">No account? <Link className="font-bold text-blue-600" to="/register">Register</Link></p>
        <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
          <Link to="/terms" className="hover:text-slate-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-slate-600 transition">Privacy Policy</Link>
        </div>
      </Card>
    </main>
  )
}
