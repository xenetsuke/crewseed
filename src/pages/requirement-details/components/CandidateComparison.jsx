import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Select from '../../../components/ui/Select';

// 🔹 Backend
import { getProfile } from "../../../Services/ProfileService";

/**
 * CandidateComparison
 * Handles side-by-side comparison of selected workers using dynamic metrics.
 */
const CandidateComparison = ({ applications = [] }) => {
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [enrichedProfiles, setEnrichedProfiles] = useState({});
  const [loading, setLoading] = useState(false);

  // 🧠 Load full profile data for all applicants to power the comparison bars
  useEffect(() => {
    const loadProfiles = async () => {
      if (!applications || applications.length === 0) return;
      try {
        setLoading(true);
        // Get unique IDs to avoid duplicate API calls
        const uniqueIds = [...new Set(applications.map(a => a.applicantId))].filter(Boolean);
        
        const responses = await Promise.all(
          uniqueIds.map(id => getProfile(id).catch(() => null))
        );

        const profileMap = {};
        responses.forEach((profile, index) => {
          if (profile) profileMap[uniqueIds[index]] = profile;
        });
        
        setEnrichedProfiles(profileMap);
      } catch (err) {
        console.error("❌ Comparison Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, [applications]);

  // Transform current applications into Select dropdown options
  const candidateOptions = applications.map(app => {
    const profile = enrichedProfiles[app.applicantId];
    return {
      value: app.applicantId, 
      label: profile?.fullName || app.fullName || `Worker ID: ${app.applicantId?.toString().slice(-5)}`,
    };
  }).filter(opt => opt.value);

  const handleAddCandidate = (id) => {
    if (!id) return;
    // Limit to 3 candidates for better UI/UX on mobile/web
    if (selectedCandidateIds.length < 3 && !selectedCandidateIds.includes(id)) {
      setSelectedCandidateIds([...selectedCandidateIds, id]);
    }
  };

  const handleRemoveCandidate = (id) => {
    setSelectedCandidateIds(prev => prev.filter(item => item !== id));
  };

  // Prepare the data for the cards
  const selectedData = selectedCandidateIds
    .map(id => {
      const app = applications.find(a => a.applicantId === id);
      if (!app) return null;
      return { ...app, profile: enrichedProfiles[app.applicantId] };
    })
    .filter(Boolean);

  return (
    <div className="card p-5 sm:p-6 mb-6 bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* 🛠️ Comparison Control Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="GitCompare" size={22} className="text-blue-600" />
            Candidate Comparison
          </h2>
          {selectedData.length > 0 && (
            <button 
              onClick={() => setSelectedCandidateIds([])}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider transition-colors"
            >
              Clear Comparison
            </button>
          )}
        </div>
        
        <div className="w-full">
          <Select
            options={candidateOptions}
            value=""
            onChange={handleAddCandidate}
            placeholder={loading ? "Fetching profiles..." : "Select candidates to compare..."}
            className="w-full"
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              {selectedData.length} / 3 slots filled
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Comparison View */}
      {selectedData.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
            <Icon name="Users" size={24} className="text-slate-300" />
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Empty Bench</p>
          <p className="text-slate-400 text-xs mt-1 px-4 max-w-xs mx-auto">
            {applications.length === 0 
              ? "No candidates have applied to this requirement yet." 
              : "Search and select candidates from the dropdown above to compare their match metrics side-by-side."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar">
          {selectedData.map((candidate) => {
            // 🧠 Dynamic Logic for Metrics
            const experienceYears = parseInt(candidate.profile?.totalExperience) || 0;
            const calcExp = Math.min(experienceYears * 10, 100); 
            const calcSkill = candidate.profile?.skills?.length > 0 ? Math.min(candidate.profile.skills.length * 20, 100) : 15;
            const calcLoc = candidate.profile?.currentCity ? 95 : 25;
            
            // Use Match Score from backend or generate a weighted average
            const backendScore = parseInt(candidate.matchScore);
            const displayScore = backendScore > 0 
              ? backendScore 
              : Math.round((calcExp * 0.4) + (calcSkill * 0.4) + (calcLoc * 0.2));

            return (
              <div 
                key={candidate.applicantId} 
                className="w-full sm:min-w-[280px] sm:flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 relative transition-all hover:shadow-md"
              >
                {/* Remove Button */}
                <button 
                  onClick={() => handleRemoveCandidate(candidate.applicantId)}
                  className="absolute top-3 right-3 p-1.5 bg-white shadow-sm text-slate-400 rounded-lg hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all z-10"
                >
                  <Icon name="X" size={14} />
                </button>

                {/* Identity Section */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border-4 border-white shadow-sm bg-slate-200">
                     {candidate.profile?.picture ? (
                       <Image 
                         src={`data:image/jpeg;base64,${candidate.profile.picture}`} 
                         className="w-full h-full object-cover" 
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Icon name="User" size={28} className="text-slate-400" />
                       </div>
                     )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 line-clamp-1 px-1">
                    {candidate.profile?.fullName || "Anonymous Worker"}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 uppercase mt-1.5 px-2 py-0.5 bg-blue-100/50 rounded-md">
                    {candidate.profile?.primaryJobRole || 'Worker'}
                  </span>
                </div>

                {/* 📊 Metrics Bar Stack */}
                <div className="space-y-4">
                  {/* Circle Score - High Impact */}
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                        <circle 
                           cx="20" cy="20" r="17" 
                           stroke="currentColor" strokeWidth="3" fill="transparent" 
                           strokeDasharray={106.8} 
                           strokeDashoffset={106.8 - (106.8 * displayScore) / 100} 
                           className="text-blue-500 transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <span className="absolute text-[9px] font-black text-slate-700">{displayScore}%</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Compatibility</p>
                      <p className="text-[11px] font-bold text-slate-700">Overall Match</p>
                    </div>
                  </div>

                  {/* Detail Bars */}
                  <div className="space-y-3 pt-1">
                    <ProgressBar 
                      label="Experience" 
                      subLabel={`${experienceYears} Years`}
                      value={calcExp} 
                      color="bg-blue-500" 
                    />
                    <ProgressBar 
                      label="Skill Fit" 
                      subLabel={`${candidate.profile?.skills?.length || 0} Skills`}
                      value={calcSkill} 
                      color="bg-emerald-500" 
                    />
                    <ProgressBar 
                      label="Proximity" 
                      subLabel={candidate.profile?.currentCity || 'Unknown'}
                      value={calcLoc} 
                      color="bg-purple-500" 
                    />
                  </div>

                  {/* Skills Tags */}
                  <div className="pt-3 border-t border-slate-200/50">
                    <div className="flex flex-wrap gap-1">
                      {(candidate.profile?.skills || ["General Labor"]).slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500 border border-slate-200/50">
                          {String(skill)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * ProgressBar Component
 * Internal helper for scannable match details
 */
const ProgressBar = ({ label, subLabel, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-black text-slate-500 uppercase">{label}</span>
      <span className="text-[9px] font-bold text-slate-400">{subLabel}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-700 ease-in-out`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

export default CandidateComparison;