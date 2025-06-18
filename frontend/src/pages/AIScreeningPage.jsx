import React, { useState } from 'react';
import TextAnalysis from '../components/TextAnalysis';
import AudioRecorder from '../components/AudioRecorder';

function AIScreeningPage() {
  const [activeTab, setActiveTab] = useState('text');  // Default to text tab

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Screening</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Upload your speech or text samples for AI analysis of potential cognitive decline markers.</p>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'text'
            ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          onClick={() => setActiveTab('text')}
        >
          Text Analysis
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'audio'
            ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          onClick={() => setActiveTab('audio')}
        >
          Audio Analysis
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full overflow-hidden">
        {activeTab === 'text' ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Text Analysis</h3>
            <TextAnalysis />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Audio Analysis</h3>
            <AudioRecorder />
          </>
        )}
      </div>
    </div>
  );
}

export default AIScreeningPage; 