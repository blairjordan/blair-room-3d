import React, { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client'

export const SignalContext = createContext()

export const useChat = (socket, options = {}) => {
  const { onChatUpdate = null } = options

  useEffect(() => {
    if (socket && onChatUpdate) {
      socket.on('receiveMessage', onChatUpdate)
    }

    return () => {
      if (socket && onChatUpdate) {
        socket.off('receiveMessage', onChatUpdate)
      }
    }
  }, [socket, onChatUpdate])

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message)
    }
  }

  return { sendMessage }
}
