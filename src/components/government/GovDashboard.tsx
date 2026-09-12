import React from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { ArrowRight, AlertCircle } from "lucide-react";

interface GovDashboardProps {
  onNavigate: (view: string) => void;
}

export const GovDashboard: React.FC<GovDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { challenges, applications, pilots, procurements } = useData();

  const activePilots = pilots.filter((p) => p.status === "ACTIVE");
  const procuredCount = procurements.length;

  // Active pilot details (e.g. Kolhapur Flood Pilot)
  const activePilot = pilots[0];

  return (
    <div className="space-y-6 text-left">
      {/* A. Page title + short greeting */}
      <div>
        <h1 className="text-xl font-bold text-[#172033] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#172033] mt-0.5 font-medium">
          Good morning, {currentUser?.name?.includes("Sharma") ? "Dr. Sharma" : currentUser?.name || "Officer"}.
        </p>
        <p className="text-xs text-[#64748B] mt-0.5">
          Here's what's happening across your procurement programs.
        </p>
      </div>

      {/* B. Simple summary metrics: simple information blocks with subtle vertical separators */}
      <div className="bg-white border border-slate-200/80 rounded">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="p-4 relative">
            <div className="w-1 h-3.5 bg-[#2563EB] rounded-full absolute left-4 top-4"></div>
            <div className="pl-3">
              <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Active Challenges</p>
              <p className="text-2xl font-bold text-[#172033] font-mono mt-1">{challenges.length}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Across 3 departments</p>
            </div>
          </div>

          <div className="p-4 relative">
            <div className="w-1 h-3.5 bg-[#0F766E] rounded-full absolute left-4 top-4"></div>
            <div className="pl-3">
              <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Applications</p>
              <p className="text-2xl font-bold text-[#172033] font-mono mt-1">{applications.length}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Awaiting evaluation</p>
            </div>
          </div>

          <div className="p-4 relative">
            <div className="w-1 h-3.5 bg-[#15803D] rounded-full absolute left-4 top-4"></div>
            <div className="pl-3">
              <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Active Pilots</p>
              <p className="text-2xl font-bold text-[#172033] font-mono mt-1">{activePilots.length}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Kolhapur Flood Pilot</p>
            </div>
          </div>

          <div className="p-4 relative">
            <div className="w-1 h-3.5 bg-[#163A5F] rounded-full absolute left-4 top-4"></div>
            <div className="pl-3">
              <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Procured</p>
              <p className="text-2xl font-bold text-[#172033] font-mono mt-1">{procuredCount}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">This quarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* C. Requires Attention: Strongest visual element, prominent horizontal section with light amber accent */}
      <div className="bg-[#FFFDF5] border border-amber-200 border-l-4 border-l-[#B45309] rounded p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#B45309] uppercase tracking-wider mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Requires Attention</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">AI evaluation is ready for review</p>
            <h3 className="text-sm sm:text-base font-semibold text-[#172033] mt-0.5">Flood Early Warning System</h3>
            <p className="text-xs text-[#64748B] mt-0.5">3 applications received</p>
          </div>

          <button
            onClick={() => onNavigate("applications")}
            className="px-3.5 py-1.5 rounded bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* D. Recent Challenges: Clean Table without heavy wrapping card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#172033] uppercase tracking-wider">Recent Challenges</h3>
          <button
            onClick={() => onNavigate("my-challenges")}
            className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
          >
            View all →
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F7FA] text-[#64748B] font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Challenge</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4 text-center">Applications</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {challenges.map((chl) => {
                  const appCount = applications.filter((a) => a.challengeId === chl.id).length;
                  const isReady = appCount > 0;

                  return (
                    <tr key={chl.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#172033]">
                        {chl.title}
                      </td>
                      <td className="py-3 px-4 text-[#64748B]">
                        {chl.department || chl.sector}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#172033] font-medium">
                        {appCount}
                      </td>
                      <td className="py-3 px-4">
                        {isReady ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-[#0F766E] bg-teal-50 border border-teal-100">
                            Evaluation Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-[#2563EB] bg-blue-50 border border-blue-100">
                            Published
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isReady ? (
                          <button
                            onClick={() => onNavigate("applications")}
                            className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            Review →
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate("my-challenges")}
                            className="text-xs font-medium text-[#64748B] hover:text-[#172033] hover:underline cursor-pointer"
                          >
                            View →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* E. Active Pilot: Simple clean information section */}
      {activePilot && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#172033] uppercase tracking-wider">
            Active Pilot
          </div>

          <div className="bg-white border border-slate-200/80 rounded p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
              <div className="lg:col-span-2">
                <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Pilot</p>
                <h4 className="text-sm font-semibold text-[#172033] mt-0.5">{activePilot.challengeTitle}</h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Startup: <span className="font-medium text-[#172033]">{activePilot.startupName}</span>
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Location</p>
                <p className="text-xs font-medium text-[#172033] mt-0.5">{activePilot.location}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Progress</p>
                <p className="text-xs font-medium text-[#172033] mt-0.5">
                  Month {activePilot.currentMonth} of {activePilot.durationMonths}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">KPI Status</p>
                <div className="mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-[#15803D] bg-emerald-50 border border-emerald-100">
                    3 of 4 Targets Met
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <button
                  onClick={() => onNavigate("pilots")}
                  className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-[#172033] text-xs font-medium transition-colors cursor-pointer"
                >
                  View Pilot →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
