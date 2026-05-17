"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add actual reset logic here
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
            It happens to the best of us. Enter your email and we'll help you get back to managing your waste disposal in no time.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Back to Login */}
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-500">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input type="email" required placeholder="name@example.com" className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-[#008CBA] hover:bg-[#007ba3] text-white text-base font-semibold shadow-lg shadow-blue-200">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100 animate-in fade-in zoom-in duration-300">
              <h3 className="text-green-800 font-bold text-lg mb-2">Check your email</h3>
              <p className="text-green-700">
                We've sent a password reset link to your email address.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="link"
                className="text-green-800 font-semibold mt-4"
              >
                Click to resend
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
