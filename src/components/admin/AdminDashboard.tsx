import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import {
  ShieldAlert,
  Users,
  FolderKanban,
  FileSpreadsheet,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Activity,
  Layers
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { demoUsers } = useAuth();
  const { challenges, applications, pilots, observations, resetAllData } = useData();
  const [activeTab, setActiveTab] = useState<"challenges" | "applications" | "pilots" | "users">("challenges");
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="space-y-8 pb-20 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>GovTech Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Oversight & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Global monitoring of civic challenges, AI evaluation models, pilot telemetry, and certified vendors.
          </p>
        </div>

        <button
          onClick={() => setResetConfirm(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Users</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{demoUsers.length}</p>
          <span className="text-[11px] text-purple-600 font-medium mt-1 inline-block">Gov & Startups</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Civic Challenges</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{challenges.length}</p>
          <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">100% KPI Structured</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Applications</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{applications.length}</p>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 inline-block">Evidence Audited</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Field Observations</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{observations.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">Dual-Party Telemetry</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab("challenges")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "challenges"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Challenges ({challenges.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("pilots")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "pilots"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Active Pilots ({pilots.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Registered Users ({demoUsers.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {activeTab === "challenges" && (
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Location</th>
                <th className="p-3">Budget</th>
                <th className="p-3">KPIs</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {challenges.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{c.title}</td>
                  <td className="p-3 text-slate-600">{c.department}</td>
                  <td className="p-3 text-slate-600">{c.sector}</td>
                  <td className="p-3 text-slate-600">{c.location}</td>
                  <td className="p-3 font-mono text-slate-900">
                    ₹{(c.budgetMin / 100000).toFixed(1)}L - {(c.budgetMax / 100000).toFixed(1)}L
                  </td>
                  <td className="p-3 font-bold text-blue-700">{c.kpis.length}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "applications" && (
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Startup</th>
                <th className="p-3">Solution</th>
                <th className="p-3">Cost</th>
                <th className="p-3 text-center">Composite Score</th>
                <th className="p-3 text-center">KPI Score (40%)</th>
                <th className="p-3 text-center">Recommendation</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{app.startupName}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{app.solutionTitle}</td>
                  <td className="p-3 font-mono text-slate-800">₹{(app.costINR / 100000).toFixed(2)}L</td>
                  <td className="p-3 text-center font-black font-mono text-sm text-slate-900">
                    {app.evaluation?.overallScore || "—"}
                  </td>
                  <td className="p-3 text-center font-bold text-blue-700">
                    {app.evaluation?.kpiScore || "—"}
                  </td>
                  <td className="p-3 text-center font-semibold text-[11px]">
                    {app.evaluation?.recommendation || "PENDING"}
                  </td>
                  <td className="p-3 uppercase font-bold text-slate-500 text-[10px]">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "pilots" && (
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Startup</th>
                <th className="p-3">Challenge</th>
                <th className="p-3">Department</th>
                <th className="p-3">Location</th>
                <th className="p-3">Current Month</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pilots.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{p.startupName}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{p.challengeTitle}</td>
                  <td className="p-3 text-slate-600">{p.department}</td>
                  <td className="p-3 text-slate-600">{p.location}</td>
                  <td className="p-3 font-bold text-blue-700">Month {p.currentMonth} of {p.durationMonths}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "users" && (
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Organization</th>
                <th className="p-3">DPIIT / Dept</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {demoUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600 font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{u.organization}</td>
                  <td className="p-3 text-slate-500 font-mono">{u.dpiitNumber || u.department || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Restore Default Demo State?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This resets all challenges, applications, Kolhapur flood pilot, and telemetry observations back to the initial seeded hackathon demo data.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await resetAllData();
                  setResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
