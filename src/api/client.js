/**
 * API base URL. In dev, Vite serves frontend and backend runs on 8080.
 * Set VITE_API_URL in .env (e.g. http://localhost:8080) or it defaults to same origin.

* API base URL. In dev, Vite serves frontend and backend runs on 8081.
 * Set VITE_API_URL in .env (e.g. http://localhost:8081) or it defaults to same origin.
 */
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '')
  }
  return ''
}

let getToken = () => null

export function setAuthTokenGetter(fn) {
  getToken = fn
}

/** In-flight GET requests by url to avoid duplicate calls (e.g. from React Strict Mode). */
const pendingGet = new Map()

export async function fetchApi(path, options = {}) {
  const base = getBaseUrl()
  const url = path.startsWith('http') ? path : `${base}${path}`
  const isGet = !options.method || options.method === 'GET'
  const canDedupe = isGet && !options.body

  if (canDedupe && pendingGet.has(url)) {
    return pendingGet.get(url)
  }

  const token = getToken && getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const promise = fetch(url, { ...options, headers })
    .then(async (res) => {
      if (canDedupe) pendingGet.delete(url)
      if (!res.ok) {
        const text = await res.text()
        let body
        try {
          body = text ? JSON.parse(text) : {}
        } catch {
          body = { message: text || res.statusText }
        }
        const err = new Error(body.message || `HTTP ${res.status}`)
        err.status = res.status
        err.body = body
        throw err
      }
      if (res.status === 204) return null
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return res.json()
      }
      return res.text()
    })
    .catch((err) => {
      if (canDedupe) pendingGet.delete(url)
      throw err
    })

  if (canDedupe) pendingGet.set(url, promise)
  return promise
}
