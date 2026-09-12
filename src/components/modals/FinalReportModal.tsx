import React, { useState } from "react";
import { Pilot, FinalPilotReport } from "../../types.js";
import { useData } from "../../context/DataContext.js";
import {
  X,
  Award,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  Scale
} from "lucide-react";

interface FinalReportModalProps {
  pilot: Pilot;
  report: FinalPilotReport;
  onClose: () => void;
  onProcurementApproved: () => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  pilot,
  report,
  onClose,
  onProcurementApproved,
}) => {
  const { approveProcurement, addToast } = useData();
  const [decisionNotes, setDecisionNotes] = useState(
    "Approved based on demonstrated 460% improvement in early warning lead time, zero false alarms during peak monsoon downpour, and unanimous positive endorsement from Shirol and Kurundwad Gram Panchayats."
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveProcurement(pilot.id, decisionNotes);
      onProcurementApproved();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EXCEEDED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Exceeded</span>;
      case "MET":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">Met</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">Below Target</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 text-left">
        {/* Header */}
        <div className="p-5 bg-white border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-slate-600" />
                <span>Field Trial Verification Audit</span>
              </span>
              <span className="text-xs font-mono text-slate-500">Trial Concluded</span>
            </div>
            <h2 className="text-lg font-bold text-slate-950">Final Pilot Performance & Procurement Recommendation</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Contractor: <span className="text-slate-900 font-medium">{pilot.startupName}</span> • Challenge: <span className="text-slate-700">{pilot.challengeTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="sm:border-r sm:border-slate-200 sm:pr-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Performance Outcome</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-950 font-mono">
                  {report.kpisMetCount} / {report.totalKpisCount}
                </span>
                <span className="text-xs text-slate-500">KPIs Met</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5 block">
                {Math.round((report.kpisMetCount / report.totalKpisCount) * 100)}% Contractual Target Rate
              </span>
            </div>

            <div className="flex-1">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-1">Empirical Evaluation Finding</p>
              <p className="text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed font-normal">
                {report.aiRecommendation}
              </p>
            </div>
          </div>

          {/* Baseline vs Target vs Achieved Table */}
          <div>
            <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
              <span>Contractual Metric Audit & Field Observations</span>
            </h3>
            <p className="text-slate-500 text-xs mb-2.5">
              Consolidated dual-party telemetry recorded by government field officers and vendor sensors.
            </p>

            <div className="border border-slate-200 rounded-md overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">KPI Name</th>
                    <th className="py-2.5 px-3 text-center">Baseline</th>
                    <th className="py-2.5 px-3 text-center">Target</th>
                    <th className="py-2.5 px-3 text-center">Achieved</th>
                    <th className="py-2.5 px-3 text-center">Delta</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3">Telemetry Verification Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.kpiPerformances.map((item) => (
                    <tr key={item.kpiId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs">{item.kpiTitle}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                        {item.baselineValue !== undefined ? `${item.baselineValue} ${item.unit}` : "N/A"}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                        {item.targetValue} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-950">
                        {item.achievedValue} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-700">
                        {item.improvementPct ? `+${item.improvementPct}%` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-center">{getStatusBadge(item.status)}</td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Government Decision Section */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
            <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-600" />
              <span>Sanctioning Authority Justification</span>
            </h4>
            <p className="text-slate-600 text-xs">
              Record justification notes for formal procurement sanction under state innovation and public procurement guidelines.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Official Sanction Notes
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs leading-relaxed focus:outline-none focus:border-slate-500 font-normal"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                addToast({
                  type: "info",
                  title: "Pilot Extended",
                  message: "Pilot extended for 30 days of additional sensor observation.",
                });
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer"
            >
              Extend Trial (30 Days)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-4 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{isProcessing ? "Processing..." : "Approve Procurement & Issue Sanction"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

