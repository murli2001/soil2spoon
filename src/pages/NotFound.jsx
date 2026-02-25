import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="s2s-page-not-found mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center"
      data-page="not-found"
      data-section="not-found"
    >
      <p className="s2s-not-found-code text-6xl font-semibold tabular-nums text-[var(--color-text-tertiary)]">404</p>
      <h1 className="s2s-not-found-title mt-4 text-2xl font-semibold text-[var(--color-text)]">
        Page not found
      </h1>
      <p className="s2s-not-found-message mt-2 text-[var(--color-text-secondary)]">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="s2s-btn-primary s2s-not-found-back mt-8 inline-block rounded-full px-6 py-3"
        data-section="not-found-back-link"
      >
        Back to home
      </Link>
    </motion.div>
  )
}
