export default function NutrientCard({ nutrient, total, limit, status }) {
  const percentage = Math.min((total / limit) * 100, 100);
  
  const colorMap = {
    safe: 'green',
    warning: 'yellow',
    low: 'yellow',
    high: 'red'
  };

  const color = colorMap[status.status] || 'gray';
  
  const gradientClasses = {
    green: 'from-green-400 via-emerald-400 to-teal-400',
    yellow: 'from-yellow-400 via-amber-400 to-orange-400',
    red: 'from-red-400 via-rose-400 to-pink-400',
    gray: 'from-gray-400 to-gray-500'
  };

  const bgGradientClasses = {
    green: 'from-green-50 via-emerald-50 to-teal-50',
    yellow: 'from-yellow-50 via-amber-50 to-orange-50',
    red: 'from-red-50 via-rose-50 to-pink-50',
    gray: 'from-gray-50 to-gray-100'
  };

  const borderClasses = {
    green: 'border-green-300',
    yellow: 'border-yellow-300',
    red: 'border-red-300',
    gray: 'border-gray-300'
  };

  const icons = {
    protein: '🥩',
    potassium: '🍌',
    phosphorus: '🥛',
    sodium: '🧂'
  };

  const nutrientNames = {
    protein: 'Protein',
    potassium: 'Potassium',
    phosphorus: 'Phosphorus',
    sodium: 'Sodium'
  };

  const units = {
    protein: 'g',
    potassium: 'mg',
    phosphorus: 'mg',
    sodium: 'mg'
  };

  return (
    <div className={`bg-gradient-to-br ${bgGradientClasses[color]} rounded-2xl p-6 border-2 ${borderClasses[color]} shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClasses[color]} flex items-center justify-center text-2xl shadow-lg`}>
              {icons[nutrient]}
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {nutrientNames[nutrient]}
            </h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{total.toFixed(1)}</p>
              <p className="text-xs text-gray-600">{units[nutrient]}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Limit</p>
              <p className="text-lg font-semibold text-gray-700">{limit.toFixed(1)}{units[nutrient]}</p>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="h-4 bg-white/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${gradientClasses[color]} rounded-full transition-all duration-500 ease-out relative`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-600">0%</span>
              <span className="text-xs font-semibold text-gray-700">{percentage.toFixed(0)}%</span>
              <span className="text-xs text-gray-600">100%</span>
            </div>
          </div>
          
          <div className={`mt-3 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm`}>
            <p className={`text-sm font-medium ${
              color === 'green' ? 'text-green-700' :
              color === 'yellow' ? 'text-yellow-700' :
              color === 'red' ? 'text-red-700' :
              'text-gray-700'
            }`}>
              {status.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


