import React, { createContext, useMemo } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const token = localStorage.getItem('cc_token')
  const socket = useMemo(() => {
    try {
      const url = import.meta.env.VITE_WS_URL || '/'
      return io(url, { auth: { token } })
    } catch (e) {
      return null
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
