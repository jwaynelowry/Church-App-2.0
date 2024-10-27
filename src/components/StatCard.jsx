import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {value}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trendUp ? (
            <ArrowUp className={trendColors.up} size={16} />
          ) : (
            <ArrowDown className={trendColors.down} size={16} />
          )}
          <span className={`ml-1 text-sm ${trendUp ? trendColors.up : trendColors.down}`}>
            {trend}
          </span>
          <span className="ml-2 text-sm text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
}