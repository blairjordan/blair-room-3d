import React, { useState } from 'react'

export default function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message = { id: Date.now(), text: newMessage }
    setMessages((prevMessages) => [...prevMessages, message])
    setNewMessage('')
  }

  return (
    <div className='fixed bottom-0 right-4 max-w-md p-4 bg-white/50 rounded-lg shadow-lg flex flex-col z-10'>
      <div className='mb-4 h-64 overflow-y-auto'>
        {messages.map((message) => (
          <div key={message.id} className='bg-blue-100 p-2 rounded-md mb-2'>
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
          className='w-full p-2 border-2 border-gray-200 rounded-md'
        />
        <button onClick={sendMessage} className='w-full mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'>
          Send
        </button>
      </div>
    </div>
  )
}
