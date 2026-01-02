export const mockJobs = [
{
  "id": 1,

  "jobTitle": "Warehouse Loader",
  "jobRole": "Loader",
  "jobDescription": "Responsible for loading and unloading goods in warehouse operations.",
  "industryCategory": "LOGISTICS",
  "applicants": [],

  "numberOfWorkers": 10,
  "experienceLevel": "FRESHER",
  "skillCategory": "General Labor",
  "primarySkills": ["Lifting", "Loading"],
  "secondarySkills": ["Basic Inventory"],
  "physicalRequirements": {
    "liftingCapacity": 25,
    "standingDuration": 8,
    "mobilityNeeds": "Normal mobility"
  },

  "workLocationId": 1001,
  "locationName": "Main Warehouse",
  "fullWorkAddress": "Plot 45, Andheri MIDC, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400093",
  "gpsCoordinates": {
    "latitude": 19.1203,
    "longitude": 72.8504
  },

  "wageType": "DAILY",
  "baseWageAmount": 700,
  "wageRange": {
    "min": 600,
    "max": 800
  },
  "overtimeRate": 120,
  "performanceIncentives": false,
  "paymentFrequency": "WEEKLY",

  "shiftStartTime": "08:00",
  "shiftEndTime": "17:00",
  "totalHoursPerDay": 9,
  "workingDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "weeklyOffPattern": "SUNDAY",
  "breakDuration": 60,
  "nightShiftPremium": 0,

  "jobType": "PERMANENT",
  "contractDuration": "PERMANENT",
  "startDate": "2025-01-10",
  "endDate": null,
  "immediateJoining": true,
  "probationPeriod": 30,

  "transportProvided": true,
  "transportDetails": "Company bus pickup at Andheri station",
  "foodProvided": true,
  "foodDetails": "Lunch provided",
  "accommodationProvided": false,
  "accommodationDetails": null,
  "uniformProvided": true,
  "medicalInsurance": true,
  "esiPfBenefits": true,
  "festivalBonuses": false,
  "leavePolicy": "6 paid leaves per year",

  "applicationDeadline": "2025-01-20T23:59:00",
  "allowDirectApplications": true,
  "interviewRequired": false,
  "documentRequirements": ["Aadhar Card", "PAN Card"],
  "backgroundCheckRequired": false,
  "medicalFitnessRequired": false,

  "urgencyLevel": "NORMAL",
  "visibility": "PUBLIC",
  "featuredJob": false,
  "autoRenewal": false,

  "minimumAge": 18,
  "maximumAge": 50,
  "genderPreference": "NO_PREFERENCE",
  "educationLevel": "PRIMARY",
  "languageRequirements": ["Hindi"],
  "certificationRequirements": [],
  "previousIndustryExperience": ["Warehouse"],

  "jobStatus": "ACTIVE"
},

  {
    id: "job-002",
    title: "Packers for E-commerce Fulfillment",
    companyId: "company-002",
    companyName: "QuickShip Solutions",
    companyLogo: "https://ui-avatars.com/api/?name=QuickShip+Solutions&background=FF6B6B&color=fff",
    status: "ACTIVE",
    priority: "URGENT",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)?.toISOString(),
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)?.toISOString(),
    jobType: "PART_TIME",
    industry: "E-commerce",
    location: {
      city: "Mumbai",
      area: "Goregaon",
      address: "Warehouse Complex, Goregaon East, Mumbai",
      pincode: "400063"
    },
    description: "Immediate requirement for packers to handle e-commerce orders. Fast-paced environment with opportunities for growth.",
    requirements: {
      roles: ["Packer", "Quality Check"],
      experience: { min: 0, max: 3 },
      skills: ["Product Packaging", "Quality Control", "Speed"],
      education: "10th Pass",
      languages: ["Hindi", "Marathi"],
      shifts: ["DAY", "EVENING"]
    },
    compensation: {
      wageType: "DAILY",
      dailyWage: { amount: 550, negotiable: true },
      monthlyWage: { amount: 16500, negotiable: true },
      benefits: ["Performance Bonus", "Meals"]
    },
    workSchedule: {
      daysPerWeek: 6,
      hoursPerDay: 6,
      shifts: ["DAY", "EVENING"],
      overtimeAvailable: true
    },
    positions: {
      total: 20,
      filled: 5,
      remaining: 15
    },
    applications: {
      total: 67,
      pending: 52,
      shortlisted: 10,
      rejected: 5
    },
    metrics: {
      views: 456,
      applies: 67,
      responseRate: 85,
      avgTimeToRespond: "1 hour"
    }
  },
  {
    id: "job-003",
    title: "Security Guards - Night Shift",
    companyId: "company-003",
    companyName: "SecureZone Services",
    companyLogo: "https://ui-avatars.com/api/?name=SecureZone+Services&background=4ECDC4&color=fff",
    status: "ACTIVE",
    priority: "MEDIUM",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)?.toISOString(),
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)?.toISOString(),
    jobType: "FULL_TIME",
    industry: "Security Services",
    location: {
      city: "Mumbai",
      area: "Bandra Complex",
      address: "Commercial Building, Bandra West, Mumbai",
      pincode: "400050"
    },
    description: "Experienced security guards required for commercial property. Must be alert and responsible with good communication skills.",
    requirements: {
      roles: ["Security Guard", "Night Watchman"],
      experience: { min: 3, max: 10 },
      skills: ["Security Patrol", "CCTV Monitoring", "First Aid"],
      education: "12th Pass",
      languages: ["Hindi", "English"],
      shifts: ["NIGHT"]
    },
    compensation: {
      wageType: "MONTHLY",
      dailyWage: { amount: 850, negotiable: false },
      monthlyWage: { amount: 25500, negotiable: false },
      benefits: ["Uniform", "Insurance", "Night Allowance"]
    },
    workSchedule: {
      daysPerWeek: 6,
      hoursPerDay: 12,
      shifts: ["NIGHT"],
      overtimeAvailable: false
    },
    positions: {
      total: 5,
      filled: 2,
      remaining: 3
    },
    applications: {
      total: 28,
      pending: 18,
      shortlisted: 6,
      rejected: 4
    },
    metrics: {
      views: 178,
      applies: 28,
      responseRate: 72,
      avgTimeToRespond: "3 hours"
    }
  },
  {
    id: "job-004",
    title: "Housekeeping Staff for Corporate Office",
    companyId: "company-004",
    companyName: "CleanCo Facilities",
    companyLogo: "https://ui-avatars.com/api/?name=CleanCo+Facilities&background=95E1D3&color=333",
    status: "ACTIVE",
    priority: "MEDIUM",
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString(),
    expiryDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000)?.toISOString(),
    jobType: "FULL_TIME",
    industry: "Facility Management",
    location: {
      city: "Mumbai",
      area: "Lower Parel",
      address: "IT Park, Lower Parel, Mumbai",
      pincode: "400013"
    },
    description: "Looking for dedicated housekeeping staff for maintaining cleanliness in corporate office premises.",
    requirements: {
      roles: ["Cleaner", "Housekeeping"],
      experience: { min: 1, max: 5 },
      skills: ["Deep Cleaning", "Floor Maintenance", "Sanitization"],
      education: "No formal education required",
      languages: ["Hindi", "Marathi"],
      shifts: ["MORNING", "DAY"]
    },
    compensation: {
      wageType: "MONTHLY",
      dailyWage: { amount: 500, negotiable: true },
      monthlyWage: { amount: 15000, negotiable: true },
      benefits: ["Meals", "Transport", "Uniform"]
    },
    workSchedule: {
      daysPerWeek: 6,
      hoursPerDay: 8,
      shifts: ["MORNING"],
      overtimeAvailable: false
    },
    positions: {
      total: 8,
      filled: 3,
      remaining: 5
    },
    applications: {
      total: 52,
      pending: 38,
      shortlisted: 9,
      rejected: 5
    },
    metrics: {
      views: 312,
      applies: 52,
      responseRate: 80,
      avgTimeToRespond: "4 hours"
    }
  },
  {
    id: "job-005",
    title: "Cook for Corporate Cafeteria",
    companyId: "company-005",
    companyName: "TasteBuds Catering",
    companyLogo: "https://ui-avatars.com/api/?name=TasteBuds+Catering&background=F38181&color=fff",
    status: "ACTIVE",
    priority: "HIGH",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)?.toISOString(),
    expiryDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000)?.toISOString(),
    jobType: "FULL_TIME",
    industry: "Food Services",
    location: {
      city: "Mumbai",
      area: "BKC",
      address: "Corporate Tower, Bandra Kurla Complex, Mumbai",
      pincode: "400051"
    },
    description: "Experienced cook required for preparing meals in corporate cafeteria. Must be skilled in Indian and continental cuisine.",
    requirements: {
      roles: ["Cook", "Chef"],
      experience: { min: 3, max: 8 },
      skills: ["Indian Cuisine", "Food Safety", "Menu Planning"],
      education: "10th Pass",
      languages: ["Hindi", "English"],
      shifts: ["MORNING", "DAY"]
    },
    compensation: {
      wageType: "MONTHLY",
      dailyWage: { amount: 1000, negotiable: true },
      monthlyWage: { amount: 30000, negotiable: true },
      benefits: ["Accommodation", "Meals", "Annual Bonus"]
    },
    workSchedule: {
      daysPerWeek: 6,
      hoursPerDay: 8,
      shifts: ["MORNING", "DAY"],
      overtimeAvailable: true
    },
    positions: {
      total: 3,
      filled: 1,
      remaining: 2
    },
    applications: {
      total: 34,
      pending: 24,
      shortlisted: 7,
      rejected: 3
    },
    metrics: {
      views: 201,
      applies: 34,
      responseRate: 88,
      avgTimeToRespond: "2 hours"
    }
  }
];

export default mockJobs;