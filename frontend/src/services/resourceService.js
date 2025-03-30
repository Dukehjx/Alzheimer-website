import axios from 'axios';
import { API_BASE_URL } from '../config';

const RESOURCE_API = `${API_BASE_URL}/api/v1/resources`;

/**
 * Get all resources
 * @returns {Promise<Array>} Promise containing array of resources
 */
export const getAllResources = async () => {
    try {
        const response = await axios.get(RESOURCE_API);
        return response.data.resources;
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
};

/**
 * Get resources by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Promise containing array of resources in the category
 */
export const getResourcesByCategory = async (category) => {
    try {
        const response = await axios.get(`${RESOURCE_API}/categories/${encodeURIComponent(category)}`);
        return response.data.resources;
    } catch (error) {
        console.error(`Error fetching resources for category ${category}:`, error);
        throw error;
    }
};

/**
 * Search resources by query
 * @param {string} query - The search query
 * @returns {Promise<Array>} Promise containing array of matching resources
 */
export const searchResources = async (query) => {
    try {
        const response = await axios.get(`${RESOURCE_API}/search`, {
            params: { query }
        });
        return response.data.resources;
    } catch (error) {
        console.error(`Error searching resources with query ${query}:`, error);
        throw error;
    }
};

/**
 * Get all available categories
 * @returns {Promise<Array>} Promise containing array of unique categories
 */
export const getCategories = async () => {
    try {
        const resources = await getAllResources();
        const categories = [...new Set(resources.map(resource => resource.category))];
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}; 