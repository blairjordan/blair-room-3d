import React, { useState, useContext, useCallback } from 'react'
import { useChat } from '@/components/hooks/useChat'
import { SocketContext } from '@/components/context/SocketContext'

export default function ChatWindow() {
  const socket = useContext(SocketContext)

  const onChatUpdate = useCallback((data) => {
    // setMessages((prevMessages) => [...prevMessages, data])
    console.log('Chat update:', data)
  }, [])

  const { sendMessage } = useChat(socket, { onChatUpdate })

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const sendChatMessage = () => {
    if (!newMessage.trim()) return
    const message = { id: Date.now(), text: newMessage }
    sendMessage(message)
    setMessages((prevMessages) => [...prevMessages, message])
    setNewMessage('')
  }

  const chatContainerStyle = {
    backgroundColor: 'hsla(0, 0%, 0%, 0.3)',
    color: 'hsla(0, 0%, 100%, 0.5)',
    padding: '4px',
    fontFamily: '"Roboto Mono", "Source Code Pro", Menlo, Courier, monospace', // --bs-ff
    fontSize: '11px',
    fontWeight: '500',
    lineHeight: '1',
    boxShadow: '0 0 10px hsla(0, 0%, 0%, 0.2)',
    borderRadius: '6px',
  }

  const messageInputStyle = {
    backgroundColor: 'hsla(0, 0%, 0%, 0.3)',
    color: 'hsla(0, 0%, 100%, 0.5)',
    borderColor: 'hsla(0, 0%, 0%, 0.2)',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  const sendMessageButtonStyle = {
    backgroundColor: 'hsla(0, 0%, 80%, 1)',
    color: 'hsla(0, 0%, 0%, 0.8)',
  }

  return (
    <div
      style={chatContainerStyle}
      className='fixed bottom-0 right-4 max-w-md rounded-lg shadow-lg flex flex-col z-10 space-y-4'
    >
      <div className='flex-1 overflow-y-auto'>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{ backgroundColor: 'hsla(0, 0%, 0%, 0.6)', color: 'hsla(0, 0%, 100%, 0.5)' }}
            className='p-2 rounded-md mb-2'
          >
            {message.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type='text'
          placeholder='Type your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='w-full p-2 rounded-md focus:outline-none'
          style={messageInputStyle}
        />
        <button
          onClick={sendChatMessage}
          className='w-full mt-2 p-2 rounded-md focus:outline-none hover:bg-blue-600'
          style={sendMessageButtonStyle}
        >
          Send
        </button>
      </div>
    </div>
  )
}
