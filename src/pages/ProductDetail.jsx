import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug, getProductReviews, createProductReview, updateProductReview } from '../api/products'
import { getSiteInformation } from '../api/content'
import { getProductInformation, defaultInformation } from '../data/siteInformation'
import { useCart } from '../context/CartContext'
import { useAuthState } from '../context/AuthContext'
import { deleteReview as deleteReviewApi } from '../api/admin'
import ProductImage from '../components/ProductImage'

const HIGHLIGHTS_LABELS = {
  brand: 'Brand',
  productType: 'Product type',
  dietaryPreference: 'Dietary preference',
  keyFeatures: 'Key features',
  flavour: 'Flavour',
  ingredients: 'Ingredients',
  allergenInformation: 'Allergen information',
  weight: 'Weight',
  unit: 'Unit',
  packagingType: 'Packaging type',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [siteInfo, setSiteInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { cart, addToCart, updateQuantity } = useCart()
  const { user } = useAuthState()
  const [activeImage, setActiveImage] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editRating, setEditRating] = useState(5)
  const [editText, setEditText] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState(null)
  const [deletingReviewId, setDeletingReviewId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const quantityInCart = useMemo(
    () => (product ? (cart.find((i) => i.id === product.id)?.quantity ?? 0) : 0),
    [cart, product]
  )

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setSiteInfo(null)
    getProductBySlug(slug)
      .then((p) => {
        if (!cancelled) setProduct(p)
        return p
      })
      .then((p) => {
        if (p?.id && !cancelled) return getProductReviews(p.id)
        return []
      })
      .then((r) => { if (!cancelled) setReviews(Array.isArray(r) ? r : []) })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!product?.id) return
    let cancelled = false
    getSiteInformation(product.id)
      .then((data) => {
        if (!cancelled && data && typeof data === 'object') setSiteInfo(data)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [product?.id])

  const handleBuyNow = useCallback(() => {
    navigate('/cart')
  }, [navigate])

  const scrollToReviews = useCallback(() => {
    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault()
    if (!product?.id || !user) return
    setReviewSubmitting(true)
    setReviewError(null)
    try {
      await createProductReview(product.id, { rating: reviewRating, text: reviewText.trim() })
      setReviewRating(5)
      setReviewText('')
      const [updatedProduct, list] = await Promise.all([
        getProductBySlug(slug),
        getProductReviews(product.id),
      ])
      setProduct(updatedProduct)
      setReviews(Array.isArray(list) ? list : [])
    } catch (err) {
      setReviewError(err?.body?.message || err?.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }, [product?.id, slug, user, reviewRating, reviewText])

  const startEditReview = useCallback((review) => {
    setEditingReviewId(review.id)
    setEditRating(review.rating ?? 5)
    setEditText(review.text ?? '')
    setEditError(null)
  }, [])

  const cancelEditReview = useCallback(() => {
    setEditingReviewId(null)
    setEditError(null)
  }, [])

  const handleSaveEditReview = useCallback(async (e) => {
    e.preventDefault()
    if (!product?.id || !editingReviewId) return
    setEditSubmitting(true)
    setEditError(null)
    try {
      await updateProductReview(product.id, editingReviewId, { rating: editRating, text: editText.trim() })
      setEditingReviewId(null)
      const [updatedProduct, list] = await Promise.all([
        getProductBySlug(slug),
        getProductReviews(product.id),
      ])
      setProduct(updatedProduct)
      setReviews(Array.isArray(list) ? list : [])
    } catch (err) {
      setEditError(err?.body?.message || err?.message || 'Failed to update review')
    } finally {
      setEditSubmitting(false)
    }
  }, [product?.id, slug, editingReviewId, editRating, editText])

  const handleDeleteReview = useCallback(async (review) => {
    if (!product?.id || !window.confirm('Delete this review? This cannot be undone.')) return
    setDeletingReviewId(review.id)
    setDeleteError(null)
    try {
      await deleteReviewApi(product.id, review.id)
      const [updatedProduct, list] = await Promise.all([
        getProductBySlug(slug),
        getProductReviews(product.id),
      ])
      setProduct(updatedProduct)
      setReviews(Array.isArray(list) ? list : [])
      if (editingReviewId === review.id) setEditingReviewId(null)
    } catch (err) {
      setDeleteError(err?.body?.message || err?.message || 'Failed to delete review')
    } finally {
      setDeletingReviewId(null)
    }
  }, [product?.id, slug, editingReviewId])

  // All hooks must run unconditionally (before any early return)
  const images = useMemo(
    () => (product?.images?.length ? product.images : product?.image ? [product.image] : []),
    [product]
  )
  const discount = useMemo(
    () =>
      product?.originalPrice != null
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
    [product]
  )
  const hasProductInformation = useMemo(
    () => product?.information && typeof product.information === 'object' && Object.values(product.information).some((v) => v != null && String(v).trim() !== ''),
    [product]
  )
  const information = useMemo(
    () => (product ? (hasProductInformation ? getProductInformation(product) : (siteInfo ?? getProductInformation(product))) : defaultInformation),
    [product, siteInfo, hasProductInformation]
  )
  // Use actual loaded reviews for count and rating so we never show fake/seed numbers
  const actualReviewCount = reviews.length
  const actualRating = useMemo(() => {
    if (reviews.length === 0) return product?.rating ?? 0
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews, product?.rating])

  if (loading) {
    return (
      <div className="s2s-product-detail-loading mx-auto max-w-7xl px-4 py-20 text-center" data-page="product-detail">
        <p className="text-[var(--color-text-tertiary)]">Loading…</p>
      </div>
    )
  }
  if (error || !product) {
    return (
      <div className="s2s-product-detail-not-found mx-auto max-w-7xl px-4 py-20 text-center" data-page="product-detail" data-section="not-found">
        {error && <p className="text-red-600">{error}</p>}
        <p className="text-[var(--color-text-secondary)]">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-[var(--color-primary)] transition-colors duration-300 hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="s2s-page-product-detail mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12" data-page="product-detail" data-product-slug={product.slug}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="s2s-product-detail-back mb-6"
        data-section="back-link"
      >
        <Link
          to="/products"
          className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          ← Back to products
        </Link>
      </motion.div>

      <div className="s2s-product-detail-grid grid items-start gap-10 lg:grid-cols-2 lg:gap-16" data-section="product-detail-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="s2s-product-detail-gallery space-y-4 lg:sticky lg:top-24 lg:self-start"
          data-section="product-gallery"
        >
          <div className="s2s-product-detail-main-image aspect-square overflow-hidden rounded-2xl bg-[var(--color-bg-muted)]">
            <ProductImage
              src={images[activeImage]}
              fallbackSrc={product.fallbackImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {images.length > 1 && (
            <div className="s2s-product-detail-thumbnails flex gap-2 overflow-x-auto pb-2" data-section="product-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    activeImage === i
                      ? 'border-[var(--color-primary)]'
                      : 'border-transparent hover:border-[var(--color-border)]'
                  }`}
                >
                  <ProductImage
                    src={img}
                    fallbackSrc={product.fallbackImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="s2s-product-detail-info flex flex-col gap-6"
          data-section="product-info"
        >
          <div className="flex flex-col gap-3">
            <div className="s2s-product-detail-badges flex items-center gap-2">
              {discount > 0 && (
                <span className="rounded-lg bg-[var(--color-accent)]/15 px-2.5 py-1 text-sm font-medium text-[var(--color-accent)]">
                  −{discount}% off
                </span>
              )}
              <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-primary)] sm:text-4xl">
              {product.name}
            </h1>
            {product.netQty && (
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text)]">Net Qty:</span> {product.netQty}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text)]">Ratings</span> {actualRating}
              </span>
              <button
                type="button"
                onClick={scrollToReviews}
                className="cursor-pointer text-left text-[var(--color-text-secondary)] underline-offset-2 transition-colors hover:text-[var(--color-primary)] hover:underline"
              >
                <span className="font-medium text-[var(--color-text)]">Reviews</span> ({actualReviewCount})
              </button>
            </div>
            <p className="text-lg text-[var(--color-text-secondary)] leading-snug">
              {product.description}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[var(--color-text)]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice != null && (
                <span className="text-lg text-[var(--color-text-tertiary)] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="s2s-product-detail-actions flex flex-wrap items-center gap-4" data-section="quantity-and-cart">
            <div className="s2s-product-detail-quantity flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantityInCart <= 0}
                onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                className="flex h-12 w-12 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-[var(--color-text-secondary)]"
              >
                −
              </button>
              <span className="w-12 text-center font-medium tabular-nums" aria-live="polite">
                {quantityInCart}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => addToCart(product, 1)}
                className="flex h-12 w-12 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                +
              </button>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={() => addToCart(product, 1)}
              className="s2s-btn-secondary rounded-full px-8 py-3.5 text-base"
            >
              Add to cart
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={handleBuyNow}
              className="s2s-btn-shadow rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Buy now
            </motion.button>
            </div>
          </div>

          {/* Highlights card — right column */}
          {product.highlights && Object.keys(product.highlights).length > 0 && (
            <section
              className="s2s-product-highlights"
              data-section="highlights"
              aria-labelledby="highlights-heading"
            >
              <h2 id="highlights-heading" className="mb-4 text-xl font-bold tracking-tight text-[var(--color-primary)] sm:text-2xl">
                Highlights
              </h2>
              <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(product.highlights).map(([key, value]) => {
                    if (value == null || String(value).trim() === '') return null
                    const label = HIGHLIGHTS_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
                    return (
                      <div key={key} className="border-b border-[var(--color-border-subtle)] pb-4 last:border-0 last:pb-0 sm:even:border-l sm:even:pl-6 [&:nth-child(2n)]:sm:border-b-[var(--color-border-subtle)]">
                        <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                          {label}
                        </dt>
                        <dd className="mt-1 text-[var(--color-text)]">
                          {value}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            </section>
          )}

          {/* Information card — right column */}
          <section
            className="s2s-product-information"
            data-section="information"
            aria-labelledby="information-heading"
          >
            <h2 id="information-heading" className="mb-4 text-xl font-bold tracking-tight text-[var(--color-primary)] sm:text-2xl">
              Information
            </h2>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <dl className="space-y-5">
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Disclaimer</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text-secondary)]">{information.disclaimer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Customer care details</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm text-[var(--color-text)]">{information.customerCareDetails}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Seller name</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.sellerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Seller address</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.sellerAddress}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Seller license no.</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.sellerLicenseNo}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Manufacturer name</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.manufacturerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Country of origin</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.countryOfOrigin}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Shelf life</dt>
                  <dd className="mt-1 text-sm text-[var(--color-text)]">{information.shelfLife}</dd>
                </div>
              </dl>
            </div>
          </section>
        </motion.div>
      </div>

      {/* Reviews section — scroll target when clicking review count */}
      <section
        id="product-reviews"
        className="s2s-product-reviews mt-16 border-t border-[var(--color-border-subtle)] pt-12"
        data-section="reviews"
        aria-labelledby="reviews-heading"
      >
        <motion.h2
          id="reviews-heading"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold tracking-tight text-[var(--color-primary)] sm:text-3xl"
        >
          Customer reviews
        </motion.h2>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          {actualReviewCount} {actualReviewCount === 1 ? 'review' : 'reviews'} · Rating {actualRating}
        </p>

        {/* Add review: only for logged-in users */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="mt-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Write a review</h3>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                required
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="review-text" className="block text-sm font-medium text-[var(--color-text-secondary)]">Your review</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                placeholder="Share your experience with this product..."
              />
            </div>
            {reviewError && (
              <p className="mt-2 text-sm text-red-600" role="alert">{reviewError}</p>
            )}
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {reviewSubmitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        ) : (
          <p className="mt-6 text-[var(--color-text-secondary)]">
            <Link to="/login" className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline">Log in</Link>
            {' '}to add a review.
          </p>
        )}

        {deleteError && (
          <p className="mt-4 text-sm text-red-600" role="alert">{deleteError}</p>
        )}
        <ul className="mt-8 space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.li
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
              >
                {editingReviewId === review.id ? (
                  <form onSubmit={handleSaveEditReview} className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-sm font-medium text-[var(--color-text-secondary)]">Rating</label>
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                        required
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`edit-review-text-${review.id}`} className="block text-sm font-medium text-[var(--color-text-secondary)]">Your review</label>
                      <textarea
                        id={`edit-review-text-${review.id}`}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        required
                        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                      />
                    </div>
                    {editError && <p className="text-sm text-red-600" role="alert">{editError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={editSubmitting}
                        className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      >
                        {editSubmitting ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditReview}
                        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-[var(--color-text)]">{review.author}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-600" aria-label={`${review.rating} out of 5 stars`}>
                          ★ {review.rating}
                        </span>
                        <time className="text-sm text-[var(--color-text-tertiary)]" dateTime={review.date}>
                          {review.date}
                        </time>
                        {review.ownedByCurrentUser && (
                          <button
                            type="button"
                            onClick={() => startEditReview(review)}
                            className="text-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        {user?.role === 'ADMIN' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review)}
                            disabled={deletingReviewId === review.id}
                            className="text-sm font-medium text-red-600 underline-offset-2 hover:underline disabled:opacity-60"
                          >
                            {deletingReviewId === review.id ? 'Deleting…' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-[var(--color-text-secondary)]">{review.text}</p>
                  </>
                )}
              </motion.li>
            ))
          ) : (
            <li className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-secondary)]">
              No reviews yet. Be the first to review this product!
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
