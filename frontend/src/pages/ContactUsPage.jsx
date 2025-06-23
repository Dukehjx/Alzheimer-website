import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ContactUsPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, we'll create a mailto link with the form data
        const subject = encodeURIComponent(formData.subject || 'Contact from NeuroAegis Website');
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:D117107101@outlook.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                            Contact Us
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            We'd love to hear from you. Get in touch with our team for questions, feedback, or collaboration opportunities.
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                                Get in Touch
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Whether you have questions about our platform, need technical support, or want to explore partnership opportunities, we're here to help.
                            </p>

                            <div className="space-y-8">
                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Email
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Send us an email and we'll get back to you as soon as possible.
                                        </p>
                                        <a
                                            href="mailto:D117107101@outlook.com"
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                                        >
                                            D117107101@outlook.com
                                        </a>
                                    </div>
                                </div>

                                {/* Response Time */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Response Time
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            We typically respond to all inquiries within 24-48 hours during business days.
                                        </p>
                                    </div>
                                </div>

                                {/* Support Types */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            How We Can Help
                                        </h3>
                                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                                            <li>• Technical support and troubleshooting</li>
                                            <li>• Partnership and collaboration inquiries</li>
                                            <li>• Research collaboration opportunities</li>
                                            <li>• Platform feedback and suggestions</li>
                                            <li>• Media and press inquiries</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Send us a Message
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                    >
                                        Send Message
                                    </button>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                        By submitting this form, you agree to our privacy policy and terms of service.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    How can I get started with NeuroAegis?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    You can begin by taking our early detection quiz or exploring our AI-powered screening tools. No registration is required to get started with basic assessments.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Is my data secure and private?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Yes, we take data privacy and security very seriously. All data is encrypted and we follow strict privacy guidelines. Please review our privacy policy for detailed information.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Can healthcare providers use NeuroAegis?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    While our platform is designed for individual use, we're open to discussing partnerships and collaboration opportunities with healthcare providers and researchers.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    What languages does NeuroAegis support?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Our platform supports over 12 languages including English, Spanish, Chinese, Arabic, Hindi, and many others to ensure global accessibility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 