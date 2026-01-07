import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Bookmark, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // ✅ Added for caching

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import DashboardMetrics from "../../components/ui/DashboardMetrics";
import SearchBar from "./components/SearchBar";
import WorkerCard from "./components/WorkerCard";
import ComparisonPanel from "./components/ComparisonPanel";

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

import {
  getProfile,
  getAllProfiles,
  updateProfile,
} from "../../Services/ProfileService";
import { setProfile, changeProfile } from "../../features/ProfileSlice";

const FindWorkers = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [compareList, setCompareList] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* =========================================================
      FETCH ALL WORKER PROFILES (REACT QUERY CACHING)
  ========================================================= */
  const { data: allWorkers = [], isLoading: loading } = useQuery({
    queryKey: ["workerProfiles"],
    queryFn: async () => {
      const res = await getAllProfiles();
      return (res || []).filter((p) => p.accountType === "APPLICANT");
    },
    staleTime: 1000 * 60 * 5, // ✅ Cache data for 5 minutes
    enabled: !!user?.id,      // Only fetch if user exists
  });

  /* =========================================================
      FETCH CURRENT USER (EMPLOYER) PROFILE
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
  }, [profile?.id, user?.id, dispatch]);

  /* =========================================================
      SEARCH & FILTER LOGIC (MEMOIZED)
  ========================================================= */
  const filteredWorkers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return allWorkers;
    return allWorkers.filter(
      (w) =>
        w.fullName?.toLowerCase().includes(q) ||
        w.primaryJobRole?.toLowerCase().includes(q)
    );
  }, [searchQuery, allWorkers]);

  /* =========================================================
      SAVE / BOOKMARK WORKER LOGIC
  ========================================================= */
  const handleBookmarkWorker = async (workerId) => {
    if (!profile?.id) return;
    try {
      let savedWorkers = profile.savedWorkers ? [...profile.savedWorkers] : [];

      savedWorkers = savedWorkers.includes(workerId)
        ? savedWorkers.filter((id) => id !== workerId)
        : [...savedWorkers, workerId];

      const updatedProfile = { ...profile, savedWorkers };

      // Optimistic Update
      dispatch(changeProfile(updatedProfile));
      await updateProfile(updatedProfile);
    } catch (err) {
      console.error("❌ Failed to save worker", err);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50/50">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`main-content transition-all duration-300 ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Talent
              </h1>
              <p className="text-slate-500 mt-1">
                Discover and connect with top-rated workers.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">Searching Profiles</h3>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <DashboardMetrics
                  metrics={[
                    {
                      icon: <Users className="w-5 h-5" />,
                      label: "Available Workers",
                      value: filteredWorkers.length,
                      color: "bg-blue-500",
                    },
                    {
                      icon: <Bookmark className="w-5 h-5" />,
                      label: "Bookmarked",
                      value: profile?.savedWorkers?.length || 0,
                      color: "bg-amber-500",
                    },
                  ]}
                />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <SearchBar
                  onSearch={setSearchQuery}
                  resultCount={filteredWorkers.length}
                />
              </div>

              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={{
                        ...worker,
                        isSaved: profile?.savedWorkers?.includes(worker.id),
                      }}
                      onBookmark={handleBookmarkWorker}
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
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No workers found</h3>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ComparisonPanel
        workers={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((w) => w.id !== id))}
        onClear={() => setCompareList([])}
      />

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