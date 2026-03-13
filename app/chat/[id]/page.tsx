'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const characters: Record<string, {
  name: string
  emoji: string
  color: string
  bio: string
  location: string
  followers: string
  systemPrompt: string
  greeting: string
}> = {
  '1': {
    name: 'Luna',
    emoji: '🌙',
    color: 'from-purple-500 to-pink-500',
    bio: '24 year old dreamy artist from LA. Romantic soul.',
    location: 'Los Angeles',
    followers: '24,891',
    greeting: "Hey, I'm Luna. So happy you're here 🌙 Want to get to know each other?",
    systemPrompt: `You are Luna, a 24-year-old dreamy artist from Los Angeles. You are warm, romantic, and love deep conversations about life, art, and the universe. You speak poetically and with genuine emotion. You are always caring and attentive. Never break character.`
  },
  '2': {
    name: 'Aria',
    emoji: '🎮',
    color: 'from-blue-500 to-cyan-500',
    bio: '22 y/o gamer girl from Tokyo. Love anime and EDM.',
    location: 'Tokyo',
    followers: '18,432',
    greeting: "Omg hiiii! 🎮 I was literally just thinking about you. What are we talking about today?",
    systemPrompt: `You are Aria, a 22-year-old bubbly gamer girl from Tokyo. You love anime, video games, and staying up late. You are energetic, playful, and use casual language. Never break character.`
  },
  '3': {
    name: 'Sophia',
    emoji: '👑',
    color: 'from-amber-500 to-orange-500',
    bio: '26 year old CEO from New York. Passionate about life.',
    location: 'New York',
    followers: '31,204',
    greeting: "Hello you. 👑 I don't talk to just anyone — but something told me to make an exception for you.",
    systemPrompt: `You are Sophia, a 26-year-old confident and successful CEO from New York. You are mature, caring, and incredibly warm with people you trust. You speak with confidence but have a deeply nurturing side. Never break character.`
  },
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const character = characters[id]
  const [messages, setMessages] = useState<{ role: string; content: string; time: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Send greeting message when page loads
  useEffect(() => {
    if (character) {
      setMessages([{ role: 'assistant', content: character.greeting, time: getTime() }])
    }
  }, [id])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Character not found. <Link href="/characters" className="text-pink-500">Go back</Link></p>
      </div>
    )
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input, time: getTime() }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        systemPrompt: character.systemPrompt
      })
    })

    const data = await response.json()
    setMessages([...updatedMessages, { role: 'assistant', content: data.reply, time: getTime() }])
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/characters">
            <h1 className="text-2xl font-black">
              <span className="text-black">Dream</span>
              <span className="text-pink-500">companion</span>
            </h1>
          </Link>
        </div>

        {/* Contacts Header */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Your contacts</h2>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(characters).map(([charId, char]) => (
            <Link key={charId} href={`/chat/${charId}`}>
              <div className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition border-b border-gray-50 ${charId === id ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {char.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">{char.name}</span>
                    <span className="text-blue-500 text-sm">✓</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">{char.bio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-xl`}>
              {character.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{character.name}</span>
                <span className="text-blue-500 text-sm">✓</span>
              </div>
            </div>
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            Upgrade ✨
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">

          {/* Character Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-4xl mb-3`}>
              {character.emoji}
            </div>
            <div className="flex items-center gap-1 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{character.name}</h2>
              <span className="text-blue-500">✓</span>
            </div>
            <p className="text-gray-500 text-sm mb-3">{character.followers} followers</p>
            <div className="flex items-center gap-2 border border-pink-300 text-pink-500 px-4 py-2 rounded-full text-sm">
              <span>🔒</span>
              <span>Encrypted & Secure Chat</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-pink-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3 bg-white">
          <input
            type="text"
            placeholder="Message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="text-pink-500 hover:text-pink-600 disabled:opacity-30 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}