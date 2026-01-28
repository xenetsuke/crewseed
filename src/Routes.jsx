import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import ProtectedRoute from "./Services/ProtectedRoute.jsx";
import PublicRoute from "./Services/PublicRoute.jsx";

/* Pages */
import Login from "./pages/login";
import WorkerSignup from "./pages/worker-signup";
import EmployerSignup from "./pages/employer-signup";

import WorkerDashboard from "./pages/worker-dashboard";
import WorkerMobileDashboard from "./pages/worker-mobile-dashboard";
import WorkerJobList from "./pages/worker-job-list";
import WorkerAssignments from "./pages/worker-assignments";
// import WorkerAssignmentTracking from "./pages/worker-assignment-tracking";
import WorkerProfile from "./pages/worker-profile";
import WorkerProfileSetup from "./pages/worker-profile-setup";
import MobileJobDetails from "./pages/mobile-job-details";

import EmployerDashboard from "./pages/employer-dashboard";
import EmployerRequirements from "./pages/employer-requirements";
import PostJobRequirement from "./pages/post-job-requirement";
import RequirementDetailsPage from "./pages/requirement-details";
import FindWorkers from "./pages/find-workers";
import EmployerProfile from "./pages/employer-profile";
import CompanyOnboarding from "./pages/company-onboarding";

import AssignmentDetails from "./pages/assignment-details";
import NotificationsSystem from "./pages/notifications-system";
import HRToolComingSoon from "./pages/hr-tool";
import AttendanceUploadPage from "pages/AttendanceUploadPage/AttendanceUploadPage.jsx";
import Landing from "./pages/landing/Landing";
import HowItWorksPage from "./pages/how-it-works/HowItWorksPage";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <RouterRoutes>
          {/* =========================
              Public Routes
          ========================= */}
          {/* <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          /> */}
          <Route path="/assignment-details" element={<AssignmentDetails />} />

          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route
            path="/attendance/upload/:token"
            element={
              <PublicRoute>
                <AttendanceUploadPage />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/worker-signup"
            element={
              <PublicRoute>
                <WorkerSignup />
              </PublicRoute>
            }
          />

          <Route
            path="/employer-signup"
            element={
              <PublicRoute>
                <EmployerSignup />
              </PublicRoute>
            }
          />

          {/* =========================
              Worker (APPLICANT) Routes
          ========================= */}
          <Route
            path="/worker-dashboard"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker-mobile-dashboard"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerMobileDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker-job-list"
            element={
              <PublicRoute>
                <WorkerJobList />
              </PublicRoute>
            }
          />

          <Route
            path="/worker-assignments"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerAssignments />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/worker-assignment-tracking"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerAssignmentTracking />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/worker-profile"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker-profile-setup"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <WorkerProfileSetup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mobile-job-details"
            element={
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <MobileJobDetails />
              </ProtectedRoute>
            }
          />

          {/* ======= ==================
              Employer Routes
          ========================= */}
          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr-tool"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <HRToolComingSoon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-requirements"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <EmployerRequirements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-job-requirement/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <PostJobRequirement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requirement-details/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <RequirementDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/find-workers"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <FindWorkers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company-onboarding"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <CompanyOnboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-profile"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />

          {/* =========================
              Shared / Internal
          ========================= */}
          <Route
            path="/assignment-details"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER", "APPLICANT"]}>
                <AssignmentDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications-system"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYER", "APPLICANT"]}>
                <NotificationsSystem />
              </ProtectedRoute>
            }
          />

          {/* =========================
              Fallback
          ========================= */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
