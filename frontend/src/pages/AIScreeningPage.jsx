import React from 'react';
import TextAnalysis from '../components/TextAnalysis';

function AIScreeningPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Screening</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Upload your speech or text samples for AI analysis of potential cognitive decline markers.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload Audio Sample</h3>
          <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 mb-4">
            Select Audio File
          </button>
          <p className="text-center text-gray-500 dark:text-gray-400 my-2">or</p>
          <button className="w-full bg-white text-primary-600 border border-primary-600 py-2 px-4 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-gray-600">
            Record Audio
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Text Analysis</h3>
          <TextAnalysis />
        </div>
      </div>
    </div>
  );
}

export default AIScreeningPage; 