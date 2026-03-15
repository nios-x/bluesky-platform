'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Send, MessageCircle } from 'lucide-react'


interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  options?: string[]
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to Blue Sky Disposal. How can I assist you today? You can say things like "I want to book a dumpster" or ask for help.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStep, setBookingStep] = useState<null | number>(null)
  const [bookingData, setBookingData] = useState<any>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  // Booking flow steps
  const cityOptions = [
    'Detroit',
    'Warren',
    'Sterling Heights',
    'Livonia',
    'Troy',
    'Dearborn'
  ];

  const bookingSteps = [
    {
      key: 'type',
      text: 'What type of dumpster do you need?',
      options: ['Roll-Off', 'Rubber-Wheeled', 'Permanent']
    },
    {
      key: 'size',
      text: 'What size dumpster do you need?',
      options: ['10 Yard', '15 Yard', '20 Yard', '30 Yard']
    },
    {
      key: 'location',
      text: 'Where do you need the dumpster delivered? (Select your city)',
      options: cityOptions
    },
    {
      key: 'date',
      text: 'When do you need the dumpster? (Pick a date)',
      options: null // Will show calendar picker
    },
    {
      key: 'confirm',
      text: 'Thank you! Here is your booking summary. Would you like to proceed?',
      options: ['Yes, book now', 'No, start over']
    }
  ];

  const botResponses: { [key: string]: string } = {
    'pricing': 'Our pricing varies based on dumpster size and rental duration. For specific quotes, please contact us or check our calculator on the Size Guide page.',
    'sizes': 'We offer dumpsters in various sizes: 10 yard, 15 yard, 20 yard, and 30 yard. Choose Roll Off, Rubber Wheeled, or Permanent dumpsters based on your needs.',
    'book': 'Let’s get started with your booking! I’ll ask you a few quick questions.',
    'contact': 'You can reach us through our Contact page, or call us at (123) 456-7890 for immediate assistance.',
    'area': 'We provide service in 50+ cities. Please check our coverage area on the Services page or contact us directly.',
    'rental': 'Our rental periods are flexible. Typically, we offer daily, weekly, and monthly rental options. Please contact us for specific details.',
    'payment': 'We accept credit cards, debit cards, bank transfers, and digital payments. All transactions are secure.',
    'delivery': 'Yes, we provide delivery and pickup services as part of our dumpster rental. Delivery time depends on your address.',
    'hello': 'Hello! How can I help you with Blue Sky Disposal services today?',
    'hi': 'Hi there! What can I help you with?',
    'help': 'I can help you with information about our dumpster rentals, pricing, booking, services, and more. What would you like to know? You can also type "book a dumpster" to start the booking process.',
  }


  // Booking flow logic
  const startBooking = () => {
    setBookingStep(0)
    setBookingData({})
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: bookingSteps[0].text,
        sender: 'bot',
        timestamp: new Date(),
        options: bookingSteps[0].options || undefined
      }
    ])
  }

  // Calendar picker state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarStep, setCalendarStep] = useState<null | number>(null);

  const handleBookingStep = (value: string) => {
    const step = bookingStep ?? 0;
    const stepData = bookingSteps[step];
    const newBookingData = { ...bookingData, [stepData.key]: value };
    setBookingData(newBookingData);

    // If next step is date, show calendar picker
    if (bookingSteps[step + 1] && bookingSteps[step + 1].key === 'date') {
      setShowCalendar(true);
      setCalendarStep(step + 1);
      setBookingStep(step + 1);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: bookingSteps[step + 1].text,
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
      return;
    }

    if (step < bookingSteps.length - 1) {
      setBookingStep(step + 1);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: bookingSteps[step + 1].key === 'confirm'
            ? `Type: ${newBookingData.type || '-'}\nSize: ${newBookingData.size || '-'}\nLocation: ${newBookingData.location || '-'}\nDate: ${newBookingData.date || '-'}`
            : bookingSteps[step + 1].text,
          sender: 'bot',
          timestamp: new Date(),
          options: bookingSteps[step + 1].options || undefined
        }
      ]);
    } else {
      setBookingStep(null);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Booking complete! Our team will contact you soon. If you want to start over, type "book a dumpster".',
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  };

  const generateBotResponse = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes('book')) {
      startBooking()
      return null
    }
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    return 'Thank you for your message! For more specific information, please visit our FAQ page, contact us directly, or call us at (123) 456-7890. Our team is here to help!'
  }

  const handleSendMessage = async (optionValue?: string) => {
    if (!input.trim() && !optionValue) return

    const userText = optionValue || input
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      // If in booking flow, handle step
      if (bookingStep !== null) {
        handleBookingStep(userText)
        setIsLoading(false)
        return
      }
      const botResponse = generateBotResponse(userText)
      if (botResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
          }
        ])
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl flex flex-col h-96 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">Blue Sky Support</p>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-[#0a1e63] text-white rounded-br-none'
                      : 'bg-white text-[#0a1e63] border border-[#efc73f]/40 rounded-bl-none'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  {/* Quick reply options */}
                  {message.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSendMessage(opt)}
                          className="bg-[#efc73f] hover:bg-[#0a1e63] hover:text-white text-[#0a1e63] font-semibold px-3 py-1 rounded-full text-xs border border-[#efc73f] transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Calendar picker for date step */}
                  {showCalendar && bookingStep === calendarStep && message.sender === 'bot' && bookingSteps[bookingStep]?.key === 'date' && (
                    <div className="mt-2">
                      <input
                        type="date"
                        className="border border-[#efc73f]/40 rounded-lg px-2 py-1 text-[#0a1e63]"
                        onChange={e => {
                          setShowCalendar(false);
                          handleSendMessage(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#0a1e63] px-4 py-2 rounded-lg border border-[#efc73f]/40 rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#efc73f] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#efc73f] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#efc73f] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-[#efc73f]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#efc73f] focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-[#efc73f] hover:bg-[#0a1e63] hover:text-white disabled:bg-slate-300 text-[#0a1e63] p-2 rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#0a1e63] to-[#efc73f] hover:from-[#0a1e63] hover:to-[#efc73f]/80 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
