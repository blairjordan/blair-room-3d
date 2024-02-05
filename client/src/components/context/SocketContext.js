'use client'

import React, { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client'

export const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
