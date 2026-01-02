// Mock employer API services
// TODO: Replace with real Spring Boot API calls when backend is ready

/**
 * Get employer dashboard data
 * @returns {Promise} Dashboard data with requirements and statistics
 */
export const getEmployerDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDashboard = {
        statistics: {
          activeRequirements: 5,
          totalApplications: 48,
          interviewsScheduled: 12,
          workersHired: 23,
        },
        activeRequirements: [
          {
            id: 'req-001',
            title: 'Warehouse Loader',
            location: 'Sector 21, Gurgaon',
            positionsRequired: 5,
            applicationsReceived: 12,
            status: 'ACTIVE',
            postedDate: '2025-11-30',
            urgency: 'HIGH',
          },
          {
            id: 'req-002',
            title: 'Security Guard',
            location: 'DLF Phase 3',
            positionsRequired: 3,
            applicationsReceived: 8,
            status: 'ACTIVE',
            postedDate: '2025-11-28',
            urgency: 'MEDIUM',
          },
        ],
        recentActivity: [
          {
            id: 'act-1',
            type: 'APPLICATION',
            message: 'New application for Warehouse Loader position',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            requirementId: 'req-001',
          },
          {
            id: 'act-2',
            type: 'INTERVIEW',
            message: 'Interview completed for Security Guard',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            requirementId: 'req-002',
          },
        ],
        upcomingInterviews: [
          {
            id: 'int-1',
            candidateName: 'Ravi Kumar',
            position: 'Warehouse Loader',
            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            location: 'Office - Conference Room A',
          },
        ],
      };
      resolve(mockDashboard);
    }, 700);
  });
};

/**
 * Get all job requirements
 * @param {Object} filters - Requirement filters
 * @returns {Promise} List of requirements
 */
export const getRequirements = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRequirements = [
        {
          id: 'req-001',
          title: 'Warehouse Loader',
          location: 'Sector 21, Gurgaon',
          positionsRequired: 5,
          wage: '₹800-1000/day',
          shiftTime: '9:00 AM - 6:00 PM',
          duration: '3 months contract',
          applicationsReceived: 12,
          shortlisted: 5,
          interviewed: 2,
          hired: 0,
          status: 'ACTIVE',
          postedDate: '2025-11-30',
          applicationDeadline: '2025-12-15',
          urgency: 'HIGH',
          verified: true,
        },
        {
          id: 'req-002',
          title: 'Security Guard',
          location: 'DLF Phase 3',
          positionsRequired: 3,
          wage: '₹18,000-20,000/month',
          shiftTime: 'Night Shift (10 PM - 6 AM)',
          duration: 'Permanent',
          applicationsReceived: 8,
          shortlisted: 3,
          interviewed: 1,
          hired: 0,
          status: 'ACTIVE',
          postedDate: '2025-11-28',
          applicationDeadline: '2025-12-20',
          urgency: 'MEDIUM',
          verified: true,
        },
        {
          id: 'req-003',
          title: 'Packer',
          location: 'Manesar Industrial Area',
          positionsRequired: 10,
          wage: '₹750/day',
          shiftTime: '10:00 AM - 7:00 PM',
          duration: '6 months contract',
          applicationsReceived: 25,
          shortlisted: 8,
          interviewed: 5,
          hired: 3,
          status: 'PARTIALLY_FILLED',
          postedDate: '2025-11-20',
          applicationDeadline: '2025-12-10',
          urgency: 'LOW',
          verified: true,
        },
      ];
      resolve(mockRequirements);
    }, 600);
  });
};

/**
 * Create new job requirement
 * @param {Object} requirementData - Requirement details
 * @returns {Promise} Created requirement
 */
export const createRequirement = async (requirementData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Job requirement created successfully',
        requirement: {
          id: 'req-' + Date.now(),
          ...requirementData,
          status: 'ACTIVE',
          postedDate: new Date().toISOString(),
          applicationsReceived: 0,
        },
      });
    }, 1000);
  });
};

/**
 * Update job requirement
 * @param {string} requirementId - Requirement ID
 * @param {Object} updateData - Updated requirement data
 * @returns {Promise} Updated requirement
 */
export const updateRequirement = async (requirementId, updateData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Requirement updated successfully',
        requirement: {
          id: requirementId,
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Delete job requirement
 * @param {string} requirementId - Requirement ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteRequirement = async (requirementId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Requirement deleted successfully',
        requirementId,
      });
    }, 500);
  });
};

/**
 * Get requirement details
 * @param {string} requirementId - Requirement ID
 * @returns {Promise} Detailed requirement information
 */
export const getRequirementDetails = async (requirementId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDetails = {
        id: requirementId,
        title: 'Warehouse Loader',
        location: {
          address: 'Plot 45, Sector 21, Gurgaon, Haryana',
          landmark: 'Near Metro Station',
          city: 'Gurgaon',
          state: 'Haryana',
        },
        positionsRequired: 5,
        wage: {
          type: 'DAILY',
          min: 800,
          max: 1000,
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
          startDate: '2025-12-05',
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
          skills: ['Loading', 'Unloading', 'Forklift Operation'],
        },
        benefits: ['Transport', 'Food', 'Medical Insurance', 'Performance Bonus'],
        applicationsReceived: 12,
        shortlisted: 5,
        interviewed: 2,
        hired: 0,
        rejected: 3,
        status: 'ACTIVE',
        postedDate: '2025-11-30',
        applicationDeadline: '2025-12-15',
        urgency: 'HIGH',
      };
      resolve(mockDetails);
    }, 600);
  });
};

/**
 * Search workers
 * @param {Object} searchFilters - Worker search filters
 * @returns {Promise} List of matching workers
 */
export const searchWorkers = async (searchFilters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockWorkers = [
        {
          id: 'worker-001',
          name: 'Ravi Kumar',
          profilePhoto: 'https://via.placeholder.com/150',
          role: 'Warehouse Loader',
          location: 'Gurgaon, Haryana',
          distance: '2.5 km',
          experience: 3,
          rating: 4.5,
          totalJobs: 12,
          skills: ['Loading', 'Unloading', 'Packing', 'Forklift Operation'],
          availability: 'AVAILABLE',
          expectedWage: {
            daily: 800,
            monthly: 25000,
          },
          preferredShift: 'MORNING',
          languages: ['Hindi', 'English'],
          verificationStatus: 'VERIFIED',
          online: true,
        },
        {
          id: 'worker-002',
          name: 'Suresh Yadav',
          profilePhoto: 'https://via.placeholder.com/150',
          role: 'Packer',
          location: 'Manesar, Haryana',
          distance: '8.2 km',
          experience: 2,
          rating: 4.2,
          totalJobs: 8,
          skills: ['Packing', 'Quality Check', 'Inventory Management'],
          availability: 'AVAILABLE',
          expectedWage: {
            daily: 750,
            monthly: 22500,
          },
          preferredShift: 'DAY',
          languages: ['Hindi'],
          verificationStatus: 'VERIFIED',
          online: false,
        },
        {
          id: 'worker-003',
          name: 'Amit Singh',
          profilePhoto: 'https://via.placeholder.com/150',
          role: 'Security Guard',
          location: 'DLF Phase 3, Gurgaon',
          distance: '5.0 km',
          experience: 5,
          rating: 4.8,
          totalJobs: 15,
          skills: ['Security Operations', 'CCTV Monitoring', 'First Aid'],
          availability: 'AVAILABLE',
          expectedWage: {
            monthly: 20000,
          },
          preferredShift: 'NIGHT',
          languages: ['Hindi', 'English', 'Punjabi'],
          verificationStatus: 'VERIFIED',
          online: true,
        },
      ];
      resolve(mockWorkers);
    }, 800);
  });
};

/**
 * Get worker profile details
 * @param {string} workerId - Worker ID
 * @returns {Promise} Detailed worker profile
 */
export const getWorkerProfile = async (workerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfile = {
        id: workerId,
        name: 'Ravi Kumar',
        profilePhoto: 'https://via.placeholder.com/150',
        email: 'ravi.kumar@example.com',
        phone: '+91-9876543210',
        role: 'Warehouse Loader',
        dateOfBirth: '1995-05-15',
        gender: 'MALE',
        location: {
          city: 'Gurgaon',
          state: 'Haryana',
          address: 'MG Road, Sector 14',
        },
        experience: 3,
        rating: 4.5,
        totalJobs: 12,
        completionRate: 95,
        skills: ['Loading', 'Unloading', 'Packing', 'Forklift Operation'],
        availability: 'AVAILABLE',
        expectedWage: {
          daily: 800,
          monthly: 25000,
        },
        preferredShift: 'MORNING',
        languages: ['Hindi', 'English'],
        documents: [
          { type: 'AADHAAR', status: 'VERIFIED' },
          { type: 'PAN', status: 'VERIFIED' },
          { type: 'BANK_ACCOUNT', status: 'VERIFIED' },
        ],
        workHistory: [
          {
            jobTitle: 'Packer',
            companyName: 'XYZ Manufacturing',
            duration: '3 months',
            rating: 4.5,
            feedback: 'Excellent worker, very punctual',
          },
        ],
        verificationStatus: 'VERIFIED',
        backgroundCheck: 'PASSED',
      };
      resolve(mockProfile);
    }, 600);
  });
};

/**
 * Get applications for a requirement
 * @param {string} requirementId - Requirement ID
 * @param {string} status - Application status filter
 * @returns {Promise} List of applications
 */
export const getApplications = async (requirementId, status = 'ALL') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockApplications = [
        {
          id: 'app-001',
          workerId: 'worker-001',
          workerName: 'Ravi Kumar',
          workerPhoto: 'https://via.placeholder.com/80',
          role: 'Warehouse Loader',
          experience: 3,
          rating: 4.5,
          expectedWage: '₹800/day',
          location: 'Gurgaon',
          distance: '2.5 km',
          appliedDate: '2025-12-01',
          status: 'PENDING',
          matchScore: 85,
        },
        {
          id: 'app-002',
          workerId: 'worker-002',
          workerName: 'Suresh Yadav',
          workerPhoto: 'https://via.placeholder.com/80',
          role: 'Warehouse Assistant',
          experience: 2,
          rating: 4.2,
          expectedWage: '₹750/day',
          location: 'Manesar',
          distance: '8.2 km',
          appliedDate: '2025-12-02',
          status: 'SHORTLISTED',
          matchScore: 78,
        },
        {
          id: 'app-003',
          workerId: 'worker-003',
          workerName: 'Amit Singh',
          workerPhoto: 'https://via.placeholder.com/80',
          role: 'Loader',
          experience: 1,
          rating: 4.0,
          expectedWage: '₹700/day',
          location: 'Gurgaon',
          distance: '3.8 km',
          appliedDate: '2025-11-30',
          status: 'INTERVIEWED',
          matchScore: 72,
          interviewDate: '2025-12-03',
          interviewFeedback: 'Good communication, needs training',
        },
      ];

      const filteredApplications = status === 'ALL'
        ? mockApplications
        : mockApplications.filter(app => app.status === status);

      resolve(filteredApplications);
    }, 700);
  });
};

/**
 * Update application status
 * @param {string} applicationId - Application ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data (feedback, interview date, etc.)
 * @returns {Promise} Updated application
 */
export const updateApplicationStatus = async (applicationId, status, additionalData = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Application ${status.toLowerCase()} successfully`,
        application: {
          id: applicationId,
          status,
          ...additionalData,
          updatedAt: new Date().toISOString(),
        },
      });
    }, 600);
  });
};

/**
 * Schedule interview
 * @param {string} applicationId - Application ID
 * @param {Object} interviewData - Interview details
 * @returns {Promise} Interview schedule confirmation
 */
export const scheduleInterview = async (applicationId, interviewData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Interview scheduled successfully',
        interview: {
          id: 'int-' + Date.now(),
          applicationId,
          ...interviewData,
          status: 'SCHEDULED',
          createdAt: new Date().toISOString(),
        },
      });
    }, 700);
  });
};

/**
 * Send invitation to worker
 * @param {string} workerId - Worker ID
 * @param {string} requirementId - Requirement ID
 * @param {Object} message - Invitation message
 * @returns {Promise} Invitation result
 */
export const inviteWorker = async (workerId, requirementId, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Invitation sent successfully',
        invitation: {
          id: 'inv-' + Date.now(),
          workerId,
          requirementId,
          status: 'SENT',
          sentAt: new Date().toISOString(),
        },
      });
    }, 500);
  });
};

/**
 * Get employer profile
 * @returns {Promise} Employer profile data
 */
export const getEmployerProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfile = {
        id: 'employer-456',
        contactPerson: 'Rajesh Sharma',
        email: 'rajesh@abclogistics.com',
        phone: '+91-9876543210',
        company: {
          name: 'ABC Logistics',
          logo: 'https://via.placeholder.com/150',
          industry: 'Logistics & Supply Chain',
          size: '500-1000 employees',
          established: '2010',
          website: 'www.abclogistics.com',
          address: {
            street: 'Plot 45, Sector 21',
            city: 'Gurgaon',
            state: 'Haryana',
            pincode: '122001',
          },
          about: 'Leading logistics company serving North India with comprehensive warehousing and transportation solutions.',
          rating: 4.2,
          totalReviews: 45,
        },
        verificationStatus: 'VERIFIED',
        activeRequirements: 5,
        totalHires: 23,
        profileCompletion: 90,
      };
      resolve(mockProfile);
    }, 600);
  });
};

/**
 * Update employer profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile
 */
export const updateEmployerProfile = async (profileData) => {
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