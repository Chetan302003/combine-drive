import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from '@/components/drive/BrandLogo'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiFetch<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process password reset request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-11 w-11" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password</h1>
            <p className="text-sm text-slate-500">Reset your Combine Drive access.</p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Check your inbox</h2>
            <p className="mt-2 text-sm text-slate-600">
              If an account is associated with <strong className="text-slate-800">{email}</strong>, you will receive an email with instructions to reset your password shortly.
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
              The link is valid for <strong>15 minutes</strong>. Don't forget to check your spam or junk folder if you don't see it.
            </div>
            <div className="mt-6 grid gap-2">
              <Link to="/login">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1"
              >
                Send to a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Enter the email address linked to your account and we’ll send you a secure link to reset your password.
            </p>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Email Address
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </label>

              {error ? (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </p>
              ) : null}

              <Button disabled={loading} className="w-full">
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          </>
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
