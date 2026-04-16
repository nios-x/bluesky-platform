'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  getRecommendation,
  parseRecommendationResponse,
  formatPrice,
  fileToBase64,
  isValidZipCode,
} from '@/lib/utils/recommendation';

/**
 * Example AI Recommendation Component
 * Demonstrates how to integrate the recommendation system into your UI
 */
export default function AIRecommendationForm() {
  // Form state
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'image'
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Result state
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle image file selection
   */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate inputs
    if (!zipCode) {
      toast.error('Please enter your ZIP code');
      return;
    }

    if (!isValidZipCode(zipCode)) {
      toast.error('Invalid ZIP code format (XXXXX or XXXXX-XXXX)');
      return;
    }

    if (inputMode === 'text' && !textInput.trim()) {
      toast.error('Please describe your project');
      return;
    }

    if (inputMode === 'image' && !selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      let imageBase64 = null;

      // Convert image to base64 if using image mode
      if (inputMode === 'image' && selectedImage) {
        imageBase64 = await fileToBase64(selectedImage);
      }

      // Call recommendation API
      const data = await getRecommendation({
        text: inputMode === 'text' ? textInput : null,
        imageBase64,
        zipCode,
      });

      // Parse and display result
      const parsed = parseRecommendationResponse(data);

      if (parsed.error) {
        setError(parsed.error);
        toast.error(parsed.error);
      } else {
        setResult(parsed);
        toast.success(
          `Recommended: ${parsed.recommendation.size}yd ${parsed.recommendation.displayType}`
        );
      }
    } catch (err) {
      const message = err.message || 'Failed to get recommendation';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">Smart Dumpster Recommendation</h1>
        <p className="text-gray-600 mb-6">
          Tell us about your project or upload an image of your debris
        </p>

        {/* Input Mode Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setInputMode('text');
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className={`flex-1 py-2 px-4 rounded font-medium transition ${
              inputMode === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📝 Text Description
          </button>
          <button
            onClick={() => {
              setInputMode('image');
              setTextInput('');
            }}
            className={`flex-1 py-2 px-4 rounded font-medium transition ${
              inputMode === 'image'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📸 Upload Image
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ZIP Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g., 48038 or 48038-1234"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe your project and the materials you need to dispose of. E.g., 'Kitchen remodel with mixed construction debris' or 'Removing a concrete driveway'"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Image Input */}
          {inputMode === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover mx-auto rounded"
                      />
                      <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-4xl">📸</p>
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && !error && (
        <div className="space-y-4">
          {/* Main Recommendation */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ Recommended Dumpster
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded p-4">
                <p className="text-gray-600 text-sm">Size</p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.recommendation.size} yards
                </p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="text-gray-600 text-sm">Type</p>
                <p className="text-lg font-bold text-gray-800">
                  {result.recommendation.displayType}
                </p>
              </div>
            </div>

            <div className="bg-white rounded p-4 space-y-2 mb-4">
              <div>
                <p className="text-gray-600 text-sm">Project Type</p>
                <p className="font-semibold text-gray-800">
                  {result.recommendation.projectType}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Material Type</p>
                <p className="font-semibold text-gray-800">
                  {result.recommendation.materialType}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Estimated Volume</p>
                <p className="font-semibold text-gray-800">
                  {result.recommendation.displayVolume}
                </p>
              </div>
              {result.ai.ruleApplied && (
                <div>
                  <p className="text-gray-600 text-sm">Applied Rule</p>
                  <p className="font-semibold text-orange-600">
                    {result.ai.ruleApplied}
                  </p>
                </div>
              )}
            </div>

            {/* Confidence Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">Confidence</p>
                <p className="font-semibold text-gray-800">{result.confidence}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          {result.pricing && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Pricing Estimate</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Base Price:</span>
                  <span className="font-semibold">{result.pricing.formattedBase}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold">{result.pricing.formattedShipping}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Included: {result.pricing.included_days} days, {result.pricing.included_tons} tons</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {result.pricing.formattedTotal}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Proceed to Booking
              </button>
            </div>
          )}

          {/* Debug Info */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-gray-700">
              📊 Debug Information
            </summary>
            <div className="mt-4 space-y-2 text-sm font-mono bg-white p-3 rounded overflow-auto max-h-64">
              <div>
                <p className="text-gray-600">Raw AI Response:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                  {JSON.stringify(result.ai.rawResponse, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
