import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { getAnalysisHistory } from '../api/aiService';

// Custom Brain icon if not available in Heroicons
const BrainCustomIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18c.33 0 .6-.27.6-.6V7.8c0-.17.17-.3.34-.24l5.34 1.8c.23.08.47-.07.47-.3V7.5c0-.13-.08-.24-.2-.28l-5.8-1.94c-.1-.03-.21-.03-.3 0l-5.8 1.94c-.12.04-.2.15-.2.28v1.56c0 .23.24.38.47.3l5.34-1.8c.17-.06.34.07.34.24v9.6c0 .33.27.6.6.6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10v4a4 4 0 0 0 8 0v-4"
    />
  </svg>
);

// Initial empty stats data structure
const initialStats = [
  {
    name: 'Cognitive Score',
    value: '0/100',
    change: '0%',
    trend: 'up',
    icon: BrainCustomIcon,
    iconBackground: 'bg-primary-100 dark:bg-primary-900',
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
  {
    name: 'Training Sessions',
    value: '0',
    change: '0',
    trend: 'up',
    icon: ChartBarIcon,
    iconBackground: 'bg-secondary-100 dark:bg-secondary-900',
    iconColor: 'text-secondary-600 dark:text-secondary-400',
  },
  {
    name: 'Language Complexity',
    value: '0/100',
    change: '0%',
    trend: 'up',
    icon: ChatBubbleLeftRightIcon,
    iconBackground: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    name: 'Reaction Time',
    value: '0ms',
    change: '0ms',
    trend: 'up',
    icon: ClockIcon,
    iconBackground: 'bg-indigo-100 dark:bg-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
];

// Sample activity data
const activities = [
  {
    id: 1,
    title: 'Completed Speech Analysis',
    time: '2 hours ago',
    icon: ChatBubbleLeftRightIcon,
    iconBackground: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Your latest speech sample has been analyzed. View your results for detailed insights.',
    link: '/ai-screening',
  },
  {
    id: 2,
    title: 'Cognitive Training Reminder',
    time: '1 day ago',
    icon: BrainCustomIcon,
    iconBackground: 'bg-primary-100 dark:bg-primary-900',
    iconColor: 'text-primary-600 dark:text-primary-400',
    description: 'It\'s time for your daily cognitive training exercise. Keep your mind sharp!',
    link: '/cognitive-training',
  },
  {
    id: 3,
    title: 'New Research Article',
    time: '3 days ago',
    icon: DocumentTextIcon,
    iconBackground: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
    description: 'New research on lifestyle factors affecting cognitive health has been published in our resource hub.',
    link: '/resource-hub',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch analysis history from the API
        const historyData = await getAnalysisHistory(5);

        if (historyData && historyData.length > 0) {
          // Get the most recent analysis
          const latestAnalysis = historyData[0];
          // Compare with the previous analysis if available
          const previousAnalysis = historyData.length > 1 ? historyData[1] : null;

          // Calculate the cognitive score from the analysis
          const cognitiveScore = Math.round(latestAnalysis.cognitive_score * 100);
          let cognitiveChange = '0%';
          let cognitiveTrend = 'up';

          if (previousAnalysis) {
            const prevScore = Math.round(previousAnalysis.cognitive_score * 100);
            const diff = cognitiveScore - prevScore;
            cognitiveChange = `${diff >= 0 ? '+' : ''}${diff}%`;
            cognitiveTrend = diff >= 0 ? 'up' : 'down';
          }

          // Calculate language complexity from domain scores (if available)
          let languageScore = 0;
          let languageChange = '0%';
          let languageTrend = 'up';

          if (latestAnalysis.domain_scores) {
            // Find the language domain score
            const languageDomain = Object.keys(latestAnalysis.domain_scores)
              .find(key => key.toLowerCase().includes('language'));

            if (languageDomain) {
              languageScore = Math.round(latestAnalysis.domain_scores[languageDomain] * 100);

              if (previousAnalysis && previousAnalysis.domain_scores) {
                const prevLanguageScore = Math.round(previousAnalysis.domain_scores[languageDomain] * 100);
                const diff = languageScore - prevLanguageScore;
                languageChange = `${diff >= 0 ? '+' : ''}${diff}%`;
                languageTrend = diff >= 0 ? 'up' : 'down';
              }
            }
          }

          // Update the stats with real data
          setStats(prevStats => [
            {
              ...prevStats[0],
              value: `${cognitiveScore}/100`,
              change: cognitiveChange,
              trend: cognitiveTrend
            },
            // Keep training sessions as is for now (would need another API for this)
            prevStats[1],
            {
              ...prevStats[2],
              value: `${languageScore || 0}/100`,
              change: languageChange,
              trend: languageTrend
            },
            // Keep reaction time as is for now (would need another API for this)
            prevStats[3]
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Welcome back! Here's an overview of your cognitive health and recent activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white dark:bg-neutral-800 shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${stat.iconBackground} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-4 w-full">
                  <p className="truncate text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {loading ? '...' : stat.value}
                    </p>
                    <div
                      className={`flex items-center text-sm font-medium ${stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-500'
                        : 'text-red-600 dark:text-red-500'
                        }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      )}
                      {loading ? '...' : stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show error if any */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Cognitive Trends */}
        <div className="col-span-2 grid grid-cols-1 gap-5">
          {/* Chart Card */}
          <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Cognitive Health Trends</h3>
              <div className="mt-2">
                <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-700 rounded-md flex items-center justify-center">
                  <p className="text-neutral-500 dark:text-neutral-400">Chart visualization will be implemented here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">AI Recommendations</h3>
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-primary-50 dark:bg-primary-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <BrainCustomIcon className="h-5 w-5 text-primary-500 dark:text-primary-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">Increase Word Variety</h3>
                      <div className="mt-2 text-sm text-primary-700 dark:text-primary-300">
                        <p>Your vocabulary diversity has slightly decreased. Consider reading more diverse materials and practicing word puzzles to expand your vocabulary.</p>
                      </div>
                      <div className="mt-3">
                        <Link to="/cognitive-training" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          Start Training →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-secondary-50 dark:bg-secondary-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-secondary-500 dark:text-secondary-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-secondary-800 dark:text-secondary-200">Diet & Sleep Optimization</h3>
                      <div className="mt-2 text-sm text-secondary-700 dark:text-secondary-300">
                        <p>Based on your profile, improved sleep quality and omega-3 rich foods could help maintain cognitive function.</p>
                      </div>
                      <div className="mt-3">
                        <Link to="/resource-hub" className="text-sm font-medium text-secondary-600 hover:text-secondary-500 dark:text-secondary-400 dark:hover:text-secondary-300">
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700">
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="relative flex space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${activity.iconBackground}`}>
                      <activity.icon className={`h-6 w-6 ${activity.iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                        <Link to={activity.link} className="hover:underline focus:outline-none">
                          {activity.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{activity.description}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-center">
                <Link to="/activity" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  View all activity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg flex flex-col">
          <div className="px-4 py-5 sm:p-6 flex-grow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">AI Screening</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Submit speech or text for analysis</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/ai-screening"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full justify-center"
              >
                Start Screening
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg flex flex-col">
          <div className="px-4 py-5 sm:p-6 flex-grow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-100 dark:bg-secondary-900 rounded-md p-3">
                <BrainCustomIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Training Games</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Exercise your cognitive abilities</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/cognitive-training"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 w-full justify-center"
              >
                Start Training
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg flex flex-col">
          <div className="px-4 py-5 sm:p-6 flex-grow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Resources</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Explore prevention strategies</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/resource-hub"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
              >
                View Resources
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg flex flex-col">
          <div className="px-4 py-5 sm:p-6 flex-grow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Monitoring</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Track your cognitive health</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/health-monitoring"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 