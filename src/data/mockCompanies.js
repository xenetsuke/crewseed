export const mockCompanies = [
  {
    id: "company-001",
    name: "ABC Logistics Pvt Ltd",
    logo: "https://ui-avatars.com/api/?name=ABC+Logistics&background=0D8ABC&color=fff",
    industry: "Logistics & Warehousing",
    companySize: "51-200 employees",
    foundedYear: 2010,
    location: {
      headquarters: "Mumbai, Maharashtra",
      branches: ["Delhi", "Bangalore", "Pune"],
      address: "Plot No. 45, Andheri MIDC, Mumbai - 400093"
    },
    contact: {
      email: "hr@abclogistics.com",
      phone: "+91-22-12345678",
      website: "www.abclogistics.com"
    },
    contactPerson: {
      name: "Vikram Singh",
      designation: "HR Manager",
      phone: "+91-9876543201",
      email: "vikram.singh@abclogistics.com"
    },
    description: "Leading logistics and warehousing company providing end-to-end supply chain solutions across India.",
    verified: true,
    rating: 4.3,
    reviewCount: 56,
    benefits: ["Health Insurance", "PF/ESI", "Performance Bonus", "Transport", "Meals"],
    workCulture: "Professional and fast-paced environment with focus on efficiency and safety.",
    activeJobs: 3,
    totalHires: 142,
    joinedDate: new Date(2023, 0, 15)?.toISOString()
  },
  {
    id: "company-002",
    name: "QuickShip Solutions",
    logo: "https://ui-avatars.com/api/?name=QuickShip+Solutions&background=FF6B6B&color=fff",
    industry: "E-commerce Fulfillment",
    companySize: "201-500 employees",
    foundedYear: 2015,
    location: {
      headquarters: "Navi Mumbai, Maharashtra",
      branches: ["Mumbai", "Thane", "Pune"],
      address: "Warehouse Complex, Goregaon East, Mumbai - 400063"
    },
    contact: {
      email: "careers@quickship.com",
      phone: "+91-22-23456789",
      website: "www.quickship.com"
    },
    contactPerson: {
      name: "Priya Desai",
      designation: "Talent Acquisition Lead",
      phone: "+91-9876543202",
      email: "priya.desai@quickship.com"
    },
    description: "Fast-growing e-commerce fulfillment company specializing in last-mile delivery and warehousing solutions.",
    verified: true,
    rating: 4.5,
    reviewCount: 89,
    benefits: ["Performance Incentives", "Transport", "Meals", "Growth Opportunities"],
    workCulture: "Dynamic startup culture with emphasis on speed and customer satisfaction.",
    activeJobs: 5,
    totalHires: 287,
    joinedDate: new Date(2023, 2, 10)?.toISOString()
  },
  {
    id: "company-003",
    name: "SecureZone Services",
    logo: "https://ui-avatars.com/api/?name=SecureZone+Services&background=4ECDC4&color=fff",
    industry: "Security Services",
    companySize: "501-1000 employees",
    foundedYear: 2008,
    location: {
      headquarters: "Mumbai, Maharashtra",
      branches: ["Pune", "Nashik", "Aurangabad"],
      address: "Commercial Building, Bandra West, Mumbai - 400050"
    },
    contact: {
      email: "recruitment@securezone.in",
      phone: "+91-22-34567890",
      website: "www.securezone.in"
    },
    contactPerson: {
      name: "Rajesh Iyer",
      designation: "Recruitment Manager",
      phone: "+91-9876543203",
      email: "rajesh.iyer@securezone.in"
    },
    description: "Premium security services provider offering trained security personnel for corporate and residential properties.",
    verified: true,
    rating: 4.1,
    reviewCount: 123,
    benefits: ["Uniform", "Insurance", "Night Allowance", "Training Programs"],
    workCulture: "Professional environment with emphasis on discipline and safety standards.",
    activeJobs: 4,
    totalHires: 456,
    joinedDate: new Date(2022, 10, 5)?.toISOString()
  },
  {
    id: "company-004",
    name: "CleanCo Facilities",
    logo: "https://ui-avatars.com/api/?name=CleanCo+Facilities&background=95E1D3&color=333",
    industry: "Facility Management",
    companySize: "101-200 employees",
    foundedYear: 2012,
    location: {
      headquarters: "Mumbai, Maharashtra",
      branches: ["Thane", "Navi Mumbai"],
      address: "IT Park, Lower Parel, Mumbai - 400013"
    },
    contact: {
      email: "jobs@cleanco.in",
      phone: "+91-22-45678901",
      website: "www.cleanco.in"
    },
    contactPerson: {
      name: "Anjali Khanna",
      designation: "Operations Manager",
      phone: "+91-9876543204",
      email: "anjali.khanna@cleanco.in"
    },
    description: "Complete facility management solutions including housekeeping, maintenance, and sanitization services.",
    verified: true,
    rating: 4.4,
    reviewCount: 67,
    benefits: ["Uniform", "Transport", "Meals", "ESI"],
    workCulture: "Respectful workplace with focus on quality service delivery.",
    activeJobs: 6,
    totalHires: 234,
    joinedDate: new Date(2023, 5, 20)?.toISOString()
  },
  {
    id: "company-005",
    name: "TasteBuds Catering",
    logo: "https://ui-avatars.com/api/?name=TasteBuds+Catering&background=F38181&color=fff",
    industry: "Food Services",
    companySize: "51-100 employees",
    foundedYear: 2016,
    location: {
      headquarters: "Mumbai, Maharashtra",
      branches: ["Pune", "Nashik"],
      address: "Corporate Tower, Bandra Kurla Complex, Mumbai - 400051"
    },
    contact: {
      email: "hiring@tastebuds.com",
      phone: "+91-22-56789012",
      website: "www.tastebuds.com"
    },
    contactPerson: {
      name: "Sandeep Malhotra",
      designation: "Head Chef & HR",
      phone: "+91-9876543205",
      email: "sandeep.malhotra@tastebuds.com"
    },
    description: "Premium catering services specializing in corporate cafeterias and event catering.",
    verified: true,
    rating: 4.6,
    reviewCount: 45,
    benefits: ["Accommodation", "Meals", "Annual Bonus", "Skill Development"],
    workCulture: "Creative environment with focus on culinary excellence and innovation.",
    activeJobs: 2,
    totalHires: 89,
    joinedDate: new Date(2023, 8, 12)?.toISOString()
  }
];

export default mockCompanies;