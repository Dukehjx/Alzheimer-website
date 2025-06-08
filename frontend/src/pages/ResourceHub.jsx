import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    AcademicCapIcon,
    HeartIcon,
    LightBulbIcon,
    BookOpenIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '../api/apiClient';

// Resource type icons mapping
const RESOURCE_TYPE_ICONS = {
    'cognitive': AcademicCapIcon,
    'lifestyle': HeartIcon,
    'therapy': LightBulbIcon,
    'education': BookOpenIcon,
    'video': VideoCameraIcon,
    'article': DocumentTextIcon,
    'checklist': ClipboardDocumentListIcon,
    'tool': WrenchScrewdriverIcon,
    'default': DocumentTextIcon
};

// Category color mapping
const CATEGORY_COLORS = {
    'Lifestyle Changes to Prevent or Slow Alzheimer\'s and Dementia': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700',
    'Detection, Symptoms, and Diagnosis of Alzheimer\'s and Dementia': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700',
    'Activities and Therapies for Alzheimer\'s and Dementia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700',
    'Treatment and Care': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-700',
    'Support and Resources': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-700',
    'default': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700'
};

// Resource type filters - will be populated with translations in component
const getResourceTypeFilters = (t) => [
    { value: '', label: t('resourceHub.filters.allTypes') },
    { value: 'article', label: t('resourceHub.filters.articles') },
    { value: 'video', label: t('resourceHub.filters.videos') },
    { value: 'tool', label: t('resourceHub.filters.tools') },
    { value: 'checklist', label: t('resourceHub.filters.checklists') },
    { value: 'education', label: t('resourceHub.filters.educational') }
];

// Helper function to determine resource type from title/description
const getResourceType = (resource) => {
    const title = resource.title?.toLowerCase() || '';
    const description = resource.description?.toLowerCase() || '';
    const combined = `${title} ${description}`;

    if (combined.includes('video') || combined.includes('watch')) return 'video';
    if (combined.includes('checklist') || combined.includes('check list')) return 'checklist';
    if (combined.includes('tool') || combined.includes('calculator')) return 'tool';
    if (combined.includes('cognitive') || combined.includes('brain') || combined.includes('memory')) return 'cognitive';
    if (combined.includes('lifestyle') || combined.includes('exercise') || combined.includes('diet')) return 'lifestyle';
    if (combined.includes('therapy') || combined.includes('treatment')) return 'therapy';
    if (combined.includes('education') || combined.includes('learn')) return 'education';

    return 'article'; // default
};

// Helper function to extract source and year from resource
const getSourceAndYear = (resource) => {
    // Try to extract from title or description
    const title = resource.title || '';
    const description = resource.description || '';

    // Look for year patterns (2020-2024)
    const yearMatch = (title + ' ' + description).match(/\b(20[2-4][0-9])\b/);
    const year = yearMatch ? yearMatch[1] : null;

    // Extract source from title if it contains a colon
    let source = null;
    if (title.includes(':')) {
        const parts = title.split(':');
        if (parts.length > 1) {
            source = parts[0].trim();
        }
    }

    // Fallback sources based on URL domain
    if (!source && resource.url) {
        try {
            const url = new URL(resource.url);
            const domain = url.hostname.replace('www.', '');

            const domainToSource = {
                'alzheimers.org.uk': 'Alzheimer\'s Society',
                'alz.org': 'Alzheimer\'s Association',
                'nia.nih.gov': 'National Institute on Aging',
                'mayoclinic.org': 'Mayo Clinic',
                'webmd.com': 'WebMD',
                'healthline.com': 'Healthline',
                'medicalnewstoday.com': 'Medical News Today',
                'ncbi.nlm.nih.gov': 'NCBI',
                'theguardian.com': 'The Guardian',
                'bbc.com': 'BBC',
                'cnn.com': 'CNN Health'
            };

            source = domainToSource[domain] || domain;
        } catch (e) {
            // Invalid URL, ignore
        }
    }

    return { source, year };
};

// FAQ data - will be populated with translations in component
const getFAQData = (t) => [
    {
        id: 1,
        misconception: t('resourceHub.faq.item1.misconception'),
        fact: t('resourceHub.faq.item1.fact')
    },
    {
        id: 2,
        misconception: t('resourceHub.faq.item2.misconception'),
        fact: t('resourceHub.faq.item2.fact')
    },
    {
        id: 3,
        misconception: t('resourceHub.faq.item3.misconception'),
        fact: t('resourceHub.faq.item3.fact')
    },
    {
        id: 4,
        misconception: t('resourceHub.faq.item4.misconception'),
        fact: t('resourceHub.faq.item4.fact')
    },
    {
        id: 5,
        misconception: t('resourceHub.faq.item5.misconception'),
        fact: t('resourceHub.faq.item5.fact')
    },
    {
        id: 6,
        misconception: t('resourceHub.faq.item6.misconception'),
        fact: t('resourceHub.faq.item6.fact')
    },
    {
        id: 7,
        misconception: t('resourceHub.faq.item7.misconception'),
        fact: t('resourceHub.faq.item7.fact')
    },
    {
        id: 8,
        misconception: t('resourceHub.faq.item8.misconception'),
        fact: t('resourceHub.faq.item8.fact')
    },
    {
        id: 9,
        misconception: t('resourceHub.faq.item9.misconception'),
        fact: t('resourceHub.faq.item9.fact')
    },
    {
        id: 10,
        misconception: t('resourceHub.faq.item10.misconception'),
        fact: t('resourceHub.faq.item10.fact')
    }
];

// FAQ Item Component
function FAQItem({ faq, isOpen, onToggle, t }) {
    return (
        <div className="border border-neutral-200 dark:border-neutral-600 rounded-lg overflow-hidden">
            <button
                className="w-full px-6 py-4 text-left bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${faq.id}`}
                aria-label={`FAQ: ${faq.misconception}`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <div className="flex items-start gap-3">
                            <BookOpenIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                                <span className="text-red-600 dark:text-red-400 font-semibold">{t('resourceHub.faq.misconceptionLabel')}:</span> {faq.misconception}
                            </h3>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                        )}
                    </div>
                </div>
            </button>
            <div
                id={`faq-content-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                role="region"
                aria-labelledby={`faq-button-${faq.id}`}
            >
                <div className="px-6 py-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-600">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        <span className="text-green-600 dark:text-green-400 font-semibold">{t('resourceHub.faq.factLabel')}:</span> {faq.fact}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResourceHub() {
    const { t } = useTranslation();
    const [allResources, setAllResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedResourceType, setSelectedResourceType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFAQs, setOpenFAQs] = useState(new Set());

    // Get translated data
    const resourceTypeFilters = getResourceTypeFilters(t);
    const faqData = getFAQData(t);

    // FAQ handlers
    const toggleFAQ = (faqId) => {
        setOpenFAQs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(faqId)) {
                newSet.delete(faqId);
            } else {
                newSet.add(faqId);
            }
            return newSet;
        });
    };

    const expandAllFAQs = () => {
        setOpenFAQs(new Set(faqData.map(faq => faq.id)));
    };

    const collapseAllFAQs = () => {
        setOpenFAQs(new Set());
    };

    // Search suggestions
    const generateSearchSuggestions = (query) => {
        if (!query || query.length < 2) return [];

        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Add suggestions from resource titles
        allResources.forEach(resource => {
            const title = resource.title?.toLowerCase() || '';
            if (title.includes(queryLower) && !suggestions.includes(resource.title)) {
                suggestions.push(resource.title);
            }
        });

        // Add common search terms
        const commonTerms = [
            'alzheimer', 'dementia', 'memory', 'cognitive', 'brain', 'prevention',
            'symptoms', 'treatment', 'care', 'lifestyle', 'exercise', 'diet'
        ];

        commonTerms.forEach(term => {
            if (term.includes(queryLower) && !suggestions.some(s => s.toLowerCase().includes(term))) {
                suggestions.push(term.charAt(0).toUpperCase() + term.slice(1));
            }
        });

        return suggestions.slice(0, 5);
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        const suggestions = generateSearchSuggestions(value);
        setSearchSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0 && value.length > 1);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        // Trigger search
        handleSearchSubmit(null, suggestion);
    };

    // Fetch all resources and categories on component mount
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/resources/');
            const fetchedResources = response.data?.resources || [];
            setAllResources(fetchedResources);
            setFilteredResources(fetchedResources);

            const uniqueCategories = [
                ...new Set(fetchedResources.map(resource => resource.category))
            ].filter(Boolean);
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Error fetching initial resources:', err);
            setError(err.message || 'Failed to load resources. Please try again later.');
            setAllResources([]);
            setFilteredResources([]);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Handle category selection
    const handleCategoryChange = async (category) => {
        setSelectedCategory(category);
        setIsLoading(true);
        setError(null);
        setSearchQuery('');

        try {
            if (category) {
                const response = await apiClient.get(`/resources/categories/${category}`);
                setFilteredResources(response.data?.resources || []);
            } else {
                setFilteredResources(allResources);
            }
        } catch (err) {
            console.error(`Error fetching resources for category ${category}:`, err);
            setError(err.message || `Failed to load resources for ${category}.`);
            setFilteredResources([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resource type filter
    const handleResourceTypeChange = (type) => {
        setSelectedResourceType(type);

        let filtered = selectedCategory
            ? allResources.filter(r => r.category === selectedCategory)
            : allResources;

        if (type) {
            filtered = filtered.filter(resource => getResourceType(resource) === type);
        }

        setFilteredResources(filtered);
    };

    // Handle search
    const handleSearchSubmit = async (e, queryOverride = null) => {
        if (e) e.preventDefault();

        const query = (queryOverride || searchQuery).trim();
        setIsLoading(true);
        setError(null);
        setShowSuggestions(false);

        if (!query) {
            if (selectedCategory) {
                handleCategoryChange(selectedCategory);
            } else {
                setFilteredResources(allResources);
                setIsLoading(false);
            }
            return;
        }

        try {
            const response = await apiClient.get(`/resources/search?query=${encodeURIComponent(query)}`);
            setFilteredResources(response.data?.resources || []);
        } catch (err) {
            console.error(`Error searching resources with query "${query}":`, err);
            setError(err.message || t('resourceHub.errors.searchFailed'));
            setFilteredResources([]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFiltersAndSearch = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedResourceType('');
        setFilteredResources(allResources);
        setError(null);
        setShowSuggestions(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">{t('resourceHub.title')}</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {t('resourceHub.description')}
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4 sm:mx-0" role="alert">
                    <p className="font-bold">{t('resourceHub.errors.errorLabel')}</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Resources Section */}
            <div className="bg-white dark:bg-neutral-800 shadow sm:rounded-lg mt-6 px-4 py-5 sm:p-6">
                {/* Search and filter controls */}
                <div className="mb-6 space-y-4">
                    {/* Search bar with suggestions */}
                    <div className="relative">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    placeholder={t('resourceHub.search.placeholder')}
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    aria-label={t('resourceHub.search.ariaLabel')}
                                    aria-expanded={showSuggestions}
                                    aria-haspopup="listbox"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={t('resourceHub.search.submitAriaLabel')}
                                >
                                    {t('resourceHub.search.button')}
                                </button>
                            </div>
                        </form>

                        {/* Search suggestions dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-lg">
                                <ul role="listbox" className="py-1">
                                    {searchSuggestions.map((suggestion, index) => (
                                        <li key={index}>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-600"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                role="option"
                                                aria-selected="false"
                                            >
                                                {suggestion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Category filter */}
                        <div className="flex-1">
                            <label htmlFor="category-select" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                {t('resourceHub.filters.categoryLabel')}
                            </label>
                            <select
                                id="category-select"
                                name="category"
                                className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-md bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                aria-label={t('resourceHub.filters.categoryAriaLabel')}
                            >
                                <option value="">{t('resourceHub.filters.allCategories')}</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Resource type filter */}
                        <div className="flex-1">
                            <label htmlFor="type-select" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                {t('resourceHub.filters.resourceTypeLabel')}
                            </label>
                            <select
                                id="type-select"
                                name="resourceType"
                                className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-md bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                value={selectedResourceType}
                                onChange={(e) => handleResourceTypeChange(e.target.value)}
                                aria-label={t('resourceHub.filters.resourceTypeAriaLabel')}
                            >
                                {resourceTypeFilters.map((filter) => (
                                    <option key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset button */}
                        <div className="flex items-end">
                            <button
                                onClick={resetFiltersAndSearch}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                aria-label={t('resourceHub.filters.resetAriaLabel')}
                            >
                                {t('resourceHub.filters.resetButton')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results section */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" role="status" aria-label={t('resourceHub.results.loadingAriaLabel')}></div>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-neutral-600 dark:text-neutral-300">
                            {error ? t('resourceHub.results.couldNotLoad') : t('resourceHub.results.noResourcesFound')}
                        </p>
                        <button
                            onClick={resetFiltersAndSearch}
                            className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                            {t('resourceHub.results.resetFiltersButton')}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredResources.map((resource) => {
                            const resourceType = getResourceType(resource);
                            const IconComponent = RESOURCE_TYPE_ICONS[resourceType] || RESOURCE_TYPE_ICONS.default;
                            const { source, year } = getSourceAndYear(resource);
                            const categoryColor = CATEGORY_COLORS[resource.category] || CATEGORY_COLORS.default;

                            return (
                                <article
                                    key={resource.id}
                                    className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-neutral-200 dark:border-neutral-600"
                                >
                                    <div className="flex gap-4">
                                        {/* Resource type icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-medium text-neutral-900 dark:text-white leading-tight">
                                                    {resource.title}
                                                </h3>
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-3 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                                    aria-label={`Visit ${resource.title} (opens in new tab)`}
                                                >
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                                </a>
                                            </div>

                                            {/* Source and year */}
                                            {(source || year) && (
                                                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                                    {source && <span>{t('resourceHub.results.sourceLabel')}: {source}</span>}
                                                    {source && year && <span> | </span>}
                                                    {year && <span>{year}</span>}
                                                </div>
                                            )}

                                            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-3">
                                                {resource.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>
                                                    {resource.category}
                                                </span>

                                                <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                                                    {resourceType.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white dark:bg-neutral-800 shadow sm:rounded-lg mt-8 px-4 py-5 sm:p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                        {t('resourceHub.faq.title')}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                        {t('resourceHub.faq.description')}
                    </p>

                    {/* FAQ Controls */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={expandAllFAQs}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={t('resourceHub.faq.expandAllAriaLabel')}
                        >
                            {t('resourceHub.faq.expandAllButton')}
                        </button>
                        <button
                            onClick={collapseAllFAQs}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            aria-label={t('resourceHub.faq.collapseAllAriaLabel')}
                        >
                            {t('resourceHub.faq.collapseAllButton')}
                        </button>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4" role="region" aria-label={t('resourceHub.faq.regionAriaLabel')}>
                    {faqData.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openFAQs.has(faq.id)}
                            onToggle={() => toggleFAQ(faq.id)}
                            t={t}
                        />
                    ))}
                </div>

                {/* FAQ Footer */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>{t('resourceHub.faq.disclaimerLabel')}:</strong> {t('resourceHub.faq.disclaimerText')}
                    </p>
                </div>
            </div>
        </div>
    );
} 