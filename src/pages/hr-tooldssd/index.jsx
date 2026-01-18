import React, { useState } from "react";
import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import Icon from "../../components/AppIcon";

const HRToolComingSoon = () => {
  // Maintaining sidebar state consistent with FindWorkers
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-[80px]" : "ml-[260px]"
        } max-lg:ml-0`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
          
          {/* Main Visual Card */}
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 text-center relative overflow-hidden">
            
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              {/* Icon Section */}
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative bg-white border border-gray-100 p-6 rounded-2xl shadow-lg">
                    <Icon name="Wrench" size={48} color="var(--color-primary)" />
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">
                 Coming Soon
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  HR Management <span className="text-blue-600">Tool</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                  Streamline your workforce payroll, attendance tracking, and 
                  compliance management in one unified dashboard.
                </p>
              </div>

              {/* Progress Bar Section */}
              {/* <div className="max-w-xs mx-auto space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-400">Phase 1</span>
                  <span className="text-blue-600">65%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full p-1">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: '65%' }}
                  />
                </div>
              </div> */}

              {/* Features Preview */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {['Payroll', 'Attendance', 'Contracts'].map((feature) => (
                  <div key={feature} className="flex items-center justify-center gap-2 text-gray-400">
                    <Icon name="CheckCircle2" size={16} color="#94a3b8" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          {/* <p className="mt-8 text-gray-400 text-sm flex items-center gap-2">
            <Icon name="Clock" size={14} />
            Expected Launch: First Quarter 2026
          </p> */}
        </div>
      </main>
    </div>
  );
};

export default HRToolComingSoon;