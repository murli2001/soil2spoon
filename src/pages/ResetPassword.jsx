import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import * as authApi from '../api/auth'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!tokenFromUrl.trim()) {
      setError('Invalid or missing reset link. Request a new one from the login page.')
      return
    }
    setSubmitting(true)
    try {
      await authApi.resetPassword(tokenFromUrl, password)
      setSuccess(true)
    } catch (err) {
      setError(err.body?.message || err.message || 'Failed to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="s2s-page-reset-password mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-16 sm:py-24" data-page="reset-password-success">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Password reset</h1>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="s2s-btn-primary mt-8 inline-block rounded-full px-8 py-3.5"
          >
            Sign in
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="s2s-page-reset-password mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-16 sm:py-24" data-page="reset-password">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="s2s-reset-form-wrap"
        data-section="reset-password-form"
      >
        <h1 className="s2s-reset-title text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          Set new password
        </h1>
        <p className="s2s-reset-subtitle mt-2 text-[var(--color-text-secondary)]">
          Enter your new password below.
        </p>

        {!tokenFromUrl.trim() && (
          <p className="mt-4 text-sm text-amber-600">
            No reset token in the URL. Use the &quot;Forgot password?&quot; link on the login page to receive a reset link.
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6" data-section="reset-password-fields">
          <div className="s2s-reset-field s2s-reset-field-password">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              New password
            </label>
            <div className="relative mt-2">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
          </div>
          <div className="s2s-reset-field s2s-reset-field-confirm">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Confirm password
            </label>
            <div className="relative mt-2">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 pr-12 text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={submitting || !tokenFromUrl.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="s2s-btn-primary w-full rounded-full py-3.5 disabled:opacity-60"
          >
            {submitting ? 'Resetting…' : 'Reset password'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          <Link to="/login" className="font-medium text-[var(--color-primary)] transition-colors duration-300 hover:underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
