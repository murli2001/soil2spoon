import { fetchApi } from './client'

/**
 * Admin product CRUD. Requires admin auth (Bearer token with role ADMIN).
 */
export async function createProduct(body) {
  return fetchApi('/api/admin/products', { method: 'POST', body: JSON.stringify(body) })
}

export async function updateProduct(id, body) {
  return fetchApi(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteProduct(id) {
  return fetchApi(`/api/admin/products/${id}`, { method: 'DELETE' })
}

/**
 * Delete any review (admin only). Updates product review count/rating on backend.
 */
export async function deleteReview(productId, reviewId) {
  return fetchApi(`/api/admin/products/${productId}/reviews/${reviewId}`, { method: 'DELETE' })
}
