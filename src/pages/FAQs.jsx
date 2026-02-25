import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'
import { getFaqs } from '../api/content'
import { faqs as staticFaqs } from '../data/faqs'

export default function FAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getFaqs()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setFaqs(data)
        else if (!cancelled) setFaqs(staticFaqs)
      })
      .catch(() => {
        if (!cancelled) setFaqs(staticFaqs)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const list = faqs.length > 0 ? faqs : staticFaqs

  return (
    <div className="s2s-page-faqs mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-page="faqs">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="mb-8 text-[var(--color-text-secondary)]">
          Quick answers to common questions about orders, shipping, returns and more.
        </p>
        {loading ? (
          <p className="text-[var(--color-text-tertiary)]">Loading FAQs…</p>
        ) : (
          <FAQ faqs={list} id="faqs" />
        )}
      </motion.div>
    </div>
  )
}
