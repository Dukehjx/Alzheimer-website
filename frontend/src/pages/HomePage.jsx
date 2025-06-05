import React from 'react';
import { Link } from 'react-router-dom';
import homepageImage from '../assets/homepage-image.png';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section with Modern Flat Design */}
      <div className="relative isolate overflow-hidden bg-white w-full min-h-screen">

        {/* Colorful Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large blue curved shape - top right */}
          <div className="absolute top-10 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-90 transform rotate-12"></div>

          {/* Purple curved shape - middle right */}
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full opacity-80 transform -rotate-12"></div>

          {/* Yellow accent shapes */}
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg transform rotate-45 opacity-70"></div>
          <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full opacity-80"></div>

          {/* Geometric accent elements */}
          <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 transform rotate-12 opacity-60"></div>
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-70"></div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
            {/* Left Side: Content */}
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl relative">
              {/* Decorative background elements for left side */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 opacity-40"
                style={{
                  borderRadius: '60% 40% 30% 70% / 40% 60% 70% 30%'
                }}></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 opacity-30"
                style={{
                  borderRadius: '70% 30% 40% 60% / 50% 50% 60% 40%'
                }}></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Powered by Advanced AI
                  </span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight mb-8">
                  <span className="text-blue-600 block mb-2">Alzheimer's</span>
                  <span className="text-blue-500 block relative">
                    risk factors
                    {/* Decorative underline */}
                    <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-60"
                      style={{
                        borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%'
                      }}></div>
                  </span>
                </h1>

                <div className="relative">
                  <p className="text-xl leading-relaxed text-gray-700 font-normal max-w-lg mb-10 relative z-10">
                    Our platform uses <span className="font-semibold text-blue-600">advanced AI</span> to analyze speech and text patterns for early signs of cognitive decline,
                    helping with <span className="font-semibold text-purple-600">early detection</span> of Mild Cognitive Impairment (MCI) and Alzheimer's prevention through
                    comprehensive assessment tools.
                  </p>
                  {/* Subtle background decoration for text */}
                  <div className="absolute top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-200 to-orange-200 opacity-20"
                    style={{
                      borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%'
                    }}></div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-12">
                  <Link
                    to="/quiz"
                    className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 px-10 py-5 text-xl font-semibold text-white shadow-xl transition-all duration-300 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 relative overflow-hidden"
                  >
                    {/* Button background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: '50% 50% 50% 50%'
                      }}></div>
                    <span className="relative z-10">Get started!</span>
                    <svg className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/resources"
                    className="text-xl font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center group relative"
                  >
                    Learn more
                    <span className="ml-2 transition-transform group-hover:translate-x-1 text-blue-500" aria-hidden="true">→</span>
                    {/* Underline decoration */}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"
                      style={{
                        borderRadius: '50% 50% 50% 50%'
                      }}></div>
                  </Link>
                </div>

                {/* Enhanced trust indicators */}
                <div className="flex items-center gap-8 relative">
                  {/* Background decoration for trust indicators */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-cyan-50/50 -z-10 rounded-2xl opacity-60"
                    style={{
                      borderRadius: '60% 40% 50% 50% / 40% 60% 40% 60%'
                    }}></div>

                  <div className="flex items-center gap-3 relative">
                    <div className="h-4 w-4 bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg"
                      style={{
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                      }}></div>
                    <span className="text-sm text-gray-700 font-semibold">AI-Validated</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <div className="h-4 w-4 bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg"
                      style={{
                        borderRadius: '60% 40% 50% 50% / 50% 50% 50% 50%'
                      }}></div>
                    <span className="text-sm text-gray-700 font-semibold">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <div className="h-4 w-4 bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg"
                      style={{
                        borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%'
                      }}></div>
                    <span className="text-sm text-gray-700 font-semibold">Evidence-Based</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Modern Illustration-Style Image Display */}
            <div className="relative mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="relative">
                {/* Decorative background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-yellow-50 transform scale-125 opacity-30"
                  style={{
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                  }}></div>

                {/* Main image container with symmetrical organic blob styling */}
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-6 shadow-2xl transform scale-110"
                  style={{
                    borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
                  }}>
                  <div className="bg-white p-3 shadow-inner"
                    style={{
                      borderRadius: '45% 45% 45% 45% / 35% 35% 65% 65%'
                    }}>
                    <img
                      src={homepageImage}
                      alt="AI-Powered Alzheimer's Detection"
                      className="w-full h-auto mx-auto object-cover transform scale-125"
                      style={{
                        borderRadius: '40% 40% 40% 40% / 30% 30% 70% 70%'
                      }}
                    />
                  </div>
                </div>

                {/* Floating modern geometric elements with organic positioning */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg transform rotate-12"
                  style={{
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                  }}></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg"
                  style={{
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                  }}></div>
                <div className="absolute top-1/4 -left-10 w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-md transform rotate-45"
                  style={{
                    borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%'
                  }}></div>
                <div className="absolute bottom-1/3 -right-10 w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 shadow-md"
                  style={{
                    borderRadius: '60% 40% 40% 60% / 50% 50% 50% 50%'
                  }}></div>

                {/* Additional organic accent shapes */}
                <div className="absolute top-1/2 right-0 w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-400"
                  style={{
                    borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%'
                  }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 transform rotate-45"
                  style={{
                    borderRadius: '50% 50% 50% 50% / 80% 20% 80% 20%'
                  }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section with clean modern design */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32 w-full">
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-50 rounded-full opacity-30"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Comprehensive Care
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for cognitive health
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines AI-powered analysis, cognitive training, and resources to support your brain health journey.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col group hover:bg-white hover:shadow-xl p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-blue-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h3.75m-3.75 3h3.75m-3.75 3h3.75M6.75 6h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V8.25A2.25 2.25 0 016.75 6z" />
                    </svg>
                  </div>
                  Early Detection Quiz
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Take our scientifically-designed quiz to assess potential signs of MCI or early Alzheimer's disease with quick or comprehensive assessments.
                  </p>
                  <p className="mt-6">
                    <Link to="/quiz" className="inline-flex items-center text-sm font-semibold leading-6 text-blue-600 hover:text-blue-700 transition-colors duration-200 group">
                      Take Quiz
                      <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>

              <div className="flex flex-col group hover:bg-white hover:shadow-xl p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-purple-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                  </div>
                  AI Screening
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Submit speech or text samples for AI analysis to assess potential cognitive decline by examining linguistic patterns.
                  </p>
                  <p className="mt-6">
                    <Link to="/screening" className="inline-flex items-center text-sm font-semibold leading-6 text-purple-600 hover:text-purple-700 transition-colors duration-200 group">
                      Try AI Screening
                      <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>

              <div className="flex flex-col group hover:bg-white hover:shadow-xl p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-yellow-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-600 group-hover:to-orange-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  Cognitive Training
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Engage in AI-generated language-based challenges, such as word recall and reading comprehension, to strengthen cognitive abilities.
                  </p>
                  <p className="mt-6">
                    <Link to="/training" className="inline-flex items-center text-sm font-semibold leading-6 text-yellow-600 hover:text-yellow-700 transition-colors duration-200 group">
                      Start Training
                      <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>

              <div className="flex flex-col group hover:bg-white hover:shadow-xl p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-green-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 group-hover:from-green-600 group-hover:to-emerald-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  Resource Hub
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Access comprehensive information on early symptoms, prevention strategies, and caregiving tips, as well as the latest research.
                  </p>
                  <p className="mt-6">
                    <Link to="/resources" className="inline-flex items-center text-sm font-semibold leading-6 text-green-600 hover:text-green-700 transition-colors duration-200 group">
                      Browse Resources
                      <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 