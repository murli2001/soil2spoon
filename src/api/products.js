import { fetchApi } from './client'

export async function getCategories() {
  return fetchApi('/api/categories')
}

export async function getProducts(params = {}) {
  const { category, page = 0, size = 20 } = params
  const search = new URLSearchParams()
  if (category) search.set('category', category)
  search.set('page', page)
  search.set('size', size)
  return fetchApi(`/api/products?${search}`)
}

export async function getProductBySlug(slug) {
  return fetchApi(`/api/products/${encodeURIComponent(slug)}`)
}

export async function getFeaturedProducts() {
  return fetchApi('/api/products/featured')
}

export async function getTrendingProducts() {
  return fetchApi('/api/products/trending')
}

export async function getProductReviews(productId) {
  return fetchApi(`/api/products/${productId}/reviews`)
}

/**
 * Create a review for a product. Requires the user to be logged in (Bearer token).
 */
export async function createProductReview(productId, body) {
  return fetchApi(`/api/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Update a review. Only the user who wrote the review can update. Requires auth.
 */
export async function updateProductReview(productId, reviewId, body) {
  return fetchApi(`/api/products/${productId}/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
