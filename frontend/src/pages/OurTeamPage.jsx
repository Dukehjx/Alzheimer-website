import React from 'react';
import { useTranslation } from 'react-i18next';

export default function OurTeamPage() {
    const { t } = useTranslation();

    const teamMembers = [
        {
            name: 'Duke Hu',
            role: 'Founder & Lead Developer',
            bio: 'Duke is the visionary behind NeuroAegis, combining expertise in artificial intelligence and cognitive health to create innovative solutions for early detection and prevention of cognitive decline. With a passion for leveraging technology to improve healthcare outcomes, Duke leads the development of cutting-edge AI-powered assessment tools.',
            expertise: ['Artificial Intelligence', 'Machine Learning', 'Cognitive Health', 'Full-Stack Development'],
            image: null, // Placeholder for future image
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                            Our Team
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Meet the dedicated professionals working to advance cognitive health through innovative technology and evidence-based solutions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Members Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-16 lg:gap-24">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
                                    {/* Profile Image Placeholder */}
                                    <div className="flex-shrink-0">
                                        <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                            <div className="w-44 h-44 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <svg className="w-24 h-24 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member Information */}
                                    <div className="flex-1 text-center lg:text-left">
                                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                                            {member.name}
                                        </h2>
                                        <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
                                            {member.role}
                                        </p>
                                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
                                            {member.bio}
                                        </p>

                                        {/* Expertise Tags */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Areas of Expertise
                                            </h3>
                                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                                {member.expertise.map((skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Our Commitment
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-6">
                            At NeuroAegis, we are committed to advancing the field of cognitive health through innovative technology and evidence-based research. Our team brings together diverse expertise in artificial intelligence, neuroscience, and healthcare to create solutions that make a real difference in people's lives.
                        </p>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                            We believe that early detection and prevention are key to maintaining cognitive health, and we're dedicated to making these tools accessible to everyone, regardless of their background or location.
                        </p>
                    </div>
                </div>
            </div>

            {/* Join Our Mission */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                            Growing Our Impact
                        </h2>
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
                            NeuroAegis is continuously evolving, and we're always looking to expand our team with passionate individuals who share our vision of improving cognitive health worldwide. Whether you're a researcher, developer, clinician, or advocate, there are many ways to contribute to our mission.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Research Excellence
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Contributing to cutting-edge research in cognitive health and AI applications.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Global Collaboration
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Working with international partners to expand our global reach and impact.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Innovation Focus
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Developing next-generation tools and technologies for cognitive health assessment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 