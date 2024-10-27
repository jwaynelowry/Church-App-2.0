import React from 'react';

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="animate-pulse flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="mt-4 animate-pulse flex items-center">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}