import React from 'react';
import { useTranslation } from 'react-i18next';

const ScoreExplanation = ({ scores }) => {
    const { t } = useTranslation();

    const getDomainExplanations = () => ({
        lexicalDiversity: {
            title: t('scoreExplanation.vocabularyRichness'),
            low: t('scoreExplanation.vocabularyLow'),
            moderate: t('scoreExplanation.vocabularyModerate'),
            high: t('scoreExplanation.vocabularyHigh')
        },
        syntacticComplexity: {
            title: t('scoreExplanation.sentenceStructure'),
            low: t('scoreExplanation.sentenceLow'),
            moderate: t('scoreExplanation.sentenceModerate'),
            high: t('scoreExplanation.sentenceHigh')
        },
        speechFluency: {
            title: t('scoreExplanation.fluencyFocus'),
            low: t('scoreExplanation.fluencyLow'),
            moderate: t('scoreExplanation.fluencyModerate'),
            high: t('scoreExplanation.fluencyHigh')
        },
        memoryCues: {
            title: t('scoreExplanation.recallDetail'),
            low: t('scoreExplanation.memoryLow'),
            moderate: t('scoreExplanation.memoryModerate'),
            high: t('scoreExplanation.memoryHigh')
        }
    });

    const getExplanationLevel = (score) => {
        if (score < 50) return 'low';
        if (score < 75) return 'moderate';
        return 'high';
    };

    const domainExplanations = getDomainExplanations();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-3">
                {t('scoreExplanation.title')}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('scoreExplanation.description')}
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
                    {t('scoreExplanation.disclaimer')}
                </p>
            </div>
        </div>
    );
};

export default ScoreExplanation; 