import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../api/apiClient'; // Import apiClient

// FAQ data
const FAQ_DATA = [
    {
        id: 1,
        misconception: "Memory loss is a normal part of aging.",
        fact: "While some mild forgetfulness is common with aging, persistent memory loss that disrupts daily life is not normal. It may be an early sign of Alzheimer's or another type of dementia. Aging-related forgetfulness (e.g., occasionally misplacing keys) differs from forgetting how to use the keys or what they're for."
    },
    {
        id: 2,
        misconception: "Only elderly people get Alzheimer's.",
        fact: "Most people with Alzheimer's are 65 or older, but early-onset Alzheimer's can develop in people as young as their 30s or 40s. It accounts for about 5–10% of all cases. Younger individuals may initially be misdiagnosed due to atypical symptoms like vision or language problems rather than memory issues."
    },
    {
        id: 3,
        misconception: "Alzheimer's is just memory loss.",
        fact: "Alzheimer's affects more than memory—it impairs thinking, problem-solving, language, judgment, and behavior. As it progresses, it can cause confusion, mood swings, personality changes, and loss of independence."
    },
    {
        id: 4,
        misconception: "MCI always leads to Alzheimer's.",
        fact: "Mild Cognitive Impairment (MCI) increases the risk of Alzheimer's, but not all people with MCI progress to dementia. Some remain stable for years, and a portion may even revert to normal cognition, especially if the cause is treatable (e.g., medication side effects, depression, or sleep disorders)."
    },
    {
        id: 5,
        misconception: "There is no treatment for Alzheimer's.",
        fact: "There is no cure yet, but treatments can manage symptoms and improve quality of life. FDA-approved medications (e.g., donepezil, memantine, lecanemab) may slow progression in early stages. Lifestyle changes, cognitive activities, and social support are also crucial non-pharmacological interventions."
    },
    {
        id: 6,
        misconception: "People with Alzheimer's have no awareness.",
        fact: "In early and even moderate stages, many individuals are aware of their diagnosis and capable of participating in decisions. Lack of understanding from others can lead to social withdrawal and unnecessary dependence."
    },
    {
        id: 7,
        misconception: "Alzheimer's is caused by aluminum, vaccines, or microwaves.",
        fact: "These claims are not supported by scientific evidence. Alzheimer's is caused by a complex interplay of genetics, age, vascular health, and lifestyle factors—not by everyday exposures like cooking with aluminum or using vaccines."
    },
    {
        id: 8,
        misconception: "Dementia and Alzheimer's are the same.",
        fact: "Dementia is a general term for cognitive decline affecting daily life. Alzheimer's is the most common cause of dementia, but there are others, including vascular dementia, Lewy body dementia, and frontotemporal dementia."
    },
    {
        id: 9,
        misconception: "People with dementia cannot understand or communicate.",
        fact: "People with dementia often retain emotional memory and the ability to respond to kindness, tone of voice, music, and visual cues. With patience and adaptation, meaningful communication is often possible far into the disease."
    },
    {
        id: 10,
        misconception: "A person with Alzheimer's cannot live well.",
        fact: "With the right support, routines, and engagement in activities they enjoy, many people with Alzheimer's continue to experience joy, connection, and purpose—especially in early and middle stages."
    }
];

// FAQ Item Component
function FAQItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border border-neutral-200 dark:border-neutral-600 rounded-lg overflow-hidden">
            <button
                className="w-full px-6 py-4 text-left bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${faq.id}`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                            <span className="text-red-600 dark:text-red-400 font-semibold">Misconception:</span> {faq.misconception}
                        </h3>
                    </div>
                    <div className="flex-shrink-0">
                        {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                        )}
                    </div>
                </div>
            </button>
            <div
                id={`faq-content-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-600">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        <span className="text-green-600 dark:text-green-400 font-semibold">Fact:</span> {faq.fact}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Hardcoded resources data - REMOVED
// const RESOURCES = [...];

export default function ResourceHub() {
    const [allResources, setAllResources] = useState([]); // Store all fetched resources
    const [filteredResources, setFilteredResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFAQs, setOpenFAQs] = useState(new Set());

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
        setOpenFAQs(new Set(FAQ_DATA.map(faq => faq.id)));
    };

    const collapseAllFAQs = () => {
        setOpenFAQs(new Set());
    };

    // Fetch all resources and categories on component mount
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/resources/');
            // Access response.data.resources for the actual data
            const fetchedResources = response.data?.resources || [];
            setAllResources(fetchedResources);
            setFilteredResources(fetchedResources);

            const uniqueCategories = [
                ...new Set(fetchedResources.map(resource => resource.category))
            ].filter(Boolean); // Filter out null/undefined categories
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
        setSearchQuery(''); // Clear search query when category changes

        try {
            if (category) {
                const response = await apiClient.get(`/resources/categories/${category}`);
                // Access response.data.resources for the actual data
                setFilteredResources(response.data?.resources || []);
            } else {
                // Show all resources if 'All Categories' is selected
                setFilteredResources(allResources);
            }
        } catch (err) {
            console.error(`Error fetching resources for category ${category}:`, err);
            setError(err.message || `Failed to load resources for ${category}.`);
            setFilteredResources([]); // Clear resources on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        setIsLoading(true);
        setError(null);

        if (!query) {
            // If search is empty, reset to current category or all resources
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
            // Access response.data.resources for the actual data
            setFilteredResources(response.data?.resources || []);
        } catch (err) {
            console.error(`Error searching resources with query "${query}":`, err);
            setError(err.message || 'Failed to perform search. Please try again.');
            setFilteredResources([]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFiltersAndSearch = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setFilteredResources(allResources); // Reset to all initially fetched resources
        setError(null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Resource Hub</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    Explore comprehensive information on cognitive health, prevention strategies, and the latest research.
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4 sm:mx-0" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Resources Section */}
            <div className="bg-white dark:bg-neutral-800 shadow sm:rounded-lg mt-6 px-4 py-5 sm:p-6">
                {/* Search and filter controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Category filter */}
                    <div className="min-w-[240px]">
                        <select
                            id="category"
                            name="category"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-md bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results section */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-neutral-600 dark:text-neutral-300">
                            {error ? 'Could not load resources.' : 'No resources found matching your criteria.'}
                        </p>
                        <button
                            onClick={resetFiltersAndSearch}
                            className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Reset filters & Search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {resource.title}
                                        </h3>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            aria-label={`Visit ${resource.title}`}
                                        >
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                        </a>
                                    </div>
                                    <p className="mt-1 text-neutral-600 dark:text-neutral-300 text-sm">
                                        {resource.description}
                                    </p>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {resource.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white dark:bg-neutral-800 shadow sm:rounded-lg mt-8 px-4 py-5 sm:p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                        Common misconceptions about Alzheimer's disease and cognitive health, clarified with evidence-based facts.
                    </p>

                    {/* FAQ Controls */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={expandAllFAQs}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAllFAQs}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {FAQ_DATA.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openFAQs.has(faq.id)}
                            onToggle={() => toggleFAQ(faq.id)}
                        />
                    ))}
                </div>

                {/* FAQ Footer */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice.
                        If you have concerns about cognitive health, please consult with a qualified healthcare provider.
                    </p>
                </div>
            </div>
        </div>
    );
} 