import React, { useState, useEffect } from "react"; 
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

/**
 * ScheduleInterviewModal
 */
const ScheduleInterviewModal = ({ worker, isOpen, onClose, onSchedule }) => {
  const profile = worker?.profile;

  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    duration: "30",
    interviewType: "in-person",
    location: "",
    interviewerName: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        interviewDate: "",
        interviewTime: "",
        duration: "30",
        interviewType: "in-person",
        location: "",
        interviewerName: "",
        notes: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen || !worker || !profile) return null;

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  const interviewTypeOptions = [
    { value: "in-person", label: "In-Person" },
    { value: "video", label: "Video Call" },
    { value: "phone", label: "Phone Call" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.interviewDate) newErrors.interviewDate = "Interview date is required";
    if (!formData.interviewTime) newErrors.interviewTime = "Interview time is required";
    if (!formData.interviewerName) newErrors.interviewerName = "Interviewer name is required";
    if (formData.interviewType === "in-person" && !formData.location)
      newErrors.location = "Location is required for in-person interviews";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const interviewDateTime = `${formData.interviewDate}T${formData.interviewTime}:00`;

    const payload = {
      id: worker.applicationId,
      applicantId: worker.applicantId,
      applicationStatus: "INTERVIEWING",
      interviewTime: interviewDateTime,
      duration: Number(formData.duration),
      interviewType: formData.interviewType,
      location: formData.interviewType === "in-person" ? formData.location : null,
      interviewerName: formData.interviewerName,
      notes: formData.notes || null,
    };

    onSchedule(payload);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-card rounded-2xl shadow-xl max-w-lg w-full sm:max-w-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Icon name="Calendar" size={24} /> Schedule Interview
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* FORM (scrollable) */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto"
          style={{ flex: "1 1 auto" }}
        >
          {/* Worker Info */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-500">Interviewing:</p>
            <p className="text-lg font-bold truncate">{profile.fullName}</p>
            <p className="text-sm text-slate-500 truncate">{profile.primaryJobRole || "Worker"}</p>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              min={today}
              label="Interview Date *"
              value={formData.interviewDate}
              onChange={(e) => handleChange("interviewDate", e.target.value)}
              error={errors.interviewDate}
            />
            <Input
              type="time"
              label="Interview Time *"
              value={formData.interviewTime}
              onChange={(e) => handleChange("interviewTime", e.target.value)}
              error={errors.interviewTime}
            />
          </div>

          {/* DURATION */}
          <Select
            label="Duration"
            options={durationOptions}
            value={formData.duration}
            onChange={(v) => handleChange("duration", v)}
          />

          {/* TYPE */}
          <Select
            label="Interview Type"
            options={interviewTypeOptions}
            value={formData.interviewType}
            onChange={(v) => handleChange("interviewType", v)}
          />

          {/* LOCATION */}
          {formData.interviewType === "in-person" && (
            <Input
              label="Location *"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={errors.location}
            />
          )}

          {/* INTERVIEWER NAME */}
          <Input
            label="Interviewer Name *"
            value={formData.interviewerName}
            onChange={(e) => handleChange("interviewerName", e.target.value)}
            error={errors.interviewerName}
          />

          {/* NOTES */}
          <textarea
            className="w-full min-h-[100px] border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </form>

        {/* ACTIONS (sticky footer) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end p-4 sm:p-6 border-t border-slate-200 flex-shrink-0 bg-white dark:bg-card">
          <Button type="submit" iconName="Calendar" className="w-full sm:w-auto" onClick={handleSubmit}>
            Schedule Interview
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
