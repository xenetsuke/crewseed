export const mockNotifications = [
  {
    id: "notif-001",
    userId: "worker-001",
    userRole: "WORKER",
    type: "JOB_MATCH",
    title: "New Job Match",
    message: "A new job matching your profile has been posted: Warehouse Loaders Required",
    data: {
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      companyName: "ABC Logistics Pvt Ltd",
      matchScore: 92
    },
    read: false,
    actionRequired: true,
    actionLabel: "View Job",
    actionUrl: "/worker/jobs/job-001",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
    priority: "HIGH"
  },
  {
    id: "notif-002",
    userId: "worker-001",
    userRole: "WORKER",
    type: "APPLICATION_UPDATE",
    title: "Application Shortlisted",
    message: "Your application for \'Warehouse Loaders Required\' has been shortlisted",
    data: {
      applicationId: "app-001",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      companyName: "ABC Logistics Pvt Ltd",
      status: "SHORTLISTED"
    },
    read: false,
    actionRequired: true,
    actionLabel: "View Details",
    actionUrl: "/worker/applications/app-001",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)?.toISOString(),
    priority: "HIGH"
  },
  {
    id: "notif-003",
    userId: "worker-002",
    userRole: "WORKER",
    type: "INTERVIEW_SCHEDULED",
    title: "Interview Scheduled",
    message: "Interview scheduled for 'Packers for E-commerce Fulfillment' on Dec 8, 2025 at 10:00 AM",
    data: {
      applicationId: "app-002",
      jobId: "job-002",
      jobTitle: "Packers for E-commerce Fulfillment",
      companyName: "QuickShip Solutions",
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)?.toISOString(),
      interviewTime: "10:00 AM",
      interviewMode: "In-person",
      location: "Warehouse Complex, Goregaon East"
    },
    read: false,
    actionRequired: true,
    actionLabel: "Confirm",
    actionUrl: "/worker/interviews/app-002",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
    priority: "URGENT"
  },
  {
    id: "notif-004",
    userId: "company-001",
    userRole: "EMPLOYER",
    type: "NEW_APPLICATION",
    title: "New Application Received",
    message: "Rajesh Kumar applied for \'Warehouse Loaders Required'",
    data: {
      applicationId: "app-001",
      workerId: "worker-001",
      workerName: "Rajesh Kumar",
      jobId: "job-001",
      jobTitle: "Warehouse Loaders Required",
      matchScore: 92
    },
    read: false,
    actionRequired: true,
    actionLabel: "Review Application",
    actionUrl: "/employer/applications/app-001",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
    priority: "MEDIUM"
  },
  {
    id: "notif-005",
    userId: "company-002",
    userRole: "EMPLOYER",
    type: "APPLICATION_MILESTONE",
    title: "50 Applications Received",
    message: "Your job posting \'Packers for E-commerce Fulfillment\' has received 50 applications",
    data: {
      jobId: "job-002",
      jobTitle: "Packers for E-commerce Fulfillment",
      applicationsCount: 50,
      pendingReview: 38
    },
    read: false,
    actionRequired: true,
    actionLabel: "Review Applications",
    actionUrl: "/employer/jobs/job-002/applications",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)?.toISOString(),
    priority: "MEDIUM"
  },
  {
    id: "notif-006",
    userId: "worker-003",
    userRole: "WORKER",
    type: "JOB_OFFER",
    title: "Job Offer Received",
    message: "Congratulations! You have been selected for 'Security Guards - Night Shift'",
    data: {
      applicationId: "app-003",
      jobId: "job-003",
      jobTitle: "Security Guards - Night Shift",
      companyName: "SecureZone Services",
      offerDetails: {
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)?.toISOString(),
        wage: { daily: 850, monthly: 25500 }
      }
    },
    read: false,
    actionRequired: true,
    actionLabel: "Accept Offer",
    actionUrl: "/worker/offers/app-003",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    priority: "URGENT"
  },
  {
    id: "notif-007",
    userId: "company-003",
    userRole: "EMPLOYER",
    type: "JOB_EXPIRING",
    title: "Job Posting Expiring Soon",
    message: "Your job posting 'Security Guards - Night Shift' will expire in 3 days",
    data: {
      jobId: "job-003",
      jobTitle: "Security Guards - Night Shift",
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)?.toISOString(),
      remainingPositions: 3
    },
    read: true,
    actionRequired: true,
    actionLabel: "Extend Posting",
    actionUrl: "/employer/jobs/job-003/extend",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)?.toISOString(),
    priority: "MEDIUM"
  },
  {
    id: "notif-008",
    userId: "worker-004",
    userRole: "WORKER",
    type: "PROFILE_INCOMPLETE",
    title: "Complete Your Profile",
    message: "Your profile is 75% complete. Add documents to increase visibility",
    data: {
      completionPercentage: 75,
      missingItems: ["PAN Card", "Bank Details"]
    },
    read: true,
    actionRequired: true,
    actionLabel: "Complete Profile",
    actionUrl: "/worker/profile/documents",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString(),
    priority: "LOW"
  },
  {
    id: "notif-009",
    userId: "company-004",
    userRole: "EMPLOYER",
    type: "PAYMENT_DUE",
    title: "Payment Due Reminder",
    message: "Invoice payment of ₹15,000 is due for worker Sunita Devi",
    data: {
      workerId: "worker-004",
      workerName: "Sunita Devi",
      amount: 15000,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)?.toISOString(),
      invoiceId: "INV-2025-001"
    },
    read: false,
    actionRequired: true,
    actionLabel: "Pay Now",
    actionUrl: "/employer/payments/INV-2025-001",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)?.toISOString(),
    priority: "HIGH"
  },
  {
    id: "notif-010",
    userId: "worker-005",
    userRole: "WORKER",
    type: "DOCUMENT_VERIFIED",
    title: "Document Verified",
    message: "Your Aadhaar card has been successfully verified",
    data: {
      documentType: "AADHAAR",
      verificationDate: new Date()?.toISOString()
    },
    read: true,
    actionRequired: false,
    actionLabel: null,
    actionUrl: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
    priority: "LOW"
  }
];

export const notificationTypes = {
  JOB_MATCH: "JOB_MATCH",
  APPLICATION_UPDATE: "APPLICATION_UPDATE",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  JOB_OFFER: "JOB_OFFER",
  NEW_APPLICATION: "NEW_APPLICATION",
  APPLICATION_MILESTONE: "APPLICATION_MILESTONE",
  JOB_EXPIRING: "JOB_EXPIRING",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
  PAYMENT_DUE: "PAYMENT_DUE",
  DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED",
  SYSTEM_UPDATE: "SYSTEM_UPDATE"
};

export const notificationPriorities = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};

export default mockNotifications;