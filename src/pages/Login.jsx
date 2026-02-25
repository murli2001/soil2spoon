import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthActions } from '../context/AuthContext'
import * as authApi from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [forgotMessage, setForgotMessage] = useState(null)
  const [forgotResetLink, setForgotResetLink] = useState(null)
  const [forgotError, setForgotError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.body?.message || err.message || 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotMessage(null)
    setForgotResetLink(null)
    setForgotSubmitting(true)
    try {
      const res = await authApi.forgotPassword(forgotEmail.trim())
      setForgotMessage(res.message || 'If an account exists with this email, you will receive a password reset link.')
      if (res.resetLink) setForgotResetLink(res.resetLink)
      if (!res.resetLink) setForgotEmail('')
    } catch (err) {
      setForgotError(err.body?.message || err.message || 'Request failed')
    } finally {
      setForgotSubmitting(false)
    }
  }

  return (
    <div className="s2s-page-login mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-16 sm:py-24" data-page="login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="s2s-login-form-wrap"
        data-section="login-form"
      >
        <h1 className="s2s-login-title text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          Sign in
        </h1>
        <p className="s2s-login-subtitle mt-2 text-[var(--color-text-secondary)]">
          Enter your credentials to access your account.
        </p>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <form id="login-form" onSubmit={handleSubmit} className="s2s-login-form mt-10 space-y-6" data-section="login-form-fields">
          <div className="s2s-login-field s2s-login-field-email">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              placeholder="you@example.com"
            />
          </div>
          <div className="s2s-login-field s2s-login-field-password">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 pr-12 text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-right">
              <button
                type="button"
                onClick={() => { setForgotOpen(true); setForgotMessage(null); setForgotError(''); setForgotEmail(email); }}
                className="text-sm font-medium text-[var(--color-primary)] transition-colors duration-300 hover:underline"
              >
                Forgot password?
              </button>
            </p>
          </div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="s2s-btn-primary w-full rounded-full py-3.5 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Don’t have an account?{' '}
          <Link to="/signup" className="font-medium text-[var(--color-primary)] transition-colors duration-300 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>

      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="s2s-forgot-modal w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl"
            data-section="forgot-password-modal"
          >
            <h2 id="forgot-password-title" className="text-xl font-semibold text-[var(--color-text)]">
              Forgot password
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-[var(--color-text)]">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3.5 text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  placeholder="you@example.com"
                />
              </div>
              {forgotError && <p className="text-sm text-red-600">{forgotError}</p>}
              {forgotMessage && <p className="text-sm text-[var(--color-text-secondary)]">{forgotMessage}</p>}
              {forgotResetLink && (
                <div className="rounded-xl bg-[var(--color-bg-muted)] p-4 text-sm">
                  <p className="font-medium text-[var(--color-text)]">Email is not configured on the server. Use this link to reset your password:</p>
                  <a href={forgotResetLink} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-[var(--color-primary)] hover:underline">
                    {forgotResetLink}
                  </a>
                  <p className="mt-2 text-[var(--color-text-tertiary)]">Copy the link or open it in a new tab. It expires in 1 hour.</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setForgotOpen(false); setForgotMessage(null); setForgotResetLink(null); setForgotError(''); }}
                  className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-muted)]"
                >
                  Close
                </button>
                <motion.button
                  type="submit"
                  disabled={forgotSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="s2s-btn-primary flex-1 rounded-full py-3 disabled:opacity-60"
                >
                  {forgotSubmitting ? 'Sending…' : 'Send reset link'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
