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

/**
 * Get all resources
 * @returns {Promise<Array>} Promise containing array of resources
 */
export const getAllResources = async () => {
    return RESOURCES;
};

/**
 * Get resources by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Promise containing array of resources in the category
 */
export const getResourcesByCategory = async (category) => {
    return RESOURCES.filter(resource => resource.category === category);
};

/**
 * Search resources by query
 * @param {string} query - The search query
 * @returns {Promise<Array>} Promise containing array of matching resources
 */
export const searchResources = async (query) => {
    const searchQuery = query.toLowerCase().trim();
    return RESOURCES.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery) ||
        resource.description.toLowerCase().includes(searchQuery)
    );
};

/**
 * Get all available categories
 * @returns {Promise<Array>} Promise containing array of unique categories
 */
export const getCategories = async () => {
    const categories = [...new Set(RESOURCES.map(resource => resource.category))];
    return categories;
}; 