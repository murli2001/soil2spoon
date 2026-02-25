import { fetchApi } from './client'

/**
 * GET /api/cart — returns current user's cart (auth required).
 * @returns {Promise<Array<{ id: string, name: string, slug: string, price: number, image?: string, fallbackImage?: string, quantity: number }>>}
 */
export async function getCart() {
  return fetchApi('/api/cart')
}

/**
 * PUT /api/cart — replace entire cart (auth required).
 * @param {Array<{ productId: number, quantity: number }>} items
 * @returns {Promise<Array>} new cart
 */
export async function setCart(items) {
  return fetchApi('/api/cart', {
    method: 'PUT',
    body: JSON.stringify(items),
  })
}
