import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <p className="text-primary-600 text-sm font-semibold uppercase tracking-wide dark:text-primary-400">404 error</p>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">Page not found</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 