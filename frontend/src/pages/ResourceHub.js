import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// Hardcoded resources data
const RESOURCES = [
  {
    id: "1",
    title: "How to Slow Alzheimer's with Lifestyle Changes",
    description: "An intensive lifestyle program involving a vegan diet, exercise, stress management, and support groups can significantly slow cognitive decline in individuals with mild cognitive impairment or early Alzheimer's.",
    url: "https://time.com/6986373/how-to-slow-alzheimers-lifestyle/",
    category: "Lifestyle Changes to Prevent or Slow Alzheimer's"
  },
  {
    id: "2",
    title: "Alzheimer's: Lifestyle Habit Changes Improved Brain Function",
    description: "A study found that a vegan diet, regular walking, social connection, supplements, and stress reduction improved cognitive function in older adults with early Alzheimer's.",
    url: "https://fortune.com/well/2024/06/07/alzheimers-lifestyle-habit-changes-improved-brain-function/",
    category: "Lifestyle Changes to Prevent or Slow Alzheimer's"
  },
  {
    id: "3",
    title: "Lifestyle Changes May Slow or Prevent Alzheimer's in People at High Risk",
    description: "Adopting a whole-foods plant-based diet, regular exercise, stress management, and support groups can help maintain cognitive function in those with mild cognitive impairment or early dementia.",
    url: "https://www.usnews.com/news/health-news/articles/2024-06-07/lifestyle-changes-may-slow-or-prevent-alzheimers-in-people-at-high-risk",
    category: "Lifestyle Changes to Prevent or Slow Alzheimer's"
  },
  {
    id: "4",
    title: "Can Health & Lifestyle Changes Protect Elders From Alzheimer's?",
    description: "This article discusses how lifestyle changes such as diet, exercise, and cognitive stimulation may help protect elders from Alzheimer's disease.",
    url: "https://www.ucsf.edu/news/2023/11/426636/can-health-lifestyle-changes-protect-elders-alzheimers",
    category: "Lifestyle Changes to Prevent or Slow Alzheimer's"
  },
  {
    id: "5",
    title: "Reducing Risk for Dementia",
    description: "Staying physically active, managing diabetes and blood pressure, and preventing hearing loss can help reduce dementia risk.",
    url: "https://www.cdc.gov/alzheimers-dementia/prevention/index.html",
    category: "Lifestyle Changes to Prevent or Slow Alzheimer's"
  },
  {
    id: "6",
    title: "Activities for Alzheimer's: What to Do",
    description: "Engaging in stimulating activities can help people with Alzheimer's maintain cognitive function and improve their quality of life.",
    url: "https://www.healthline.com/health/alzheimers/activities-for-alzheimers",
    category: "Activities and Therapies for Alzheimer's"
  },
  {
    id: "7",
    title: "Therapeutic Activities for Alzheimer's Disease",
    description: "This article explores various therapeutic activities that can benefit individuals with Alzheimer's disease by promoting cognitive and emotional well-being.",
    url: "https://www.webmd.com/alzheimers/therapeutic-activities-alzheimers-disease",
    category: "Activities and Therapies for Alzheimer's"
  },
  {
    id: "8",
    title: "Activity Ideas for Dementia",
    description: "This resource provides a list of activity ideas to help people with dementia stay engaged and independent.",
    url: "https://www.alzheimers.org.uk/get-support/staying-independent/activity-ideas-dementia",
    category: "Activities and Therapies for Alzheimer's"
  },
  {
    id: "9",
    title: "10 Early Signs and Symptoms of Alzheimer's",
    description: "This page lists ten common warning signs of Alzheimer's disease.",
    url: "https://www.alz.org/alzheimers-dementia/10_signs",
    category: "Detection and Symptoms of Alzheimer's"
  },
  {
    id: "10",
    title: "All About the SAGE Test for Alzheimer's and Dementia Detection",
    description: "The Self-Administered Gerocognitive Exam (SAGE) is a test that can help detect early signs of Alzheimer's and dementia.",
    url: "https://www.everydayhealth.com/alzheimers-disease/all-about-the-sage-test-for-alzheimers-and-dementia-detection/",
    category: "Detection and Symptoms of Alzheimer's"
  },
  {
    id: "11",
    title: "Alzheimer's Disease Symptoms",
    description: "This page describes the symptoms of Alzheimer's disease, including memory problems, confusion, and changes in behavior.",
    url: "https://www.nhs.uk/conditions/alzheimers-disease/symptoms/",
    category: "Detection and Symptoms of Alzheimer's"
  },
  {
    id: "12",
    title: "SAGE Test",
    description: "The SAGE test is a self-administered test used to evaluate cognitive function and detect early signs of memory disorders like Alzheimer's.",
    url: "https://wexnermedical.osu.edu/brain-spine-neuro/memory-disorders/sage",
    category: "Detection and Symptoms of Alzheimer's"
  }
];

export default function ResourceHub() {
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = () => {
      // Set all resources
      setFilteredResources(RESOURCES);

      // Extract unique categories from hardcoded data
      const uniqueCategories = [...new Set(RESOURCES.map(resource => resource.category))];
      setCategories(uniqueCategories);

      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category) {
      // Filter resources by selected category
      const categoryResources = RESOURCES.filter(resource =>
        resource.category === category
      );
      setFilteredResources(categoryResources);
    } else {
      // Show all resources if no category is selected
      setFilteredResources(RESOURCES);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      // If search is empty, reset to current category or all resources
      if (selectedCategory) {
        handleCategoryChange(selectedCategory);
      } else {
        setFilteredResources(RESOURCES);
      }
      return;
    }

    // Filter resources based on search query
    const searchResults = RESOURCES.filter(resource =>
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query)
    );
    setFilteredResources(searchResults);
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
            <p className="text-lg text-neutral-600 dark:text-neutral-300">No resources found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setFilteredResources(RESOURCES);
              }}
              className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Reset filters
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