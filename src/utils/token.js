// Token management utility for localStorage
// Handles authentication token storage and retrieval

const TOKEN_KEY = 'bluecollar_auth_token';
const USER_KEY = 'bluecollar_user_data';

/**
 * Save authentication token to localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    return null;
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

/**
 * Save user data to localStorage
 * @param {Object} userData - User information
 */
export const setUserData = (userData) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data from localStorage:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get user role from stored user data
 * @returns {string|null} User role (WORKER/EMPLOYER) or null
 */
export const getUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  removeToken();
};