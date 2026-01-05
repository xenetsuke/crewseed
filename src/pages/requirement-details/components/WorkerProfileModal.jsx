import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

/**
 * WorkerProfileModal
 * Updated: Refactored to use 'worker' data directly throughout the UI.
 * Replaced all 'profile' and 'application' variable dependencies.
 */
const WorkerProfileModal = ({
  worker,
  isOpen,
  onClose,
  // onScheduleInterview = () => {}, 
  onContact = () => {}, 
  onApprove = () => {}, 
  onReject = () => {}, 
  onSelect = () => {}, 
  onChangeStatus = () => {}, 
}) => {
  if (!isOpen || !worker) return null;

  // Trigger onSelect and update status
  const handleSelect = async (applicationId) => {
    onSelect(applicationId); 
    onClose(); 
  };

  // Trigger onChangeStatus for updating status
  const handleStatusChange = async (applicationId) => {
    onChangeStatus(applicationId); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border flex flex-col">
        {/* HEADER */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="User" size={20} className="text-primary" />
            Worker Detail
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="X" size={22} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* WORKER HEADER SECTION */}
          <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-muted/20 border border-border/50">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-background shadow-sm shrink-0">
              <Image
                src={
                  worker?.profile?.picture
                    ? `data:image/jpeg;base64,${worker.profile?.picture}`
                    : "/Avatar.png" 
                }
                alt={worker?.fullName || worker?.profile?.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-3xl font-black tracking-tight">
                    {worker?.fullName || worker?.profile?.fullName || "Worker Name"}
                  </h3>
                  <p className="text-primary font-bold text-lg">
                    {worker?.profile?.primaryJobRole || "Role not specified"}
                  </p>
                </div>
                <div className="bg-success/10 text-success px-4 py-2 rounded-xl border border-success/20 flex items-center gap-2">
                  <Icon name="Target" size={18} />
                  <span className="font-black">
                    {worker?.matchScore || 85}% Match
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  {worker?.profile?.currentCity || "Location not specified"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Briefcase" size={16} className="text-primary" />
                  {worker?.profile?.totalExperience || 0} Years Experience
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Mail" size={16} className="text-primary" />
                  {worker?.email || worker?.profile?.email || "Email not provided"}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Availability:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      worker?.profile?.Workeravailability
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {worker?.profile?.Workeravailability
                      ? "AVAILABLE"
                      : "NOT AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Summary & History */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Icon name="FileText" size={16} /> Professional Summary
                </h4>
                <div className="text-foreground leading-relaxed p-4 rounded-xl bg-card border">
                  {worker?.profile?.about ||
                    worker?.coverLetter ||
                    "This worker hasn't provided a summary yet."}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Icon name="Building" size={16} /> Work History
                </h4>
                {worker?.profile?.recentAssignments?.length > 0 ? (
                  <div className="space-y-4">
                    {worker.profile.recentAssignments.map((job, i) => (
                      <div
                        key={i}
                        className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-full"
                      >
                        <p className="font-bold text-base">{job.jobTitle}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {job.company} • {job.location}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-xl text-center text-muted-foreground text-sm">
                    No work history recorded
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Skills & Certs */}
            <div className="space-y-8">
              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Core Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {worker?.profile?.skills?.length > 0 ? (
                    worker.profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary/5 border border-primary/10 text-primary"
                      >
                        {skill.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs italic">
                      No skills listed
                    </span>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Verification
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/10">
                    <span className="text-xs font-bold">Identity Docs</span>
                    <Icon
                      name="CheckCircle"
                      size={14}
                      className="text-success"
                    />
                  </div>
                  {worker?.profile?.certifications?.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium p-2 border rounded-lg"
                    >
                      <Icon
                        name="Award"
                        size={14}
                        className="text-orange-500"
                      />
                      {cert}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* ACTION FOOTER */}
        {/* <div className="bg-muted/30 border-t border-border p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              iconName="Calendar"
              onClick={() => {
                onScheduleInterview(worker);
                onClose();
              }}
              className="flex-1 h-12"
            >
              Interview Worker
            </Button>
            {/* Any other worker actions can be added here 
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WorkerProfileModal;