import React from "react";
import { useAuth } from "../../context/AuthContext.js";
import {
  User,
  Building2,
  Mail,
  ShieldCheck,
  Calendar,
  Award,
  FileCheck2,
  Rocket
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const { currentUser, role } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">User Profile & Verified Credentials</h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Government authority credentials and DPIIT startup verification records.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
            {currentUser?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
              Role: {role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500">Organization / Department:</span>
            <span className="font-bold text-slate-900">{currentUser?.organization}</span>
          </div>

          {currentUser?.dpiitNumber && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">DPIIT Startup Recognition:</span>
              </div>
              <span className="font-mono font-bold text-emerald-800">{currentUser.dpiitNumber}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500">Access Privileges:</span>
            <span className="font-semibold text-slate-900">
              {role === "government"
                ? "Issue Challenges, Award Pilots, Sanction Procurement"
                : role === "startup"
                ? "Apply to Challenges, Claim KPIs, Submit Monthly Telemetry"
                : "Full System Administration & Audit"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
