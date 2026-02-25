import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuthState, useAuthActions } from '../context/AuthContext'

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
]

function navLinksWithAdmin(user) {
  const admin = user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin' }] : []
  return [...navLinks, ...admin]
}

export default function Navbar() {
  const { cartCount } = useCart()
  const { user } = useAuthState()
  const { logout } = useAuthActions()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onResize = () => setMobileMenuOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mobileMenuOpen])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) {
        navigate(`/products?search=${encodeURIComponent(q)}`)
        setSearchQuery('')
      } else {
        navigate('/products')
      }
    },
    [searchQuery, navigate]
  )

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="s2s-navbar sticky top-0 z-50 border-b border-[var(--color-primary-hover)] bg-[var(--color-navbar-bg)] text-[var(--color-on-primary)] transition-all duration-300"
      data-section="navbar"
    >
      <nav className="s2s-navbar-inner mx-auto flex h-14 min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="s2s-logo-link flex min-w-0 shrink items-center transition-opacity hover:opacity-90" aria-label="Soil2Spoon home" onClick={scrollToTop}>
          <img
            src="https://res.cloudinary.com/ddhzj2jfw/image/upload/v1771675428/soil2spoon_white_kbka6v.svg"
            alt="Soil2Spoon"
            className="s2s-logo h-9 max-w-[130px] object-contain object-left sm:h-12 sm:max-w-none sm:max-h-[56px] md:h-14 md:max-h-[64px]"
            width={280}
            height={80}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <span className="s2s-logo-fallback hidden text-lg font-semibold tracking-tight text-[var(--color-on-primary)] sm:text-xl">Soil2Spoon</span>
        </Link>
        <form onSubmit={handleSearch} className="s2s-nav-search hidden flex-1 max-w-xs mx-4 md:flex">
          <div className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-[var(--color-on-primary)]/30 bg-[var(--color-on-primary)]/10 py-2 pl-4 pr-10 text-sm text-[var(--color-on-primary)] placeholder:text-[var(--color-on-primary)]/60 focus:border-[var(--color-on-primary)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-on-primary)]/20"
              aria-label="Search products"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-on-primary)]/80 hover:bg-[var(--color-on-primary)]/20 hover:text-[var(--color-on-primary)]" aria-label="Search">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </form>
        <div className="s2s-nav-links hidden items-center gap-8 md:flex">
          {navLinksWithAdmin(user).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors duration-300 hover:bg-[var(--color-navbar-hover)] hover:text-[var(--color-on-primary)] text-[var(--color-on-primary)]"
              onClick={to === '/' ? scrollToTop : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="s2s-nav-actions flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-2xl p-2 text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)] md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
          <Link to="/products" className="rounded-2xl p-2 text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)] md:hidden" aria-label="Search products">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </Link>
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--color-on-primary)]/90 sm:block">{user.name}</span>
              <button type="button" onClick={() => { logout(); navigate('/') }} className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)] sm:block">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)] sm:block">Sign in</Link>
          )}
          <Link to="/dashboard" className="rounded-2xl p-2 text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)]" aria-label="Account">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
          <Link to="/cart" className="relative rounded-2xl p-2 text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-navbar-hover)]" aria-label="Cart">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-medium text-white shadow-sm">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              aria-hidden="true"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="s2s-navbar-mobile-menu fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col gap-6 border-l border-[var(--color-primary-hover)] bg-[var(--color-navbar-bg)] p-6 pt-20 shadow-xl md:hidden"
              data-section="navbar-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              <nav className="flex flex-col gap-2">
                {navLinksWithAdmin(user).map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="rounded-xl px-4 py-3 text-base font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-navbar-hover)]"
                    onClick={() => { to === '/' && scrollToTop(); closeMobileMenu(); }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-[var(--color-on-primary)]/20 pt-4">
                {user ? (
                  <>
                    <p className="px-4 py-2 text-sm text-[var(--color-on-primary)]/90">{user.name}</p>
                    <button
                      type="button"
                      onClick={() => { logout(); navigate('/'); closeMobileMenu(); }}
                      className="w-full rounded-xl px-4 py-3 text-left text-base font-medium text-[var(--color-on-primary)] hover:bg-[var(--color-navbar-hover)]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block rounded-xl px-4 py-3 text-base font-medium text-[var(--color-on-primary)] hover:bg-[var(--color-navbar-hover)]"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
