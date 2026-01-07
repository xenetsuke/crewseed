import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query"; // ✅ Added React Query

import WorkerSidebar from '../../components/navigation/WorkerSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Image from '../../components/AppImage';

// Service & Redux Imports
import { getAllJobs } from "../../Services/JobService";
import { updateProfile, getProfile } from "../../Services/ProfileService";
import { changeProfile, setProfile } from "../../features/ProfileSlice";

const WorkerAssignments = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux State
    const profile = useSelector((state) => state.profile);
    const user = useSelector((state) => state.user);

    // UI State
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('active'); 

    // Data State
    const [activeAssignments, setActiveAssignments] = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);

    /* =========================================================
        REACT QUERY: SHARED CACHED FETCHING
    ========================================================= */
    const { data: allJobs = [], isLoading: loading } = useQuery({
      queryKey: ["allJobs"],
      queryFn: getAllJobs,
      staleTime: 5 * 60 * 1000, // 5 mins cache
      refetchOnWindowFocus: false,
    });

    /* =========================================================
        DATA PROCESSING LOGIC
    ========================================================= */
    useEffect(() => {
        if (!user?.id || !allJobs) return;

        // 1. Identify Applied Jobs
        const appliedJobs = allJobs.filter(job => 
            job.applicants?.some(app => app.applicantId === user.id)
        );

        const appliedIds = new Set(appliedJobs.map(j => j.id));

        // 2. Filter Active
        const active = appliedJobs.filter(job => {
            const myApp = job.applicants?.find(a => a.applicantId === user.id);
            return ['APPLIED', 'UNDER_REVIEW', 'INTERVIEWING'].includes(myApp?.applicationStatus);
        }).map(job => formatJobData(job, user.id));

        // 3. Filter Completed
        const completed = appliedJobs.filter(job => {
            const myApp = job.applicants?.find(a => a.applicantId === user.id);
            return ['SELECTED', 'REJECTED', 'JOINED', 'NO_SHOW'].includes(myApp?.applicationStatus);
        }).map(job => formatJobData(job, user.id));

        // 4. Process Saved Jobs
        if (profile?.savedJobs) {
            const saved = allJobs
                .filter(job => profile.savedJobs.includes(job.id) && !appliedIds.has(job.id))
                .map(job => formatJobData(job, user.id));
            setSavedJobs(saved);
        }

        setActiveAssignments(active);
        setCompletedAssignments(completed);
    }, [allJobs, user?.id, profile?.savedJobs]);

    /* =========================================================
        PROFILE SYNC
    ========================================================= */
    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.id && !profile?.id) {
                try {
                    const userProfile = await getProfile(user.id);
                    dispatch(setProfile(userProfile));
                } catch (err) {
                    console.error("Failed to fetch profile:", err);
                }
            }
        };
        fetchProfile();
    }, [user?.id, profile?.id, dispatch]);

    const formatJobData = (job, userId) => {
      const myApp = job.applicants?.find(a => a.applicantId === userId);
      return {
        ...job,
        title: job.jobTitle,
        company: job?.employer?.companyName || "Company",
        companyLogo: job?.employer?.picture 
          ? `data:image/jpeg;base64,${job.employer.picture}` 
          : "/company-placeholder.png",
        location: job.fullWorkAddress,
        dailyWage: job.baseWageAmount,
        status: myApp?.applicationStatus || 'SAVED',
        duration: job.experienceLevel?.replace('_', ' ') || 'Flexible',
        benefits: { 
          transport: job.transportProvided, 
          food: job.foodProvided, 
          accommodation: job.accommodationProvided 
        }
      };
    };

    const handleRemoveSavedJob = async (jobId) => {
      if (!profile?.id) return;
      try {
        const updatedIDs = profile.savedJobs.filter(id => id !== jobId);
        const updatedProfile = { ...profile, savedJobs: updatedIDs };
        await updateProfile(updatedProfile);
        dispatch(changeProfile(updatedProfile));
      } catch (err) {
        console.error("Failed to remove saved job:", err);
      }
    };

    /* =========================================================
        RENDER FUNCTIONS
    ========================================================= */
    const renderJobCard = (job, isSavedTab = false) => (
      <div key={job.id} className="card p-4 hover:shadow-md transition-shadow relative">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              {isSavedTab ? (
                <button 
                onClick={() => handleRemoveSavedJob(job.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Icon name="Trash2" size={20} />
              </button>
              ) : (
                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">
                  {job.status?.replace('_', ' ') || 'PENDING'}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="Briefcase" size={16} className="text-primary" />
                <span>{job.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Icon name="IndianRupee" size={16} />
                <span>₹{job.dailyWage}/day</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.benefits.transport && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">Transport</span>
              )}
              {job.benefits.food && (
                <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-md">Food</span>
              )}
              {job.benefits.accommodation && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-md">Stay Provided</span>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/mobile-job-details', { state: { assignmentId: job.id } })}
              >
                View Details
              </Button>
              
              {isSavedTab ? (
                <Button 
                  className="flex-1"
                  onClick={() => navigate('/mobile-job-details', { state: { assignmentId: job.id } })}
                >
                  Apply Now
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-center rounded-md bg-muted text-muted-foreground text-sm font-semibold uppercase border border-border">
                  {job.status?.replace('_', ' ') || 'PENDING'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-background">
        <WorkerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
                <p className="text-muted-foreground mt-1">Manage your applications and saved opportunities</p>
              </div>

              <div className="flex items-center gap-6 mb-8 border-b border-border">
                {['active', 'completed', 'saved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-semibold capitalize transition-all relative ${
                      activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'saved' ? 'Saved Jobs' : tab}
                    <span className="ml-2 py-0.5 px-2 bg-muted text-[10px] rounded-full">
                      {tab === 'active' ? activeAssignments.length : tab === 'completed' ? completedAssignments.length : savedJobs.length}
                    </span>
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {loading && allJobs.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground">Loading...</div>
                ) : activeTab === 'active' ? (
                  activeAssignments.length === 0 ? <div className="col-span-full text-center py-20">No active applications.</div> : activeAssignments.map(job => renderJobCard(job))
                ) : activeTab === 'completed' ? (
                  completedAssignments.length === 0 ? <div className="col-span-full text-center py-20">No completed jobs.</div> : completedAssignments.map(job => renderJobCard(job))
                ) : (
                  savedJobs.length === 0 ? <div className="col-span-full text-center py-20">No saved jobs.</div> : savedJobs.map(job => renderJobCard(job, true))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
};

export default WorkerAssignments;