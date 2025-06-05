import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    DocumentTextIcon,
    PlayIcon,
    BookOpenIcon,
    CogIcon,
    BellIcon,
    CalendarIcon,
    TrophyIcon,
    HeartIcon,
    UserIcon,
    PlusIcon,
    AcademicCapIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { getAnalysisHistory } from '../api/aiService';
import { getProgressMetrics } from '../api/cognitiveTrainingService';
import { useAuth } from '../contexts/AuthContext';

// Array of brain health tips
const brainHealthTips = [
    "Take a brisk walk daily to improve blood flow to the brain.",
    "Eat leafy greens like spinach and kale for cognitive support.",
    "Stay socially active to help lower the risk of dementia.",
    "Limit added sugars to protect your memory.",
    "Sleep 7–9 hours each night to help clear brain waste.",
    "Learn a new skill to stimulate brain connections.",
    "Drink enough water—dehydration can impair thinking.",
    "Practice meditation to lower stress and support brain health.",
    "Eat salmon for omega-3 fatty acids that support neurons.",
    "Don't smoke—smoking accelerates brain aging.",
    "Play puzzles and logic games to strengthen your mind.",
    "Keep blood pressure in check to reduce dementia risk.",
    "Eat blueberries and strawberries—they're rich in antioxidants.",
    "Protect your head—wear helmets when needed.",
    "Go to bed and wake up at the same time every day.",
    "Read books often to strengthen verbal memory.",
    "Listen to music—it engages multiple brain regions.",
    "Avoid excessive alcohol—it can shrink your brain.",
    "Choose whole foods over processed ones.",
    "Stay curious and keep learning.",
    "Take breaks throughout the day to refocus.",
    "Drink green tea—it contains helpful brain compounds.",
    "Use checklists to ease mental load.",
    "Get sunlight for healthy vitamin D levels.",
    "Practice daily gratitude for emotional well-being.",
    "Eat walnuts—they're great for your brain.",
    "Take walks in nature to reduce stress.",
    "Use both hands for tasks to challenge your brain.",
    "Try mindful breathing to sharpen focus.",
    "Check your hearing and vision regularly.",
    "Use your non-dominant hand to build brain agility.",
    "Keep learning throughout life to build brain reserve.",
    "Volunteer to stay socially and mentally engaged.",
    "Cut out trans fats—they damage brain cells.",
    "Add turmeric to meals—it may reduce brain inflammation.",
    "Try tai chi or yoga for mental clarity.",
    "Write by hand to engage your brain differently.",
    "Eat legumes and whole grains for steady energy.",
    "Avoid multitasking to improve memory.",
    "Keep track of your mood—it impacts cognition.",
    "Get consistent, quality sleep every night.",
    "Drink water first thing in the morning.",
    "Try new routines to keep your brain adaptable.",
    "Practice slow breathing to reduce cortisol levels.",
    "Eat avocados—they contain healthy fats.",
    "Spend time with loved ones regularly.",
    "Use mnemonic devices to retain information.",
    "Laugh—it boosts brain activity and mood.",
    "Cook at home to control your brain-friendly diet.",
    "Get up and move every hour if you sit often.",
    "Do balance exercises to prevent falls and injuries.",
    "Learn a new language to enhance memory.",
    "Play an instrument—it strengthens brain circuits.",
    "Prioritize fiber-rich foods for overall health.",
    "Keep your cholesterol in a healthy range.",
    "Avoid overusing screens—give your eyes and brain breaks.",
    "Label items in your home to support memory.",
    "Try brain training apps in moderation.",
    "Organize your day with a written schedule.",
    "Watch documentaries to learn while relaxing.",
    "Avoid high-sodium foods—they may affect blood flow.",
    "Try oil-based dressings for healthy fats.",
    "Use reminders and alarms to support routines.",
    "Practice recalling names and stories actively.",
    "Take stairs instead of the elevator.",
    "Learn about history or science to expand knowledge.",
    "Practice visualization techniques to aid memory.",
    "Engage in friendly debates to sharpen thinking.",
    "Chew your food well—it aids digestion and focus.",
    "Keep your home well-lit to reduce confusion.",
    "Play memory card games to stay sharp.",
    "Keep your phone use purposeful and limited.",
    "Plan your meals ahead to eat smarter.",
    "Reflect on your day before bed.",
    "Use aromatherapy to reduce anxiety and stress.",
    "Practice saying phone numbers out loud to remember them.",
    "Try new routes when walking or driving.",
    "Mix up your workout routine to stay challenged.",
    "Talk to yourself when problem-solving—it boosts focus.",
    "Use color-coded systems for organization.",
    "Minimize distractions when trying to remember something.",
    "Exercise in the morning for better daytime focus.",
    "Listen actively when others speak.",
    "Create a vision board to inspire brain goals.",
    "Use flashcards to strengthen memory.",
    "Dance—it activates memory and coordination.",
    "Avoid loud noise exposure—protect your hearing.",
    "Meditate for just 10 minutes to improve focus.",
    "Use all your senses when learning something new.",
    "Connect with nature to refresh your mind.",
    "Eat in smaller portions to maintain stable energy.",
    "Follow the Mediterranean diet for brain support.",
    "Avoid crash diets—they can affect mental clarity.",
    "Get iron from beans and dark greens.",
    "Practice gratitude journaling.",
    "Ask questions instead of accepting assumptions.",
    "Stay updated with credible health information.",
    "Use analog clocks—they engage spatial memory.",
    "Try mental math instead of using calculators.",
    "Clean your space to clear your mind.",
    "Celebrate small wins—they boost motivation.",
    "Limit screen use before bedtime.",
    "Don't skip breakfast—it helps cognition.",
    "Include fermented foods for gut-brain health.",
    "Try resistance training for brain and body.",
    "Speak out loud what you want to remember.",
    "Avoid overeating—moderation supports focus.",
    "Take walking meetings instead of sitting.",
    "Use your senses to stay in the moment.",
    "Learn to recognize early signs of memory changes.",
    "Spend time with pets—they reduce stress.",
    "Practice saying affirmations in the morning.",
    "Draw or sketch to boost creativity.",
    "Stay optimistic—attitude influences brain health.",
    "Use timers to stay on task.",
    "Avoid refined carbs—they cause brain fog.",
    "Learn a new recipe each week.",
    "Cut back on caffeine in the afternoon.",
    "Practice deep listening in conversations.",
    "Decorate with calming colors.",
    "Keep your brain curious with documentaries.",
    "Use habit trackers to stay consistent.",
    "Read aloud for auditory processing.",
    "Avoid smoking areas—even secondhand smoke harms.",
    "Brush and floss—oral health links to cognition.",
    "Keep learning about health science.",
    "Take magnesium-rich foods like bananas and nuts.",
    "Avoid nighttime snacking—it disrupts rest.",
    "Reflect on meaningful experiences regularly.",
    "Rotate your hobbies to keep variety.",
    "Watch your posture—it affects blood flow.",
    "Don't skip your annual checkups.",
    "Practice journaling to process emotions.",
    "Join clubs or meetups to stay engaged.",
    "Focus on one task at a time.",
    "Give yourself grace during mental fog.",
    "Prioritize long-term health over quick fixes.",
    "Limit late-night TV or scrolling.",
    "Start your day with natural light.",
    "Try guided imagery to calm the mind.",
    "Choose dark chocolate in moderation.",
    "Take walks after meals.",
    "Reconnect with old friends—it supports memory.",
    "Visualize positive outcomes during stress.",
    "Learn CPR or first aid—it sharpens focus.",
    "Keep glucose levels steady with balanced meals.",
    "Avoid all-nighters—they harm memory formation.",
    "Organize photos and memories—it reinforces recall.",
    "Speak up if memory changes worry you.",
    "Make brain health a daily priority.",
];

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

// Initial cognitive health metrics
const initialMetrics = [
    {
        name: 'Cognitive Score',
        value: 'N/A',
        change: '-',
        trend: 'up',
        icon: BrainCustomIcon,
        color: 'primary',
        description: 'Latest AI analysis cognitive score',
    },
    {
        name: 'Training Sessions',
        value: '0',
        change: '0',
        trend: 'up',
        icon: ChartBarIcon,
        color: 'secondary',
        description: 'Total completed training sessions',
    },
    {
        name: 'Training Accuracy',
        value: 'N/A',
        change: '-',
        trend: 'up',
        icon: TrophyIcon,
        color: 'yellow',
        description: 'Average accuracy across all training',
    },
    {
        name: 'Consistency Score',
        value: '0%',
        change: '0%',
        trend: 'up',
        icon: ClockIcon,
        color: 'indigo',
        description: 'Training consistency score',
    },
];

// Quick action links
const quickActions = [
    {
        title: 'Start AI Screening',
        description: 'Analyze your speech patterns',
        icon: ChatBubbleLeftRightIcon,
        href: '/screening',
        color: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-white',
    },
    {
        title: 'Cognitive Training',
        description: 'Play brain training games',
        icon: BrainCustomIcon,
        href: '/cognitive-training',
        color: 'bg-primary-500 hover:bg-primary-600',
        textColor: 'text-white',
    },
    {
        title: 'Take Detection Quiz',
        description: 'Quick cognitive assessment',
        icon: DocumentTextIcon,
        href: '/quiz',
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-white',
    },
    {
        title: 'Resource Hub',
        description: 'Educational materials',
        icon: BookOpenIcon,
        href: '/resources',
        color: 'bg-purple-500 hover:bg-purple-600',
        textColor: 'text-white',
    },
];

// Recent activities
const recentActivities = [
    {
        id: 1,
        title: 'Completed Word Recall Exercise',
        time: '2 hours ago',
        icon: BrainCustomIcon,
        iconBackground: 'bg-primary-100 dark:bg-primary-900',
        iconColor: 'text-primary-600 dark:text-primary-400',
        description: 'Scored 85% in the advanced word recall challenge',
        link: '/cognitive-training/word-recall',
    },
    {
        id: 2,
        title: 'Speech Analysis Completed',
        time: '1 day ago',
        icon: ChatBubbleLeftRightIcon,
        iconBackground: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400',
        description: 'Your latest speech sample shows improved clarity',
        link: '/screening',
    },
    {
        id: 3,
        title: 'Read New Research Article',
        time: '2 days ago',
        icon: DocumentTextIcon,
        iconBackground: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-400',
        description: 'Viewed "Nutrition and Brain Health" in Resource Hub',
        link: '/resources',
    },
    {
        id: 4,
        title: 'Memory Match Challenge',
        time: '3 days ago',
        icon: TrophyIcon,
        iconBackground: 'bg-yellow-100 dark:bg-yellow-900',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        description: 'Achieved personal best with 12 matches in 90 seconds',
        link: '/cognitive-training/memory-match',
    },
];

export default function UserHomePage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(initialMetrics);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentHealthTip, setCurrentHealthTip] = useState('');

    // Get current time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        // Select a random health tip on component mount
        const randomIndex = Math.floor(Math.random() * brainHealthTips.length);
        setCurrentHealthTip(brainHealthTips[randomIndex]);

        async function fetchUserData() {
            if (!currentUser || !currentUser.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch both analysis history and training metrics in parallel
                const [historyData, trainingMetrics] = await Promise.all([
                    getAnalysisHistory(currentUser.id, 5).catch(() => []),
                    getProgressMetrics().catch(() => null)
                ]);

                // Process cognitive scores from AI analysis
                let cognitiveScore = 'N/A';
                let cognitiveChange = '-';
                let cognitiveTrend = 'up';

                if (historyData && historyData.length > 0) {
                    const latestAnalysis = historyData[0];
                    const previousAnalysis = historyData.length > 1 ? historyData[1] : null;

                    // Check for either overall_score or risk_score in the analysis
                    const latestScore = latestAnalysis.overall_score || latestAnalysis.risk_score;

                    if (latestScore !== undefined) {
                        // Convert to cognitive score (inverse of risk_score for risk_score, direct for overall_score)
                        const scoreValue = latestAnalysis.overall_score !== undefined
                            ? latestAnalysis.overall_score * 100
                            : (1 - latestAnalysis.risk_score) * 100;

                        cognitiveScore = `${Math.round(scoreValue)}/100`;

                        if (previousAnalysis) {
                            const prevScore = previousAnalysis.overall_score || previousAnalysis.risk_score;
                            if (prevScore !== undefined) {
                                const prevScoreValue = previousAnalysis.overall_score !== undefined
                                    ? previousAnalysis.overall_score * 100
                                    : (1 - previousAnalysis.risk_score) * 100;

                                const diff = scoreValue - prevScoreValue;
                                cognitiveChange = `${diff >= 0 ? '+' : ''}${Math.round(diff)}`;
                                cognitiveTrend = diff >= 0 ? 'up' : 'down';
                            }
                        }
                    }
                }

                // Process training metrics
                let trainingSessions = '0';
                let trainingAccuracy = 'N/A';
                let consistencyScore = '0%';
                let trainingChange = '0';
                let accuracyChange = '-';
                let consistencyChange = '0%';

                if (trainingMetrics) {
                    trainingSessions = trainingMetrics.total_sessions.toString();

                    // Calculate overall accuracy from average scores
                    if (trainingMetrics.average_scores && Object.keys(trainingMetrics.average_scores).length > 0) {
                        const scores = Object.values(trainingMetrics.average_scores);
                        const avgAccuracy = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                        trainingAccuracy = `${Math.round(avgAccuracy)}%`;
                        accuracyChange = '+'; // Placeholder - would need historical data for real change
                    }

                    if (trainingMetrics.consistency_score !== undefined) {
                        consistencyScore = `${Math.round(trainingMetrics.consistency_score * 100)}%`;
                        consistencyChange = '+'; // Placeholder - would need historical data for real change
                    }

                    trainingChange = '+'; // Placeholder - would need historical data for real change
                }

                setMetrics([
                    {
                        ...initialMetrics[0],
                        value: cognitiveScore,
                        change: cognitiveChange,
                        trend: cognitiveTrend
                    },
                    {
                        ...initialMetrics[1],
                        value: trainingSessions,
                        change: trainingChange,
                        trend: 'up'
                    },
                    {
                        ...initialMetrics[2],
                        value: trainingAccuracy,
                        change: accuracyChange,
                        trend: 'up'
                    },
                    {
                        ...initialMetrics[3],
                        value: consistencyScore,
                        change: consistencyChange,
                        trend: 'up'
                    }
                ]);

            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'Failed to load user data');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [currentUser]);

    const userName = currentUser?.full_name || currentUser?.name || currentUser?.email?.split('@')[0] || 'User';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {getGreeting()}, {userName}! 👋
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                            Welcome to your personalized cognitive health dashboard
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3">
                        <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full">
                            <UserIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.href}
                            className={`${action.color} ${action.textColor} p-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                                    <p className="text-sm opacity-90">{action.description}</p>
                                </div>
                                <action.icon className="w-8 h-8 opacity-80" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Cognitive Health Metrics */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cognitive Health Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                                    <metric.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center text-sm font-medium ${metric.trend === 'up'
                                        ? 'text-green-600 dark:text-green-500'
                                        : 'text-red-600 dark:text-red-500'
                                        }`}>
                                        {metric.trend === 'up' ? (
                                            <ArrowUpIcon className="w-4 h-4 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 mr-1" />
                                        )}
                                        {loading ? '...' : metric.change}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                {metric.name}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {loading ? '...' : metric.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                            <Link
                                to="/profile"
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.iconBackground} flex items-center justify-center`}>
                                        <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            {activity.time}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                            {activity.description}
                                        </p>
                                        <Link
                                            to={activity.link}
                                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium"
                                        >
                                            Continue →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Health Tips */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <HeartIcon className="w-5 h-5 mr-2" />
                            Today's Health Tip
                        </h3>
                        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-md">
                            <p className="text-sm text-primary-800 dark:text-primary-200 mb-2">
                                <strong>Today's Tip:</strong> {currentHealthTip}
                            </p>
                            <Link
                                to="/resources"
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium"
                            >
                                Learn more about brain health →
                            </Link>
                        </div>
                    </div>

                    {/* Progress Snapshot */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <AcademicCapIcon className="w-5 h-5 mr-2" />
                            This Week's Progress
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Training Sessions</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {loading ? '...' : `${metrics[1]?.value || '0'}/5`}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: loading ? '0%' : `${Math.min(100, (parseInt(metrics[1]?.value || '0') / 5) * 100)}%`
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Training Accuracy</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {loading ? '...' : metrics[2]?.value || 'N/A'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: loading ? '0%' : `${parseInt(metrics[2]?.value?.replace('%', '') || '0')}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Logout Button */}
                    <div className="sm:hidden">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}
        </div>
    );
} 