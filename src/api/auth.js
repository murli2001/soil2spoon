import { fetchApi } from './client'

export async function login(email, password) {
  return fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup(email, password, name) {
  return fetchApi('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

export async function getMe() {
  return fetchApi('/api/auth/me')
}

export async function forgotPassword(email) {
  return fetchApi('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token, newPassword) {
  return fetchApi('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}
