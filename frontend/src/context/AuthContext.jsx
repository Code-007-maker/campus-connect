import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc_user')) } catch { return null }
  })

  useEffect(() => {
    // optional: validate/refresh token on load
    const token = localStorage.getItem('cc_token')
    if (token && !user) {
      authService.me().then(res => {
        setUser(res.user)
        localStorage.setItem('cc_user', JSON.stringify(res.user))
      }).catch(() => {
        localStorage.removeItem('cc_token')
        localStorage.removeItem('cc_user')
      })
    }
  }, [])

  const login = async (creds) => {
    const res = await authService.login(creds)
    setUser(res.user)
    localStorage.setItem('cc_user', JSON.stringify(res.user))
    localStorage.setItem('cc_token', res.token)
    return res
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cc_user')
    localStorage.removeItem('cc_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
