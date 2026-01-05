import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ SAME AS WorkerJobList

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import DashboardMetrics from "../../components/ui/DashboardMetrics";
import SearchBar from "./components/SearchBar";
import WorkerCard from "./components/WorkerCard";
import ComparisonPanel from "./components/ComparisonPanel";

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

// ✅ SAME services & redux actions as WorkerJobList
import { getProfile, getAllProfiles, updateProfile } from "../../Services/ProfileService";
import { setProfile, changeProfile } from "../../features/ProfileSlice";

const FindWorkers = () => {
  const dispatch = useDispatch();

  // ✅ SAME redux usage as WorkerJobList
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // DATA
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  // FILTERS
  const [searchQuery, setSearchQuery] = useState("");

  // COMPARE
  const [compareList, setCompareList] = useState([]);

  // MODALS
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* =========================================================
      FETCH EMPLOYER PROFILE (EXACT SAME LOGIC AS WorkerJobList)
  ========================================================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const userProfile = await getProfile(user.id);
          dispatch(setProfile(userProfile));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (user?.id && !profile?.id) fetchProfile();
  }, [profile, user, dispatch]);

  /* =========================================================
      FETCH WORKERS
  ========================================================= */
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await getAllProfiles();

        const applicants = (res || [])
          .filter((p) => p.accountType === "APPLICANT")
          // ✅ derive isSaved from profile.savedWorkers
          .map((w) => ({
            ...w,
            isSaved: profile?.savedWorkers?.includes(w.id),
          }));

        setWorkers(applicants);
        setFilteredWorkers(applicants);
      } catch (err) {
        console.error("❌ Failed to load workers", err);
      }
    };

    fetchWorkers();
  }, [profile]); // 🔥 re-run when profile updates

  /* =========================================================
      SEARCH
  ========================================================= */
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

  /* =========================================================
      VIEW PROFILE
  ========================================================= */
  const handleViewProfile = async (worker) => {
    try {
      const prof = await getProfile(worker.id);

      setSelectedWorker({
        id: worker.id,
        fullName: prof.fullName || worker.fullName,

        profile: {
          fullName: prof.fullName || worker.fullName,
          picture: prof.picture || worker.picture,
          skills: prof.skills || [],
          certifications: prof.certifications || [],
          recentAssignments: prof.recentAssignments || [],
          Workeravailability: prof.availability ?? ["Available"],
          about: prof.about || prof.bio || "",
          primaryJobRole: prof.primaryJobRole || worker.primaryJobRole,
          totalExperience: prof.totalExperience || worker.totalExperience || 0,
          email: prof.email,
          phone: prof.phone,
          currentCity: prof.currentCity || worker.currentCity,
        },

        applicationStatus: worker.applicationStatus,
      });

      setShowProfileModal(true);
    } catch (err) {
      console.error("❌ Failed to load profile", err);
    }
  };

  /* =========================================================
      UI
  ========================================================= */
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
                // ✅ NOW FROM profile.savedWorkers
                value: profile?.savedWorkers?.length || 0,
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
                // ✅ pass isSaved (same pattern as savedJobs)
                worker={{
                  ...worker,
                  isSaved: profile?.savedWorkers?.includes(worker.id),
                }}
                onBookmark={async (workerId) => {
                  if (!profile?.id) return;

                  try {
                    // ✅ SAME toggle logic as savedJobs
                    let savedWorkers = profile.savedWorkers
                      ? [...profile.savedWorkers]
                      : [];

                    savedWorkers = savedWorkers.includes(workerId)
                      ? savedWorkers.filter((id) => id !== workerId)
                      : [...savedWorkers, workerId];

                    const updatedProfile = { ...profile, savedWorkers };
                    await updateProfile(updatedProfile);
                    dispatch(changeProfile(updatedProfile));
                  } catch (err) {
                    console.error("❌ Failed to save worker", err);
                  }
                }}
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

      {/* MODALS */}
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
