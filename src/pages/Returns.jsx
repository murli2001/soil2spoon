import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getReturnsPolicy } from '../api/content'

const fallbackReturns = {
  title: 'Returns & refunds',
  intro: 'We want you to be happy with your purchase. Here’s our returns policy.',
  windowDays: 7,
  conditions: [
    'Product must be unopened and in original packaging.',
    'Opened food items cannot be returned for hygiene reasons.',
    'To initiate a return, contact us at support@soil2spoon.com with your order number and reason.',
    'Refunds are processed within 5–7 business days after we receive the returned product.',
  ],
  contactNote: 'For any return or refund queries, reach out to support@soil2spoon.com or use our Contact page.',
}

function normalizeReturns(data) {
  if (!data || typeof data !== 'object') return null
  return {
    title: data.title ?? fallbackReturns.title,
    intro: data.intro ?? fallbackReturns.intro,
    windowDays: Number(data.windowDays) ?? fallbackReturns.windowDays,
    conditions: Array.isArray(data.conditions) && data.conditions.length > 0 ? data.conditions : fallbackReturns.conditions,
    contactNote: data.contactNote ?? fallbackReturns.contactNote,
  }
}

export default function Returns() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getReturnsPolicy()
      .then((res) => {
        if (!cancelled) setPolicy(normalizeReturns(res) ?? fallbackReturns)
      })
      .catch(() => {
        if (!cancelled) setPolicy(fallbackReturns)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const data = policy ?? fallbackReturns

  return (
    <div className="s2s-page-returns mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-page="returns">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
          {data.title}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {data.intro}
        </p>

        <div className="mt-10 space-y-8">
          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Return window</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              You may return eligible items within {data.windowDays} days of delivery for a full refund.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Conditions</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--color-text-secondary)]">
              {(Array.isArray(data.conditions) ? data.conditions : []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Need help?</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {data.contactNote}
            </p>
            <Link to="/contact" className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline">
              Go to Contact →
            </Link>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-[var(--color-text-tertiary)]">
          <Link to="/" className="text-[var(--color-primary)] hover:underline">Back to home</Link>
          {' · '}
          <Link to="/shipping" className="text-[var(--color-primary)] hover:underline">Shipping policy</Link>
        </p>
      </motion.div>
    </div>
  )
}
