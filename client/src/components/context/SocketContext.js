'use client'

import React, { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client'

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL

export const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
