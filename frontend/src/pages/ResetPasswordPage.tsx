import { useState, type FormEvent } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from '@/components/drive/BrandLogo'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')?.trim() || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ token, password }),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-slate-900">Invalid Reset Link</h1>
          <p className="mt-2 text-sm text-slate-600">
            The password reset link is missing or malformed. Please request a new link from the forgot password page.
          </p>
          <div className="mt-6">
            <Link to="/forgot-password">
              <Button className="w-full">Request New Link</Button>
            </Link>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-11 w-11" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
            <p className="text-sm text-slate-500">Choose a new secure password.</p>
          </div>
        </div>

        {success ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Password Changed!</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your password has been successfully updated. You can now sign in to Combine Drive using your new password.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/login')} className="w-full">
                Sign In Now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              New Password
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Confirm New Password
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error ? (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </p>
            ) : null}

            <Button disabled={loading} className="w-full">
              {loading ? 'Updating password...' : 'Update Password'}
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
          <Link to="/terms" className="hover:text-slate-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-slate-600 transition">Privacy Policy</Link>
        </div>
      </Card>
    </main>
  )
}
