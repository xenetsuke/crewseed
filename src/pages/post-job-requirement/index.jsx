import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

// Step-wise form components
import JobBasicDetails from "./components/JobBasicDetails";
import JobDescription from "./components/JobDescription";
import CompensationBenefits from "./components/CompensationBenefits";
import ScheduleAvailability from "./components/ScheduleAvailability";
import ApplicationSettings from "./components/ApplicationSettings";
import JobPreview from "./components/JobPreview";

// Backend API
import { postJob, getJob } from "../../Services/JobService";

// ✅ Valid categories for backend enum
const VALID_CATEGORIES = [
  "CONSTRUCTION",
  "LOGISTICS",
  "HOSPITALITY",
  "MANUFACTURING",
  "RETAIL",
];

const PostJobRequirement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jobId = Number(id);
  const user = useSelector((state) => state.user);

  // ---------------- UI STATE ----------------
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  // ---------------- API STATE ----------------
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // ---------------- FORM STATE ----------------
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobRole: "",
    companyName:"",
    managerName:"",
    category: "", // Must be one of VALID_CATEGORIES
    employmentType: "",
    location: "",
    experienceLevel: "",
    positions: "1",
    description: "",
    paymentFrequency: "",
    city:"",
    state:"",
    pincode:"",
    minPay: "",
    maxPay: "",
    benefits: [],
    startDate: "",
    startTime: "",
    endTime: "",
    workingDays: [],
    // Booleans default to false
    overtimeAvailable: false,
    weekendRequired: false,
    flexibleHours: false,
    immediateJoining: false,
    performanceIncentives: false,
    transportProvided: false,
    foodProvided: false,
    accommodationProvided: false,
    uniformProvided: false,
    medicalInsurance: false,
    esiPfBenefits: false,
    festivalBonuses: false,
    allowMultiple: false,
    autoRenewal: false,
    featuredJob: false,
    interviewRequired: false,
    backgroundCheckRequired: false,
    medicalFitnessRequired: false,
    applicationDeadline: "",
    id: undefined, // For update
  });

  // --- HELPER TO FORMAT DATE FOR YOUR DTO ---
  const getFormattedDate = () => {
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    };
    
    // Returns format: "06 Jan 2026, 12:30" (Matching your @JsonFormat)
    return now.toLocaleString('en-GB', options).replace(/,/g, '');
  };
  const getFormattedPostedDate = () => {
  const now = new Date();
  
  // Day: 06
  const day = now.getDate().toString().padStart(2, '0');
  
  // Month: Jan
  const month = now.toLocaleString('en-GB', { month: 'short' });
  
  // Year: 2026
  const year = now.getFullYear();
  
  // Time: 14:30
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Returns: "06 Jan 2026, 14:30"
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

  // ---------------- EDIT MODE ----------------
useEffect(() => {
    if (!jobId || jobId === 0) return; // New job

    const loadJob = async () => {
      console.log(`Loading job with ID: ${jobId}`);
      try {
        const res = await getJob(jobId);
        console.log("Loaded job details:", res);
        
        setFormData({
          id: jobId,
          jobTitle: res.jobTitle ?? "",
          jobRole: res.jobRole ?? "",
              companyName:res.companyName ?? "",
              managerName:res.managerName ?? "",

          
          category: VALID_CATEGORIES.includes(res.industryCategory)
            ? res.industryCategory
            : "",
            
          employmentType: res.jobType ?? "",
          location: res.fullWorkAddress ?? "",
          experienceLevel: res.experienceLevel ?? "",
          positions: String(res.numberOfWorkers ?? 1),
          description: res.jobDescription ?? "",
          paymentFrequency: res.paymentFrequency ?? "",
          minPay: res.baseWageAmount ?? "",
          maxPay: res.wageRange?.max ?? "",
            city:res.city??"",
    state:res.state??"",
    pincode:res.pincode??"",
          // Schedule & Availability
          startDate: res.startDate ?? "",
          endDate: res.endDate ?? "",
          contractDuration: res.contractDuration ?? "",
          customDuration: res.customDuration ?? "",
          shiftType: res.shiftType ?? "",
          shiftStartTime: res.shiftStartTime ?? "", 
          shiftEndTime: res.shiftEndTime ?? "",     
          workingDays: res.workingDays ?? [],

          // ⬇️ FIXED: Application Settings
          // We store the full string (with T00:00:00) in state so that 
          // if the user hits "Save" without touching this field, it doesn't break.
          applicationDeadline: res.applicationDeadline ?? "", 
          
          documentRequirements: res.documentRequirements ?? [],
          additionalInstructions: res.additionalInstructions ?? "",

          // Booleans
          immediateJoining: res.immediateJoining ?? false,
          performanceIncentives: res.performanceIncentives ?? false,
          transportProvided: res.transportProvided ?? false,
          foodProvided: res.foodProvided ?? false,
          accommodationProvided: res.accommodationProvided ?? false,
          uniformProvided: res.uniformProvided ?? false,
          medicalInsurance: res.medicalInsurance ?? false,
          esiPfBenefits: res.esiPfBenefits ?? false,
          festivalBonuses: res.festivalBonuses ?? false,
          
          allowMultiple: res.allowDirectApplications ?? false, 
          autoRenewal: res.autoRenewal ?? false,
          featuredJob: res.featuredJob ?? false,
          interviewRequired: res.interviewRequired ?? false,
          backgroundCheckRequired: res.backgroundCheckRequired ?? false,
          medicalFitnessRequired: res.medicalFitnessRequired ?? false,
        });
      } catch (err) {
        console.error("Failed to load job", err);
      }
    };

    loadJob();
  }, [jobId]);

  // ---------------- SAFE CHANGE HANDLER ----------------
  const handleChange = (field, value) => {
    console.log(`Changing field: ${field} to value: ${value}`);
    setFormData((prev) => ({
      ...prev,
      [field]:
        value ?? (Array.isArray(prev[field]) ? [] : typeof prev[field] === "boolean" ? false : ""),
    }));
  };

  // ---------------- STEP DEFINITIONS ----------------
  const steps = [
    { number: 1, title: "Basic Details", icon: "FileText" },
    { number: 2, title: "Description", icon: "AlignLeft" },
    { number: 3, title: "Compensation", icon: "DollarSign" },
    { number: 4, title: "Schedule", icon: "Clock" },
    { number: 5, title: "Application", icon: "Settings" },
  ];

  // ---------------- BUILD JOB PAYLOAD ----------------
const buildJobDtoPayload = (status) => {
    console.log("Building job payload with status:", status);
    return {
      postedDate: getFormattedPostedDate(),
      id: formData.id,
      postedBy: user.id,
      jobStatus: status,
      jobTitle: formData.jobTitle || "",
      jobRole: formData.jobRole || "",
                    companyName:formData.companyName ?? "",
                    managerName:formData.managerName ?? "",
          city:formData.city??"",
    state:formData.state??"",
    pincode:formData.pincode??"",
      jobDescription: formData.description || "",
      industryCategory: VALID_CATEGORIES.includes(formData.category?.toUpperCase())
        ? formData.category.toUpperCase()
        : null,
      numberOfWorkers: Number(formData.positions || 1),
      experienceLevel: formData.experienceLevel?.toUpperCase() || null,
      fullWorkAddress: formData.location || "",
      baseWageAmount: Number(formData.minPay || 0),
      wageRange:
        formData.minPay && formData.maxPay
          ? { min: Number(formData.minPay), max: Number(formData.maxPay) }
          : null,
      paymentFrequency: formData.paymentFrequency?.toUpperCase() || null,
      
      shiftStartTime: formData.shiftStartTime || null,
      shiftEndTime: formData.shiftEndTime || null,
      shiftType: formData.shiftType || null,
      contractDuration: formData.contractDuration || null,
      customDuration: formData.customDuration || "",
      
      workingDays: formData.workingDays || [],
      jobType: formData.employmentType?.toUpperCase() || null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,

      applicationDeadline: formData.applicationDeadline || null,
      documentRequirements: formData.documentRequirements || [],
      additionalInstructions: formData.additionalInstructions || "",

      immediateJoining: formData.immediateJoining ?? false,
      performanceIncentives: formData.performanceIncentives ?? false,
      transportProvided: formData.transportProvided ?? false,
      foodProvided: formData.foodProvided ?? false,
      accommodationProvided: formData.accommodationProvided ?? false,
      uniformProvided: formData.uniformProvided ?? false,
      medicalInsurance: formData.medicalInsurance ?? false, // Fixed spelling
      esiPfBenefits: formData.esiPfBenefits ?? false,
      festivalBonuses: formData.festivalBonuses ?? false,
      allowDirectApplications: formData.allowMultiple ?? false,
      autoRenewal: formData.autoRenewal ?? false,
      featuredJob: formData.featuredJob ?? false,
      interviewRequired: formData.interviewRequired ?? false,
      backgroundCheckRequired: formData.backgroundCheckRequired ?? false,
      medicalFitnessRequired: formData.medicalFitnessRequired ?? false,
    };
  };

  // ---------------- SAVE DRAFT ----------------
  const handleSaveDraft = async () => {
    console.log("Saving draft with form data:", formData);
    try {
      setIsSaving(true);
      const res = await postJob(buildJobDtoPayload("DRAFT"));
      console.log("Draft saved successfully:", res);
      // Update ID to ensure future updates
      setFormData((prev) => ({ ...prev, id: res.id }));
      alert("Draft saved successfully");
    } catch {
      alert("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- PUBLISH JOB ----------------
  const handlePublish = async () => {
    console.log("Publishing job with form data:", formData);
    try {
      setIsPublishing(true);
      const res = await postJob(buildJobDtoPayload("ACTIVE"));
      console.log("Job published successfully:", res);
      setFormData((prev) => ({ ...prev, id: res.id }));
      navigate(`/requirement-details/${res.id}`);
    } catch {
      alert("Failed to publish job");
    } finally {
      setIsPublishing(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {jobId === 0 ? "Post New Job" : "Edit Job"}
            </h1>

            <Button
              variant="outline"
              iconName={showPreview ? "EyeOff" : "Eye"}
              onClick={() => {
                setShowPreview(!showPreview);
                console.log(`Preview toggled: ${!showPreview}`);
              }}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>

          {/* STEP TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  onClick={() => setActiveStep(step.number)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all
                    ${activeStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center
                      ${activeStep === step.number ? "bg-primary-foreground text-primary" : "bg-background"}`}
                  >
                    <span className="text-xs font-semibold">{step.number}</span>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
                </div>

                {index < steps.length - 1 && <Icon name="ChevronRight" size={16} />}
              </React.Fragment>
            ))}
          </div>

          {/* FORM CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={showPreview ? "lg:col-span-2" : "lg:col-span-3"}>
              {activeStep === 1 && <JobBasicDetails formData={formData} onChange={handleChange} validCategories={VALID_CATEGORIES} />}
              {activeStep === 2 && <JobDescription formData={formData} onChange={handleChange} />}
              {activeStep === 3 && <CompensationBenefits formData={formData} onChange={handleChange} />}
              {activeStep === 4 && <ScheduleAvailability formData={formData} onChange={handleChange} />}
              {activeStep === 5 && <ApplicationSettings formData={formData} onChange={handleChange} />}

              {/* ACTION BAR */}
              <div className="card p-6 flex justify-between mt-6">
                <Button
                  variant="secondary"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                >
                  Save Draft
                </Button>

                {activeStep < 5 ? (
                  <Button onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
                ) : (
                  <Button
                    variant="success"
                    loading={isPublishing}
                    onClick={handlePublish}
                  >
                    Publish Job
                  </Button>
                )}
              </div>
            </div>

            {showPreview && (
              <div className="lg:col-span-1">
                <JobPreview formData={formData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobRequirement;
