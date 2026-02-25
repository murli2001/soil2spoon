import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getContactInfo } from '../api/content'

const fallbackContact = {
  email: 'support@soil2spoon.com',
  phone: '+91 98765 43210',
  address: '123 Spice Lane, Andheri East, Mumbai, Maharashtra 400069',
  hours: 'Mon–Sat: 9:00 AM – 6:00 PM IST',
}

function normalizeContact(data) {
  if (!data || typeof data !== 'object') return null
  return {
    email: data.email ?? fallbackContact.email,
    phone: data.phone ?? fallbackContact.phone,
    address: data.address ?? fallbackContact.address,
    hours: data.hours ?? fallbackContact.hours,
  }
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getContactInfo()
      .then((data) => {
        if (!cancelled) setInfo(normalizeContact(data) ?? fallbackContact)
      })
      .catch(() => {
        if (!cancelled) setInfo(fallbackContact)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const data = info ?? fallbackContact

  return (
    <div className="s2s-page-contact mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-page="contact">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
          Contact us
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Have a question or feedback? Reach out — we’re here to help.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Get in touch</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-[var(--color-text-tertiary)]">Email</dt>
                <dd>
                  <a href={`mailto:${data.email}`} className="text-[var(--color-primary)] hover:underline">
                    {data.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-text-tertiary)]">Phone</dt>
                <dd>
                  <a href={`tel:${String(data.phone).replace(/\s/g, '')}`} className="text-[var(--color-primary)] hover:underline">
                    {data.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-text-tertiary)]">Address</dt>
                <dd className="text-[var(--color-text-secondary)]">{data.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-text-tertiary)]">Business hours</dt>
                <dd className="text-[var(--color-text-secondary)]">{data.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Send a message</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              We’ll get back to you within 1–2 business days.
            </p>
            {submitted ? (
              <p className="mt-6 text-sm font-medium text-[var(--color-accent)]">
                Thanks! Your message has been received. (This is a demo — no message was sent.)
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--color-text)]">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--color-text)]">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--color-text)]">Message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    placeholder="How can we help?"
                  />
                </div>
                <button type="submit" className="s2s-btn-primary rounded-full px-6 py-2.5 text-sm">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--color-text-tertiary)]">
          <Link to="/" className="text-[var(--color-primary)] hover:underline">Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
