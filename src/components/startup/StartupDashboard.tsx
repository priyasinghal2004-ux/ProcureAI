import React from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { Challenge } from "../../types.js";
import { ArrowRight, CheckCircle2, Building2, Target } from "lucide-react";

interface StartupDashboardProps {
  onNavigate: (view: string) => void;
  onSelectChallenge?: (challenge: Challenge) => void;
}

export const StartupDashboard: React.FC<StartupDashboardProps> = ({
  onNavigate,
  onSelectChallenge,
}) => {
  const { currentUser } = useAuth();
  const { challenges, applications, pilots } = useData();

  const activePilot = pilots[0];

  const recentActivities = [
    {
      date: "Today, 10:45 AM",
      text: "Government Officer verified Month 3 field telemetry for Flood Early Warning Pilot.",
    },
    {
      date: "Yesterday",
      text: "Field discrepancy audit passed: 0 sensor or metric discrepancies detected.",
    },
    {
      date: "3 days ago",
      text: "Application for Waste Collection Optimization submitted and queued for evaluation.",
    },
  ];

  return (
    <div className="space-y-6 text-left text-[#252525]">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#173B32] tracking-tight">Vendor & Startup Portal</h1>
        <p className="text-xs sm:text-sm text-[#252525] mt-0.5 font-medium">
          Welcome, {currentUser?.organization || "AquaSense Technologies"}.
        </p>
        <p className="text-xs text-[#6B6A63] mt-0.5">
          Review open government challenges, submit technical proposals, and track milestone disbursements.
        </p>
      </div>

      {/* 1. Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FBF9F4] border border-[#DDD7CA] rounded">
          <div className="text-[11px] font-semibold text-[#6B6A63] uppercase tracking-wider">Active Field Pilot</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#173B32]">
            {activePilot ? "1" : "0"}
          </div>
          <div className="text-[11px] text-[#3F7658] font-medium mt-0.5">Kolhapur Flood Warning (M3)</div>
        </div>

        <div className="p-4 bg-[#FBF9F4] border border-[#DDD7CA] rounded">
          <div className="text-[11px] font-semibold text-[#6B6A63] uppercase tracking-wider">Submitted Proposals</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#173B32]">{applications.length}</div>
          <div className="text-[11px] text-[#6B6A63] mt-0.5">All registered in procurement system</div>
        </div>

        <div className="p-4 bg-[#FBF9F4] border border-[#DDD7CA] rounded">
          <div className="text-[11px] font-semibold text-[#6B6A63] uppercase tracking-wider">Disbursed Funds</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#173B32]">₹12.0L</div>
          <div className="text-[11px] text-[#3F7658] font-medium mt-0.5">Milestones 1 & 2 Released</div>
        </div>

        <div className="p-4 bg-[#FBF9F4] border border-[#DDD7CA] rounded">
          <div className="text-[11px] font-semibold text-[#6B6A63] uppercase tracking-wider">Open Challenges</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#173B32]">{challenges.length}</div>
          <div className="text-[11px] text-[#6B6A63] mt-0.5">Open for startup pilot proposals</div>
        </div>
      </div>

      {/* 2. Open Challenges Section (Table) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#173B32] uppercase tracking-wider">Available Public Challenges</h3>
          <button
            onClick={() => onNavigate("discover-challenges")}
            className="text-xs font-medium text-[#173B32] hover:underline cursor-pointer"
          >
            View all open challenges →
          </button>
        </div>

        <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F1E8] text-[#6B6A63] font-semibold border-b border-[#DDD7CA] text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Challenge Title</th>
                  <th className="py-2.5 px-4">Authority</th>
                  <th className="py-2.5 px-4">Budget Range</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/70">
                {challenges.map((chl) => (
                  <tr key={chl.id} className="hover:bg-white transition-colors">
                    <td className="py-3 px-4 font-medium text-[#173B32]">{chl.title}</td>
                    <td className="py-3 px-4 text-[#6B6A63]">{chl.department || chl.sector}</td>
                    <td className="py-3 px-4 font-mono text-[#252525]">
                      ₹{(chl.budgetMin / 100000).toFixed(1)}L – ₹{(chl.budgetMax / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-4 text-[#6B6A63]">{chl.location}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onSelectChallenge) {
                            onSelectChallenge(chl);
                          } else {
                            onNavigate("discover-challenges");
                          }
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#173B32] hover:bg-[#F5F1E8] border border-[#DDD7CA] rounded transition-colors cursor-pointer"
                      >
                        View & Apply →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. My Applications Section (Table) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#173B32] uppercase tracking-wider">My Submitted Applications</h3>
          <button
            onClick={() => onNavigate("my-applications")}
            className="text-xs font-medium text-[#173B32] hover:underline cursor-pointer"
          >
            View all proposals →
          </button>
        </div>

        <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F1E8] text-[#6B6A63] font-semibold border-b border-[#DDD7CA] text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Solution Proposal</th>
                  <th className="py-2.5 px-4 text-center">Score</th>
                  <th className="py-2.5 px-4">Evaluation Recommendation</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/70">
                {applications.slice(0, 4).map((app) => (
                  <tr key={app.id} className="hover:bg-white transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#173B32]">{app.solutionTitle}</div>
                      <div className="text-[11px] text-[#6B6A63]">{app.startupName}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#173B32]">
                      {app.evaluation?.overallScore ? `${app.evaluation.overallScore}/100` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-[#3F7658]">
                        {app.evaluation?.recommendation ? app.evaluation.recommendation.replace(/_/g, " ") : "Under Review"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA]">
                        <CheckCircle2 className="w-3 h-3 text-[#3F7658]" />
                        <span className="uppercase">{app.status.replace(/_/g, " ")}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate("my-applications")}
                        className="px-2.5 py-1 text-xs font-medium text-[#173B32] hover:underline cursor-pointer"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Telemetry & Activities */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#173B32] uppercase tracking-wider">
          Audit & Verification Activity
        </h3>
        <div className="divide-y divide-[#DDD7CA]/70">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <span className="text-[#252525]">{act.text}</span>
              <span className="text-[11px] text-[#6B6A63] font-mono whitespace-nowrap">{act.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
