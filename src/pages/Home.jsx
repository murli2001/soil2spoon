import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import FAQ from '../components/FAQ'
import { getFeaturedProducts, getTrendingProducts, getCategories } from '../api/products'
import { getFaqs } from '../api/content'
import { faqs as staticFaqs } from '../data/faqs'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([getFeaturedProducts(), getTrendingProducts(), getCategories()])
      .then(([feat, trend, cats]) => {
        if (!cancelled) {
          setFeatured(Array.isArray(feat) ? feat : (feat?.content && Array.isArray(feat.content) ? feat.content : []))
          setTrending(Array.isArray(trend) ? trend : (trend?.content && Array.isArray(trend.content) ? trend.content : []))
          setCategories(Array.isArray(cats) ? cats : (cats?.content && Array.isArray(cats.content) ? cats.content : []))
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    getFaqs()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setFaqs(data)
        else if (!cancelled) setFaqs(staticFaqs)
      })
      .catch(() => {
        if (!cancelled) setFaqs(staticFaqs)
      })
    return () => { cancelled = true }
  }, [])

  const handleHeroClick = useCallback(() => navigate('/products'), [navigate])

  return (
    <div className="s2s-page-home" data-page="home">
      {/* Promotion block — above hero */}
      <section
        className="s2s-promo border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 py-3 sm:px-6 lg:px-8"
        data-section="promotion"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-[var(--color-text-secondary)]">
          <span>🆓 Free shipping on orders over ₹499</span>
          <span className="hidden sm:inline" aria-hidden>•</span>
          <Link to="/products?category=spices" className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline">
            Shop spices
          </Link>
          <span className="hidden sm:inline" aria-hidden>•</span>
          <Link to="/products?category=pickles" className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline">
            New pickles in
          </Link>
        </div>
      </section>

      {/* Banner section — clickable, goes to /products. Fixed size 1920×320px. */}
      <section
        className="s2s-hero s2s-banner relative h-[320px] w-full cursor-pointer overflow-hidden bg-[var(--color-bg)]"
        data-section="banner"
        onClick={handleHeroClick}
        onKeyDown={(e) => e.key === 'Enter' && handleHeroClick(e)}
        role="button"
        tabIndex={0}
        aria-label="Go to products"
      >
        <img
          src="https://res.cloudinary.com/ddhzj2jfw/image/upload/v1771950601/banner_jeosb4.png"
          alt=""
          className="h-full w-full object-cover object-center"
          width={1920}
          height={320}
        />
      </section>

      {/* Featured products */}
      <section className="s2s-featured s2s-textured-section border-t border-[var(--color-border-subtle)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" data-section="featured-products">
        <div className="s2s-featured-inner mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="s2s-featured-header mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
              Featured products
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              Handpicked Indian spices, pastes and pickles for your kitchen.
            </p>
          </motion.div>
          {error && <p className="mb-6 text-center text-red-600">{error}</p>}
          {loading ? (
            <p className="text-center text-[var(--color-text-tertiary)]">Loading…</p>
          ) : (
            <div className="s2s-featured-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-section="featured-grid">
              {(Array.isArray(featured) ? featured : []).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="s2s-categories bg-[var(--color-bg)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" data-section="categories">
        <div className="s2s-categories-inner mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl"
          >
            Shop by category
          </motion.h2>
          <div className="s2s-categories-grid grid grid-cols-3 gap-4 sm:gap-6" data-section="categories-grid">
            {!loading && (Array.isArray(categories) ? categories : []).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="s2s-category-item"
                data-section={`category-${cat.id}`}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="flex flex-col items-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-soft)] transition-all duration-300 ease-out hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card)]"
                >
                  <span className="text-4xl sm:text-5xl" role="img" aria-hidden>
                    {cat.icon}
                  </span>
                  <span className="mt-3 text-sm font-medium text-[var(--color-text)]">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="s2s-trending s2s-textured-section border-t border-[var(--color-border-subtle)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" data-section="trending">
        <div className="s2s-trending-inner mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="s2s-trending-header mb-12 flex items-end justify-between gap-4"
          >
            <div className="s2s-trending-header-text">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
                Trending now
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Indian kitchen favourites this week.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden shrink-0 text-sm font-medium text-[var(--color-primary)] transition-colors duration-300 hover:underline sm:block"
            >
              View all
            </Link>
          </motion.div>
          <div className="s2s-trending-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-section="trending-grid">
            {!loading && (Array.isArray(trending) ? trending : []).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <FAQ faqs={faqs.length > 0 ? faqs : staticFaqs} id="faqs" />
      </motion.section>
    </div>
  )
}
