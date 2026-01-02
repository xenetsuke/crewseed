import React, { useEffect, useState } from "react";
import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import DashboardMetrics from "../../components/ui/DashboardMetrics";
import SearchBar from "./components/SearchBar";
import WorkerCard from "./components/WorkerCard";
import ComparisonPanel from "./components/ComparisonPanel";

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

import { getProfile, getAllProfiles } from "../../Services/ProfileService";

const FindWorkers = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // DATA
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  // FILTERS
  const [searchQuery, setSearchQuery] = useState("");

  // COMPARE
  const [compareList, setCompareList] = useState([]);

  // ✅ REQUIRED MODAL STATE (FIX)
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // --------------------------------------------------
  // FETCH WORKERS
  // --------------------------------------------------
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await getAllProfiles();
        const applicants = (res || []).filter(
          (p) => p.accountType === "APPLICANT"
        );
        setWorkers(applicants);
        setFilteredWorkers(applicants);
      } catch (err) {
        console.error("❌ Failed to load workers", err);
      }
    };
    fetchWorkers();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredWorkers(
      workers.filter(
        (w) =>
          w.fullName?.toLowerCase().includes(q) ||
          w.primaryJobRole?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, workers]);

  // --------------------------------------------------
  // ✅ VIEW PROFILE (MUST BE OUTSIDE EFFECT)
  // --------------------------------------------------
  const handleViewProfile = async (worker) => {
    try {
      const profile = await getProfile(worker.id);

      setSelectedWorker({
        id: worker.id,
        fullName: profile.fullName || worker.fullName,
        
        profile: {
          fullName: profile.fullName || worker.fullName,
          picture: profile.picture || worker.picture,
          skills: profile.skills || [],
          certifications: profile.certifications || [],
          recentAssignments: profile.recentAssignments || [],
          Workeravailability: profile.availability ?? ["Available"],
          about: profile.about || profile.bio || "",
          primaryJobRole: profile.primaryJobRole || worker.primaryJobRole,
          totalExperience: profile.totalExperience || worker.totalExperience || 0,
          email: profile.email,
          phone: profile.phone,
          currentCity: profile.currentCity || worker.currentCity,
        },

        applicationStatus: worker.applicationStatus,
      });

      setShowProfileModal(true);
    } catch (err) {
      console.error("❌ Failed to load profile", err);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Find Workers</h1>

          <DashboardMetrics
            metrics={[
              { icon: "Users", label: "Available Workers", value: filteredWorkers.length },
              { 
                icon: "Bookmark", 
                label: "Bookmarked", 
                value: workers.filter(w => w.applicationStatus === "AVAILABLE").length 
              },
            ]}
          />

          <SearchBar
            onSearch={setSearchQuery}
            resultCount={filteredWorkers.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                isBookmarked={worker.applicationStatus === "AVAILABLE"}
                onBookmark={(id) =>
                  setWorkers((prev) =>
                    prev.map((w) =>
                      w.id === id
                        ? { ...w, applicationStatus: w.applicationStatus === "AVAILABLE" ? "NONE" : "AVAILABLE" }
                        : w
                    )
                  )
                }
                onViewProfile={handleViewProfile}
                onCompare={(w) =>
                  setCompareList((prev) =>
                    prev.find((x) => x.id === w.id) || prev.length >= 4
                      ? prev
                      : [...prev, w]
                  )
                }
              />
            ))}
          </div>
        </div>
      </main>

      <ComparisonPanel
        workers={compareList}
        onRemove={(id) =>
          setCompareList((prev) => prev.filter((w) => w.id !== id))
        }
        onClear={() => setCompareList([])}
      />

      {/* ✅ MODALS */}
      <WorkerProfileModal
        worker={selectedWorker}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onScheduleInterview={(worker) => {
          setSelectedWorker(worker);
          setShowScheduleModal(true);
        }}
      />

      <ScheduleInterviewModal
        worker={selectedWorker}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={() => setShowScheduleModal(false)}
      />
    </div>
  );
};

export default FindWorkers;