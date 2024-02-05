import React, { useState, useContext, useCallback } from 'react'
import { useChat } from '@/components/hooks/useChat'
import { SocketContext } from '@/components/context/SocketContext'

export default function ChatWindow() {
  const socket = useContext(SocketContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onChatUpdate = useCallback((message) => {
    if (message?.audioFile) {
      const audio = new Audio(`${process.env.NEXT_PUBLIC_SERVER_URL}/${message.audioFile}`)
      audio.play()
      return
    }

    setMessages((prevMessages) => [...prevMessages, message])
    if (message.from !== 'you') {
      setIsLoading(false)
    }
  }, [])

  const { sendMessage } = useChat(socket, { onChatUpdate })

  const sendChatMessage = () => {
    if (!newMessage.trim()) return
    setIsLoading(true)
    const message = { id: Date.now(), text: newMessage, from: 'you' }
    sendMessage(message)
    setNewMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  return (
    <div className='fixed bottom-0 right-4 max-w-md rounded-lg shadow-lg flex flex-col z-10 space-y-4 p-4 text-xs bg-custom-bg text-custom-text border border-custom-border font-roboto'>
      <div className='flex-1 overflow-y-auto'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-md mb-2 ${message.from !== 'you' ? 'bg-custom-bg ml-auto' : 'bg-gray-700 mr-auto'}`}
          >
            {message.from}: <span className={`${message.error ? 'italic' : ''}`}>{message.text || message.error}</span>
          </div>
        ))}
      </div>
      <input
        type='text'
        placeholder='Type your message...'
        value={newMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setNewMessage(e.target.value)}
        className={`w-full p-2 rounded-md focus:outline-none bg-custom-bg text-custom-text border border-custom-border disabled:bg-gray-600 disabled:text-gray-400`}
        disabled={isLoading}
      />
      <button
        onClick={sendChatMessage}
        className={`w-full mt-2 p-2 rounded-md focus:outline-none disabled:cursor-not-allowed ${isLoading ? 'bg-gray-400 text-gray-700' : 'bg-[hsla(0,0%,80%,1)] text-[hsla(0,0%,0%,0.8)]'} hover:bg-gray-400 disabled:bg-gray-300 disabled:text-gray-500`}
        disabled={isLoading}
      >
        {isLoading ? 'Waiting for reply...' : 'Send'}
      </button>
    </div>
  )
}
