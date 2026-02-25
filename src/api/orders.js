import { fetchApi } from './client'

/**
 * GET /api/orders — list current user's orders (auth required), newest first.
 * @returns {Promise<Array<{ id: string, orderDate: string, totalAmount: number, status: string, items: Array }>>}
 */
export async function getOrders() {
  return fetchApi('/api/orders')
}

/**
 * POST /api/orders — create order from current cart (auth required). Backend clears cart.
 * @param {Object} [body] - Optional { shippingName, shippingPhone, shippingAddressLine1, shippingAddressLine2, shippingCity, shippingState, shippingPincode, paymentMethod }
 * @returns {Promise<{ id: string, orderDate: string, totalAmount: number, status: string, items: Array }>}
 */
export async function createOrder(body = {}) {
  return fetchApi('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
