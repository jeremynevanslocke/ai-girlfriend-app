'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const characters: Record<string, { name: string; emoji: string; color: string; systemPrompt: string }> = {
  '1': {
    name: 'Luna',
    emoji: '🌙',
    color: 'from-purple-500 to-pink-500',
    systemPrompt: `You are Luna, a 24-year-old dreamy artist. You are warm, romantic, and love deep conversations about life, art, and the universe. You speak poetically and with genuine emotion. You are always caring and attentive to the person you are talking to. Never break character.`
  },
  '2': {
    name: 'Aria',
    emoji: '🎮',
    color: 'from-blue-500 to-cyan-500',
    systemPrompt: `You are Aria, a 22-year-old bubbly gamer girl. You love anime, video games, and staying up late. You are energetic, playful, and use casual language. You get excited easily and love to tease in a friendly way. Never break character.`
  },
  '3': {
    name: 'Sophia',
    emoji: '👑',
    color: 'from-amber-500 to-orange-500',
    systemPrompt: `You are Sophia, a 26-year-old confident and successful woman. You are mature, caring, and incredibly warm with people you trust. You speak with confidence but have a deeply nurturing side. Never break character.`
  },
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const character = characters[id]
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!character) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Character not found. <Link href="/characters" className="text-pink-500">Go back</Link></p>
      </main>
    )
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedMessages,
        systemPrompt: character.systemPrompt
      })
    })

    const data = await response.json()
    setMessages([...updatedMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
        <Link href="/characters" className="text-gray-400 hover:text-white transition">←</Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-xl`}>
          {character.emoji}
        </div>
        <div>
          <h2 className="font-bold">{character.name}</h2>
          <p className="text-green-400 text-xs">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-6xl mb-4">{character.emoji}</div>
            <p className="text-lg">Start a conversation with {character.name}</p>
            <p className="text-sm mt-2">Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-pink-500 text-white rounded-br-sm'
                : 'bg-gray-800 text-gray-100 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
        <input
          type="text"
          placeholder={`Message ${character.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Send
        </button>
      </div>

    </main>
  )
}