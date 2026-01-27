import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const WorkHistoryTab = ({ data, onSave }) => {
  const { t } = useTranslation();

  const [assignments, setAssignments] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  /* 🗓️ Format date */
  const formatDate = (date) => {
    if (!date) return t("common.na");
    const d = new Date(date);
    if (isNaN(d)) return t("common.na");
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* Init assignments */
  useEffect(() => {
    if (!data?.recentAssignments) return;

    setAssignments(
      data.recentAssignments.map((a) => ({
        ...a,
        // ✅ Change 1: Mapping companyName from backend correctly
        company: a.companyName || a.company || "", 
        baseMonthlyPay: a.baseMonthlyPay ?? 0,
        // ✅ Change 2: Ensuring wagetype is MONTHLY
        wagetype: "MONTHLY",
        isEditing: false,
        startDate: a.startDate ? a.startDate.slice(0, 10) : "",
        endDate: a.endDate ? a.endDate.slice(0, 10) : "",
      }))
    );
  }, [data]);

  /* ============================
      📊 AUTO CALCULATED STATS
  ============================ */
  const calculatedStats = useMemo(() => {
    const jobsCompleted = assignments.length;

    const totalEarnings = assignments.reduce(
      (sum, a) => sum + (Number(a.baseMonthlyPay) || 0),
      0
    );

    const ratings = assignments
      .map((a) => a.rating)
      .filter((r) => typeof r === "number");

    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;

    return {
      totalJobsCompleted: jobsCompleted,
      totalEarnings,
      averageRating,
    };
  }, [assignments]);

  const stats = data?.statistics ?? calculatedStats;

  /* ============================
      CRUD HANDLERS
  ============================ */
  const updateField = (i, field, value) => {
    setAssignments((prev) =>
      prev.map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleEdit = (i) => {
    setAssignments((prev) =>
      prev.map((a, idx) =>
        idx === i ? { ...a, isEditing: !a.isEditing } : a
      )
    );
  };

  const saveAssignment = async () => {
    const payload = {
      ...data,
      recentAssignments: assignments.map((a) => {
        const x = { ...a };
        // Ensure backend receives the correct field name
        x.companyName = x.company;
        delete x.isEditing;
        x.startDate = x.startDate ? `${x.startDate}T00:00:00` : null;
        x.endDate = x.endDate ? `${x.endDate}T00:00:00` : null;
        return x;
      }),
    };

    await onSave(payload);
    setAssignments((prev) => prev.map((a) => ({ ...a, isEditing: false })));
  };

  const removeAssignment = async (i) => {
    const updated = assignments.filter((_, idx) => idx !== i);
    setAssignments(updated);

    const payload = {
      ...data,
      recentAssignments: updated.map((a) => {
        const x = { ...a };
        x.companyName = x.company;
        delete x.isEditing;
        x.startDate = x.startDate ? `${x.startDate}T00:00:00` : null;
        x.endDate = x.endDate ? `${x.endDate}T00:00:00` : null;
        return x;
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
      baseMonthlyPay: 0,
      wagetype: "MONTHLY", // ✅ Locked to MONTHLY
      rating: null,
      isEditing: true,
    };

    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    setViewAll(true);

    await onSave({
      ...data,
      recentAssignments: updated.map((a) => {
        const x = { ...a };
        x.companyName = x.company;
        delete x.isEditing;
        x.startDate = x.startDate ? `${x.startDate}T00:00:00` : null;
        x.endDate = x.endDate ? `${x.endDate}T00:00:00` : null;
        return x;
      }),
    });
  };

  const inputClasses =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 bg-primary/10 rounded-xl">
          <p className="text-2xl font-bold text-primary">
            {stats.totalJobsCompleted}
          </p>
          <span className="text-sm text-muted-foreground uppercase">
            {t("workHistory.stats.jobsCompleted")}
          </span>
        </div>

        <div className="card p-6 bg-green-500/10 rounded-xl">
          <p className="text-2xl font-bold text-green-600">
            ₹{stats.totalEarnings}
          </p>
          <span className="text-sm text-muted-foreground uppercase">
            {t("workHistory.stats.totalEarnings")}
          </span>
        </div>

        <div className="card p-6 bg-yellow-500/10 rounded-xl">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.averageRating}
          </p>
          <span className="text-sm text-muted-foreground uppercase">
            {t("workHistory.stats.avgRating")}
          </span>
        </div>
      </div>

      {/* ASSIGNMENTS */}
      <div className="card p-6 space-y-4 border rounded-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Clock" size={20} />
            {t("workHistory.recentAssignments")}
          </h3>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewAll(!viewAll)}
            >
              {viewAll ? t("common.showLess") : t("common.viewAll")}
            </Button>
            <Button size="sm" onClick={addAssignment}>
              ➕ {t("common.add")}
            </Button>
          </div>
        </div>

        {(viewAll ? assignments : assignments.slice(0, 3)).map((a, index) => (
          <div key={index} className="border p-4 rounded-xl">
            {!a.isEditing ? (
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">
                    {a.jobTitle || t("workHistory.untitled")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {a.company} • {a.location}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Icon name="Calendar" size={14} />
                    {formatDate(a.startDate)} → {formatDate(a.endDate)}
                  </p>
                  <p className="font-bold text-primary">
                    ₹{a.baseMonthlyPay} /{" "}
                    {t(`wage.${a.wagetype?.toLowerCase?.() ?? "monthly"}`)}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleEdit(index)}
                >
                  ✏ {t("common.edit")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className={inputClasses}
                  placeholder={t("workHistory.fields.jobTitle")}
                  value={a.jobTitle}
                  onChange={(e) =>
                    updateField(index, "jobTitle", e.target.value)
                  }
                />
                <input
                  className={inputClasses}
                  placeholder={t("workHistory.fields.company")}
                  value={a.company}
                  onChange={(e) =>
                    updateField(index, "company", e.target.value)
                  }
                />
                {/* <input
                  className={inputClasses}
                  placeholder={t("workHistory.fields.location")}
                  value={a.location}
                  onChange={(e) =>
                    updateField(index, "location", e.target.value)
                  }
                /> */}
                <select 
                  className={inputClasses} 
                  value="MONTHLY" 
                  
                >
                  <option value="MONTHLY">Monthly Pay </option>
                </select>
                <input
                  type="number"
                  className={inputClasses}
                  placeholder={t("workHistory.fields.wage")}
                  value={a.baseMonthlyPay}
                  onChange={(e) =>
                    updateField(
                      index,
                      "baseMonthlyPay",
                      Number(e.target.value)
                    )
                  }
                />
                {/* Locked Wagetype Field */}

                <div className="flex gap-2">
                  <Button size="sm" onClick={saveAssignment}>
                    💾 {t("common.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEdit(index)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeAssignment(index)}
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkHistoryTab;