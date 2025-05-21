import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../api/apiClient'; // Import apiClient

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
        </div>
    );
} 