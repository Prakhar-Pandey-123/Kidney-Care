import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Onboarding() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: '',
    weight: '',
    ckdStage: '',
    activityLevel: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.email || !formData.password)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 2 && (!formData.age || !formData.weight)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 3 && (!formData.ckdStage || !formData.activityLevel)) {
      setError('Please select all options');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const profile = {
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      ckdStage: parseInt(formData.ckdStage),
      activityLevel: formData.activityLevel
    };

    const result = await register(formData.email, formData.password, profile);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm font-medium text-gray-700">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Create Your Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your weight in kg"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Health Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">CKD Stage</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(stage => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setFormData({ ...formData, ckdStage: stage.toString() })}
                      className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                        formData.ckdStage === stage.toString()
                          ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Select your CKD stage (1-5)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
                <div className="space-y-2">
                  {['sedentary', 'light', 'moderate', 'active', 'very_active'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, activityLevel: level })}
                      className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-colors ${
                        formData.activityLevel === level
                          ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Review & Confirm</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{formData.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{formData.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CKD Stage:</span>
                <span className="font-medium">Stage {formData.ckdStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Activity:</span>
                <span className="font-medium">{formData.activityLevel.replace('_', ' ')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Not medical treatment. Awareness & tracking only.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <div className="ml-auto">
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


