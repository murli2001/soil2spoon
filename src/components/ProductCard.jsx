import { memo, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'

function ProductCard({ product, index = 0 }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
  const quantityInCart = useMemo(
    () => cart.find((i) => i.id === product.id)?.quantity ?? 0,
    [cart, product.id]
  )
  const discount = useMemo(
    () =>
      product.originalPrice != null
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
    [product.originalPrice, product.price]
  )
  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault()
      addToCart(product)
    },
    [addToCart, product]
  )
  const handleRemove = useCallback(
    (e) => {
      e.preventDefault()
      removeFromCart(product.id)
    },
    [removeFromCart, product.id]
  )
  const handleIncrease = useCallback(
    (e) => {
      e.preventDefault()
      updateQuantity(product.id, quantityInCart + 1)
    },
    [updateQuantity, product.id, quantityInCart]
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="s2s-product-card group flex flex-col overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] transition-all duration-300 ease-out hover:shadow-[var(--shadow-card-hover)]"
      data-section="product-card"
      data-product-id={product.id}
      data-product-slug={product.slug}
    >
      <Link to={`/products/${product.slug}`} className="s2s-product-card-link block overflow-hidden rounded-t-2xl">
        <motion.div
          className="s2s-product-card-image-wrap aspect-square w-full overflow-hidden bg-[var(--color-bg-muted)]"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <ProductImage
            src={product.image}
            fallbackSrc={product.fallbackImage}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </Link>
      <div className="s2s-product-card-body flex flex-1 flex-col p-5 sm:p-6">
        <div className="s2s-product-card-badges mb-2 flex items-center gap-2">
          {discount > 0 && (
            <span className="rounded-lg bg-[var(--color-accent)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
              −{discount}%
            </span>
          )}
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {product.category}
          </span>
        </div>
        <Link to={`/products/${product.slug}`} className="group/link">
          <h3 className="font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover/link:text-[var(--color-primary)] text-lg sm:text-xl">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">
            ★ {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="s2s-product-card-actions mt-auto flex items-end justify-between gap-4 pt-4">
          <div className="s2s-product-card-price flex items-baseline gap-2">
            <span className="text-xl font-semibold text-[var(--color-text)]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice != null && (
              <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {quantityInCart > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="s2s-product-card-quantity flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface)] px-2 py-2 sm:gap-3 sm:px-3"
            >
              <button
                type="button"
                onClick={handleRemove}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                aria-label="Remove from cart"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-semibold text-[var(--color-text)]" aria-live="polite">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                aria-label="Add one more"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              className="s2s-btn-secondary rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              Add to cart
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default memo(ProductCard)
