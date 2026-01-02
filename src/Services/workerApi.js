// Mock worker API services
// TODO: Replace with real Spring Boot API calls when backend is ready

/**
 * Get worker dashboard data
 * @returns {Promise} Dashboard data with assignments and statistics
 */
export const getWorkerDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDashboard = {
        todayAssignment: {
          id: 'assign-001',
          jobTitle: 'Warehouse Loader',
          companyName: 'ABC Logistics',
          companyLogo: 'https://via.placeholder.com/80',
          location: 'Sector 21, Gurgaon',
          distance: '2.3 km',
          shiftTime: '9:00 AM - 6:00 PM',
          reportTime: '8:45 AM',
          supervisorName: 'Rajesh Kumar',
          supervisorPhone: '+91-9876543210',
          status: 'CONFIRMED',
        },
        statistics: {
          totalJobs: 12,
          activeAssignments: 1,
          pendingApplications: 3,
          totalEarnings: 45000,
          averageRating: 4.5,
        },
        recentActivity: [
          {
            id: 'act-1',
            type: 'APPLICATION',
            message: 'Applied to Packer position at XYZ Company',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'act-2',
            type: 'INTERVIEW',
            message: 'Interview scheduled for tomorrow at 10:00 AM',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };
      resolve(mockDashboard);
    }, 600);
  });
};

/**
 * Get worker profile
 * @returns {Promise} Worker profile data
 */
export const getWorkerProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfile = {
        id: 'worker-123',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        phone: '+91-9876543210',
        profilePhoto: 'https://via.placeholder.com/150',
        role: 'WORKER',
        dateOfBirth: '1995-05-15',
        gender: 'MALE',
        address: {
          street: 'MG Road',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
        },
        skills: ['Loading', 'Unloading', 'Packing', 'Forklift Operation'],
        experience: 3,
        availability: 'AVAILABLE',
        preferredShift: 'MORNING',
        expectedWage: {
          daily: 800,
          monthly: 25000,
        },
        documents: [
          { type: 'AADHAAR', status: 'VERIFIED', number: 'XXXX-XXXX-1234' },
          { type: 'PAN', status: 'VERIFIED', number: 'ABCDE1234F' },
          { type: 'BANK_ACCOUNT', status: 'PENDING', number: 'XXXX-XXXX-5678' },
        ],
        rating: 4.5,
        totalJobs: 12,
        profileCompletion: 85,
      };
      resolve(mockProfile);
    }, 700);
  });
};

/**
 * Update worker profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile
 */
export const updateWorkerProfile = async (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Profile updated successfully',
        profile: { ...profileData, updatedAt: new Date().toISOString() },
      });
    }, 800);
  });
};

/**
 * Get worker assignments
 * @param {string} status - Assignment status filter (ACTIVE, COMPLETED, ALL)
 * @returns {Promise} List of assignments
 */
export const getWorkerAssignments = async (status = 'ALL') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAssignments = [
        {
          id: 'assign-001',
          jobTitle: 'Warehouse Loader',
          companyName: 'ABC Logistics',
          companyLogo: 'https://via.placeholder.com/80',
          location: 'Sector 21, Gurgaon',
          distance: '2.3 km',
          wage: '₹800/day',
          shiftTime: '9:00 AM - 6:00 PM',
          startDate: '2025-12-01',
          status: 'ONGOING',
          daysCompleted: 2,
          totalDays: 30,
        },
        {
          id: 'assign-002',
          jobTitle: 'Packer',
          companyName: 'XYZ Manufacturing',
          companyLogo: 'https://via.placeholder.com/80',
          location: 'Manesar Industrial Area',
          distance: '8.5 km',
          wage: '₹750/day',
          shiftTime: '10:00 AM - 7:00 PM',
          startDate: '2025-11-15',
          endDate: '2025-11-30',
          status: 'COMPLETED',
          rating: 4.5,
          earnings: 12000,
        },
      ];
      
      const filteredAssignments = status === 'ALL' 
        ? mockAssignments 
        : mockAssignments.filter(a => a.status === status);
      
      resolve(filteredAssignments);
    }, 600);
  });
};

/**
 * Get available jobs for worker
 * @param {Object} filters - Job filters
 * @returns {Promise} List of available jobs
 */
export const getAvailableJobs = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockJobs = [
        {
          id: 'job-001',
          title: 'Warehouse Loader',
          companyName: 'ABC Logistics',
          companyLogo: 'https://via.placeholder.com/80',
          location: 'Sector 21, Gurgaon',
          distance: '2.3 km',
          wage: '₹800-1000/day',
          shiftTime: '9:00 AM - 6:00 PM',
          duration: '3 months contract',
          positionsAvailable: 5,
          requirements: ['1-2 years experience', 'Can lift 25kg'],
          benefits: ['Transport', 'Food', 'Insurance'],
          postedDate: '2 days ago',
          urgent: true,
          verified: true,
        },
        {
          id: 'job-002',
          title: 'Security Guard',
          companyName: 'SecureMax Security',
          companyLogo: 'https://via.placeholder.com/80',
          location: 'DLF Phase 3',
          distance: '5.1 km',
          wage: '₹18,000-20,000/month',
          shiftTime: 'Night Shift (10 PM - 6 AM)',
          duration: 'Permanent',
          positionsAvailable: 3,
          requirements: ['Ex-serviceman preferred', 'Physical fitness'],
          benefits: ['Accommodation', 'Uniform', 'ESI/PF'],
          postedDate: '1 week ago',
          urgent: false,
          verified: true,
        },
      ];
      resolve(mockJobs);
    }, 700);
  });
};

/**
 * Apply for a job
 * @param {string} jobId - Job ID
 * @returns {Promise} Application result
 */
export const applyForJob = async (jobId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Application submitted successfully',
        applicationId: 'app-' + Date.now(),
        status: 'PENDING',
      });
    }, 500);
  });
};

/**
 * Get job details
 * @param {string} jobId - Job ID
 * @returns {Promise} Detailed job information
 */
export const getJobDetails = async (jobId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockJobDetails = {
        id: jobId,
        title: 'Warehouse Loader',
        companyName: 'ABC Logistics',
        companyLogo: 'https://via.placeholder.com/150',
        industry: 'Logistics & Supply Chain',
        location: {
          address: 'Plot 45, Sector 21, Gurgaon, Haryana',
          distance: '2.3 km',
          landmark: 'Near Metro Station',
        },
        wage: {
          daily: 850,
          monthly: 25500,
          overtime: 150,
        },
        schedule: {
          shiftTime: '9:00 AM - 6:00 PM',
          workingDays: 'Monday to Saturday',
          breakTime: '1 hour lunch break',
        },
        duration: {
          type: 'CONTRACT',
          length: '3 months',
          startDate: 'Immediate',
        },
        description: {
          responsibilities: [
            'Loading and unloading goods from trucks',
            'Organizing warehouse inventory',
            'Operating material handling equipment',
            'Maintaining cleanliness and safety standards',
          ],
          requirements: [
            '1-2 years experience in warehouse operations',
            'Ability to lift 25kg',
            'Basic knowledge of warehouse operations',
            'Good physical fitness',
          ],
          workingConditions: [
            'Indoor warehouse environment',
            'Temperature controlled facility',
            'Safety equipment provided',
          ],
        },
        benefits: ['Transport', 'Food', 'Medical Insurance', 'Performance Bonus'],
        company: {
          name: 'ABC Logistics',
          about: 'Leading logistics company serving North India',
          size: '500-1000 employees',
          established: '2010',
          rating: 4.2,
          totalReviews: 45,
        },
        applicationStatus: null,
        positionsAvailable: 5,
        applicationsReceived: 12,
        postedDate: '2025-11-30',
        applicationDeadline: '2025-12-15',
        verified: true,
        urgent: true,
      };
      resolve(mockJobDetails);
    }, 600);
  });
};

/**
 * Update availability status
 * @param {string} status - Availability status (AVAILABLE, NOT_AVAILABLE)
 * @param {string} availableFrom - Available from date (optional)
 * @returns {Promise} Update confirmation
 */
export const updateAvailability = async (status, availableFrom = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Availability updated successfully',
        availability: {
          status,
          availableFrom,
          updatedAt: new Date().toISOString(),
        },
      });
    }, 400);
  });
};

/**
 * Upload document
 * @param {Object} documentData - Document data with file
 * @returns {Promise} Upload result
 */
export const uploadDocument = async (documentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Document uploaded successfully',
        document: {
          id: 'doc-' + Date.now(),
          type: documentData.type,
          status: 'PENDING',
          uploadedAt: new Date().toISOString(),
        },
      });
    }, 1200);
  });
};

/**
 * Get work history
 * @returns {Promise} List of completed jobs
 */
export const getWorkHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHistory = [
        {
          id: 'job-hist-001',
          jobTitle: 'Packer',
          companyName: 'XYZ Manufacturing',
          duration: '3 months',
          startDate: '2025-08-01',
          endDate: '2025-10-31',
          rating: 4.5,
          earnings: 22500,
          feedback: 'Excellent worker, very punctual and hardworking',
        },
        {
          id: 'job-hist-002',
          jobTitle: 'Loader',
          companyName: 'Quick Transport Ltd',
          duration: '2 months',
          startDate: '2025-05-15',
          endDate: '2025-07-15',
          rating: 4.0,
          earnings: 16000,
          feedback: 'Good performance, reliable worker',
        },
      ];
      resolve(mockHistory);
    }, 500);
  });
};