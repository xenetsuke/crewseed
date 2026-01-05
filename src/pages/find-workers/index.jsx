import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Bookmark, Loader2, Search, Filter } from "lucide-react"; // ✅ Modern Icons

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import DashboardMetrics from "../../components/ui/DashboardMetrics";
import SearchBar from "./components/SearchBar";
import WorkerCard from "./components/WorkerCard";
import ComparisonPanel from "./components/ComparisonPanel";

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

import { getProfile, getAllProfiles, updateProfile } from "../../Services/ProfileService";
import { setProfile, changeProfile } from "../../features/ProfileSlice";

const FindWorkers = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [compareList, setCompareList] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const res = await getAllProfiles();
        const applicants = (res || [])
          .filter((p) => p.accountType === "APPLICANT")
          .map((w) => ({
            ...w,
            isSaved: profile?.savedWorkers?.includes(w.id),
          }));

        setWorkers(applicants);
        setFilteredWorkers(applicants);
      } catch (err) {
        console.error("❌ Failed to load workers", err);
      } finally {
        // Artificial delay for smooth transition
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchWorkers();
  }, [profile]);

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
          Workeravailability: prof.Workeravailability ?? ["Available"],
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

      <main className={`main-content transition-all duration-300 ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Talent</h1>
              <p className="text-slate-500 mt-1">Discover and connect with top-rated workers for your requirements.</p>
            </div>
          </div>

          {loading ? (
            /* ✨ Modern Loading State */
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute w-16 h-16 border-2 border-primary/20 rounded-full"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">Searching Profiles</h3>
                <p className="text-slate-500 text-sm">Curating the best candidates for you...</p>
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
                        color: "bg-blue-500" 
                    },
                    {
                        icon: <Bookmark className="w-5 h-5" />,
                        label: "Bookmarked",
                        value: profile?.savedWorkers?.length || 0,
                        color: "bg-amber-500"
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
                      onBookmark={async (workerId) => {
                        if (!profile?.id) return;
                        try {
                          let savedWorkers = profile.savedWorkers ? [...profile.savedWorkers] : [];
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
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                   <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-400 w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-900">No workers found</h3>
                   <p className="text-slate-500">Try adjusting your search keywords or filters.</p>
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
