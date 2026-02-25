import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuthState } from '../context/AuthContext'
import ProductImage from '../components/ProductImage'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuthState()
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="s2s-page-cart s2s-cart-empty mx-auto max-w-2xl px-4 py-24 text-center"
        data-page="cart"
        data-section="cart-empty"
      >
        <h1 className="s2s-cart-empty-title text-2xl font-bold text-[var(--color-primary)]">Your cart is empty</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Add items from the store to get started.
        </p>
        <Link
          to="/products"
          className="s2s-btn-primary mt-8 inline-block rounded-full px-8 py-3.5"
        >
          Shop products
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="s2s-page-cart mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14" data-page="cart">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="s2s-cart-title text-3xl font-bold tracking-tight text-[var(--color-primary)]"
        data-section="cart-title"
      >
        Cart
      </motion.h1>
      <p className="s2s-cart-count mt-2 text-[var(--color-text-secondary)]">
        {cartCount} {cartCount === 1 ? 'item' : 'items'}
      </p>

      <div className="s2s-cart-content mt-10 grid gap-8 lg:grid-cols-3" data-section="cart-content">
        <div className="s2s-cart-items-col lg:col-span-2">
          <ul className="s2s-cart-items-list space-y-4" data-section="cart-items-list">
            {cart.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="s2s-cart-item flex gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5"
                data-section="cart-item"
                data-item-id={item.id}
              >
                <div className="s2s-cart-item-image h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-bg-muted)] sm:h-28 sm:w-28">
                  <ProductImage
                    src={item.image}
                    fallbackSrc={item.fallbackImage}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="s2s-cart-item-details min-w-0 flex-1">
                  <Link
                    to={`/products/${item.slug}`}
                    className="font-medium text-[var(--color-text)] hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-[var(--color-text-secondary)]">₹{item.price.toLocaleString('en-IN')} each</p>
                    <div className="s2s-cart-item-actions mt-3 flex flex-wrap items-center gap-3">
                    <div className="s2s-cart-item-quantity flex items-center rounded-xl border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-[var(--color-text-tertiary)] transition-colors duration-300 hover:text-[var(--color-secondary)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-text)]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="s2s-cart-summary-col lg:col-span-1"
          data-section="cart-summary"
        >
          <div id="order-summary" className="s2s-cart-order-summary sticky top-24 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="s2s-cart-order-summary-title text-lg font-bold text-[var(--color-primary)]">Order summary</h2>
            <div className="s2s-cart-order-summary-rows mt-4 space-y-2 border-t border-[var(--color-border-subtle)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="font-medium text-[var(--color-text)]">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Shipping</span>
                <span className="font-medium text-[var(--color-text)]">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-[var(--color-border-subtle)] pt-4 text-lg font-semibold">
              <span>Total</span>
              <span className="text-[var(--color-text)]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="s2s-btn-primary mt-6 w-full rounded-full py-3.5"
              >
                Place order
              </button>
            ) : (
              <Link
                to="/login"
                className="s2s-btn-primary mt-6 block w-full rounded-full py-3.5 text-center"
              >
                Sign in to place order
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
