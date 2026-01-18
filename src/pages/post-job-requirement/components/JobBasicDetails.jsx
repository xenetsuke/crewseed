import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const JobBasicDetails = ({ formData, onChange, errors }) => {
  // Automatically generated date for display purposes
  // Formatted as "06 Jan 2026" to match your DTO's pattern
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Must match backend Enum: IndustryCategory
  const jobCategories = [
    { value: "CONSTRUCTION", label: "Construction & Trades" },
    { value: "MANUFACTURING", label: "Manufacturing & Production" },
    { value: "LOGISTICS", label: "Logistics & Supply Chain" },
    { value: "HOSPITALITY", label: "Hospitality & Services" },
    { value: "RETAIL", label: "Retail & Shop Staff" },
    { value: "AGRICULTURE", label: "Agriculture & Farming" },
    { value: "INFRASTRUCTURE", label: "Infrastructure & Public Works" },
    { value: "TRANSPORTATION", label: "Transportation & Driving" },
    { value: "WAREHOUSING", label: "Warehousing & Storage" },
    { value: "FACILITY_MANAGEMENT", label: "Facility Management & Housekeeping" },
    { value: "HEALTHCARE_SUPPORT", label: "Healthcare Support Staff" },
    { value: "AUTOMOBILE", label: "Automobile & Mechanics" },
    { value: "TEXTILE_GARMENTS", label: "Textile & Garments" },
    { value: "FOOD_PROCESSING", label: "Food Processing & Packaging" },
    { value: "ENERGY_UTILITIES", label: "Energy, Electrical & Utilities" },
    { value: "MINING", label: "Mining & Quarrying" },
    { value: "WASTE_MANAGEMENT", label: "Waste Management & Sanitation" },
    { value: "DOMESTIC_SERVICES", label: "Domestic & Home Services" },
    { value: "BEAUTY_WELLNESS", label: "Beauty & Wellness" },
  ];

  // Must match backend Enum: JobType
  const employmentTypes = [
    { value: "PERMANENT", label: "Permanent" },
    { value: "CONTRACT", label: "Contract" },
    { value: "TEMPORARY", label: "Temporary" },
  ];

  // Must match backend Enum: ExperienceLevel
  const experienceLevels = [
    { value: "FRESHER", label: "Fresher (0 years)" },
    { value: "ONE_TO_TWO", label: "1–2 years" },
    { value: "TWO_TO_THREE", label: "2–3 years" },
    { value: "THREE_PLUS", label: "3+ years" },
    { value: "EXPERT", label: "Expert (5+ years)" },
  ];

  // Must match backend Enum: jobRole
  const jobRoles = [
    { value: "GENERAL_WORKER", label: "General Worker" },
    { value: "LOADER", label: "Loader" },
    { value: "PACKER", label: "Packer" },
    { value: "DRIVER", label: "Driver" },
    { value: "SECURITY_GUARD", label: "Security Guard" },
    { value: "HOUSEKEEPING", label: "Housekeeping Staff" },
    { value: "MACHINE_OPERATOR", label: "Machine Operator" },
    { value: "CONSTRUCTION_WORKER", label: "Construction Worker" },
    { value: "ELECTRICIAN", label: "Electrician" },
    { value: "PLUMBER", label: "Plumber" },
    { value: "CARPENTER", label: "Carpenter" },
    { value: "PAINTER", label: "Painter" },
    { value: "LABOURER", label: "Labourer" },
    { value: "MASON", label: "Mason" },
    { value: "FORKLIFT_OPERATOR", label: "Forklift Operator" },
    { value: "WELDER", label: "Welder" },
    { value: "SAFETY_OFFICER", label: "Safety Officer" },
    { value: "CLEANER", label: "Cleaner" },
    { value: "STEEL_FIXER", label: "Steel Fixer" },
    { value: "COOK", label: "Cook" },
    { value: "NURSE", label: "Nurse (Blue-collar healthcare)" },
    { value: "GARDENER", label: "Gardener" },
    { value: "STORAGE_WORKER", label: "Storage Worker" },
    { value: "FACTORY_WORKER", label: "Factory Worker" },
    { value: "ROAD_SWEEPER", label: "Road Sweeper" },
    { value: "SHOP_ASSISTANT", label: "Shop Assistant" },
    { value: "LAB_ASSISTANT", label: "Lab Assistant" },
  ];

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">1</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Basic Job Details</h2>
          <p className="text-sm text-muted-foreground">
            Essential information about the position
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Post Job Date (Read-Only) */}
        <div className="md:col-span-2">
          <Input
            label="Job Post Date"
            type="text"
            value={today}
            disabled
            description="This date is automatically set based on your current time"
          />
        </div>

        {/* Job Title */}
        <div className="md:col-span-2">
          <Input
            label="Job Title"
            type="text"
            placeholder="e.g., Construction Worker, Warehouse Associate"
            value={formData?.jobTitle}
            onChange={(e) => onChange("jobTitle", e?.target?.value)}
            error={errors?.jobTitle}
            required
            description="Be specific and clear about the position"
          />
        </div>
      {/* Company Name */}
<div className="md:col-span-2">
  <Input
    label="Company Name"
    type="text"
    placeholder="Write Your Company Name"
    value={formData?.companyName}
    onChange={(e) => onChange("companyName", e?.target?.value)}
    error={errors?.companyName}
    required
    description="Enter the legal name of your business or organization"
  />
</div>

        {/* Job Role */}
        <Select
          label="Job Role"
          options={jobRoles}
          value={formData?.jobRole || null}
          onChange={(value) => onChange("jobRole", value)}
          placeholder="Select job role"
          description="Select the closest matching role"
        />

        {/* Category */}
        <Select
          label="Job Category"
          options={jobCategories}
          value={formData?.category || null}
          onChange={(value) => onChange("category", value)}
          error={errors?.category}
          required
          placeholder="Select a category"
          description="Choose the most relevant category"
        />

        {/* Employment Type */}
        <Select
          label="Employment Type"
          options={employmentTypes}
          value={formData?.employmentType || null}
          onChange={(value) => onChange("employmentType", value)}
          error={errors?.employmentType}
          required
          placeholder="Select employment type"
        />

        {/* Location */}
        <Input
          label="Location"
          type="text"
          placeholder="City, State or complete work address"
          value={formData?.location}
          onChange={(e) => onChange("location", e?.target?.value)}
          error={errors?.location}
          required
          description="Where will the work be performed?"
        />

        {/* Experience Level */}
        <Select
          label="Experience Level"
          options={experienceLevels}
          value={formData?.experienceLevel || null}
          onChange={(value) => onChange("experienceLevel", value)}
          error={errors?.experienceLevel}
          required
          placeholder="Select experience level"
        />

        {/* Number of Positions */}
        <div className="md:col-span-2">
          <Input
            label="Number of Positions"
            type="number"
            placeholder="1"
            value={formData?.positions}
            onChange={(e) => onChange("positions", e?.target?.value)}
            error={errors?.positions}
            required
            min="1"
            description="How many workers do you need?"
          />
        </div>
      </div>
    </div>
  );
};

export default JobBasicDetails;