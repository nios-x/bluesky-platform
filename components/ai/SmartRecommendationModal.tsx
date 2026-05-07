//components/ai/SmartRecommendationModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Send, Upload, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/booking-context";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "recommendation";
  recommendation?: {
    size: number;
    type: string;
    projectType?: string;
    materialType?: string;
    reason?: string;
    price?: number;
  };
}

interface SmartRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZipCode?: string;
}

export function SmartRecommendationModal({
  isOpen,
  onClose,
  initialZipCode = "",
}: SmartRecommendationModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { updateBooking } = useBooking();

  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputValue((prev) => prev + " " + transcript);
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message and reset on modal open/close
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! 👋 What kind of project or cleanup are you working on?",
        type: "text",
      };
      setMessages([welcomeMsg]);
    }

    if (!isOpen) {
      // Reset when modal closes
      setMessages([]);
      setInputValue("");
      setSelectedImage(null);
    }
  }, [isOpen]);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedImage(base64);

        // Add user message with image preview
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: "[Image uploaded]",
          type: "text",
        };
        setMessages((prev) => [...prev, userMsg]);

        // Send message with image
        sendMessage(base64, null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (
    imageBase64: string | null,
    textInput: string | null
  ) => {
    if (!textInput && !imageBase64) return;

    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((msg) => msg.type !== "recommendation")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add current user message
      conversationHistory.push({
        role: "user",
        content: textInput || "[Image uploaded]",
      });

      // Call conversational API
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          imageBase64: imageBase64 || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response
        const aiMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.reply,
          type: data.type || "text",
          recommendation: data.recommendation || undefined,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setSelectedImage(null);
      } else {
        console.error("API error:", data.error);
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Sorry, I had trouble processing that. Can you tell me more about your project?",
          type: "text",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Sorry, I had trouble connecting. Please try again.",
        type: "text",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue || "[Image uploaded]",
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);

    // Send to API
    await sendMessage(selectedImage, inputValue);
  };

  const handleContinueWithRecommendation = (recommendation: Message["recommendation"]) => {
    if (!recommendation) return;

    // Pre-fill booking data
    updateBooking(0, {
      dumpsterSize: recommendation.size,
      dumpsterType: recommendation.type,
      projectType: recommendation.projectType || "Custom Project",
      materialType: recommendation.materialType || "Various Materials",
      zipCode: initialZipCode,
      basePrice: recommendation.price || 455,
    });

    // Close modal and redirect
    onClose();
    router.push(
      `/booking/step-1?size=${recommendation.size}&type=${recommendation.type}&source=ai`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-gray-200"
      >
        {/* Header */}
          <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#142A52] text-white flex items-center justify-center text-sm font-bold">
                AI
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Dumpster Assistant
                </h2>
                <p className="text-xs text-gray-500">
                  Smart recommendations powered by AI
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Text Message */}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-[#142A52] text-white rounded-2xl rounded-br-md px-4 py-2 text-sm shadow-sm"
                    : "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 text-sm shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-[#142A52]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ZIP Code Prompt (if needed) */}
        {/* Removed: ZIP code is now handled conversationally */}

        {/* Input Area */}
        <div className="border-t border-gray-100 p-3 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">

            {/* + button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <Upload className="w-4 h-4 text-gray-600" />
            </button>

            {/* Input */}
            <input
              type="text"
              placeholder="Tell me about your project..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />

            {/* Mic */}
            <button
              onClick={toggleListening}
              className={`p-2 rounded-lg ${
                isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-2 bg-[#142A52] text-white rounded-lg hover:opacity-90 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
