export default function AlertBanner({ alert }) {
  const colorMap = {
    high: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800' },
    low: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800' },
    info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' }
  };

  const colors = colorMap[alert.type] || colorMap.info;

  return (
    <div className={`${colors.bg} border-l-4 ${colors.border} p-4 rounded-r-lg mb-4`}>
      <p className={`${colors.text} text-sm font-medium`}>{alert.message}</p>
    </div>
  );
}


