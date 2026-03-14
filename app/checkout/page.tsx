'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    zipCode: '',
    dumpsterSize: '20 Yard',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [error, setError] = useState('');

  // Pre-fill from URL parameters
  useEffect(() => {
    const zipcode = searchParams.get('zipcode');
    const size = searchParams.get('size');

    if (zipcode || size) {
      setFormData(prev => ({
        ...prev,
        zipCode: zipcode || prev.zipCode,
        dumpsterSize: size || prev.dumpsterSize
      }));
    }
  }, [searchParams]);

  const dumpsterPrices: Record<string, string> = {
    '10 Yard': '$299',
    '15 Yard': '$349',
    '20 Yard': '$399',
    '30 Yard': '$449'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const isStep1Valid = formData.address && formData.zipCode && formData.firstName && formData.lastName && formData.email && formData.phone;
  const isStep2Valid = formData.cardNumber && formData.cardExpiry && formData.cardCVC;

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      setError('Please fill in all required fields');
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!isStep2Valid) {
      setError('Please enter valid payment details');
      return;
    }
    alert('✓ Booking Confirmed! You will receive a confirmation email shortly.');
    window.location.href = '/';
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator - 2 Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-[#08054C] to-[#0a0660] text-white shadow-lg'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step}
                  </motion.div>
                  {step < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        currentStep > step ? 'bg-gradient-to-r from-[#08054C] to-[#0a0660]' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm font-semibold text-slate-600">
              <span className={currentStep >= 1 ? 'text-[#08054C]' : ''}>Delivery Info</span>
              <span className={currentStep >= 2 ? 'text-[#08054C]' : ''}>Payment</span>
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 mb-8"
          >
            {/* Step 1: Delivery Info */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                    <MapPin className="w-8 h-8 text-[#08054C]" />
                    Delivery Details
                  </h2>
                  <p className="text-slate-600 ml-11">Where should we deliver your dumpster?</p>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Zip Code *</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="48201"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(313) 123-4567"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none transition-all text-base"
                    />
                  </div>

                  {/* Dumpster Size Display */}
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm font-bold text-blue-600 mb-1">DUMPSTER SIZE</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-slate-900">{formData.dumpsterSize}</p>
                      <p className="text-2xl font-bold text-blue-600">{dumpsterPrices[formData.dumpsterSize]}</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 font-semibold">
                    {error}
                  </motion.p>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                    <CreditCard className="w-8 h-8 text-[#08054C]" />
                    Payment
                  </h2>
                  <p className="text-slate-600 ml-11">Complete your booking securely</p>
                </div>

                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Customer:</span>
                        <span className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Address:</span>
                        <span className="font-semibold text-slate-900">{formData.address.substring(0, 30)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Dumpster:</span>
                        <span className="font-semibold text-slate-900">{formData.dumpsterSize}</span>
                      </div>
                      <div className="border-t border-blue-300 pt-3 flex justify-between">
                        <span className="font-bold text-slate-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">{dumpsterPrices[formData.dumpsterSize]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-900">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 1234 5678 9010"
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none text-base font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none text-base font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={3}
                        value={formData.cardCVC}
                        onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none text-base font-mono"
                      />
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 font-semibold">
                    {error}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
              className="px-8 py-3 rounded-xl border-2 border-slate-300 disabled:opacity-50"
            >
              Back
            </Button>

            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#08054C] to-[#0a0660] hover:from-[#0a0660] hover:to-[#0d0780] text-white font-bold disabled:opacity-50 flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStep2Valid}
                className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Booking
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
