export const mockWorkerActivities = [
  {
    id: "activity-w-001",
    userId: "worker-001",
    type: "APPLICATION_SUBMITTED",
    title: "Applied to Job",
    description: "You applied for \'Warehouse Loaders Required\' at ABC Logistics Pvt Ltd",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      companyName: "ABC Logistics Pvt Ltd"
    },
    icon: "briefcase",
    color: "blue"
  },
  {
    id: "activity-w-002",
    userId: "worker-001",
    type: "APPLICATION_SHORTLISTED",
    title: "Application Shortlisted",
    description: "Your application for \'Warehouse Loaders Required\' has been shortlisted",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-001",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      companyName: "ABC Logistics Pvt Ltd"
    },
    icon: "check-circle",
    color: "green"
  },
  {
    id: "activity-w-003",
    userId: "worker-001",
    type: "PROFILE_UPDATED",
    title: "Profile Updated",
    description: "You updated your skills and experience",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      fieldsUpdated: ["skills", "experience"]
    },
    icon: "user",
    color: "purple"
  },
  {
    id: "activity-w-004",
    userId: "worker-002",
    type: "JOB_VIEWED",
    title: "Viewed Job",
    description: "You viewed \'Packers for E-commerce Fulfillment'",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      jobId: "job-002",
      jobTitle: "Packers for E-commerce Fulfillment",
      companyName: "QuickShip Solutions"
    },
    icon: "eye",
    color: "gray"
  },
  {
    id: "activity-w-005",
    userId: "worker-003",
    type: "JOB_OFFER_ACCEPTED",
    title: "Job Offer Accepted",
    description: "You accepted the offer for 'Security Guards - Night Shift'",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-003",
      jobId: "job-003",
      jobTitle: "Security Guards - Night Shift",
      companyName: "SecureZone Services",
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)?.toISOString()
    },
    icon: "check-circle",
    color: "green"
  },
  {
    id: "activity-w-006",
    userId: "worker-004",
    type: "DOCUMENT_UPLOADED",
    title: "Document Uploaded",
    description: "You uploaded PAN card for verification",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      documentType: "PAN"
    },
    icon: "file-text",
    color: "blue"
  }
];

export const mockEmployerActivities = [
  {
    id: "activity-e-001",
    userId: "company-001",
    type: "JOB_POSTED",
    title: "Job Posted",
    description: "You posted a new job: \'Warehouse Loaders Required'",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      positions: 10
    },
    icon: "plus-circle",
    color: "green"
  },
  {
    id: "activity-e-002",
    userId: "company-001",
    type: "APPLICATION_RECEIVED",
    title: "New Application",
    description: "Rajesh Kumar applied for \'Warehouse Loaders Required'",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-001",
      workerId: "worker-001",
      workerName: "Rajesh Kumar",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      matchScore: 92
    },
    icon: "user-plus",
    color: "blue"
  },
  {
    id: "activity-e-003",
    userId: "company-001",
    type: "APPLICATION_SHORTLISTED",
    title: "Application Shortlisted",
    description: "You shortlisted Rajesh Kumar for \'Warehouse Loaders Required'",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-001",
      workerId: "worker-001",
      workerName: "Rajesh Kumar",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required"
    },
    icon: "check-circle",
    color: "green"
  },
  {
    id: "activity-e-004",
    userId: "company-002",
    type: "INTERVIEW_SCHEDULED",
    title: "Interview Scheduled",
    description: "Interview scheduled with Priya Sharma for Dec 8, 2025",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-002",
      workerId: "worker-002",
      workerName: "Priya Sharma",
      jobId: "job-002",
      jobTitle: "Packers for E-commerce Fulfillment",
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)?.toISOString()
    },
    icon: "calendar",
    color: "purple"
  },
  {
    id: "activity-e-005",
    userId: "company-003",
    type: "WORKER_HIRED",
    title: "Worker Hired",
    description: "You hired Amit Patel for 'Security Guards - Night Shift'",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-003",
      workerId: "worker-003",
      workerName: "Amit Patel",
      jobId: "job-003",
      jobTitle: "Security Guards - Night Shift"
    },
    icon: "user-check",
    color: "green"
  },
  {
    id: "activity-e-006",
    userId: "company-004",
    type: "JOB_UPDATED",
    title: "Job Updated",
    description: "You updated the job posting \'Housekeeping Staff for Corporate Office'",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)?.toISOString(),
    data: {
      jobId: "job-004",
      jobTitle: "Housekeeping Staff for Corporate Office",
      fieldsUpdated: ["wage", "positions"]
    },
    icon: "edit",
    color: "blue"
  },
  {
    id: "activity-e-007",
    userId: "company-005",
    type: "APPLICATION_REJECTED",
    title: "Application Rejected",
    description: "You rejected application from Lakshmi Menon",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)?.toISOString(),
    data: {
      applicationId: "app-006",
      workerId: "worker-006",
      workerName: "Lakshmi Menon",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      reason: "Skills mismatch"
    },
    icon: "x-circle",
    color: "red"
  }
];

export const activityTypes = {
  // Worker Activities
  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  APPLICATION_SHORTLISTED: "APPLICATION_SHORTLISTED",
  JOB_VIEWED: "JOB_VIEWED",
  JOB_SAVED: "JOB_SAVED",
  JOB_OFFER_ACCEPTED: "JOB_OFFER_ACCEPTED",
  JOB_OFFER_REJECTED: "JOB_OFFER_REJECTED",
  PROFILE_UPDATED: "PROFILE_UPDATED",
  DOCUMENT_UPLOADED: "DOCUMENT_UPLOADED",
  DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED",
  
  // Employer Activities
  JOB_POSTED: "JOB_POSTED",
  JOB_UPDATED: "JOB_UPDATED",
  JOB_CLOSED: "JOB_CLOSED",
  APPLICATION_RECEIVED: "APPLICATION_RECEIVED",
  APPLICATION_REVIEWED: "APPLICATION_REVIEWED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  WORKER_HIRED: "WORKER_HIRED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  WORKER_CONTACTED: "WORKER_CONTACTED"
};

export default {
  mockWorkerActivities,
  mockEmployerActivities,
  activityTypes
};