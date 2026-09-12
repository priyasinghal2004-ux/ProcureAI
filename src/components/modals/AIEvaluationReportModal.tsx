import React from "react";
import { StartupApplication, Evaluation, Challenge } from "../../types.js";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileText,
  TrendingUp,
  FileCheck
} from "lucide-react";

interface AIEvaluationReportModalProps {
  application: StartupApplication;
  challenge: Challenge;
  onClose: () => void;
  onSelectForPilot: (application: StartupApplication) => void;
}

export const AIEvaluationReportModal: React.FC<AIEvaluationReportModalProps> = ({
  application,
  challenge,
  onClose,
  onSelectForPilot,
}) => {
  const evalData: Evaluation | undefined = application.evaluation;

  if (!evalData) return null;

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "STRONGLY_RECOMMENDED":
        return { text: "Strongly Recommended", bg: "bg-emerald-50 text-emerald-800 border-emerald-300" };
      case "RECOMMENDED":
        return { text: "Recommended", bg: "bg-blue-50 text-blue-800 border-blue-300" };
      case "CONDITIONAL":
        return { text: "Conditional / Needs Review", bg: "bg-amber-50 text-amber-800 border-amber-300" };
      default:
        return { text: "Not Recommended", bg: "bg-rose-50 text-rose-800 border-rose-300" };
    }
  };

  const recInfo = getRecommendationBadge(evalData.recommendation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-5 bg-white border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${recInfo.bg}`}>
                {recInfo.text}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Rank #{evalData.rank} of Applications
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-950">{application.startupName}</h2>
            <p className="text-xs text-slate-600">
              Proposal: <span className="text-slate-900 font-medium">{application.solutionTitle}</span> • Challenge:{" "}
              <span className="text-slate-700">{challenge.title}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Executive Summary & Composite Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 items-center">
            <div className="text-center md:text-left md:border-r md:border-slate-200 pr-4">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Composite Score</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1 mt-0.5">
                <span className="text-3xl font-bold font-mono text-slate-950">{evalData.overallScore}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Automated AI Audit</span>
            </div>

            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Executive Summary</p>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {evalData.summary}
              </p>
            </div>
          </div>

          {/* Multi-Criteria Scoring Breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
              <span>Multi-Criteria Scoring Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* KPI Credibility (40%) */}
              <div className="p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">KPI Credibility</span>
                  <span className="text-[9px] font-mono text-slate-400">40% Wt</span>
                </div>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">{evalData.kpiScore}<span className="text-xs font-normal text-slate-400">/40</span></p>
              </div>

              {/* Technical (20%) */}
              <div className="p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Technical</span>
                  <span className="text-[9px] font-mono text-slate-400">20% Wt</span>
                </div>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">{evalData.technicalScore}<span className="text-xs font-normal text-slate-400">/20</span></p>
              </div>

              {/* Relevance (20%) */}
              <div className="p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Relevance</span>
                  <span className="text-[9px] font-mono text-slate-400">20% Wt</span>
                </div>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">{evalData.relevanceScore}<span className="text-xs font-normal text-slate-400">/20</span></p>
              </div>

              {/* Cost (10%) */}
              <div className="p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Cost Feasibility</span>
                  <span className="text-[9px] font-mono text-slate-400">10% Wt</span>
                </div>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">{evalData.costScore}<span className="text-xs font-normal text-slate-400">/10</span></p>
              </div>

              {/* Team (10%) */}
              <div className="p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Team Track</span>
                  <span className="text-[9px] font-mono text-slate-400">10% Wt</span>
                </div>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">{evalData.teamScore}<span className="text-xs font-normal text-slate-400">/10</span></p>
              </div>
            </div>
          </div>

          {/* Per-KPI Claim vs Evidence Audit Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>KPI Claim Credibility & Evidence Cross-Reference</span>
            </h3>
            <p className="text-xs text-slate-500 mb-2.5">
              NLP audit compares applicant claims against submitted technical datasheets and field trial records.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">KPI Name</th>
                    <th className="py-2.5 px-3">Gov Target</th>
                    <th className="py-2.5 px-3">Startup Claim</th>
                    <th className="py-2.5 px-3">Evidence Submitted</th>
                    <th className="py-2.5 px-3">Credibility Assessment</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evalData.kpiAnalysis.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.kpiTitle}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{item.governmentTarget}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{item.startupClaim}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs">{item.evidenceCited}</td>
                      <td className="py-2.5 px-3 text-slate-700">
                        <span className="leading-relaxed">{item.assessment}</span>
                        {item.assessment.includes("discrepancy") || item.assessment.includes("Unsubstantiated") ? (
                          <span className="block mt-0.5 text-[10px] font-semibold text-amber-700">
                            ⚠ Discrepancy Flagged
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded font-mono font-semibold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Flags */}
          {evalData.riskFlags && evalData.riskFlags.length > 0 && (
            <div className="p-3.5 rounded-md border border-amber-200 bg-amber-50/70 space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Risk & Inconsistency Audit Flags</span>
              </h4>
              <ul className="space-y-1 text-xs text-amber-950 font-medium">
                {evalData.riskFlags.map((risk, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-700">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Strengths */}
            <div className="p-3.5 rounded-md border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Key Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {evalData.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-3.5 rounded-md border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Identified Limitations</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {evalData.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Audit Authority: <span className="text-slate-800 font-medium">State Innovation Committee</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForPilot(application);
              }}
              className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Award Pilot to {application.startupName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

