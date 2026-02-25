import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const footerLinks = {
  Shop: [
    { to: '/products', label: 'All Products' },
    { to: '/products?category=spices', label: 'Spices' },
    { to: '/products?category=pastes', label: 'Pastes & Powders' },
    { to: '/products?category=pickles', label: 'Pickles' },
  ],
  Account: [
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Create Account' },
    { to: '/dashboard', label: 'Dashboard' },
  ],
  Support: [
    { to: '/faqs', label: 'FAQs' },
    { to: '/contact', label: 'Contact' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/returns', label: 'Returns' },
  ],
}

const socialLinks = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'Facebook' },
  { href: '#', label: 'Twitter' },
  { href: '#', label: 'YouTube' },
]

const SocialIcon = memo(function SocialIcon({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-on-primary)]/15 text-[var(--color-on-primary)] transition-all duration-300 hover:bg-[var(--color-secondary)] hover:text-[var(--color-on-primary)]"
      aria-label={label}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
})

function Footer() {
  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault()
    // Mock: no backend
  }, [])

  return (
    <footer className="s2s-footer border-t border-[var(--color-border-subtle)] bg-[var(--color-footer-bg)] text-[var(--color-on-primary)]" data-section="footer">
      <div className="s2s-footer-inner mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Newsletter + brand row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="s2s-footer-newsletter mb-12 flex flex-col gap-8 border-b border-[var(--color-on-primary)]/20 pb-12 lg:flex-row lg:items-end lg:justify-between"
          data-section="footer-newsletter"
        >
          <div className="s2s-footer-brand">
            <Link to="/" className="s2s-footer-logo-link inline-block" aria-label="Soil2Spoon home" onClick={scrollToTop}>
              <img
                src="https://res.cloudinary.com/ddhzj2jfw/image/upload/v1771675428/soil2spoon_white_kbka6v.svg"
                alt="Soil2Spoon"
                className="s2s-footer-logo h-14 w-auto object-contain sm:h-20"
                width={260}
                height={72}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <span className="s2s-footer-logo-fallback hidden text-lg font-semibold tracking-tight text-[var(--color-on-primary)]">
                Soil2Spoon
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-on-primary)]/80">
              Authentic Indian spices, pastes & pickles. From our kitchen to yours.
            </p>
          </div>
          <div className="s2s-footer-newsletter-form min-w-0 max-w-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-primary)]">
              Stay in the loop
            </h3>
            <p className="mt-1 text-sm text-[var(--color-on-primary)]/80">
              Get recipes, offers and updates. No spam.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-full border border-[var(--color-on-primary)]/30 bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-300 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                required
              />
              <button
                type="submit"
                className="s2s-btn-secondary shrink-0 rounded-full px-5 py-2.5 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        <div className="s2s-footer-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`s2s-footer-col s2s-footer-col-${heading.toLowerCase()}`}
              data-section={`footer-${heading.toLowerCase()}`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-primary)]">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-[var(--color-on-primary)]/80 transition-colors duration-300 hover:text-[var(--color-secondary)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social + copyright */}
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-[var(--color-on-primary)]/20 pt-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3" data-section="footer-social">
            {socialLinks.map((link) => (
              <SocialIcon key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
          <p className="text-center text-sm text-[var(--color-on-primary)]/70" data-section="footer-copyright">
            © {new Date().getFullYear()} Soil2Spoon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
