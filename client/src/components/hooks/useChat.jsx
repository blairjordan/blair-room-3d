import React, { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client'

export const SignalContext = createContext()

export const useChat = (socket, options = {}) => {
  const { onChatUpdate = null } = options

  useEffect(() => {
    if (socket && onChatUpdate) {
      socket.on('chatUpdate', onChatUpdate)
    }

    return () => {
      if (socket && onChatUpdate) {
        socket.off('chatUpdate', onChatUpdate)
      }
    }
  }, [socket])

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message)
    }
  }

  return {
    socket,
    sendMessage,
  }
}
