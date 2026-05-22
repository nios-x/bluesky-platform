"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { supabaseAnon } from "@/lib/supabase/client";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  HardHat,
  Bell,
  Gift,
  Shield,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

type UserType = "customer" | "partner" | "contractor";
type AuthMode = "login" | "signup" | "otp";

export default function AuthPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");

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
      description: "Rent dumpsters for personal use",
      benefits: ["Quick booking", "Easy payments", "24/7 support"]
    },
    {
      type: "partner" as UserType,
      icon: Building2,
      title: "Business Partner",
      description: "Partner with us for bulk orders",
      benefits: ["Volume discounts", "Priority service", "Dedicated manager"]
    },
    {
      type: "contractor" as UserType,
      icon: HardHat,
      title: "Contractor/Builder",
      description: "Construction site solutions",
      benefits: ["Project pricing", "Site management", "Multiple Zip codes"]
    }
  ];

  const benefits = [
    { icon: Bell, text: "Get instant notifications for order updates" },
    { icon: Gift, text: "Earn rewards on every rental" },
    { icon: Shield, text: "100% secure & encrypted transactions" },
    { icon: CheckCircle2, text: "Easy booking & cancellation" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "signup") {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send verification code");

        setAuthMode("otp");
      } else if (authMode === "otp") {
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

        const { error: authError } = await supabaseAnon.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        await refreshProfile();
        router.push("/account");
      } else {
        const { error: authError } = await supabaseAnon.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        await refreshProfile();
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left Side - Benefits & Info */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 lg:p-12 text-white lg:sticky lg:top-24">
              <h2 className="text-3xl font-bold mb-4">
                {authMode === "login" ? "Welcome Back!" : authMode === "otp" ? "Verify Email" : "Join Blue Sky Disposal"}
              </h2>
              <p className="text-blue-50 mb-8 text-lg">
                {authMode === "login"
                  ? "Sign in to access your account and manage your orders"
                  : authMode === "otp"
                  ? "We sent a 6-digit code to your email"
                  : "Create an account and get access to exclusive benefits"
                }
              </p>

              {/* Benefits */}
              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <benefit.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold">5K+</div>
                  <div className="text-sm text-blue-100">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-100">Service Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-blue-100">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              {/* Toggle Login/Signup */}
              <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${authMode === "login"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${authMode === "signup"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {authMode === "signup" && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Choose Account Type
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {userTypes.map((type) => (
                      <button
                        type="button"
                        key={type.type}
                        onClick={() => setUserType(type.type)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${userType === type.type
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${userType === type.type ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                            <type.icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{type.title}</div>
                            <div className="text-sm text-slate-600 mt-1">{type.description}</div>
                            {userType === type.type && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {type.benefits.map((benefit, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {authMode === "otp" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      6-Digit Verification Code
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter verification code"
                      className="text-center text-xl tracking-[0.25em] font-mono h-12"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                )}

                {authMode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-11"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                {authMode === "signup" && userType !== "customer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business/Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <Input
                        type="text"
                        placeholder="Enter business name"
                        className="pl-10 h-11"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {authMode !== "otp" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-11"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            className="pl-10 h-11"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {authMode === "login" && (
                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {authMode === "signup" && (
                  <label className="flex items-start gap-2 mt-4">
                    <input type="checkbox" className="mt-1 rounded border-slate-300" required />
                    <span className="text-sm text-slate-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold mt-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : authMode === "login" ? "Sign In" : authMode === "otp" ? "Verify Code" : "Create Account"}
                </Button>
              </form>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
