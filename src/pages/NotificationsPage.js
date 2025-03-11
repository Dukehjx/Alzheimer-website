import React from 'react';

function NotificationsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          View and manage your notifications.
        </p>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center h-20 text-neutral-500 dark:text-neutral-400">
            You have no notifications at this time.
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage; 