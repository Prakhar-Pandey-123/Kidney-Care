import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Kidney3D from '../components/Kidney3D';

export default function Landing() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Login attempt started...', { email });
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling login function...');
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful! Redirecting to dashboard...');
        // Use React Router navigate instead of window.location
        navigate('/dashboard');
      } else {
        console.error('Login failed:', result.message);
        setError(result.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('An unexpected error occurred. Please check the console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 via-teal-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section with 3D Kidney */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Kidney Visualization */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative">
            <Kidney3D size={400} color="#3B82F6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6 animate-float">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full border border-blue-200 mb-4">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                💚 Kidney Health Tracking
              </span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Track Your Food,<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Support Your Kidneys
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-2xl mx-auto font-medium">
            A simple way to keep an eye on protein, potassium, phosphorus, and sodium in your meals.
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Awareness and tracking—no medical advice, just peace of mind.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/onboarding"
              className="group relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10">Get Started ✨</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-blue-600 font-bold py-5 px-10 rounded-2xl shadow-xl border-2 border-blue-300 hover:border-blue-400 transform hover:scale-105 transition-all duration-300 text-lg w-full sm:w-auto"
            >
              Sign In
            </button>
          </div>

          {/* Login Form */}
          {showLogin && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md mx-auto mt-8 border border-white/20">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Sign In</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-pulse">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        <p className="text-red-700 text-sm font-bold mb-2">{error}</p>
                        {error.includes('connect to server') && (
                          <div className="bg-red-100 p-3 rounded mt-2">
                            <p className="text-red-800 text-xs font-semibold mb-1">Quick Fix:</p>
                            <ol className="text-red-700 text-xs list-decimal list-inside space-y-1">
                              <li>Open terminal in project folder</li>
                              <li>Run: <code className="bg-red-200 px-2 py-1 rounded font-mono">npm run dev</code></li>
                              <li>Wait for "Server running on port 5000"</li>
                              <li>Try signing in again</li>
                            </ol>
                          </div>
                        )}
                        {error.includes('Invalid email or password') && (
                          <div className="bg-red-100 p-3 rounded mt-2">
                            <p className="text-red-800 text-xs font-semibold mb-1">Don't have an account?</p>
                            <Link to="/onboarding" className="text-red-700 text-xs underline font-semibold hover:text-red-900">
                              → Click here to create one
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Trust Elements */}
          <div className="mt-12 text-sm text-gray-600">
            <p>Not medical treatment. Awareness & tracking only.</p>
            <p className="mt-2">Your data stays private</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
          Simple, Calm, Patient-Focused
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Everything you need in one beautiful dashboard</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border-2 border-blue-100 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📸</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Upload or Type</h3>
            <p className="text-gray-600 leading-relaxed">Take a photo or simply type your food name. Our AI estimates nutrients instantly.</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border-2 border-teal-100 hover:border-teal-300 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">See Nutrients</h3>
            <p className="text-gray-600 leading-relaxed">View your daily totals compared to safe ranges—all in one calm dashboard.</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border-2 border-purple-100 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔔</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Stay Informed</h3>
            <p className="text-gray-600 leading-relaxed">Get gentle reminders when you're approaching limits or need more nutrients.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

