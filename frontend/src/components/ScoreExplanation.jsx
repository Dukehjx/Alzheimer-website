import React from 'react';

const domainExplanations = {
    lexicalDiversity: {
        title: "Vocabulary Richness (Language)",
        low: "Your vocabulary usage shows limited range and diversity, which may indicate some language processing challenges.",
        moderate: "Your vocabulary usage shows a moderate range of words, with room for improvement in lexical diversity.",
        high: "Your vocabulary usage shows excellent diversity and range, indicating strong language processing abilities."
    },
    syntacticComplexity: {
        title: "Sentence Structure (Executive Function)",
        low: "Your sentence structures are primarily simple, which may indicate challenges in organizing complex thoughts.",
        moderate: "Your sentence structures show moderate complexity, with some variety in how ideas are structured and connected.",
        high: "Your sentence structures are appropriately complex and varied, indicating strong cognitive organization abilities."
    },
    semanticCoherence: {
        title: "Idea Organization (Visuospatial)",
        low: "Your ideas show limited organization and coherence, which may indicate challenges in cognitive mapping.",
        moderate: "Your ideas show moderate organization with some logical flow between concepts.",
        high: "Your ideas are well-organized with strong logical connections, indicating excellent cognitive mapping abilities."
    },
    speechFluency: {
        title: "Fluency & Focus (Attention)",
        low: "Your expression contains frequent hesitations or repetitions, which may indicate challenges with attention and processing.",
        moderate: "Your expression is moderately fluent with occasional hesitations or topic shifts.",
        high: "Your expression is very fluent with minimal hesitations, indicating strong attention and processing abilities."
    },
    memoryCues: {
        title: "Recall & Detail (Memory)",
        low: "Your descriptions contain limited specific details, which may indicate memory recall challenges.",
        moderate: "Your descriptions include moderate detail level with some specific references.",
        high: "Your descriptions are rich with specific details, indicating strong memory recall abilities."
    }
};

const getExplanationLevel = (score) => {
    if (score < 50) return 'low';
    if (score < 75) return 'moderate';
    return 'high';
};

const ScoreExplanation = ({ scores }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-3">
                Understanding Your Cognitive Scores
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
                These scores reflect how your language patterns compare to typical patterns across five cognitive domains.
                Higher scores (closer to 100) indicate stronger performance in that domain.
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            <div className="space-y-3">
                {Object.keys(domainExplanations).map((domain) => {
                    const score = scores[domain];
                    const level = getExplanationLevel(score);
                    const explanation = domainExplanations[domain];

                    // Determine color based on level
                    const colorClass =
                        level === 'low' ? 'text-red-600 border-red-600' :
                            level === 'moderate' ? 'text-yellow-600 border-yellow-600' :
                                'text-green-600 border-green-600';

                    return (
                        <div key={domain} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                                onClick={(e) => {
                                    const content = e.currentTarget.nextElementSibling;
                                    if (content.style.maxHeight) {
                                        content.style.maxHeight = null;
                                    } else {
                                        content.style.maxHeight = content.scrollHeight + "px";
                                    }
                                }}
                            >
                                <span className="font-medium">{explanation.title}</span>
                                <div className="flex items-center">
                                    <span className={`font-bold ${colorClass}`}>
                                        {score}/100
                                    </span>
                                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                            <div className="overflow-hidden transition-all max-h-0 duration-300 ease-in-out">
                                <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    {explanation[level]}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Note: These assessments are based on AI analysis of language patterns and should not replace professional medical evaluation.
                    If you have concerns about cognitive health, please consult a healthcare professional.
                </p>
            </div>
        </div>
    );
};

export default ScoreExplanation; 