import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { getAllResources, getResourcesByCategory, searchResources, getCategories } from '../services/resourceService';

export default function ResourceHub() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all resources and categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const allResources = await getAllResources();
        setResources(allResources);
        setFilteredResources(allResources);

        const allCategories = await getCategories();
        setCategories(allCategories);
      } catch (err) {
        setError('Failed to fetch resources. Please try again later.');
        console.error('Error fetching resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle category selection
  const handleCategoryChange = async (category) => {
    try {
      setSelectedCategory(category);
      setIsLoading(true);

      if (category) {
        const categoryResources = await getResourcesByCategory(category);
        setFilteredResources(categoryResources);
      } else {
        // If no category selected, show all resources
        setFilteredResources(resources);
      }
    } catch (err) {
      setError(`Failed to fetch resources for category: ${category}`);
      console.error('Error fetching category resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is empty, reset to current category or all resources
      if (selectedCategory) {
        await handleCategoryChange(selectedCategory);
      } else {
        setFilteredResources(resources);
      }
      return;
    }

    try {
      setIsLoading(true);
      const searchResults = await searchResources(searchQuery);
      setFilteredResources(searchResults);
    } catch (err) {
      setError(`Failed to search resources for: ${searchQuery}`);
      console.error('Error searching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Resource Hub</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Explore comprehensive information on cognitive health, prevention strategies, and the latest research.
        </p>
      </div>

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-neutral-300 dark:border-neutral-700 rounded-md py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                placeholder="Search resources..."
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading and error states */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary-500 border-t-transparent" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Resources list */}
        {!isLoading && !error && (
          <>
            {filteredResources.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No resources found</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Try adjusting your search query or category filter.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Group resources by category */}
                {[...new Set(filteredResources.map(resource => resource.category))].map(category => (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResources
                        .filter(resource => resource.category === category)
                        .map(resource => (
                          <div key={resource.id} className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                              {resource.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">
                              {resource.description}
                            </p>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              Read More
                              <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 