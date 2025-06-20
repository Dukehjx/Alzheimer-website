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
import { useAuth } from '../contexts/AuthContext.jsx'; // Updated import

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
        value: 'N/A',
        change: '-',
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
        value: 'N/A',
        change: '-',
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
    const { currentUser } = useAuth();
    const [stats, setStats] = useState(initialStats);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!currentUser || !currentUser.id) {
                setError('User not available for fetching history.');
                setLoading(false);
                setStats(initialStats);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const historyData = await getAnalysisHistory(currentUser.id, 5);

                if (historyData && historyData.length > 0) {
                    const latestAnalysis = historyData[0];
                    const previousAnalysis = historyData.length > 1 ? historyData[1] : null;

                    const cognitiveScore = latestAnalysis.risk_score !== undefined
                        ? Math.round((1 - latestAnalysis.risk_score) * 100)
                        : null;

                    let cognitiveChange = '-';
                    let cognitiveTrend = 'up';

                    if (cognitiveScore !== null && previousAnalysis && previousAnalysis.risk_score !== undefined) {
                        const prevCognitiveScore = Math.round((1 - previousAnalysis.risk_score) * 100);
                        const diff = cognitiveScore - prevCognitiveScore;
                        cognitiveChange = `${diff >= 0 ? '+' : ''}${diff}%`;
                        cognitiveTrend = diff >= 0 ? 'up' : 'down';
                    }

                    setStats(prevStats => [
                        {
                            ...prevStats[0],
                            value: cognitiveScore !== null ? `${cognitiveScore}/100` : 'N/A',
                            change: cognitiveScore !== null ? cognitiveChange : '-',
                            trend: cognitiveTrend
                        },
                        prevStats[1],
                        prevStats[2],
                        prevStats[3]
                    ]);
                } else {
                    setStats(initialStats);
                    setError('No analysis history found to display dashboard stats.');
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data. Please try again later.');
                setStats(initialStats);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [currentUser]);

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
                            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Personalized Recommendations</h3>
                            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
                                <p>Based on your recent activity, consider these actions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Engage in a new cognitive game to challenge different skills.</li>
                                    <li>Explore resources on memory improvement techniques.</li>
                                    <li>Schedule your next AI screening in 4 weeks.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 gap-5">
                    {/* Quick Actions Card */}
                    <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Quick Actions</h3>
                            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Link to="/ai-screening" className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors">
                                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-1" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Start AI Screening</span>
                                </Link>
                                <Link to="/cognitive-training" className="flex flex-col items-center justify-center p-4 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-800/50 rounded-lg transition-colors">
                                    <BrainCustomIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-1" />
                                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Cognitive Training</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Recent Activity</h3>
                            <div className="mt-2 flow-root">
                                <ul className="-mb-4">
                                    {activities.map((activity, activityIdx) => (
                                        <li key={activity.id} className="mb-4">
                                            <div className="relative pb-4">
                                                {activityIdx !== activities.length - 1 ? (
                                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
                                                ) : null}
                                                <div className="relative flex items-start space-x-3">
                                                    <div>
                                                        <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${activity.iconBackground}`}>
                                                            <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            {activity.time}
                                                        </p>
                                                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                                                            {activity.description}
                                                        </p>
                                                        <Link to={activity.link} className="mt-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                            Learn more
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 