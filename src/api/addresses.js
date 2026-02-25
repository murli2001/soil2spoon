import { fetchApi } from './client'

/**
 * GET /api/addresses — list current user's saved addresses (auth required).
 * @returns {Promise<Array<{ id: number, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault: boolean }>>}
 */
export async function getAddresses() {
  return fetchApi('/api/addresses')
}

/**
 * POST /api/addresses — create a saved address (auth required).
 * @param {Object} body - { name, phone, addressLine1, addressLine2?, city, state, pincode, isDefault? }
 * @returns {Promise<{ id, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault }>}
 */
export async function createAddress(body) {
  return fetchApi('/api/addresses', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * PUT /api/addresses/:id — update a saved address (auth required).
 */
export async function updateAddress(id, body) {
  return fetchApi(`/api/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * DELETE /api/addresses/:id — delete a saved address (auth required).
 */
export async function deleteAddress(id) {
  return fetchApi(`/api/addresses/${id}`, { method: 'DELETE' })
}
