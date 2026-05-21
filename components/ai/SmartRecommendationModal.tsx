//components/ai/SmartRecommendationModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Send, Upload, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/booking-context";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECT_TYPES } from "@/lib/constants/booking";

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
    enforced?: boolean;
  };
}

interface SmartRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZipCode?: string;
}

const WELCOME_MESSAGE = `Hi 👋 I'm your Blue Sky Dumpster Expert.

I can help recommend the right dumpster size for your project.

What kind of project do you have?`;

export function SmartRecommendationModal({
  isOpen,
  onClose,
  initialZipCode = "",
}: SmartRecommendationModalProps) {
  const [stage, setStage] = useState<"email" | "chat">("email");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showProjectTypes, setShowProjectTypes] = useState(false);
  const [zipcode, setZipcode] = useState(initialZipCode);

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

  // Initialize modal
  useEffect(() => {
    if (isOpen) {
      setStage("email");
      setMessages([]);
      setInputValue("");
      setSelectedImage(null);
      setShowProjectTypes(false);
      setEmail("");
      setZipcode(initialZipCode);
    }
  }, [isOpen, initialZipCode]);

  const handleEmailSubmit = async (skipEmail = false) => {
    if (!skipEmail && !email.trim()) {
      alert("Please enter your email to continue");
      return;
    }

    // If email provided, attempt to subscribe to Mailchimp
    if (!skipEmail && email.trim()) {
      try {
        await fetch("/api/mailchimp/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "ai_dumpster_expert" }),
        }).catch(() => {
          // Silently fail - don't block progression
        });
      } catch (error) {
        console.error("Mailchimp subscription failed:", error);
      }
    }

    // Move to chat stage
    setStage("chat");
    const welcomeMsg: Message = {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      type: "text",
    };
    setMessages([welcomeMsg]);
    setShowProjectTypes(true);
  };

  const handleProjectTypeSelect = async (projectType: string) => {
    setShowProjectTypes(false);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: projectType,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);

    // Send to API
    await sendMessage(null, projectType);
  };

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
          content: "[Image uploaded - analyzing...]",
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
      // Build conversation history
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

      // Call recommendation API
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          imageBase64: imageBase64 || undefined,
          zipcode: zipcode,
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
        content: "Sorry, I had trouble connecting. Please try again.",
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

  const handleBookRecommendation = (rec: Message["recommendation"]) => {
    if (!rec) return;

    // Pre-fill booking data
    updateBooking(0, {
      dumpsterSize: rec.size,
      dumpsterType: rec.type.toLowerCase().replace(" ", "-"),
      projectType: rec.projectType || "Other Project",
      materialType: rec.materialType || "Other Waste",
      zipCode: zipcode,
    });

    // Close modal and redirect with source=ai
    onClose();
    router.push(
      `/booking/order?size=${rec.size}&type=${rec.type.toLowerCase()}&project=${encodeURIComponent(
        rec.projectType || "Other Project"
      )}&material=${encodeURIComponent(rec.materialType || "Other Waste")}&source=ai`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200"
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#0A1628] to-[#1B3A6B]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#DAA520] text-[#0A1628] flex items-center justify-center text-lg font-bold">
              🏢
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Blue Sky Dumpster Expert
              </h2>
              <p className="text-xs text-white/80">
                AI-powered recommendations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {stage === "email" ? (
            // Email Capture Stage
            <motion.div
              key="email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="mb-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-[#0A1628] mb-2">
                  Unlock Your Dumpster Expert
                </h3>
                <p className="text-gray-600 text-lg">
                  Get AI-powered recommendations and save <span className="font-bold text-[#C89B2B]">$20</span> on your first order!
                </p>
              </div>

              <div className="w-full max-w-sm space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1628] mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEmailSubmit();
                    }}
                    className="border-2 border-[#0A1628]/30 focus:border-[#DAA520]"
                  />
                </div>

                <Button
                  onClick={() => handleEmailSubmit()}
                  className="w-full bg-gradient-to-r from-[#0A1628] to-[#DAA520] hover:from-[#1B3A6B] hover:to-[#E5B835] text-white font-bold py-6 text-lg"
                >
                  Continue →
                </Button>

                <button
                  onClick={() => handleEmailSubmit(true)}
                  className="w-full text-[#0A1628] hover:text-[#DAA520] font-semibold py-2 transition"
                >
                  Skip
                </button>
              </div>

              <p className="text-xs text-gray-500">
                We'll never spam you. See our privacy policy.
              </p>
            </motion.div>
          ) : (
            // Chat Stage
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {msg.role === "user" ? (
                      // User Message
                      <div className="max-w-xs bg-[#0A1628] text-white rounded-2xl rounded-br-none px-4 py-2 text-sm shadow-sm">
                        <p>{msg.content}</p>
                      </div>
                    ) : msg.type === "recommendation" ? (
                      // Recommendation Card
                      <div className="w-full max-w-sm">
                        <div className="bg-white border-2 border-[#C89B2B] rounded-2xl rounded-bl-none p-6 shadow-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-600 font-semibold">
                                Recommended Dumpster
                              </p>
                              <h3 className="text-2xl font-bold text-[#0A1628] mt-1">
                                🟢 {msg.recommendation?.size} Yard{" "}
                                {msg.recommendation?.type}
                              </h3>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-sm text-gray-600 font-semibold">
                                Why This Size?
                              </p>
                              <p className="text-sm text-gray-800 mt-1">
                                {msg.recommendation?.reason}
                              </p>
                            </div>

                            {msg.recommendation?.enforced && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-xs text-amber-900">
                                  ⚠️ <strong>Weight Restriction:</strong> Heavy materials require
                                  a 10 Yard Roll-Off for safety.
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2 text-xs text-gray-600">
                              <span>✓ Delivery</span>
                              <span>✓ Pickup</span>
                              <span>✓ 7 Days Free</span>
                            </div>
                          </div>

                          <Button
                            onClick={() =>
                              handleBookRecommendation(msg.recommendation)
                            }
                            className="w-full bg-gradient-to-r from-[#0A1628] to-[#DAA520] hover:from-[#1B3A6B] hover:to-[#E5B835] text-white font-bold py-2"
                          >
                            Book This Size →
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Text Message
                      <div className="max-w-xs bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Project Types Chips - Show after welcome */}
                {showProjectTypes && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 justify-start mt-4"
                  >
                    {PROJECT_TYPES.slice(0, 5).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleProjectTypeSelect(type)}
                        className="px-3 py-2 bg-[#0A1628]/10 hover:bg-[#0A1628]/20 text-[#0A1628] text-xs font-semibold rounded-full transition border border-[#0A1628]/20"
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2 text-[#0A1628]">
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

              {/* Input Area */}
              <div className="border-t border-gray-100 p-4 bg-white">
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">
                  {/* Image Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
                    title="Upload image"
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* Text Input */}
                  <input
                    type="text"
                    placeholder="Tell me more about your project..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-sm px-2"
                  />

                  {/* Voice Input */}
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transition ${isListening
                        ? "bg-red-100 text-red-600"
                        : "hover:bg-gray-200 text-gray-600"
                      }`}
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                    className="p-2 bg-[#0A1628] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
