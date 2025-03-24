import React from 'react';
import { Link } from 'react-router-dom';

function ResourceHubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resource Hub</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Access the latest information, research, and community support.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Knowledge Base</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/resources/mci-signs" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Understanding MCI and Early Alzheimer's Signs
              </Link>
            </li>
            <li>
              <Link to="/resources/prevention" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Prevention Strategies Based on Current Research
              </Link>
            </li>
            <li>
              <Link to="/resources/caregivers" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Caregiver Resources and Support
              </Link>
            </li>
            <li>
              <Link to="/resources/treatment" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Medication and Treatment Options
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Latest Research</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Study on Linguistic Markers</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Recent findings on how language changes can predict cognitive decline.</p>
              <Link to="/resources/article/linguistic-markers" className="mt-2 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Read More →
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Advances in Early Detection</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">How AI technology is revolutionizing early detection methods.</p>
              <Link to="/resources/article/ai-detection" className="mt-2 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceHubPage; 