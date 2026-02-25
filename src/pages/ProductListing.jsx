import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { getProducts, getCategories } from '../api/products'
import { getSearchExpansion, productMatchesSearch } from '../data/searchKeywords'

export default function ProductListing() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getCategories()
      .then((cats) => { if (!cancelled) setCategories(cats || []) })
      .catch((err) => { if (!cancelled) setError(err.message) })
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProducts({ category: category || undefined, size: 100 })
      .then((res) => {
        if (!cancelled) setProducts(res.content || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [category])

  const filtered = useMemo(() => {
    if (!search) return products
    const { categoryIds, terms } = getSearchExpansion(search)
    return products.filter((p) => productMatchesSearch(p, search, terms, categoryIds))
  }, [products, search])

  const currentCategory = useMemo(
    () => categories.find((c) => c.id === category),
    [categories, category]
  )

  return (
    <div className="s2s-page-products s2s-product-listing mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14" data-page="product-listing">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="s2s-product-listing-header mb-10"
        data-section="listing-header"
      >
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
          {search ? `Search: "${searchParams.get('search')}"` : currentCategory ? currentCategory.name : 'All products'}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </motion.div>

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="s2s-product-listing-filters mb-10 flex flex-wrap gap-2"
        data-section="category-filters"
      >
        <Link
          to="/products"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            !category
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/products?category=${c.id}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              category === c.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </motion.div>

      {error && <p className="mb-6 text-red-600">{error}</p>}
      {loading ? (
        <p className="py-16 text-center text-[var(--color-text-tertiary)]">Loading…</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="s2s-product-listing-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-section="product-grid"
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="s2s-product-listing-empty py-16 text-center text-[var(--color-text-secondary)]" data-section="empty-state">
          {search ? 'No products match your search. Try a different term.' : 'No products in this category yet.'}
        </p>
      )}
    </div>
  )
}
