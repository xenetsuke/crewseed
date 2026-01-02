import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const WorkHistoryTab = ({ data, onSave }) => {
  const [assignments, setAssignments] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  // 🗓️ Format LocalDate into user-friendly UI
  const formatDate = (date) => {
    if (!date) return "NA";
    const d = new Date(date);
    if (isNaN(d)) return "NA";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Initialize assignments state
  useEffect(() => {
    if (!data?.recentAssignments) return;
    setAssignments(
      data.recentAssignments.map((a) => ({
        ...a,
        isEditing: false,
        startDate: a.startDate ? a.startDate.slice(0, 10) : "",
        endDate: a.endDate ? a.endDate.slice(0, 10) : "",
      }))
    );
  }, [data]);

  const updateField = (i, field, value) => {
    setAssignments((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    );
  };

  const toggleEdit = (i) => {
    setAssignments((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, isEditing: !a.isEditing } : a))
    );
  };

  const saveAssignment = async () => {
    const payload = {
      ...data,
      recentAssignments: assignments.map((a) => {
        const newA = { ...a };
        delete newA.isEditing;
        newA.startDate = newA.startDate ? `${newA.startDate}T00:00:00` : null;
        newA.endDate = newA.endDate ? `${newA.endDate}T00:00:00` : null;
        return newA;
      }),
    };

    await onSave(payload);
    setAssignments((prev) => prev.map((a) => ({ ...a, isEditing: false })));
  };

  const removeAssignment = async (i) => {
    const updatedAssignments = assignments.filter((_, idx) => idx !== i);
    setAssignments(updatedAssignments);

    const payload = {
      ...data,
      recentAssignments: updatedAssignments.map((a) => {
        const newA = { ...a };
        delete newA.isEditing;
        newA.startDate = newA.startDate ? `${newA.startDate}T00:00:00` : null;
        newA.endDate = newA.endDate ? `${newA.endDate}T00:00:00` : null;
        return newA;
      }),
    };

    await onSave(payload);
  };

  const addAssignment = async () => {
    const newAssignment = {
      id: null,
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      wage: 0,
      wagetype: "DAILY",
      rating: null,
      isEditing: true,
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    setViewAll(true);

    const payload = {
      ...data,
      recentAssignments: updatedAssignments.map((a) => {
        const newA = { ...a };
        delete newA.isEditing;
        newA.startDate = newA.startDate ? `${newA.startDate}T00:00:00` : null;
        newA.endDate = newA.endDate ? `${newA.endDate}T00:00:00` : null;
        return newA;
      }),
    };

    await onSave(payload);
  };

  // Reusable Input Tailwind classes
  const inputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-2xl font-bold text-primary">
            {data?.statistics?.totalJobsCompleted ?? 0}
          </p>
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Jobs Completed</span>
        </div>

        <div className="card p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-2xl font-bold text-green-600">
            ₹{data?.statistics?.totalEarnings ?? 0}
          </p>
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Earnings</span>
        </div>

        <div className="card p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-2xl font-bold text-yellow-600">
            {data?.statistics?.averageRating ?? 0}
          </p>
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avg Rating</span>
        </div>
      </div>

      {/* Assignments */}
      <div className="card p-6 space-y-4 border rounded-xl shadow-sm bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Clock" size={20} className="text-primary" /> Recent Assignments
          </h3>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" type="button" onClick={() => setViewAll(!viewAll)}>
              {viewAll ? "Show Less" : "View All"}
            </Button>
            <Button size="sm" type="button" onClick={addAssignment}>
              ➕ Add
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {(viewAll ? assignments : assignments.slice(0, 3)).map((a, index) => (
            <div key={index} className="border p-4 rounded-xl hover:shadow-md transition-shadow duration-200">
              {/* ------- VIEW MODE ------- */}
              {!a.isEditing ? (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-foreground">{a.jobTitle || "Untitled Role"}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <span className="font-medium text-primary">{a.company}</span>
                      <span>•</span>
                      <span>{a.location}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Calendar" size={14} /> {formatDate(a.startDate)} → {formatDate(a.endDate)}
                      </p>
                      <p className="font-bold text-primary text-md">
                        ₹{a.wage} <span className="text-xs font-normal text-muted-foreground">/ {a.wagetype}</span>
                      </p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" type="button" onClick={() => toggleEdit(index)}>
                    ✏ Edit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* ------- EDIT MODE ------- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Job Title</label>
                      <input
                        className={inputClasses}
                        placeholder="e.g. Senior Carpenter"
                        value={a.jobTitle}
                        onChange={(e) => updateField(index, "jobTitle", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Company</label>
                      <input
                        className={inputClasses}
                        placeholder="Company Name"
                        value={a.company}
                        onChange={(e) => updateField(index, "company", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Location</label>
                      <input
                        className={inputClasses}
                        placeholder="City, State"
                        value={a.location}
                        onChange={(e) => updateField(index, "location", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Start Date</label>
                        <input
                          type="date"
                          className={inputClasses}
                          value={a.startDate}
                          onChange={(e) => updateField(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">End Date</label>
                        <input
                          type="date"
                          className={inputClasses}
                          value={a.endDate}
                          onChange={(e) => updateField(index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Wage Amount</label>
                      <input
                        type="number"
                        className={inputClasses}
                        value={a.wage}
                        onChange={(e) => updateField(index, "wage", parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-tighter">Wage Type</label>
                      <select
                        className={inputClasses}
                        value={a.wagetype}
                        onChange={(e) => updateField(index, "wagetype", e.target.value)}
                      >
                        <option value="DAILY">Daily</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button type="button" size="sm" onClick={saveAssignment}>
                      💾 Save Changes
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => toggleEdit(index)}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-auto"
                      onClick={() => removeAssignment(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryTab;