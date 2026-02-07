import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function NotificationsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const positiveAlerts = alerts.filter(a => a.type === 'info');
  const warningAlerts = alerts.filter(a => a.type === 'warning' || a.type === 'low');
  const highAlerts = alerts.filter(a => a.type === 'high');

  return (
    <div className="space-y-4">
      {/* Positive Messages */}
      {positiveAlerts.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">Great News!</h3>
              {positiveAlerts.map((alert, idx) => (
                <p key={idx} className="text-green-800 font-medium leading-relaxed">
                  {alert.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* High Priority Alerts */}
      {highAlerts.map((alert, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Attention Needed</h3>
              <p className="text-red-800 font-medium leading-relaxed mb-3">{alert.message}</p>
              <div className="bg-white/50 rounded-lg p-3 mt-3">
                <p className="text-sm text-red-700">
                  <span className="font-semibold">Current:</span> {alert.intake?.toFixed(1)} |{' '}
                  <span className="font-semibold">Limit:</span> {alert.limit?.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Warning Alerts */}
      {warningAlerts.map((alert, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Friendly Reminder</h3>
              <p className="text-yellow-800 font-medium leading-relaxed">{alert.message}</p>
              {alert.intake && alert.limit && (
                <div className="bg-white/50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-semibold">Current:</span> {alert.intake.toFixed(1)} |{' '}
                    <span className="font-semibold">Limit:</span> {alert.limit.toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">💚</span>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">All Good!</h3>
          <p className="text-blue-700">Your nutrient levels are looking great today. Keep up the excellent work!</p>
        </div>
      )}
    </div>
  );
}

