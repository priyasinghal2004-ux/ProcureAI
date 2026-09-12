import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.js";
import { StartupApplication } from "../../types.js";
import { AIEvaluationReportModal } from "../modals/AIEvaluationReportModal.js";
import { CreatePilotModal } from "../modals/CreatePilotModal.js";

interface GovApplicationsProps {
  onNavigate?: (view: string) => void;
  onAwardPilot?: (pilotId: string) => void;
  onPilotCreated?: (pilotId: string) => void;
}

export const GovApplications: React.FC<GovApplicationsProps> = ({
  onNavigate,
  onAwardPilot,
  onPilotCreated
}) => {
  const { challenges, applications, evaluateApplications } = useData();

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    challenges[0] ? challenges[0].id : ""
  );

  useEffect(() => {
    if (!selectedChallengeId && challenges.length > 0) {
      setSelectedChallengeId(challenges[0].id);
    }
  }, [challenges, selectedChallengeId]);

  const [selectedAppForReport, setSelectedAppForReport] = useState<StartupApplication | null>(null);
  const [selectedAppForPilot, setSelectedAppForPilot] = useState<StartupApplication | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];
  const challengeApps = applications.filter((a) => a.challengeId === selectedChallengeId);

  const handleRunEvaluation = async () => {
    if (!currentChallenge) return;
    setIsEvaluating(true);
    try {
      await evaluateApplications(currentChallenge.id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const sortedApps = [...challengeApps].sort((a, b) => {
    if (a.evaluation?.rank && b.evaluation?.rank) {
      return a.evaluation.rank - b.evaluation.rank;
    }
    if (a.evaluation && !b.evaluation) return -1;
    if (!a.evaluation && b.evaluation) return 1;
    return 0;
  });

  const getRecommendationStyle = (rec?: string) => {
    switch (rec) {
      case "STRONGLY_RECOMMENDED":
        return "text-[#3F7658] font-semibold";
      case "RECOMMENDED":
        return "text-[#3F7658] font-medium";
      case "CONDITIONAL":
        return "text-[#B7793E] font-medium";
      default:
        return "text-[#6B6A63]";
    }
  };

  const getRecommendationLabel = (rec?: string) => {
    switch (rec) {
      case "STRONGLY_RECOMMENDED":
        return "Strongly Recommended";
      case "RECOMMENDED":
        return "Recommended";
      case "CONDITIONAL":
        return "Conditional Review";
      default:
        return "Submitted • Pending Review";
    }
  };

  return (
    <div className="space-y-5 text-left text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD7CA]">
        <div>
          <h1 className="text-xl font-bold text-[#173B32] tracking-tight">Startup Proposals Evaluation</h1>
          <p className="text-xs text-[#6B6A63] mt-0.5">
            Review and evaluate submitted proposals against mandatory requirements and contractual KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedChallengeId}
            onChange={(e) => setSelectedChallengeId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded border border-[#DDD7CA] bg-[#FBF9F4] text-[#252525] outline-none focus:border-[#173B32] max-w-xs cursor-pointer"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating || challengeApps.length === 0}
            className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
          >
            {isEvaluating ? "Evaluating..." : "Run AI Evaluation"}
          </button>
        </div>
      </div>

      {/* Selected Challenge Context Strip */}
      {currentChallenge && (
        <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-[#173B32]">{currentChallenge.title}</span>
            <span className="text-[#DDD7CA] mx-2">•</span>
            <span className="text-[#6B6A63]">{currentChallenge.sector}</span>
            <span className="text-[#DDD7CA] mx-2">•</span>
            <span className="text-[#6B6A63]">{currentChallenge.location}</span>
          </div>
          <div className="text-[#173B32] font-mono text-[11px] font-semibold">
            {challengeApps.length} Applications Received
          </div>
        </div>
      )}

      {/* Clean Data-Heavy Table */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded overflow-hidden">
        {sortedApps.length === 0 ? (
          <div className="p-8 text-center text-[#6B6A63] text-xs">
            No applications submitted for this challenge yet. Startups can apply from the Challenges portal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F1E8] text-[#6B6A63] font-semibold border-b border-[#DDD7CA] text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">Rank</th>
                  <th className="py-2.5 px-3">Startup Proposal</th>
                  <th className="py-2.5 px-3 text-center">Overall Score</th>
                  <th className="py-2.5 px-3 text-center">KPI Credibility</th>
                  <th className="py-2.5 px-3 text-center">Technical</th>
                  <th className="py-2.5 px-3 text-center">Cost</th>
                  <th className="py-2.5 px-3">Recommendation / Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/70">
                {sortedApps.map((app) => {
                  const ev = app.evaluation;

                  return (
                    <tr key={app.id} className="hover:bg-white transition-colors">
                      {/* Rank */}
                      <td className="py-3 px-3 text-center font-mono font-medium text-[#252525]">
                        {ev?.rank ? `#${ev.rank}` : "—"}
                      </td>

                      {/* Startup */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#173B32]">{app.startupName}</div>
                        <div className="text-[11px] text-[#252525] truncate max-w-xs">{app.solutionTitle}</div>
                        {app.dpiitNumber && (
                          <span className="text-[10px] text-[#6B6A63] font-mono">
                            DPIIT: {app.dpiitNumber}
                          </span>
                        )}
                      </td>

                      {/* Overall Score */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#173B32]">
                        {ev ? `${ev.overallScore}/100` : "—"}
                      </td>

                      {/* KPI Credibility */}
                      <td className="py-3 px-3 text-center font-mono text-[#252525]">
                        {ev ? `${ev.kpiScore}/40` : "—"}
                      </td>

                      {/* Technical */}
                      <td className="py-3 px-3 text-center font-mono text-[#252525]">
                        {ev ? `${ev.technicalScore}/20` : "—"}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-3 text-center font-mono text-[#252525]">
                        {ev ? `${ev.costScore}/10` : `₹${((app.costINR || app.totalCost || 0) / 100000).toFixed(1)}L`}
                      </td>

                      {/* Recommendation */}
                      <td className={`py-3 px-3 text-xs ${getRecommendationStyle(ev?.recommendation)}`}>
                        {getRecommendationLabel(ev?.recommendation)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {ev ? (
                            <button
                              onClick={() => setSelectedAppForReport(app)}
                              className="px-2.5 py-1 text-xs font-medium text-[#173B32] hover:bg-[#F5F1E8] bg-white border border-[#DDD7CA] rounded transition-colors cursor-pointer"
                            >
                              Report
                            </button>
                          ) : (
                            <button
                              onClick={handleRunEvaluation}
                              className="px-2.5 py-1 text-xs font-medium text-[#173B32] hover:underline cursor-pointer"
                            >
                              Evaluate
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedAppForPilot(app)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-[#173B32] hover:bg-[#112D26] rounded transition-colors cursor-pointer shadow-xs"
                          >
                            Award Pilot
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Structured AI Evaluation Report Modal */}
      {selectedAppForReport && currentChallenge && (
        <AIEvaluationReportModal
          application={selectedAppForReport}
          challenge={currentChallenge}
          onClose={() => setSelectedAppForReport(null)}
          onSelectForPilot={(app) => {
            setSelectedAppForReport(null);
            setSelectedAppForPilot(app);
          }}
        />
      )}

      {/* Create Pilot Modal */}
      {selectedAppForPilot && currentChallenge && (
        <CreatePilotModal
          challenge={currentChallenge}
          application={selectedAppForPilot}
          onClose={() => setSelectedAppForPilot(null)}
          onSuccess={(pilot) => {
            setSelectedAppForPilot(null);
            if (onAwardPilot) onAwardPilot(pilot.id);
            if (onPilotCreated) onPilotCreated(pilot.id);
            if (onNavigate) onNavigate("pilots");
          }}
        />
      )}
    </div>
  );
};
