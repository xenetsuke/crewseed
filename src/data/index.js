// Central export file for all mock data
export { default as mockWorkers } from './mockWorkers';
export { default as mockJobs } from './mockJobs';
export { default as mockCompanies } from './mockCompanies';
export { default as mockApplications } from './mockApplications';
export { default as mockNotifications } from './mockNotifications';
export { 
  mockWorkerActivities, 
  mockEmployerActivities
} from './mockActivityFeed';

// Helper functions for mock data
export const getWorkerById = (workerId) => {
  const { mockWorkers } = require('./mockWorkers');
  return mockWorkers?.find(worker => worker?.id === workerId);
};

export const getJobById = (jobId) => {
  const { mockJobs } = require('./mockJobs');
  return mockJobs?.find(job => job?.id === jobId);
};

export const getCompanyById = (companyId) => {
  const { mockCompanies } = require('./mockCompanies');
  return mockCompanies?.find(company => company?.id === companyId);
};

export const getApplicationsByWorkerId = (workerId) => {
  const { mockApplications } = require('./mockApplications');
  return mockApplications?.filter(app => app?.workerId === workerId);
};

export const getApplicationsByJobId = (jobId) => {
  const { mockApplications } = require('./mockApplications');
  return mockApplications?.filter(app => app?.jobId === jobId);
};

export const getNotificationsByUserId = (userId) => {
  const { mockNotifications } = require('./mockNotifications');
  return mockNotifications?.filter(notif => notif?.userId === userId);
};

export const getUnreadNotificationsCount = (userId) => {
  const { mockNotifications } = require('./mockNotifications');
  return mockNotifications?.filter(notif => notif?.userId === userId && !notif?.read)?.length;
};

export const getWorkerActivities = (workerId) => {
  const { mockWorkerActivities } = require('./mockActivityFeed');
  return mockWorkerActivities?.filter(activity => activity?.userId === workerId);
};

export const getEmployerActivities = (companyId) => {
  const { mockEmployerActivities } = require('./mockActivityFeed');
  return mockEmployerActivities?.filter(activity => activity?.userId === companyId);
};

// Filter helpers
export const filterWorkersBySkills = (skills) => {
  const { mockWorkers } = require('./mockWorkers');
  return mockWorkers?.filter(worker => 
    worker?.skills?.some(skill => 
      skills?.some(s => skill?.name?.toLowerCase()?.includes(s?.toLowerCase()))
    )
  );
};

export const filterWorkersByLocation = (city, maxDistance) => {
  const { mockWorkers } = require('./mockWorkers');
  return mockWorkers?.filter(worker => 
    worker?.location?.city?.toLowerCase() === city?.toLowerCase() &&
    worker?.location?.distance <= maxDistance
  );
};

export const filterJobsByRole = (role) => {
  const { mockJobs } = require('./mockJobs');
  return mockJobs?.filter(job => 
    job?.requirements?.roles?.some(r => r?.toLowerCase()?.includes(role?.toLowerCase()))
  );
};

export const filterJobsByCompany = (companyId) => {
  const { mockJobs } = require('./mockJobs');
  return mockJobs?.filter(job => job?.companyId === companyId);
};

export const getActiveJobs = () => {
  const { mockJobs } = require('./mockJobs');
  return mockJobs?.filter(job => job?.status === 'ACTIVE');
};

export const getVerifiedWorkers = () => {
  const { mockWorkers } = require('./mockWorkers');
  return mockWorkers?.filter(worker => worker?.verified === true);
};

export const getAvailableWorkers = () => {
  const { mockWorkers } = require('./mockWorkers');
  return mockWorkers?.filter(worker => 
    worker?.availability?.status === 'AVAILABLE_NOW' || 
    worker?.availability?.status === 'AVAILABLE_THIS_WEEK'
  );
};

// Statistics helpers
export const getWorkerStats = () => {
  const { mockWorkers } = require('./mockWorkers');
  return {
    total: mockWorkers?.length,
    verified: mockWorkers?.filter(w => w?.verified)?.length,
    online: mockWorkers?.filter(w => w?.online)?.length,
    available: mockWorkers?.filter(w => 
      w?.availability?.status === 'AVAILABLE_NOW' || 
      w?.availability?.status === 'AVAILABLE_THIS_WEEK'
    )?.length
  };
};

export const getJobStats = (companyId = null) => {
  const { mockJobs } = require('./mockJobs');
  const jobs = companyId 
    ? mockJobs?.filter(j => j?.companyId === companyId)
    : mockJobs;
  
  return {
    total: jobs?.length,
    active: jobs?.filter(j => j?.status === 'ACTIVE')?.length,
    totalPositions: jobs?.reduce((sum, j) => sum + j?.positions?.total, 0),
    filledPositions: jobs?.reduce((sum, j) => sum + j?.positions?.filled, 0),
    totalApplications: jobs?.reduce((sum, j) => sum + j?.applications?.total, 0)
  };
};