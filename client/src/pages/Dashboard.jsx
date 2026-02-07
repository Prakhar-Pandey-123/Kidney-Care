import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import NutrientCard from '../components/NutrientCard';
import NotificationsPanel from '../components/NotificationsPanel';
import Kidney3D from '../components/Kidney3D';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mealCount, setMealCount] = useState(0);

  useEffect(() => {
    fetchDailyData();
    const interval = setInterval(fetchDailyData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDailyData = async () => {
    try {
      const response = await api.getDailyNutrition();
      setDailyData(response.data);
      setMealCount(response.data.mealCount || 0);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="relative">
            <Kidney3D size={120} color="#3B82F6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const nutrients = ['protein', 'potassium', 'phosphorus', 'sodium'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
                <span className="text-xl">💚</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Kidney Care</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/insights"
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium transition-colors"
              >
                📊 Insights
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Status Header with 3D Kidney */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Today's Status</h2>
            <p className="text-gray-600 text-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:block">
            <Kidney3D size={120} color="#3B82F6" />
          </div>
        </div>

        {/* Nutrient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {nutrients.map(nutrient => {
            if (!dailyData) return null;
            const total = dailyData.totals[nutrient]?.value || 0;
            const limit = dailyData.limits[nutrient]?.value || 1;
            const status = dailyData.status[nutrient] || { status: 'safe', message: 'In safe range' };
            
            return (
              <NutrientCard
                key={nutrient}
                nutrient={nutrient}
                total={total}
                limit={limit}
                status={status}
              />
            );
          })}
        </div>

        {/* Primary CTA - Add Food */}
        <div className="mb-8">
          <Link
            to="/add-food"
            className="group relative block w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-xl text-center overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl">➕</span>
              <span>Add Food</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
        </div>

        {/* Notifications & Alerts Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">🔔</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Notifications & Alerts</h3>
          </div>
          <NotificationsPanel />
        </div>

        {/* Daily Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-2 border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            Daily Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total meals logged:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{mealCount}</span>
            </div>
            {mealCount === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-yellow-800 font-medium">✨ Add your first meal to start tracking your nutrients!</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-purple-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">📈</span>
            Weekly Preview
          </h3>
          <p className="text-gray-600 mb-4">
            View detailed insights and trends in your Insights page.
          </p>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span>View Full Insights</span>
            <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}


