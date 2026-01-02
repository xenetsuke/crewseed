import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Briefcase, Upload, History, MapPin, Clock, IndianRupee, ChevronRight, User, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const WorkerMobileDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Mock user data
  const userName = "Rajesh Kumar";
  const userAvatar = "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3B82F6&color=fff";

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Today's assignment (mock data)
  const todayAssignment = {
    id: 1,
    jobTitle: "Warehouse Loader",
    company: "ABC Logistics Pvt Ltd",
    location: "Pithampur Industrial Area",
    shift: "9:00 AM - 6:00 PM",
    wage: "₹600/day",
    status: "confirmed"
  };

  // Recommended jobs (mock data)
  const recommendedJobs = [
    {
      id: 1,
      title: "Construction Worker",
      company: "Builder & Sons",
      wage: "₹15,000 - ₹20,000/month",
      location: "Indore",
      distance: "3.2 km",
      type: "Full-time",
      verified: true
    },
    {
      id: 2,
      title: "Delivery Partner",
      company: "QuickDeliver Services",
      wage: "₹18,000 - ₹25,000/month",
      location: "Bhopal",
      distance: "5.8 km",
      type: "Full-time",
      verified: true
    },
    {
      id: 3,
      title: "Security Guard",
      company: "SecureMax Solutions",
      wage: "₹12,000 - ₹16,000/month",
      location: "Indore",
      distance: "2.5 km",
      type: "Night Shift",
      verified: false
    },
    {
      id: 4,
      title: "Manufacturing Helper",
      company: "Tech Industries Ltd",
      wage: "₹14,000 - ₹18,000/month",
      location: "Pithampur",
      distance: "7.1 km",
      type: "Full-time",
      verified: true
    }
  ];

  // Quick actions
  const quickActions = [
    {
      id: 1,
      title: "My Profile",
      icon: <User className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      route: "/worker-profile"
    },
    {
      id: 2,
      title: "My Assignments",
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      route: "/worker-assignments"
    },
    {
      id: 3,
      title: "Upload Documents",
      icon: <Upload className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
      route: "/worker-profile?tab=documents"
    },
    {
      id: 4,
      title: "Job History",
      icon: <History className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      route: "/worker-profile?tab=history"
    }
  ];

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Handle swipe down gesture for refresh
  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      startY = e?.touches?.[0]?.clientY;
    };

    const handleTouchMove = (e) => {
      currentY = e?.touches?.[0]?.clientY;
      if (currentY - startY > 100 && window.scrollY === 0) {
        handleRefresh();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleJobApply = (jobId) => {
    navigate(`/assignment-details?id=${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top App Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={userAvatar} 
                alt="User profile avatar showing name initials"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-500">{getGreeting()},</p>
                <h1 className="text-lg font-semibold text-gray-900">{userName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate('/notifications-system')}
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate('/worker-profile')}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="flex justify-center py-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-20">
        {/* Availability Section */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Availability Status</h2>
              <p className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                {isAvailable ? 'Available for work' : 'Not available'}
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-12 w-20 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                  isAvailable ? 'translate-x-9' : 'translate-x-1'
                }`}
              >
                {isAvailable ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 m-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400 m-2" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Today's Assignment */}
        {todayAssignment && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Assignment</h2>
            <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{todayAssignment?.jobTitle}</h3>
                  <p className="text-sm text-gray-600 mt-1">{todayAssignment?.company}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  Confirmed
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {todayAssignment?.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {todayAssignment?.shift}
                </div>
                <div className="flex items-center text-sm font-semibold text-green-600">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  {todayAssignment?.wage}
                </div>
              </div>

              <Button 
                variant="default" 
                size="sm" 
                fullWidth
                onClick={() => navigate(`/assignment-details?id=${todayAssignment?.id}`)}
              >
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Recommended Jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
            <button 
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
              onClick={() => navigate('/worker-assignments')}
            >
              View All
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {recommendedJobs?.map((job) => (
              <div 
                key={job?.id}
                className="bg-white rounded-xl shadow-sm p-4 min-w-[280px] flex-shrink-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{job?.title}</h3>
                    <p className="text-sm text-gray-600">{job?.company}</p>
                  </div>
                  {job?.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {job?.wage}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {job?.location} · {job?.distance}
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {job?.type}
                  </span>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  onClick={() => handleJobApply(job?.id)}
                >
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions?.map((action) => (
              <button
                key={action?.id}
                onClick={() => navigate(action?.route)}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${action?.color} flex items-center justify-center mb-3`}>
                  {action?.icon}
                </div>
                <h3 className="font-medium text-gray-900 text-left">{action?.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerMobileDashboard;