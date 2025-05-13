import React from 'react';

const SummaryCard = ({ title, value, icon, change, changeType = 'positive', color = 'blue' }) => {
  const getGradientClass = () => {
    switch (color) {
      case 'green':
        return 'from-success-400/10 to-success-500/5 text-success-700 border-success-200';
      case 'blue':
        return 'from-primary-400/10 to-primary-500/5 text-primary-700 border-primary-200';
      case 'red':
        return 'from-danger-400/10 to-danger-500/5 text-danger-700 border-danger-200';
      case 'purple':
        return 'from-purple-400/10 to-purple-500/5 text-purple-700 border-purple-200';
      default:
        return 'from-primary-400/10 to-primary-500/5 text-primary-700 border-primary-200';
    }
  };

  const getIconClass = () => {
    switch (color) {
      case 'green':
        return 'bg-success-100 text-success-600';
      case 'blue':
        return 'bg-primary-100 text-primary-600';
      case 'red':
        return 'bg-danger-100 text-danger-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all bg-gradient-to-br ${getGradientClass()}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <div className={`rounded-xl p-2.5 ${getIconClass()}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${
              changeType === 'positive' 
                ? 'bg-success-100 text-success-700' 
                : 'bg-danger-100 text-danger-700'
            }`}>
              <span className="mr-1">
                {changeType === 'positive' ? '↑' : '↓'}
              </span>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;