// A URL base da sua API é a raiz do seu servidor backend
const API_BASE_URL = 'http://localhost:3001';

/**
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<Response>} 
 */
export async function fetchApi(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    options.headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    return fetch(`${API_BASE_URL}${endpoint}`, options);
}