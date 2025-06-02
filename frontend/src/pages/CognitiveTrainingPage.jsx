import React from 'react';
import { Link } from 'react-router-dom';

function CognitiveTrainingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cognitive Training</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Engage with our AI-generated cognitive exercises designed to strengthen your brain and potentially slow cognitive decline.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-100 dark:bg-primary-900 p-4">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-200">Word Association</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Challenge your semantic memory by finding connections between words.
            </p>
            <Link
              to="/cognitive-training/word-recall"
              className="inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              Start Exercise
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-secondary-100 dark:bg-secondary-900 p-4">
            <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">Reading Comprehension</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Practice understanding and recalling details from short passages of text.
            </p>
            <Link
              to="/cognitive-training/reading-comprehension"
              className="inline-block bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-600"
            >
              Start Exercise
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-neutral-100 dark:bg-neutral-700 p-4">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Verbal Fluency</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate as many words as possible within specific categories.
            </p>
            <Link
              to="/cognitive-training/language-fluency"
              className="inline-block bg-neutral-600 text-white py-2 px-4 rounded-md hover:bg-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-900"
            >
              Start Exercise
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-100 dark:bg-blue-900 p-4">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Category Naming Game</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enhance your semantic fluency by naming as many items as possible within a category.
            </p>
            <Link
              to="/cognitive-training/category-naming"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Start Exercise
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Log in to track your cognitive training progress over time and receive personalized recommendations.
        </p>
        <Link
          to="/login"
          className="inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 mr-4"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block bg-white text-primary-600 border border-primary-600 py-2 px-4 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-gray-700"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default CognitiveTrainingPage; 