import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthState } from '../context/AuthContext'
import { getOrders } from '../api/orders'

function formatOrderDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return isoString
  }
}

export default function Dashboard() {
  const { user } = useAuthState()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError(null)
    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="s2s-page-dashboard mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14" data-page="dashboard">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center"
        >
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Account</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">Sign in to view your orders and account.</p>
          <Link
            to="/login"
            className="s2s-btn-primary mt-6 inline-block rounded-full px-6 py-3"
          >
            Sign in
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="s2s-page-dashboard mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14" data-page="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="s2s-dashboard-header"
        data-section="dashboard-header"
      >
        <h1 className="s2s-dashboard-title text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          Account
        </h1>
        <p className="s2s-dashboard-subtitle mt-2 text-[var(--color-text-secondary)]">
          Manage your profile and orders.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="s2s-dashboard-orders mt-10"
        data-section="order-history"
      >
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">Order history</h2>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-4 text-[var(--color-text-tertiary)]">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-[var(--color-text-secondary)]">You haven’t placed any orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-[var(--color-text)]">
                    Order #{order.id} · {formatOrderDate(order.orderDate)}
                  </span>
                  <span className="rounded-full bg-[var(--color-bg-muted)] px-3 py-1 text-sm font-medium text-[var(--color-text)]">
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
                  ₹{order.totalAmount?.toLocaleString('en-IN') ?? '—'}
                </p>
                {order.items?.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-[var(--color-border-subtle)] pt-3 text-sm text-[var(--color-text-secondary)]">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="s2s-dashboard-quick-actions mt-12 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6"
        data-section="dashboard-quick-actions"
      >
        <h2 className="s2s-dashboard-quick-actions-title font-semibold text-[var(--color-text)]">Quick actions</h2>
        <div className="s2s-dashboard-quick-actions-buttons mt-4 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-2xl bg-[var(--color-bg-muted)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
          >
            Continue shopping
          </Link>
          <Link
            to="/cart"
            className="rounded-2xl bg-[var(--color-bg-muted)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
          >
            View cart
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
