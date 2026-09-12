import React from "react";
import { Challenge } from "../../types.js";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Target,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface ChallengeDetailPageProps {
  challenge: Challenge;
  onBack: () => void;
  onApply: (challenge: Challenge) => void;
  onViewApplication?: (appId: string) => void;
}

export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({
  challenge,
  onBack,
  onApply,
  onViewApplication
}) => {
  const { currentUser } = useAuth();
  const { applications } = useData();

  // Check if the current startup has already applied for this challenge
  const existingApp = applications.find(
    (app) =>
      app.challengeId === challenge.id &&
      (app.startupId === currentUser?.id ||
        (currentUser?.organization &&
          app.startupName?.toLowerCase() === currentUser.organization.toLowerCase()))
  );

  const formatCurrencyLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  const formatDeadline = (dateStr?: string) => {
    if (!dateStr) return "30 Days from issue";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 text-left">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6A63] hover:text-[#173B32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </button>

        <span className="text-xs text-[#6B6A63] font-mono">
          Ref: {challenge.id}
        </span>
      </div>

      {/* Duplicate Application Notice Banner */}
      {existingApp && (
        <div className="bg-[#FBF9F4] border-2 border-[#C5A24A] rounded p-4 text-xs space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#B7793E] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#252525] text-sm">
                  You have already applied to this challenge.
                </h4>
                <p className="text-[#6B6A63] mt-0.5">
                  Your proposal <strong className="text-[#252525]">"{existingApp.solutionTitle}"</strong> was submitted on{" "}
                  {existingApp.submittedAt ? new Date(existingApp.submittedAt).toLocaleDateString("en-IN") : "Recent"} with status:{" "}
                  <span className="font-semibold text-[#3F7658] uppercase">
                    {existingApp.status.replace(/_/g, " ")}
                  </span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onViewApplication) {
                  onViewApplication(existingApp.id);
                }
              }}
              className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Existing Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Challenge Overview Card */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-6 space-y-5">
        {/* Sector & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD7CA] pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA]">
              {challenge.sector}
            </span>
            <span className="text-xs text-[#6B6A63]">
              Issued by <strong className="text-[#252525] font-medium">{challenge.department}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded bg-[#F5F1E8] text-[#3F7658] border border-[#DDD7CA]">
              <CheckCircle2 className="w-3 h-3 text-[#3F7658]" />
              <span className="uppercase tracking-wide">
                {challenge.status === "pilot_awarded"
                  ? "Pilot Awarded"
                  : challenge.status === "published"
                  ? "Open for Proposals"
                  : challenge.status.replace(/_/g, " ")}
              </span>
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B32] tracking-tight leading-snug">
            {challenge.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#DDD7CA]/60 text-xs">
            <div className="flex items-center gap-2 text-[#6B6A63]">
              <MapPin className="w-4 h-4 text-[#C96B4B] shrink-0" />
              <span>Location: <strong className="text-[#252525]">{challenge.location}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6A63]">
              <Calendar className="w-4 h-4 text-[#173B32] shrink-0" />
              <span>Deadline: <strong className="text-[#252525]">{formatDeadline(challenge.applicationDeadline)}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6A63]">
              <Clock className="w-4 h-4 text-[#173B32] shrink-0" />
              <span>Trial Period: <strong className="text-[#252525]">{challenge.pilotDurationMonths || 3} Months</strong></span>
            </div>
          </div>
        </div>

        {/* Budget Envelope Highlight */}
        <div className="p-4 rounded bg-[#F5F1E8] border border-[#DDD7CA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-[#6B6A63] uppercase tracking-wider block">
              Sanctioned Pilot Budget Envelope
            </span>
            <span className="text-xl font-bold font-mono text-[#173B32]">
              {formatCurrencyLakhs(challenge.budgetMin)} – {formatCurrencyLakhs(challenge.budgetMax)} INR
            </span>
            <p className="text-[11px] text-[#6B6A63] mt-0.5">
              100% grant funding disbursed in milestone stages upon verified KPI benchmarks.
            </p>
          </div>

          <div className="shrink-0">
            {existingApp ? (
              <button
                disabled
                className="px-4 py-2 rounded bg-[#E8E3D9] text-[#6B6A63] text-xs font-semibold cursor-not-allowed border border-[#DDD7CA]"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={() => onApply(challenge)}
                className="px-5 py-2.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Apply for this Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Problem Description */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-[#173B32] uppercase tracking-wider">
            Problem Description & Context
          </h2>
          <p className="text-xs text-[#252525] leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Section 2: Technical & Functional Requirements */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-[#173B32] uppercase tracking-wider">
            Mandatory Solution Requirements
          </h2>
          <div className="divide-y divide-[#DDD7CA]/70 border border-[#DDD7CA] rounded overflow-hidden bg-white">
            {challenge.requirements && challenge.requirements.length > 0 ? (
              challenge.requirements.map((req, idx) => (
                <div key={idx} className="p-3 text-xs flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#252525] leading-relaxed">{req}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-[#6B6A63]">
                Standard GovTech trial requirements apply. Full specification provided in RFP document.
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Contractual KPIs (Critical Core Requirement) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-sm font-bold text-[#173B32] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#C96B4B]" />
                <span>Contractual Key Performance Indicators (KPIs)</span>
              </h2>
              <p className="text-xs text-[#6B6A63] mt-0.5">
                Each proposal is evaluated against these public baseline and target metrics. All pilot disbursements depend on verifying these targets.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#6B6A63] px-2 py-0.5 bg-[#F5F1E8] border border-[#DDD7CA] rounded self-start sm:self-auto">
              {challenge.kpis.length} Contractual Targets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge.kpis.map((kpi, idx) => (
              <div
                key={kpi.id || idx}
                className="bg-white border border-[#DDD7CA] rounded p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#DDD7CA]/60 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6A63] block">
                      KPI #{idx + 1} • Weight: {kpi.weight || 25}%
                    </span>
                    <h3 className="font-bold text-xs text-[#173B32] mt-0.5">{kpi.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA]">
                    {kpi.direction === "lower" ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-[#B7793E]" />
                        <span>Lower is better</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3 h-3 text-[#3F7658]" />
                        <span>Higher is better</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-[11px] text-[#6B6A63] leading-relaxed">
                  {kpi.description}
                </p>

                {/* Baseline vs Target Comparison */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-[#F5F1E8] border border-[#DDD7CA]/60 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-[#6B6A63] uppercase block">
                      Current Baseline
                    </span>
                    <span className="font-bold font-mono text-[#6B6A63]">
                      {kpi.baseline !== undefined ? kpi.baseline : "N/A"} {kpi.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#173B32] uppercase block">
                      Contractual Target
                    </span>
                    <span className="font-bold font-mono text-[#173B32]">
                      {kpi.target} {kpi.unit}
                    </span>
                  </div>
                </div>

                {kpi.baselineQuestion && (
                  <p className="text-[10px] text-[#6B6A63] italic">
                    Audit reference: "{kpi.baselineQuestion}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Eligibility & Institutional Guidelines */}
        <div className="p-4 rounded bg-[#F5F1E8] border border-[#DDD7CA] text-xs space-y-2">
          <h3 className="font-bold text-[#173B32] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3F7658]" />
            <span>Eligibility & Evaluation Criteria</span>
          </h3>
          <ul className="list-disc list-inside space-y-1 text-[#6B6A63] text-[11px]">
            <li>Open to DPIIT-recognized startups with verifiable technical prototypes.</li>
            <li>Applications are evaluated using the ProcureAI 5-dimensional scoring model (40% Contractual KPI Credibility, 20% Technical Feasibility, 20% Solution Relevance, 10% Commercial Viability, 10% Team Capability).</li>
            <li>Selected startups enter a legally binding 3 to 4 month field pilot with government ground support.</li>
          </ul>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="pt-4 border-t border-[#DDD7CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded border border-[#DDD7CA] bg-white text-[#252525] hover:bg-[#F5F1E8] text-xs font-medium transition-colors cursor-pointer"
          >
            ← Back to Challenges
          </button>

          {existingApp ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B6A63]">
                You have already submitted a proposal.
              </span>
              <button
                onClick={() => {
                  if (onViewApplication) {
                    onViewApplication(existingApp.id);
                  }
                }}
                className="px-4 py-2 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View My Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onApply(challenge)}
              className="px-6 py-2 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Apply for this Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
