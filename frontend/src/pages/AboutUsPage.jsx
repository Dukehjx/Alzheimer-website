import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                            About NeuroAegis
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Empowering individuals to take control of their cognitive health through innovative AI-powered technology and evidence-based prevention strategies.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Our Mission
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-6">
                            At NeuroAegis, we believe that early detection and prevention are the keys to maintaining cognitive health throughout life. Our mission is to democratize access to advanced cognitive assessment tools and provide individuals with the knowledge and resources they need to protect their brain health.
                        </p>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                            We combine cutting-edge artificial intelligence with evidence-based medical research to create a comprehensive platform that supports early detection of mild cognitive impairment (MCI) and provides personalized strategies for Alzheimer's prevention.
                        </p>
                    </div>
                </div>
            </div>

            {/* What We Do Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
                            What We Do
                        </h2>
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h3.75m-3.75 3h3.75m-3.75 3h3.75M6.75 6h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V8.25A2.25 2.25 0 016.75 6z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        Early Detection Assessments
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Our scientifically-designed quizzes and assessments help identify early signs of cognitive decline, enabling timely intervention and support.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        AI-Powered Speech Analysis
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Using advanced natural language processing and machine learning, we analyze speech patterns and linguistic markers that may indicate cognitive changes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        Cognitive Training Programs
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Engaging brain training games and exercises designed to maintain and improve cognitive function across multiple domains including memory, attention, and executive function.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        Educational Resources
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Comprehensive resource hub with evidence-based information on Alzheimer's prevention, cognitive health strategies, and the latest research findings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Our Vision
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-6">
                            We envision a world where cognitive decline is detected early and prevented through accessible, personalized, and scientifically-backed interventions. By leveraging the power of artificial intelligence and making it available to everyone, we aim to reduce the global impact of Alzheimer's disease and other forms of dementia.
                        </p>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Our platform serves as a bridge between cutting-edge research and practical application, empowering individuals, families, and healthcare providers with the tools they need to maintain cognitive health throughout the lifespan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Accessibility Section */}
            <div className="bg-blue-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Global Accessibility
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-6">
                            NeuroAegis is designed to be accessible to people around the world. Our platform supports multiple languages and includes accessibility features to ensure that cognitive health tools are available to diverse populations regardless of language, location, or ability.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">12+</div>
                                <div className="text-gray-600 dark:text-gray-300 mt-2">Languages Supported</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">WCAG</div>
                                <div className="text-gray-600 dark:text-gray-300 mt-2">Accessibility Compliant</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Join Us in Protecting Cognitive Health
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
                            Take the first step towards understanding and protecting your cognitive health. Our platform provides the tools and knowledge you need to make informed decisions about your brain health.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/quiz"
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Start Assessment
                            </Link>
                            <Link
                                to="/resources"
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-3 text-base font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Explore Resources
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 