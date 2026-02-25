import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthActions } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuthActions()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(email.trim(), password, name.trim())
      navigate('/')
    } catch (err) {
      setError(err.body?.message || err.message || 'Sign up failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="s2s-page-signup mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-16 sm:py-24" data-page="signup">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="s2s-signup-form-wrap"
        data-section="signup-form"
      >
        <h1 className="s2s-signup-title text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          Create account
        </h1>
        <p className="s2s-signup-subtitle mt-2 text-[var(--color-text-secondary)]">
          Join us for a better shopping experience.
        </p>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <form id="signup-form" onSubmit={handleSubmit} className="s2s-signup-form mt-10 space-y-6" data-section="signup-form-fields">
          <div className="s2s-signup-field s2s-signup-field-name">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              placeholder="Jane Doe"
            />
          </div>
          <div className="s2s-signup-field s2s-signup-field-email">
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
          <div className="s2s-signup-field s2s-signup-field-password">
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
            <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">
              At least 6 characters.
            </p>
          </div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="s2s-btn-primary w-full rounded-full py-3.5 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-primary)] transition-colors duration-300 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
