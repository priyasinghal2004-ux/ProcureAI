import React, { useState } from "react";
import { useData } from "../../context/DataContext.js";
import { useAuth } from "../../context/AuthContext.js";
import { Challenge } from "../../types.js";
import {
  Search,
  Filter,
  Building2,
  Calendar,
  IndianRupee,
  Target,
  ArrowRight,
  MapPin,
  CheckCircle2
} from "lucide-react";

interface DiscoverChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
  onApply?: (challenge: Challenge) => void;
}

export const DiscoverChallenges: React.FC<DiscoverChallengesProps> = ({
  onSelectChallenge,
  onApply
}) => {
  const { challenges, applications } = useData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  const sectors = ["all", ...Array.from(new Set(challenges.map((c) => c.sector)))];

  const filtered = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "all" || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const hasApplied = (challengeId: string) => {
    return applications.some(
      (app) =>
        app.challengeId === challengeId &&
        (app.startupId === currentUser?.id ||
          (currentUser?.organization &&
            app.startupName?.toLowerCase() === currentUser.organization.toLowerCase()))
    );
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#173B32] tracking-tight">
          Public Procurement Challenges
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6A63] mt-0.5">
          Verified departmental problems with defined grant budgets, contractual KPIs, and pilot pathways.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search challenges by problem, location, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded border border-[#DDD7CA] bg-[#FBF9F4] text-[#252525] focus:border-[#173B32] focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B6A63]" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="py-2 px-3 text-xs font-medium rounded border border-[#DDD7CA] bg-[#FBF9F4] text-[#252525] outline-none focus:border-[#173B32] cursor-pointer"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Sectors" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((chl) => {
          const applied = hasApplied(chl.id);

          return (
            <div
              key={chl.id}
              className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 flex flex-col justify-between hover:border-[#173B32]/60 transition-colors"
            >
              <div>
                {/* Sector & Status */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA]">
                    {chl.sector}
                  </span>
                  <div className="flex items-center gap-2">
                    {applied && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F5F1E8] text-[#3F7658] border border-[#DDD7CA] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Applied</span>
                      </span>
                    )}
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[#F5F1E8] text-[#6B6A63] border border-[#DDD7CA]">
                      {chl.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#173B32] leading-snug mb-2">
                  {chl.title}
                </h3>
                <p className="text-xs text-[#6B6A63] line-clamp-3 mb-4 leading-relaxed">
                  {chl.description}
                </p>

                {/* Department & Location */}
                <div className="space-y-1 text-xs text-[#6B6A63] mb-4 pb-3 border-b border-[#DDD7CA]/70">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#6B6A63] shrink-0" />
                    <span className="font-medium text-[#252525] truncate">{chl.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C96B4B] shrink-0" />
                    <span className="truncate">{chl.location}</span>
                  </div>
                </div>

                {/* Budget & KPIs */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-2.5 rounded bg-[#F5F1E8] border border-[#DDD7CA]/60 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-[#6B6A63] uppercase block">
                      Pilot Envelope
                    </span>
                    <span className="font-bold text-[#173B32] font-mono">
                      ₹{(chl.budgetMin / 100000).toFixed(1)}L – {(chl.budgetMax / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#6B6A63] uppercase block">
                      Contractual KPIs
                    </span>
                    <span className="font-semibold text-[#173B32] flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#C96B4B]" />
                      <span>{chl.kpis.length} Targets</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-[#DDD7CA]/70">
                <span className="text-[11px] text-[#6B6A63]">
                  Deadline: {chl.applicationDeadline ? new Date(chl.applicationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "30 Days"}
                </span>
                <button
                  onClick={() => onSelectChallenge(chl)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#173B32] hover:bg-[#112D26] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
