import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { StartupApplication, Challenge } from "../../types.js";
import { AIEvaluationReportModal } from "../modals/AIEvaluationReportModal.js";
import {
  FileCheck2,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Award,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";

interface MyApplicationsProps {
  onNavigate: (view: string) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { applications, challenges } = useData();
  const [selectedAppForReport, setSelectedAppForReport] = useState<StartupApplication | null>(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState<StartupApplication | null>(null);

  // In demo environment, show all applications or prioritize currentUser
  const displayApps = applications;

  const formatCost = (app: StartupApplication) => {
    const cost = app.costINR || app.totalCost || 0;
    return `₹${(cost / 100000).toFixed(2)} Lakhs`;
  };

  const getDocCount = (app: StartupApplication) => {
    if (Array.isArray(app.documents)) return app.documents.length;
    if (app.documents && typeof app.documents === "object") return Object.keys(app.documents).length;
    return 0;
  };

  const getKpiCount = (app: StartupApplication) => {
    return Array.isArray(app.kpiClaims) ? app.kpiClaims.length : 0;
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#173B32] tracking-tight">
            My Submitted Proposals
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6A63] mt-0.5">
            Track evaluation status, contractual verification, and pilot progression of your proposals.
          </p>
        </div>

        <button
          onClick={() => onNavigate("discover-challenges")}
          className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <span>Explore Open Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {displayApps.length === 0 ? (
        <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-8 text-center space-y-3">
          <FileText className="w-8 h-8 text-[#6B6A63] mx-auto" />
          <h3 className="font-bold text-sm text-[#252525]">No Applications Submitted Yet</h3>
          <p className="text-xs text-[#6B6A63] max-w-md mx-auto">
            Explore verified government challenges and submit a pilot proposal with contractual KPI claims.
          </p>
          <button
            onClick={() => onNavigate("discover-challenges")}
            className="px-4 py-2 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Discover Challenges →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayApps.map((app) => {
            const matchingChl = challenges.find((c) => c.id === app.challengeId);
            const ev = app.evaluation;

            return (
              <div
                key={app.id}
                className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4 hover:border-[#173B32]/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#DDD7CA]/70 pb-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F1E8] text-[#173B32] border border-[#DDD7CA]">
                      {matchingChl?.sector || "Civic Tech"}
                    </span>
                    <h3 className="font-bold text-base text-[#173B32] mt-1.5">{app.solutionTitle}</h3>
                    <p className="text-xs text-[#6B6A63] mt-0.5">
                      Challenge: <strong className="text-[#252525]">{matchingChl?.title || app.challengeTitle || app.challengeId}</strong>
                      {matchingChl?.department && ` • Issued by: ${matchingChl.department}`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wide border ${
                        app.status === "submitted"
                          ? "bg-[#F5F1E8] text-[#173B32] border-[#DDD7CA]"
                          : app.status === "evaluated"
                          ? "bg-[#F5F1E8] text-[#3F7658] border-[#DDD7CA]"
                          : app.status === "selected_for_pilot"
                          ? "bg-[#3F7658]/10 text-[#3F7658] border-[#3F7658]/30 font-bold"
                          : "bg-[#F5F1E8] text-[#6B6A63] border-[#DDD7CA]"
                      }`}
                    >
                      {app.status === "submitted" ? "SUBMITTED • UNDER REVIEW" : app.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span className="text-[11px] text-[#6B6A63] font-mono">
                      Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-IN") : "Recent"}
                    </span>
                  </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded bg-white border border-[#DDD7CA] space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">
                      Proposed Pilot Budget
                    </span>
                    <span className="font-bold text-[#173B32] font-mono text-sm">
                      {formatCost(app)}
                    </span>
                    <p className="text-[11px] text-[#6B6A63]">
                      Lead Time: {app.timelineWeeks || app.implementationTimelineWeeks || 8} Weeks
                    </p>
                  </div>

                  <div className="p-3 rounded bg-white border border-[#DDD7CA] space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">
                      Contractual KPI Claims
                    </span>
                    <span className="font-semibold text-[#173B32] text-sm block">
                      {getKpiCount(app)} Claims Registered
                    </span>
                    <p className="text-[11px] text-[#6B6A63]">
                      {getDocCount(app)} Evidence Files Attached
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#F5F1E8] border border-[#DDD7CA] space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#173B32] block">
                      Evaluation Status
                    </span>
                    {ev ? (
                      <div>
                        <span className="text-base font-bold text-[#173B32] font-mono">
                          {ev.overallScore} <span className="text-xs text-[#6B6A63]">/ 100</span>
                        </span>
                        <p className="text-[11px] text-[#3F7658] font-medium">
                          {ev.recommendation ? ev.recommendation.replace(/_/g, " ") : "Evaluated"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-semibold text-[#B7793E] block">
                          Pending Officer Review
                        </span>
                        <p className="text-[10px] text-[#6B6A63] mt-0.5">
                          Application logged in official procurement registry
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#DDD7CA]/70 text-xs">
                  <div className="flex items-center gap-2 text-[#6B6A63]">
                    <span>Applicant Entity:</span>
                    <strong className="text-[#252525]">{app.startupName}</strong>
                    {app.dpiitNumber && <span className="font-mono text-[11px]">({app.dpiitNumber})</span>}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {ev && matchingChl && (
                      <button
                        onClick={() => setSelectedAppForReport(app)}
                        className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C5A24A]" />
                        <span>View Evaluation Report</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedAppDetail(selectedAppDetail?.id === app.id ? null : app)}
                      className="px-3 py-1.5 rounded border border-[#DDD7CA] bg-white text-[#252525] hover:bg-[#F5F1E8] font-medium text-xs transition-colors cursor-pointer"
                    >
                      {selectedAppDetail?.id === app.id ? "Hide Proposal Details" : "View Proposal Details"}
                    </button>
                  </div>
                </div>

                {/* Expanded Proposal Details */}
                {selectedAppDetail?.id === app.id && (
                  <div className="mt-3 pt-3 border-t border-[#DDD7CA] space-y-3 bg-white p-4 rounded text-xs">
                    <div>
                      <h4 className="font-bold text-[#173B32] text-xs uppercase tracking-wider mb-1">Executive Overview</h4>
                      <p className="text-[#252525] leading-relaxed">{app.description || app.solutionDescription}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#173B32] text-xs uppercase tracking-wider mb-1">Technical Architecture</h4>
                      <p className="text-[#252525] leading-relaxed">{app.technicalApproach}</p>
                    </div>

                    {app.costBreakdown && (
                      <div>
                        <h4 className="font-bold text-[#173B32] text-xs uppercase tracking-wider mb-1">Cost Breakdown</h4>
                        <p className="text-[#6B6A63] font-mono">
                          {typeof app.costBreakdown === "string"
                            ? app.costBreakdown
                            : JSON.stringify(app.costBreakdown)}
                        </p>
                      </div>
                    )}

                    {app.kpiClaims && app.kpiClaims.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[#173B32] text-xs uppercase tracking-wider mb-1.5">Submitted KPI Commitments</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {app.kpiClaims.map((claim, idx) => (
                            <div key={idx} className="p-2 rounded bg-[#F5F1E8] border border-[#DDD7CA]">
                              <div className="flex justify-between font-semibold text-[11px] text-[#173B32]">
                                <span>{claim.kpiTitle}</span>
                                <span className="font-mono">{claim.claimedValue} {claim.unit}</span>
                              </div>
                              <p className="text-[10px] text-[#6B6A63] mt-0.5">{claim.howAchieved}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full AI Evaluation Report Modal */}
      {selectedAppForReport && (
        <AIEvaluationReportModal
          application={selectedAppForReport}
          challenge={
            challenges.find((c) => c.id === selectedAppForReport.challengeId) || challenges[0]
          }
          onClose={() => setSelectedAppForReport(null)}
          onSelectForPilot={() => {
            setSelectedAppForReport(null);
            onNavigate("my-pilots");
          }}
        />
      )}
    </div>
  );
};
