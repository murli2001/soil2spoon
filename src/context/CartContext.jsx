import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useAuthState } from './AuthContext'
import * as cartApi from '../api/cart'

const CartStateContext = createContext(null)
const CartActionsContext = createContext(null)
const TOAST_DURATION_MS = 2500

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.payload.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
            : i
        )
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }]
    }
    case 'UPDATE_QUANTITY': {
      return state
        .map((i) =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(0, action.payload.quantity) } : i
        )
        .filter((i) => i.quantity > 0)
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.payload.id)
    case 'CLEAR':
      return []
    case 'SET_CART':
      return Array.isArray(action.payload) ? action.payload : []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { user } = useAuthState()
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimeoutRef = useRef(null)
  const skipSyncRef = useRef(false)
  const hasLoadedCartRef = useRef(false)

  useEffect(() => {
    if (!user) {
      hasLoadedCartRef.current = false
      return
    }
    let cancelled = false
    hasLoadedCartRef.current = true
    cartApi.getCart()
      .then((data) => {
        if (!cancelled) {
          skipSyncRef.current = true
          dispatch({ type: 'SET_CART', payload: data || [] })
        }
      })
      .catch(() => { if (!cancelled) hasLoadedCartRef.current = false })
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (!user) return
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }
    const items = cart.map((item) => ({
      productId: Number(item.id),
      quantity: item.quantity,
    }))
    cartApi.setCart(items).catch(() => {})
  }, [user, cart])

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: 'ADD',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        fallbackImage: product.fallbackImage,
        quantity,
      },
    })
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToastMessage('Added to cart')
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, TOAST_DURATION_MS)
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: { id } })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  const stateValue = useMemo(() => {
    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
    return { cart, cartTotal, cartCount, toastMessage }
  }, [cart, toastMessage])

  const setCartFromApi = useCallback((items) => {
    skipSyncRef.current = true
    dispatch({ type: 'SET_CART', payload: items || [] })
  }, [])

  const actionsValue = useMemo(
    () => ({ addToCart, updateQuantity, removeFromCart, clearCart, setCartFromApi }),
    [addToCart, updateQuantity, removeFromCart, clearCart, setCartFromApi]
  )

  return (
    <CartStateContext.Provider value={stateValue}>
      <CartActionsContext.Provider value={actionsValue}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCartState() {
  const ctx = useContext(CartStateContext)
  if (!ctx) throw new Error('useCartState must be used within CartProvider')
  return ctx
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext)
  if (!ctx) throw new Error('useCartActions must be used within CartProvider')
  return ctx
}

export function useCart() {
  return { ...useCartState(), ...useCartActions() }
}
