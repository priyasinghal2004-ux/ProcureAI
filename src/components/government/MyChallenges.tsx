import React from "react";
import { useData } from "../../context/DataContext.js";
import { Challenge } from "../../types.js";
import {
  FolderKanban,
  PlusCircle,
  Building2,
  Calendar,
  IndianRupee,
  Target,
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";

interface MyChallengesProps {
  onNavigate: (view: string) => void;
  onSelectChallenge: (challenge: Challenge) => void;
}

export const MyChallenges: React.FC<MyChallengesProps> = ({ onNavigate, onSelectChallenge }) => {
  const { challenges } = useData();

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Civic Problem Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Published Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your department's active innovation challenges and review incoming startup proposals.
          </p>
        </div>

        <button
          onClick={() => onNavigate("create-challenge")}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Challenge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((chl) => (
          <div
            key={chl.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                  {chl.sector}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {chl.status.replace("_", " ")}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug mb-2">{chl.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{chl.description}</p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-800">{chl.location}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Budget Range:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹{(chl.budgetMin / 100000).toFixed(1)}L - ₹{(chl.budgetMax / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Contractual KPIs:</span>
                  <span className="font-bold text-blue-700">{chl.kpis.length} Defined</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Created: {chl.createdAt?.split("T")[0]}</span>
              <button
                onClick={() => onNavigate("applications")}
                className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Applications</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
