import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import Icon from "../../components/AppIcon";
import JobDescription from "./components/JobDescription";
import ApplicationRequirements from "./components/ApplicationRequirements";
import BenefitsSection  from "./components/BenefitsSection";
import CompanyProfile  from "./components/CompanyProfile";



import { getJob, applyJob } from "../../Services/JobService";


const AssignmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location?.state?.assignmentId;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState("not_applied");
  const [activeSection, setActiveSection] = useState("description");

  const mockLogo =
    "https://img.rocket.new/generatedImages/rocket_gen_img_1031f59ea-1764660301435.png";

  // Fetch Job Details from Backend
  const loadJobDetails = async () => {
    try {
      const res = await getJob(jobId); // res is now the job object
      console.log("🔥 API Job Details:", res);

      const mapped = {
        id: res?.id || null,
        title: res?.jobTitle || "Job Title Not Provided",
        company: {
          name: res?.clientName || "Company Name Not Provided",
          logo: mockLogo,
          verified: true,
          rating: 4.4,
          reviewCount: 120,
          industry: res?.industryCategory || "Not Specified",
          activeJobs: 5,
          size: "200-500 employees",
          founded: "2010",
          description: res?.companyDescription || "Company details not provided by employer.",
          culture: "We focus on safety, growth, and worker well-being.",
          benefits: "Health Insurance, Safety gear, Career improvement programs"
        },
        description: res?.jobDescription || "Job details coming soon...",
        responsibilities: res?.primarySkills || [],
        requirements: {
          experience: res?.experienceLevel?.replace("_", " ") || "Experience not specified",
          physical: [
            res?.physicalRequirements?.liftingCapacity
              ? `Lift up to ${res.physicalRequirements.liftingCapacity}kg`
              : "Physical fitness required",
            "Standing during work hours",
          ],
          skills: [...(res?.primarySkills || [])],
          education: res?.educationLevel || "Not Specified",
          certifications: res?.certificationRequirements || []
        },
        location: {
          address: res?.fullWorkAddress || "Location not mentioned",
          distance: "3–5 km near you"
        },
        compensation: {
          dailyWage: res?.baseWageAmount ? `₹${res.baseWageAmount}/day` : "Not Provided",
          wageRange: res?.wageRange
            ? `₹${res.wageRange.min} - ₹${res.wageRange.max}`
            : "Not Provided",
          paymentSchedule: res?.paymentFrequency || "Weekly",
          overtimeRate: res?.overtimeRate ? `₹${res.overtimeRate}/hr` : "Not specified",
          benefits: [
            res?.transportProvided && {
              icon: "Bus",
              label: "Transport",
              description: res?.transportDetails || "Transport Provided"
            },
            res?.foodProvided && {
              icon: "Utensils",
              label: "Food",
              description: res?.foodDetails || "Meals Provided"
            },
            res?.accommodationProvided && {
              icon: "Home",
              label: "Accommodation",
              description: res?.accommodationDetails || "Stay Provided"
            }
          ].filter(Boolean)
        },
        schedule: {
          shift: `${res?.shiftStartTime || "N/A"} - ${res?.shiftEndTime || "N/A"}`,
          workingDays: res?.workingDays?.length > 0 ? res.workingDays.join(", ") : "Not Specified"
        },
        duration: {
          type: res?.jobType || "Temporary",
          startDate: res?.startDate || "Not Provided"
        },
        applicants: res?.applicants?.length || 0,
        workersNeeded: res?.numberOfWorkers || 3,
        deadline: res?.applicationDeadline || "Apply Soon"
      };

      setJobData(mapped);
    } catch (err) {
      console.error("❌ Failed to fetch job:", err);
      setJobData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) loadJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    try {
      await applyJob({}, jobId);
      setApplicationStatus("applied");
    } catch (err) {
      console.error("❌ Apply Error:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!jobData) return <div className="p-6 text-center">No Data Found</div>;

  return (
    <div className="min-h-screen bg-background">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/worker-job-list")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <Icon name="ArrowLeft" size={20} />
            Back to Jobs
          </button>

          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex gap-4 items-center">
              <img
                src={jobData.company.logo}
                alt="Company Logo"
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold">{jobData.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {jobData.company.name}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 border-b mb-6 overflow-x-auto">
            {["description", "requirements", "benefits", "company"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-4 py-2 ${
                  activeSection === tab ? "bg-primary text-white rounded-lg" : "hover:bg-muted"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Dynamic Section Rendering */}
          {activeSection === "description" && <JobDescription jobData={jobData} />}
          {activeSection === "requirements" && <ApplicationRequirements
  requirements={jobData.requirements}
  deadline={jobData.deadline}
  applicants={jobData.applicants}
/>
}

         {activeSection === "benefits" && (
  <BenefitsSection benefits={jobData.compensation.benefits} />
)}


          {activeSection === "company" && (
            <div className="card p-6">
              <p className="text-sm text-muted-foreground">
           
  <CompanyProfile company={jobData.company} />
              </p>
            </div>
          )}

          {/* APPLY BUTTON */}
          <div className="card p-4 sticky bottom-0 bg-background border-t mt-6">
            <button
              disabled={applicationStatus === "applied"}
              onClick={handleApply}
              className="btn btn-primary w-full"
            >
              {applicationStatus === "applied" ? "Applied ✓" : "Apply Now"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AssignmentDetails;
