import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ({ faqs, id: sectionId, bannerImage, bannerAlt = '' }) {
  const [openId, setOpenId] = useState(null)
  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section
      id={sectionId ?? 'faqs'}
      className="s2s-faq border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      data-section="faq"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: image */}
        <div className="s2s-faq-banner order-2 flex items-center justify-center lg:order-1">
          {bannerImage ? (
            <img src={bannerImage} alt={bannerAlt} className="s2s-faq-banner-img" />
          ) : (
            <div className="s2s-faq-banner-placeholder min-h-[240px] w-full rounded-2xl bg-[var(--color-bg-muted)]" />
          )}
        </div>

        {/* Right: FAQs */}
        <div className="s2s-faq-content order-1 flex flex-col justify-center lg:order-2">
          <h2 id="faq-heading" className="mb-8 text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
            Frequently asked questions
          </h2>
          <ul className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <li key={faq.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-bg-muted)]/50 sm:px-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <span className="font-medium text-[var(--color-text)]">{faq.question}</span>
                  <span className="shrink-0 text-[var(--color-text-tertiary)]" aria-hidden>
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--color-border-subtle)] px-5 pb-4 pt-2 sm:px-6">
                        <p className="text-[var(--color-text-secondary)]">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
          </ul>
        </div>
      </div>
    </section>
  )
}
