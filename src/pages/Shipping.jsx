import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getShippingPolicy } from '../api/content'

const fallbackShipping = {
  title: 'Shipping policy',
  intro: 'We deliver across India. Here is what you need to know.',
  freeOver: 499,
  flatCharge: 49,
  deliveryDays: '3–5 business days',
  zones: [
    { name: 'Metro cities', days: '2–3 business days' },
    { name: 'Rest of India', days: '4–5 business days' },
  ],
  note: 'Orders placed before 2:00 PM IST on a business day are typically dispatched the same day. You will receive an email with tracking details once your order is shipped.',
}

function normalizeShipping(data) {
  if (!data || typeof data !== 'object') return null
  return {
    title: data.title ?? fallbackShipping.title,
    intro: data.intro ?? fallbackShipping.intro,
    freeOver: Number(data.freeOver) || fallbackShipping.freeOver,
    flatCharge: Number(data.flatCharge) ?? fallbackShipping.flatCharge,
    deliveryDays: data.deliveryDays ?? fallbackShipping.deliveryDays,
    zones: Array.isArray(data.zones) && data.zones.length > 0 ? data.zones : fallbackShipping.zones,
    note: data.note ?? fallbackShipping.note,
  }
}

export default function Shipping() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getShippingPolicy()
      .then((data) => {
        if (!cancelled) setPolicy(normalizeShipping(data) ?? fallbackShipping)
      })
      .catch(() => {
        if (!cancelled) setPolicy(fallbackShipping)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const data = policy ?? fallbackShipping

  if (loading && !policy) {
    return (
      <div className="s2s-page-shipping mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-page="shipping">
        <p className="text-[var(--color-text-tertiary)]">Loading…</p>
      </div>
    )
  }

  return (
    <div className="s2s-page-shipping mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-page="shipping">
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
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Delivery charges</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
              <li>Free shipping on all orders over ₹{Number(data.freeOver).toLocaleString('en-IN')}.</li>
              <li>Flat delivery charge of ₹{data.flatCharge} for orders below ₹{data.freeOver}.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Delivery time</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Standard delivery: {data.deliveryDays}.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
              {(Array.isArray(data.zones) ? data.zones : []).map((z) => (
                <li key={z.name}><strong className="text-[var(--color-text)]">{z.name}:</strong> {z.days}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Dispatch and tracking</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {data.note}
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-[var(--color-text-tertiary)]">
          <Link to="/" className="text-[var(--color-primary)] hover:underline">Back to home</Link>
          {' · '}
          <Link to="/contact" className="text-[var(--color-primary)] hover:underline">Contact us</Link>
        </p>
      </motion.div>
    </div>
  )
}
