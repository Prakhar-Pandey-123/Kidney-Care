import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function AddFood() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('text'); // 'text' or 'image'
  const [foodName, setFoodName] = useState('');
  const [image, setImage] = useState(null);
  const [portionSize, setPortionSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: review

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFoodName(file.name);
    }
  };

  const handleEstimate = async () => {
    if (mode === 'text' && !foodName.trim()) {
      setError('Please enter a food name');
      return;
    }
    if (mode === 'image' && !image) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.estimateNutrition({
        foodName: mode === 'text' ? foodName : null,
        image: mode === 'image' ? image : null,
        portionSize
      });

      setEstimation(response.data);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to estimate nutrition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!estimation) return;

    setLoading(true);
    setError('');

    try {
      await api.logFood({
        foodName: estimation.foodName,
        portionSize: estimation.portionSize,
        portionUnit: 'g',
        nutrients: estimation.nutrients,
        confidenceScore: estimation.confidenceScore
      });

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to log food. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add Food</h1>
          <p className="text-gray-600 mt-2">Upload an image or type the food name</p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Mode Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode('text')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  mode === 'text'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Type Food Name
              </button>
              <button
                onClick={() => setMode('image')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  mode === 'image'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Upload Image
              </button>
            </div>

            {/* Input Section */}
            {mode === 'text' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., Grilled Chicken, Banana, Rice..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleEstimate()}
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    {image ? (
                      <div>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg mb-2"
                        />
                        <p className="text-sm text-gray-600">{image.name}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Portion Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portion Size (grams)
              </label>
              <input
                type="number"
                value={portionSize}
                onChange={(e) => setPortionSize(parseInt(e.target.value) || 100)}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleEstimate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors duration-200 text-lg disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Estimate Nutrients'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Approximate values for awareness only
            </p>
          </div>
        )}

        {step === 2 && estimation && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>

            {/* Detected Food */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Detected Food</p>
              <p className="text-lg font-semibold text-gray-900">{estimation.foodName}</p>
              <p className="text-sm text-gray-500 mt-1">Portion: {estimation.portionSize}g</p>
            </div>

            {/* Nutrients Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrients</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {estimation.nutrients.protein.value} {estimation.nutrients.protein.unit}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Potassium</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {estimation.nutrients.potassium.value} {estimation.nutrients.potassium.unit}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Phosphorus</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {estimation.nutrients.phosphorus.value} {estimation.nutrients.phosphorus.unit}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sodium</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {estimation.nutrients.sodium.value} {estimation.nutrients.sodium.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> These are approximate values for awareness only. Not medical treatment.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Confirm & Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


