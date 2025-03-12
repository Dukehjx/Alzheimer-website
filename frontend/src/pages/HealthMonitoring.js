import React from 'react';

export default function HealthMonitoring() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Health Monitoring</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Track your cognitive health metrics over time and gain insights into your progress.
        </p>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Coming Soon</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Our health monitoring dashboard is currently under development. It will provide visualization of your cognitive assessment history, trends, and personalized insights based on your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 