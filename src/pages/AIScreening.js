import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  MicrophoneIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AIScreening() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Dummy data for analysis result
  const sampleResult = {
    overallScore: 82,
    cognitiveRisk: 'Low',
    categories: [
      { name: 'Lexical Diversity', score: 78, status: 'normal' },
      { name: 'Grammatical Complexity', score: 85, status: 'normal' },
      { name: 'Semantic Coherence', score: 90, status: 'strong' },
      { name: 'Speech Fluency', score: 65, status: 'caution' },
      { name: 'Word Finding', score: 75, status: 'normal' },
    ],
    insights: [
      { 
        type: 'positive', 
        title: 'Strong Verbal Reasoning', 
        description: 'Your ability to express complex ideas shows strong verbal reasoning skills.' 
      },
      { 
        type: 'caution', 
        title: 'Slight Hesitations', 
        description: 'We noticed some hesitations in your speech that might indicate mild word-finding difficulties.' 
      },
      { 
        type: 'info', 
        title: 'Consistent with Previous', 
        description: 'Your results are consistent with your previous assessments, showing stability in cognitive function.' 
      },
    ],
    recommendations: [
      'Practice word-retrieval exercises to improve fluency',
      'Continue engaging in complex verbal tasks to maintain cognitive strength',
      'Consider following up with additional cognitive assessments every 3-6 months',
    ]
  };

  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for demo
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false);
        setAnalysisResult(sampleResult);
      }, 2000);
    }, 3000);
  };

  const submitTextAnalysis = () => {
    if (!textInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setAnalysisResult(sampleResult);
    }, 2000);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setTextInput('');
  };

  // Helper to render status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'strong':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'normal':
        return <CheckCircleIcon className="h-5 w-5 text-primary-500" aria-hidden="true" />;
      case 'caution':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
      case 'warning':
        return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />;
    }
  };

  // Helper to render insight icon
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'caution':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
      case 'warning':
        return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-primary-500" aria-hidden="true" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">AI-Powered Cognitive Screening</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Submit a speech recording or text sample for analysis. Our AI will evaluate linguistic patterns 
          to help identify potential cognitive changes.
        </p>
      </div>

      {!analysisResult ? (
        <div className="mt-6 bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
          <Tab.Group>
            <Tab.List className="flex border-b border-neutral-200 dark:border-neutral-700">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-1/2 py-4 px-1 text-center font-medium text-sm focus:outline-none',
                    selected
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  )
                }
              >
                <div className="flex justify-center items-center">
                  <MicrophoneIcon className="w-5 h-5 mr-2" />
                  Speech Recording
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-1/2 py-4 px-1 text-center font-medium text-sm focus:outline-none',
                    selected
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  )
                }
              >
                <div className="flex justify-center items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Text Analysis
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels className="py-6 px-4 sm:px-6">
              <Tab.Panel>
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="mb-6 text-center">
                    <p className="text-neutral-700 dark:text-neutral-300">
                      Record yourself describing what you did yesterday in as much detail as possible. 
                      Aim to speak for at least 1 minute.
                    </p>
                  </div>
                  
                  <div className="relative w-40 h-40 mb-6">
                    <button
                      onClick={startRecording}
                      disabled={isRecording || isProcessing}
                      className={classNames(
                        'w-full h-full rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center',
                        isRecording
                          ? 'bg-red-100 dark:bg-red-900/30 animate-pulse'
                          : isProcessing
                          ? 'bg-neutral-100 dark:bg-neutral-700 cursor-wait'
                          : 'bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                      )}
                    >
                      {isRecording ? (
                        <span className="h-24 w-24 rounded-full bg-red-600 flex items-center justify-center animate-pulse"></span>
                      ) : isProcessing ? (
                        <ArrowPathIcon className="h-20 w-20 text-neutral-500 dark:text-neutral-400 animate-spin" />
                      ) : (
                        <MicrophoneIcon className="h-20 w-20 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    {isRecording ? (
                      <p className="text-red-600 dark:text-red-400 font-medium">Recording... (tap to stop)</p>
                    ) : isProcessing ? (
                      <p className="text-neutral-600 dark:text-neutral-400">Processing your speech...</p>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-400">Tap the microphone to start recording</p>
                    )}
                  </div>
                </div>
              </Tab.Panel>
              
              <Tab.Panel>
                <div className="py-4">
                  <label htmlFor="text-analysis" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Enter or paste a text sample (minimum 100 words)
                  </label>
                  <textarea
                    id="text-analysis"
                    name="text-analysis"
                    rows={6}
                    className="form-input"
                    placeholder="Start typing or paste your text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    For best results, provide a detailed description of an event, story, or your day.
                  </p>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={submitTextAnalysis}
                      disabled={isProcessing || textInput.length < 10}
                      className={classNames(
                        'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                        (isProcessing || textInput.length < 10)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-primary-700'
                      )}
                    >
                      {isProcessing ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Processing...
                        </>
                      ) : (
                        'Analyze Text'
                      )}
                    </button>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Results Overview */}
          <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-white">Analysis Results</h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                  Based on AI evaluation of your language patterns.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAnalysis}
                className="inline-flex items-center px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Start New Analysis
              </button>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{analysisResult.overallScore}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Cognitive Score</div>
                </div>
                
                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-neutral-900 dark:text-white">
                    {analysisResult.cognitiveRisk === 'Low' ? (
                      <span className="text-green-600 dark:text-green-400">Low Risk</span>
                    ) : analysisResult.cognitiveRisk === 'Moderate' ? (
                      <span className="text-yellow-600 dark:text-yellow-400">Moderate Risk</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">High Risk</span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Cognitive Risk Level</div>
                </div>
                
                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg flex flex-col justify-center">
                  <div className="text-sm text-neutral-900 dark:text-white font-medium mb-1">Assessment Complete</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Results based on AI language analysis</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">This is not a medical diagnosis</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Scores */}
          <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-white">Language Pattern Analysis</h3>
              <p className="mt-1 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                Detailed scores across key cognitive dimensions.
              </p>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              <dl>
                {analysisResult.categories.map((category, idx) => (
                  <div 
                    key={category.name} 
                    className={classNames(
                      idx % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-700/20',
                      'px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                    )}
                  >
                    <dt className="text-sm font-medium text-neutral-900 dark:text-white flex items-center">
                      {getStatusIcon(category.status)}
                      <span className="ml-2">{category.name}</span>
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2.5">
                        <div 
                          className={classNames(
                            'h-2.5 rounded-full',
                            category.status === 'strong' ? 'bg-green-500' :
                            category.status === 'normal' ? 'bg-primary-500' :
                            category.status === 'caution' ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${category.score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{category.score} / 100</span>
                        <span className="text-xs capitalize font-medium text-neutral-700 dark:text-neutral-300">{category.status}</span>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          
          {/* Insights & Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Insights */}
            <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-white">Key Insights</h3>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700">
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {analysisResult.insights.map((insight, idx) => (
                    <li key={idx} className="px-4 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{insight.title}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{insight.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-white">Recommendations</h3>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700">
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {analysisResult.recommendations.map((recommendation, idx) => (
                    <li key={idx} className="px-4 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-sm font-medium">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">{recommendation}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg px-4 py-5 sm:px-6 text-center">
            <h3 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-2">
              Track Your Cognitive Health Over Time
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300 mb-4">
              Regular assessments can help identify changes early. We recommend repeating this screening every 1-3 months.
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Set Reminder for Next Assessment
            </button>
          </div>
        </div>
      )}
      
      {/* Health Information Notice */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Health Information Notice</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                This AI screening tool is designed for informational purposes only and should not replace professional
                medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any
                health concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 