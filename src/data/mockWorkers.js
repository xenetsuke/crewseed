export const mockWorkers = [
  {
    id: "worker-001",
    name: "Rajesh Kumar",
    age: 28,
    gender: "MALE",
    primaryRole: "Loader",
    secondaryRoles: ["Packer", "Machine Operator"],
    location: {
      city: "Mumbai",
      area: "Andheri East",
      distance: 2.5, // km from employer
      pincode: "400069"
    },
    experience: {
      totalYears: 5,
      level: "EXPERIENCED"
    },
    skills: [
      { name: "Heavy Lifting", proficiency: "EXPERT" },
      { name: "Forklift Operation", proficiency: "INTERMEDIATE" },
      { name: "Inventory Management", proficiency: "INTERMEDIATE" },
      { name: "Safety Protocols", proficiency: "EXPERT" }
    ],
    languages: ["Hindi", "Marathi", "English"],
    rating: 4.5,
    reviewCount: 23,
    availability: {
      status: "AVAILABLE_NOW",
      startDate: new Date()?.toISOString(),
      shifts: ["MORNING", "DAY"]
    },
    wage: {
      daily: { min: 600, max: 800, negotiable: true },
      monthly: { min: 18000, max: 24000, negotiable: true }
    },
    verified: true,
    online: true,
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    contact: {
      phone: "+91-9876543210",
      whatsapp: "+91-9876543210",
      email: "rajesh.kumar@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      bankDetails: { verified: true }
    },
    workHistory: [
      {
        company: "ABC Logistics",
        role: "Loader",
        duration: "2 years",
        rating: 4.5
      },
      {
        company: "XYZ Warehousing",
        role: "Machine Operator",
        duration: "3 years",
        rating: 4.3
      }
    ],
    lastActive: new Date()?.toISOString()
  },
  {
    id: "worker-002",
    name: "Priya Sharma",
    age: 24,
    gender: "FEMALE",
    primaryRole: "Packer",
    secondaryRoles: ["Quality Check", "Assembly Line"],
    location: {
      city: "Mumbai",
      area: "Goregaon",
      distance: 5.2,
      pincode: "400063"
    },
    experience: {
      totalYears: 3,
      level: "INTERMEDIATE"
    },
    skills: [
      { name: "Product Packaging", proficiency: "EXPERT" },
      { name: "Quality Control", proficiency: "EXPERT" },
      { name: "Labeling", proficiency: "INTERMEDIATE" },
      { name: "Assembly", proficiency: "INTERMEDIATE" }
    ],
    languages: ["Hindi", "English"],
    rating: 4.8,
    reviewCount: 34,
    availability: {
      status: "AVAILABLE_THIS_WEEK",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)?.toISOString(),
      shifts: ["DAY", "EVENING"]
    },
    wage: {
      daily: { min: 500, max: 700, negotiable: true },
      monthly: { min: 15000, max: 21000, negotiable: true }
    },
    verified: true,
    online: false,
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    contact: {
      phone: "+91-9876543211",
      whatsapp: "+91-9876543211",
      email: "priya.sharma@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      bankDetails: { verified: false }
    },
    workHistory: [
      {
        company: "DEF Manufacturing",
        role: "Packer",
        duration: "2 years",
        rating: 4.9
      },
      {
        company: "GHI Products",
        role: "Quality Check",
        duration: "1 year",
        rating: 4.7
      }
    ],
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString()
  },
  {
    id: "worker-003",
    name: "Amit Patel",
    age: 32,
    gender: "MALE",
    primaryRole: "Security Guard",
    secondaryRoles: ["Night Watchman", "Access Control"],
    location: {
      city: "Mumbai",
      area: "Bandra West",
      distance: 8.1,
      pincode: "400050"
    },
    experience: {
      totalYears: 8,
      level: "EXPERT"
    },
    skills: [
      { name: "Security Patrol", proficiency: "EXPERT" },
      { name: "CCTV Monitoring", proficiency: "EXPERT" },
      { name: "First Aid", proficiency: "INTERMEDIATE" },
      { name: "Fire Safety", proficiency: "EXPERT" }
    ],
    languages: ["Hindi", "English", "Gujarati"],
    rating: 4.7,
    reviewCount: 45,
    availability: {
      status: "AVAILABLE_NOW",
      startDate: new Date()?.toISOString(),
      shifts: ["NIGHT", "ROTATIONAL"]
    },
    wage: {
      daily: { min: 700, max: 1000, negotiable: false },
      monthly: { min: 21000, max: 30000, negotiable: false }
    },
    verified: true,
    online: true,
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    contact: {
      phone: "+91-9876543212",
      whatsapp: "+91-9876543212",
      email: "amit.patel@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      bankDetails: { verified: true }
    },
    workHistory: [
      {
        company: "SecureMax Services",
        role: "Security Guard",
        duration: "5 years",
        rating: 4.8
      },
      {
        company: "Guardian Security",
        role: "Team Lead",
        duration: "3 years",
        rating: 4.6
      }
    ],
    lastActive: new Date()?.toISOString()
  },
  {
    id: "worker-004",
    name: "Sunita Devi",
    age: 35,
    gender: "FEMALE",
    primaryRole: "Cleaner",
    secondaryRoles: ["Housekeeping", "Sanitization"],
    location: {
      city: "Mumbai",
      area: "Malad East",
      distance: 12.3,
      pincode: "400097"
    },
    experience: {
      totalYears: 10,
      level: "EXPERT"
    },
    skills: [
      { name: "Deep Cleaning", proficiency: "EXPERT" },
      { name: "Floor Maintenance", proficiency: "EXPERT" },
      { name: "Waste Management", proficiency: "INTERMEDIATE" },
      { name: "Sanitization", proficiency: "EXPERT" }
    ],
    languages: ["Hindi", "English"],
    rating: 4.9,
    reviewCount: 67,
    availability: {
      status: "AVAILABLE_NOW",
      startDate: new Date()?.toISOString(),
      shifts: ["MORNING", "DAY"]
    },
    wage: {
      daily: { min: 400, max: 600, negotiable: true },
      monthly: { min: 12000, max: 18000, negotiable: true }
    },
    verified: true,
    online: false,
    profilePhoto: "https://i.pravatar.cc/150?img=9",
    contact: {
      phone: "+91-9876543213",
      whatsapp: "+91-9876543213",
      email: "sunita.devi@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: false },
      bankDetails: { verified: true }
    },
    workHistory: [
      {
        company: "CleanPro Services",
        role: "Cleaner",
        duration: "6 years",
        rating: 4.9
      },
      {
        company: "Sparkle Housekeeping",
        role: "Senior Cleaner",
        duration: "4 years",
        rating: 4.8
      }
    ],
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000)?.toISOString()
  },
  {
    id: "worker-005",
    name: "Mohammed Rafi",
    age: 29,
    gender: "MALE",
    primaryRole: "Cook",
    secondaryRoles: ["Kitchen Helper", "Food Prep"],
    location: {
      city: "Mumbai",
      area: "Kurla West",
      distance: 6.7,
      pincode: "400070"
    },
    experience: {
      totalYears: 6,
      level: "EXPERIENCED"
    },
    skills: [
      { name: "Indian Cuisine", proficiency: "EXPERT" },
      { name: "Chinese Cuisine", proficiency: "INTERMEDIATE" },
      { name: "Food Safety", proficiency: "EXPERT" },
      { name: "Menu Planning", proficiency: "INTERMEDIATE" }
    ],
    languages: ["Hindi", "Urdu", "English"],
    rating: 4.6,
    reviewCount: 28,
    availability: {
      status: "AVAILABLE_NEXT_WEEK",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString(),
      shifts: ["MORNING", "DAY", "EVENING"]
    },
    wage: {
      daily: { min: 800, max: 1200, negotiable: true },
      monthly: { min: 24000, max: 36000, negotiable: true }
    },
    verified: true,
    online: true,
    profilePhoto: "https://i.pravatar.cc/150?img=15",
    contact: {
      phone: "+91-9876543214",
      whatsapp: "+91-9876543214",
      email: "mohammed.rafi@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      bankDetails: { verified: true }
    },
    workHistory: [
      {
        company: "Hotel Grand Plaza",
        role: "Cook",
        duration: "4 years",
        rating: 4.7
      },
      {
        company: "Paradise Restaurant",
        role: "Assistant Cook",
        duration: "2 years",
        rating: 4.5
      }
    ],
    lastActive: new Date(Date.now() - 30 * 60 * 1000)?.toISOString()
  },
  {
    id: "worker-006",
    name: "Lakshmi Menon",
    age: 26,
    gender: "FEMALE",
    primaryRole: "Machine Operator",
    secondaryRoles: ["Production Assistant", "Quality Inspector"],
    location: {
      city: "Mumbai",
      area: "Powai",
      distance: 15.4,
      pincode: "400076"
    },
    experience: {
      totalYears: 4,
      level: "INTERMEDIATE"
    },
    skills: [
      { name: "CNC Machine Operation", proficiency: "INTERMEDIATE" },
      { name: "Production Line", proficiency: "EXPERT" },
      { name: "Machine Maintenance", proficiency: "BEGINNER" },
      { name: "Quality Testing", proficiency: "INTERMEDIATE" }
    ],
    languages: ["Hindi", "English", "Malayalam"],
    rating: 4.4,
    reviewCount: 19,
    availability: {
      status: "AVAILABLE_THIS_WEEK",
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)?.toISOString(),
      shifts: ["DAY", "EVENING", "NIGHT"]
    },
    wage: {
      daily: { min: 650, max: 900, negotiable: true },
      monthly: { min: 19500, max: 27000, negotiable: true }
    },
    verified: true,
    online: false,
    profilePhoto: "https://i.pravatar.cc/150?img=10",
    contact: {
      phone: "+91-9876543215",
      whatsapp: "+91-9876543215",
      email: "lakshmi.menon@example.com"
    },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      bankDetails: { verified: false }
    },
    workHistory: [
      {
        company: "TechMach Industries",
        role: "Machine Operator",
        duration: "3 years",
        rating: 4.5
      },
      {
        company: "Precision Manufacturing",
        role: "Production Assistant",
        duration: "1 year",
        rating: 4.3
      }
    ],
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000)?.toISOString()
  }
];

export default mockWorkers;