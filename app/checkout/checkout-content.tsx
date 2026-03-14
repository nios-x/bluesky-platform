'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, Package, CheckCircle, ChevronRight } from 'lucide-react';

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    zipCode: '',
    projectType: 'residential',
    dumpsterSize: '20-yard',
    rentalDays: '7',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Pre-fill form data from URL parameters
  useEffect(() => {
    const zipcode = searchParams.get('zipcode');
    const size = searchParams.get('size');
    const type = searchParams.get('type');

    if (zipcode || size || type) {
      setFormData(prev => ({
        ...prev,
        zipCode: zipcode || prev.zipCode,
        dumpsterSize: mapSizeToId(size) || prev.dumpsterSize,
        projectType: mapProjectType(type) || prev.projectType
      }));
    }
  }, [searchParams]);

  const dumpsterSizes = [
    { id: '10-yard', name: '10 Yard', price: '$299', capacity: '2,500-3,500 lbs' },
    { id: '15-yard', name: '15 Yard', price: '$349', capacity: '3,500-4,500 lbs' },
    { id: '20-yard', name: '20 Yard', price: '$399', capacity: '6,000-8,000 lbs' },
    { id: '30-yard', name: '30 Yard', price: '$449', capacity: '9,000-12,000 lbs' }
  ];

  // Map size from hero (e.g., "10 Yard") to checkout format (e.g., "10-yard")
  const mapSizeToId = (size: string | null) => {
    if (!size) return null;
    return size.toLowerCase().replace(' ', '-');
  };

  // Map project type from hero format to checkout format
  const mapProjectType = (type: string | null) => {
    if (!type) return 'residential';
    const typeMap: Record<string, string> = {
      'Construction': 'construction',
      'Home Clean-Out': 'residential',
      'Landscape': 'commercial',
      'Roofing': 'construction'
    };
    return typeMap[type] || 'residential';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = formData.address && formData.zipCode;
  const isStep2Valid = formData.projectType && formData.dumpsterSize;
  const isStep3Valid = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <div className="flex-1 py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step}
                </motion.div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs md:text-sm font-semibold text-slate-600">
            <span className={currentStep >= 1 ? 'text-blue-600' : ''}>Location</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : ''}>Dumpster & Project</span>
            <span className={currentStep >= 3 ? 'text-blue-600' : ''}>Confirmation</span>
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
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <MapPin className="w-8 h-8 text-blue-600" />
                  Where do you need service?
                </h2>
                <p className="text-slate-600 ml-11">Enter your delivery address</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your street address"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Zip Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="Zip code"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="City (auto-filled)"
                      disabled
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 text-base"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-blue-600">✓ We serve this area</span> - Delivery available within 24 hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dumpster Selection */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-blue-600" />
                  Select Your Dumpster
                </h2>
                <p className="text-slate-600 ml-11">Choose the right size for your project</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">Project Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['residential', 'commercial', 'construction'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleInputChange('projectType', type)}
                      className={`p-4 rounded-xl border-2 font-semibold capitalize transition-all ${
                        formData.projectType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">Dumpster Size *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dumpsterSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleInputChange('dumpsterSize', size.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.dumpsterSize === size.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-300 bg-white hover:border-blue-400'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{size.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{size.price}</p>
                      <p className="text-xs text-slate-500 mt-1">{size.capacity}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">Rental Duration *</label>
                <select
                  value={formData.rentalDays}
                  onChange={(e) => handleInputChange('rentalDays', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-base"
                >
                  <option value="3">3 Days - $50 Discount</option>
                  <option value="7">7 Days - Standard</option>
                  <option value="14">14 Days - Save More</option>
                  <option value="30">30 Days - Best Value</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  Complete Your Order
                </h2>
                <p className="text-slate-600 ml-11">Review and confirm your details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-semibold text-slate-900">{formData.zipCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dumpster:</span>
                    <span className="font-semibold text-slate-900">{dumpsterSizes.find(s => s.id === formData.dumpsterSize)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-semibold text-slate-900">{formData.rentalDays} Days</span>
                  </div>
                  <div className="border-t border-blue-300 pt-3 flex justify-between">
                    <span className="font-bold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">$399</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">Confirmation Email</p>
                  <p className="text-green-700">We'll send confirmation and SMS reminder</p>
                </div>
              </div>
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

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
              className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold disabled:opacity-50 flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => alert('Order placed! Confirmation email sent.')}
              disabled={!isStep3Valid}
              className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
