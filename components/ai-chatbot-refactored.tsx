'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'recommendation'
}

interface Recommendation {
  size: number
  type: string
  reason: string
  price?: number
}

export function AIChatbotRefactored() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to Blue Sky Disposal. I\'m here to help you find the perfect dumpster for your project. What are you working on today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [zipCode, setZipCode] = useState('')
  const [showZipPrompt, setShowZipPrompt] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Send message to Claude via /api/chat endpoint
   */
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!input.trim() && !zipCode) return

    // If showing ZIP prompt and user entered ZIP, add it to context
    if (showZipPrompt && zipCode && !input.trim()) {
      const zipMessage: Message = {
        id: Date.now().toString(),
        text: zipCode,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      }
      setMessages(prev => [...prev, zipMessage])
      setInput('')
      setShowZipPrompt(false)
      
      // Send to API with ZIP code
      await sendToAPI(messages, zipCode)
      return
    }

    if (!input.trim()) return

    // Add user message to conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Send conversation to API
    await sendToAPI([...messages, userMessage], zipCode)
  }

  /**
   * Send messages to Claude API endpoint
   */
  const sendToAPI = async (messagesArray: Message[], zip: string = '') => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesArray.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          zipCode: zip,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Add bot response to messages
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
        type: data.type,
      }

      setMessages(prev => [...prev, botMessage])

      // Handle different response types
      if (data.type === 'recommendation' && data.recommendation) {
        setRecommendation(data.recommendation)
      }

      // If API indicates we need ZIP code, show the ZIP prompt
      if (data.needsZipCode) {
        setShowZipPrompt(true)
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Render recommendation in a nice card format
   */
  const renderRecommendation = (rec: Recommendation) => (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mt-2">
      <h3 className="font-bold text-lg mb-2">✨ Recommended: {rec.size} Yard Dumpster</h3>
      <p className="text-sm mb-2">Type: {rec.type}</p>
      <p className="text-sm mb-2">Why: {rec.reason}</p>
      {rec.price && (
        <p className="text-sm font-semibold">Est. Price: ${rec.price.toFixed(2)}</p>
      )}
      <Button
        onClick={() => {
          // Could link to booking page or checkout
          alert('Redirect to booking page with ' + rec.size + ' yard dumpster selected')
        }}
        className="w-full mt-3 bg-white text-blue-600 hover:bg-gray-100"
        size="sm"
      >
        Book This Dumpster
      </Button>
    </div>
  )

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 max-h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="font-bold">Blue Sky Dumpster Assistant</h2>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === 'bot' && recommendation && msg.id === messages[messages.length - 1]?.id && (
                    renderRecommendation(recommendation)
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ZIP Code Prompt */}
          {showZipPrompt && (
            <div className="bg-blue-50 border-t border-blue-200 p-3 border-b">
              <p className="text-sm text-gray-700 mb-2">What's your ZIP code? 📍</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  placeholder="e.g., 48038"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="5"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading || showZipPrompt}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
