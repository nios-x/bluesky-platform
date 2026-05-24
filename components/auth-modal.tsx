"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Lock, Eye, EyeOff, Building2, HardHat, Bell, Gift, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { supabaseAnon } from "@/lib/supabase/client";
import Link from "next/link";

type UserType = "customer" | "partner" | "contractor";
type AuthMode = "login" | "signup" | "otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const { refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
  });

  const userTypes = [
    {
      type: "customer" as UserType,
      icon: User,
      title: "Individual Customer",
      description: "Rent dumpsters for personal use"
    },
    {
      type: "partner" as UserType,
      icon: Building2,
      title: "Business Partner",
      description: "Partner with us for bulk orders"
    },
    {
      type: "contractor" as UserType,
      icon: HardHat,
      title: "Contractor/Builder",
      description: "Construction site solutions"
    }
  ];

  const benefits = [
    { icon: Bell, text: "Instant notifications" },
    { icon: Gift, text: "Earn rewards" },
    { icon: Shield, text: "Secure transactions" },
    { icon: CheckCircle2, text: "Easy booking" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "signup") {
        // Step 1: Send OTP email
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send verification code");

        setAuthMode("otp");
      } else if (authMode === "otp") {
        // Step 2: Verify OTP and create user securely in backend
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp: otpCode,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            userType
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        // Step 3: Login to establish frontend JWT session
        const { error: authError } = await supabaseAnon.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        await refreshProfile();
        onClose();
      } else {
        // Log in user
        const { error: authError } = await supabaseAnon.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        await refreshProfile();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh]">
            {/* Left Side - Benefits */}
            <div className="hidden md:block bg-gradient-to-br from-blue-600 to-cyan-500 p-8 lg:p-12 text-white overflow-y-auto">
              <div className="flex flex-col h-full">
                <div>
                  <h2 className="text-3xl font-bold mb-3">
                    {authMode === "login" ? "Welcome Back!" : authMode === "otp" ? "Verify Email" : "Join Blue Sky"}
                  </h2>
                  <p className="text-blue-50 mb-8">
                    {authMode === "login"
                      ? "Sign in to access your account"
                      : authMode === "otp"
                        ? "We sent a 6-digit code to your email"
                        : "Create account for exclusive benefits"
                    }
                  </p>

                  {/* Benefits */}
                  <div className="space-y-4 mb-8">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <benefit.icon size={20} />
                        </div>
                        <span className="font-medium">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">5K+</div>
                    <div className="text-xs text-blue-100">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs text-blue-100">Areas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-xs text-blue-100">Years</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              {/* Toggle Login/Signup */}
              {authMode !== "otp" && (
                <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm ${authMode === "login"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600"
                      }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode("signup")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm ${authMode === "signup"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600"
                      }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* User Type Selection (Signup Only) */}
              {authMode === "signup" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Account Type
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {userTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => setUserType(type.type)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${userType === type.type
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${userType === type.type ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                            <type.icon size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-slate-900">{type.title}</div>
                            <div className="text-xs text-slate-600">{type.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}
                {authMode === "otp" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Verification Code</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="pl-10 h-11 text-center font-bold tracking-widest text-lg"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                )}

                {authMode !== "otp" && (
                  <>
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input
                            type="text"
                            placeholder="Enter your name"
                            className="pl-10 h-11"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                          type="email"
                          placeholder="Enter email"
                          className="pl-10 h-11"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input
                            type="tel"
                            placeholder="Enter phone"
                            className="pl-10 h-11"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="pl-10 pr-10 h-11"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {authMode === "login" && (
                  <div className="flex justify-end mb-4 -mt-2">
                    <Link 
                      href="/forgot-password" 
                      onClick={onClose}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : authMode === "login" ? "Sign In" : authMode === "otp" ? "Verify Code" : "Create Account"}
                </Button>

              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
