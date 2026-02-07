import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import Kidney3D from '../components/Kidney3D';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie
} from 'recharts';

export default function Insights() {
  const { logout } = useAuth();
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        api.getDailyNutrition(),
        api.getWeeklyNutrition()
      ]);
      setDailyData(dailyRes.data);
      setWeeklyData(weeklyRes.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
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
          <p className="mt-6 text-gray-600 font-medium">Loading insights...</p>
        </div>
      </div>
    );
  }

  // Prepare daily bar chart data with colors
  const dailyChartData = dailyData ? [
    {
      name: 'Protein',
      intake: dailyData.totals.protein.value,
      limit: dailyData.limits.protein.value,
      percentage: Math.min((dailyData.totals.protein.value / dailyData.limits.protein.value) * 100, 100),
      color: '#3B82F6'
    },
    {
      name: 'Potassium',
      intake: dailyData.totals.potassium.value,
      limit: dailyData.limits.potassium.value,
      percentage: Math.min((dailyData.totals.potassium.value / dailyData.limits.potassium.value) * 100, 100),
      color: '#10B981'
    },
    {
      name: 'Phosphorus',
      intake: dailyData.totals.phosphorus.value,
      limit: dailyData.limits.phosphorus.value,
      percentage: Math.min((dailyData.totals.phosphorus.value / dailyData.limits.phosphorus.value) * 100, 100),
      color: '#F59E0B'
    },
    {
      name: 'Sodium',
      intake: dailyData.totals.sodium.value,
      limit: dailyData.limits.sodium.value,
      percentage: Math.min((dailyData.totals.sodium.value / dailyData.limits.sodium.value) * 100, 100),
      color: '#EF4444'
    }
  ] : [];

  // Prepare weekly line chart data with formatted dates
  const weeklyChartData = weeklyData?.data ? weeklyData.data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })) : [];

  // Prepare pie chart data for overall status
  const pieData = dailyChartData.map(item => ({
    name: item.name,
    value: item.percentage,
    color: item.color
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border-2 border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value.toFixed(1)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-xl">📊</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Insights</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium transition-colors"
              >
                💚 Dashboard
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
        {/* Hero Section with 3D Kidney */}
        <div className="mb-8 flex items-center justify-between bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
          <div>
            <h2 className="text-4xl font-extrabold mb-2">Nutrient Insights</h2>
            <p className="text-blue-100 text-lg">Track your progress and stay healthy</p>
          </div>
          <div className="hidden md:block">
            <Kidney3D size={150} color="#FFFFFF" />
          </div>
        </div>

        {/* Daily Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dailyChartData.map((item, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: item.color }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Intake</span>
                  <span className="font-bold text-gray-900">{item.intake.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Limit</span>
                  <span className="font-bold text-gray-700">{item.limit.toFixed(1)}</span>
                </div>
                <div className="mt-3">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.percentage.toFixed(0)}% of limit</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Nutrient Bars - Enhanced */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Today's Nutrient Levels
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                {dailyChartData.map((item, index) => (
                  <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontWeight: 'bold' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="intake" name="Today's Intake" radius={[10, 10, 0, 0]}>
                {dailyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#color${index})`} />
                ))}
              </Bar>
              <Bar dataKey="limit" name="Daily Limit" fill="#E5E7EB" radius={[10, 10, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🥧</span>
            Overall Status
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Comparison - Enhanced */}
        {weeklyChartData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-teal-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              Weekly Trends
            </h2>
            <div className="space-y-10">
              {/* Protein */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🥩</span>
                  Protein
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="protein"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#proteinGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => weeklyData?.limits?.protein || 0}
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Limit"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Potassium */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🍌</span>
                  Potassium
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="potassiumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="potassium"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#potassiumGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => weeklyData?.limits?.potassium || 0}
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Limit"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Phosphorus */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🥛</span>
                  Phosphorus
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="phosphorusGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="phosphorus"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      fill="url(#phosphorusGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => weeklyData?.limits?.phosphorus || 0}
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Limit"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Sodium */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🧂</span>
                  Sodium
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sodiumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sodium"
                      stroke="#EF4444"
                      strokeWidth={3}
                      fill="url(#sodiumGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => weeklyData?.limits?.sodium || 0}
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Limit"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Pattern Insights */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            Pattern Insights
          </h2>
          {weeklyChartData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-700 text-lg font-medium mb-2">
                Start logging your meals to see insights and patterns over time.
              </p>
              <p className="text-gray-600">Track consistently for the best insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-200">
                <p className="text-lg text-blue-900 font-semibold mb-2">
                  ✨ <strong>Tip:</strong> Track your meals consistently to see helpful patterns and trends.
                </p>
                <p className="text-blue-700">
                  These charts show your intake over the past 7 days compared to your safe limits.
                  Stay within the recommended ranges for optimal kidney health awareness.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-1">✅ Consistency</p>
                  <p className="text-xs text-green-700">Keep logging daily for accurate insights</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">📈 Trends</p>
                  <p className="text-xs text-blue-700">Watch for patterns in your nutrient intake</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-900 mb-1">🎯 Goals</p>
                  <p className="text-xs text-purple-700">Stay within safe ranges for optimal health</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


