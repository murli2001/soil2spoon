import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthTokenGetter } from '../api/client'
import * as authApi from '../api/auth'

const AuthStateContext = createContext(null)
const AuthActionsContext = createContext(null)

const TOKEN_KEY = 'soil2spoon_token'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
      setTokenState(newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setTokenState(null)
      setUser(null)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password)
    setToken(res.token)
    setUser(res.user)
    return res
  }, [setToken])

  const signup = useCallback(async (email, password, name) => {
    const res = await authApi.signup(email, password, name)
    setToken(res.token)
    setUser(res.user)
    return res
  }, [setToken])

  const logout = useCallback(() => {
    setToken(null)
  }, [setToken])

  useEffect(() => {
    setAuthTokenGetter(() => token)
  }, [token])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    authApi.getMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [token, setToken])

  const stateValue = useMemo(() => ({ token, user, loading }), [token, user, loading])
  const actionsValue = useMemo(() => ({ login, signup, logout, setToken }), [login, signup, logout, setToken])

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthState() {
  const ctx = useContext(AuthStateContext)
  if (!ctx) throw new Error('useAuthState must be used within AuthProvider')
  return ctx
}

export function useAuthActions() {
  const ctx = useContext(AuthActionsContext)
  if (!ctx) throw new Error('useAuthActions must be used within AuthProvider')
  return ctx
}

export function useAuth() {
  return { ...useAuthState(), ...useAuthActions() }
}
