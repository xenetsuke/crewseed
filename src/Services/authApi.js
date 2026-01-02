// Mock authentication API services
// TODO: Replace with real Spring Boot API calls when backend is ready

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User data with token
 */
export const loginWithEmail = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response data
      const mockUser = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        user: {
          id: email.includes('worker') ? 'worker-123' : 'employer-456',
          role: email.includes('worker') ? 'WORKER' : 'EMPLOYER',
          name: email.includes('worker') ? 'Test Worker' : 'Test Employer',
          email,
          phone: '+91-9876543210',
          profileComplete: true,
          verificationStatus: 'VERIFIED',
        },
      };
      resolve(mockUser);
    }, 800);
  });
};

/**
 * Signup new worker account
 * @param {Object} userData - User registration data
 * @returns {Promise} Created user data
 */
export const signupWorker = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'worker-' + Date.now(),
          role: 'WORKER',
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          profileComplete: false,
          verificationStatus: 'PENDING',
        },
      };
      resolve(mockResponse);
    }, 1000);
  });
};

/**
 * Signup new employer account
 * @param {Object} companyData - Company registration data
 * @returns {Promise} Created employer data
 */
export const signupEmployer = async (companyData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'employer-' + Date.now(),
          role: 'EMPLOYER',
          name: companyData.contactPerson,
          email: companyData.email,
          phone: companyData.phone,
          company: {
            name: companyData.companyName,
            industry: companyData.industry,
            size: companyData.size,
          },
          profileComplete: false,
          verificationStatus: 'PENDING',
        },
      };
      resolve(mockResponse);
    }, 1000);
  });
};

/**
 * Logout current user
 * @returns {Promise} Logout confirmation
 */
export const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Logged out successfully' });
    }, 300);
  });
};

/**
 * Verify user email
 * @param {string} token - Verification token
 * @returns {Promise} Verification result
 */
export const verifyEmail = async (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Email verified successfully' });
    }, 500);
  });
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Reset request confirmation
 */
export const requestPasswordReset = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Reset link sent to email' });
    }, 600);
  });
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Reset confirmation
 */
export const resetPassword = async (token, newPassword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Password reset successfully' });
    }, 700);
  });
};