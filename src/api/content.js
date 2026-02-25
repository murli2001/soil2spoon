/**
 * Content API: FAQs, site information, policies (shipping, returns, contact).
 * Backend may not expose all of these yet; callers should fall back to static data on 404/failure.
 */
import { fetchApi } from './client'

export async function getFaqs() {
  return fetchApi('/api/faqs')
}

export async function getSiteInformation(productId) {
  const path = productId ? `/api/content/site-information?productId=${encodeURIComponent(productId)}` : '/api/content/site-information'
  return fetchApi(path)
}

export async function getShippingPolicy() {
  return fetchApi('/api/content/shipping')
}

export async function getReturnsPolicy() {
  return fetchApi('/api/content/returns')
}

export async function getContactInfo() {
  return fetchApi('/api/content/contact')
}
