"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to request password reset");
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <Image
            src="https://images.unsplash.com/photo-1532189442095-2cc84918f88f?q=80&w=2000&auto=format&fit=crop"
            alt="Blue Sky Disposal Truck"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-blue-900/40 to-black/30" />

        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <span className="text-3xl font-bold">BS</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Don't Worry, <br />
            <span className="text-blue-400">We Got You.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            It happens to the best of us. Complete the steps to securely reset your password and get back to managing your waste disposal in no time.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full relative">
          
          <Link href="/auth" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-500">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#008CBA] hover:bg-[#007ba3] text-white text-base font-semibold shadow-lg shadow-blue-200"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Enter OTP & New Password */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <KeyRound className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                  <p className="text-gray-500 text-sm">
                    We sent a 6-digit verification code to<br/>
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyAndReset} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      6-Digit Verification Code
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. 123456"
                      maxLength={6}
                      className="text-center text-xl tracking-widest font-mono h-12 bg-gray-50 border-gray-200 focus:bg-white"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter new password"
                        className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Confirm new password"
                        className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 mt-2 bg-[#008CBA] hover:bg-[#007ba3] text-white text-base font-semibold shadow-lg shadow-blue-200"
                  >
                    {loading ? "Verifying..." : "Update Password"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email?{" "}
                    <button 
                      onClick={() => handleSendOtp()} 
                      disabled={loading}
                      className="text-blue-600 font-medium hover:underline disabled:opacity-50"
                    >
                      Click to resend
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-500 mb-8">
                  Your password has been changed securely. You can now log in with your new password.
                </p>
                <Button
                  onClick={() => router.push("/auth")}
                  className="w-full h-12 bg-[#008CBA] hover:bg-[#007ba3] text-white text-base font-semibold shadow-lg shadow-blue-200"
                >
                  Continue to Log In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
