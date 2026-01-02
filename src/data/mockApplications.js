export const mockApplications = [
  {
    id: "app-001",
    workerId: "worker-001",
    workerName: "Rajesh Kumar",
    workerPhoto: "https://i.pravatar.cc/150?img=12",
    jobId: "job-001",
    jobTitle: "Warehouse Loaders Required",
    companyId: "company-001",
    companyName: "ABC Logistics Pvt Ltd",
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "SHORTLISTED",
    matchScore: 92,
    workerDetails: {
      experience: 5,
      rating: 4.5,
      skills: ["Heavy Lifting", "Forklift Operation", "Safety Protocols"],
      expectedWage: { daily: 700, monthly: 21000 },
      availability: "Immediate",
      location: "Andheri East",
      distance: 2.5
    },
    recruiterNotes: "Excellent profile. Strong experience in warehouse operations.",
    interviewScheduled: {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)?.toISOString(),
      time: "10:00 AM",
      mode: "In-person"
    }
  },
  {
    id: "app-002",
    workerId: "worker-002",
    workerName: "Priya Sharma",
    workerPhoto: "https://i.pravatar.cc/150?img=5",
    jobId: "job-002",
    jobTitle: "Packers for E-commerce Fulfillment",
    companyId: "company-002",
    companyName: "QuickShip Solutions",
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "PENDING",
    matchScore: 88,
    workerDetails: {
      experience: 3,
      rating: 4.8,
      skills: ["Product Packaging", "Quality Control"],
      expectedWage: { daily: 600, monthly: 18000 },
      availability: "This week",
      location: "Goregaon",
      distance: 5.2
    },
    recruiterNotes: null,
    interviewScheduled: null
  },
  {
    id: "app-003",
    workerId: "worker-003",
    workerName: "Amit Patel",
    workerPhoto: "https://i.pravatar.cc/150?img=33",
    jobId: "job-003",
    jobTitle: "Security Guards - Night Shift",
    companyId: "company-003",
    companyName: "SecureZone Services",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "HIRED",
    matchScore: 95,
    workerDetails: {
      experience: 8,
      rating: 4.7,
      skills: ["Security Patrol", "CCTV Monitoring", "First Aid"],
      expectedWage: { daily: 850, monthly: 25500 },
      availability: "Immediate",
      location: "Bandra West",
      distance: 8.1
    },
    recruiterNotes: "Perfect fit. Hired for night shift position.",
    interviewScheduled: {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
      time: "2:00 PM",
      mode: "Completed"
    },
    hiringDetails: {
      hiredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)?.toISOString(),
      agreedWage: { daily: 850, monthly: 25500 }
    }
  },
  {
    id: "app-004",
    workerId: "worker-004",
    workerName: "Sunita Devi",
    workerPhoto: "https://i.pravatar.cc/150?img=9",
    jobId: "job-004",
    jobTitle: "Housekeeping Staff for Corporate Office",
    companyId: "company-004",
    companyName: "CleanCo Facilities",
    appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "SHORTLISTED",
    matchScore: 90,
    workerDetails: {
      experience: 10,
      rating: 4.9,
      skills: ["Deep Cleaning", "Floor Maintenance", "Sanitization"],
      expectedWage: { daily: 500, monthly: 15000 },
      availability: "Immediate",
      location: "Malad East",
      distance: 12.3
    },
    recruiterNotes: "Highly experienced. Scheduled for final interview.",
    interviewScheduled: {
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)?.toISOString(),
      time: "11:00 AM",
      mode: "In-person"
    }
  },
  {
    id: "app-005",
    workerId: "worker-005",
    workerName: "Mohammed Rafi",
    workerPhoto: "https://i.pravatar.cc/150?img=15",
    jobId: "job-005",
    jobTitle: "Cook for Corporate Cafeteria",
    companyId: "company-005",
    companyName: "TasteBuds Catering",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "PENDING",
    matchScore: 85,
    workerDetails: {
      experience: 6,
      rating: 4.6,
      skills: ["Indian Cuisine", "Food Safety"],
      expectedWage: { daily: 1000, monthly: 30000 },
      availability: "Next week",
      location: "Kurla West",
      distance: 6.7
    },
    recruiterNotes: null,
    interviewScheduled: null
  },
  {
    id: "app-006",
    workerId: "worker-006",
    workerName: "Lakshmi Menon",
    workerPhoto: "https://i.pravatar.cc/150?img=10",
    jobId: "job-001",
    jobTitle: "Warehouse Loaders Required",
    companyId: "company-001",
    companyName: "ABC Logistics Pvt Ltd",
    appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)?.toISOString(),
    status: "REJECTED",
    matchScore: 65,
    workerDetails: {
      experience: 4,
      rating: 4.4,
      skills: ["Machine Operation", "Production Line"],
      expectedWage: { daily: 750, monthly: 22500 },
      availability: "This week",
      location: "Powai",
      distance: 15.4
    },
    recruiterNotes: "Skills not matching job requirements. Rejected.",
    interviewScheduled: null,
    rejectionReason: "Skills mismatch - More suited for machine operator roles"
  }
];

export const applicationStatuses = {
  PENDING: "PENDING",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEWED: "INTERVIEWED",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN"
};

export default mockApplications;