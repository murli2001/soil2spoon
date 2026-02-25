import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartState } from '../context/CartContext'

function AddToCartToast() {
  const { toastMessage } = useCartState()

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-on-primary)] shadow-[var(--shadow-card)]"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(AddToCartToast)
