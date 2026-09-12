import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { KPI } from "../../types.js";
import { SubmitObservationModal } from "../modals/SubmitObservationModal.js";
import { FinalReportModal } from "../modals/FinalReportModal.js";
import { ProcurementView } from "./ProcurementView.js";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Award,
  Layers,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
} from "lucide-react";

export const PilotDashboard: React.FC = () => {
  const { role } = useAuth();
  const { pilots, observations, generateFinalReport, procurements } = useData();

  const defaultPilot = pilots.find((p) => p.id === "plt-kolhapur-aquasense") || pilots[0];
  const [selectedPilotId, setSelectedPilotId] = useState<string>(defaultPilot ? defaultPilot.id : "");

  const activePilot = pilots.find((p) => p.id === selectedPilotId) || pilots[0];

  const [obsModalOpen, setObsModalOpen] = useState(false);
  const [selectedKpiForObs, setSelectedKpiForObs] = useState<KPI | undefined>(undefined);
  const [finalReportModalOpen, setFinalReportModalOpen] = useState(false);
  const [activeReportData, setActiveReportData] = useState<any | null>(null);

  // Chart view controls
  const [selectedKpiId, setSelectedKpiId] = useState<string>(
    activePilot?.lockedKPIs[0]?.id || ""
  );
  const [chartMode, setChartMode] = useState<"trend" | "portfolio">("trend");

  const matchingProcurement = procurements.find((pr) => pr.pilotId === activePilot?.id);
  const [showProcurementView, setShowProcurementView] = useState(false);

  if (!activePilot) {
    return (
      <div className="p-8 text-center text-[#6B6A63] text-xs">
        No active pilots found in current registry.
      </div>
    );
  }

  if (showProcurementView && matchingProcurement) {
    return (
      <ProcurementView
        pilot={activePilot}
        procurement={matchingProcurement}
        onBackToDashboard={() => setShowProcurementView(false)}
      />
    );
  }

  const pilotObs = observations.filter((o) => o.pilotId === activePilot.id);

  // Active KPI for detailed trend chart
  const currentKpi =
    activePilot.lockedKPIs.find((k) => k.id === selectedKpiId) ||
    activePilot.lockedKPIs[0];

  // 1. Build trend timeline data for selected KPI
  const buildKpiTrendData = (kpi: KPI) => {
    const kpiObs = pilotObs.filter((o) => o.kpiId === kpi.id);
    const data = [];

    // Pre-pilot baseline
    data.push({
      stage: "Baseline",
      monthNum: 0,
      Government: kpi.baseline !== undefined ? Number(kpi.baseline) : null,
      Startup: kpi.baseline !== undefined ? Number(kpi.baseline) : null,
      Target: Number(kpi.target),
      discrepancy: 0,
      status: "Official Pre-Pilot Baseline",
      notes: kpi.baselineQuestion || "Pre-pilot recorded baseline in target district",
    });

    const maxMonths = Math.max(activePilot.durationMonths || 3, 3);
    for (let m = 1; m <= maxMonths; m++) {
      const govObs = kpiObs.find((o) => o.month === m && o.submittedByRole === "government");
      const startupObs = kpiObs.find((o) => o.month === m && o.submittedByRole === "startup");

      const govVal = govObs !== undefined ? Number(govObs.value) : null;
      const startupVal = startupObs !== undefined ? Number(startupObs.value) : null;
      const delta =
        govVal !== null && startupVal !== null ? Math.abs(govVal - startupVal) : null;

      let pointStatus = "Awaiting Telemetry";
      if (govVal !== null && startupVal !== null) {
        if (delta! <= 0.3) pointStatus = "Dual Verified (In Agreement)";
        else pointStatus = `Discrepancy: ${delta!.toFixed(2)} ${kpi.unit}`;
      } else if (govVal !== null) {
        pointStatus = "Government Logged (Pending Vendor)";
      } else if (startupVal !== null) {
        pointStatus = "Vendor Logged (Pending Verification)";
      }

      data.push({
        stage: `Month ${m}`,
        monthNum: m,
        Government: govVal,
        Startup: startupVal,
        Target: Number(kpi.target),
        discrepancy: delta !== null ? Number(delta.toFixed(2)) : null,
        status: pointStatus,
        govNotes: govObs?.notes,
        startupNotes: startupObs?.notes,
        hasData: govVal !== null || startupVal !== null,
      });
    }

    return data;
  };

  const trendData = currentKpi ? buildKpiTrendData(currentKpi) : [];

  // Calculate dynamic Y-axis bounds for trend chart
  const calculateYDomain = () => {
    if (!currentKpi) return [0, 10];
    const vals: number[] = [Number(currentKpi.target)];
    if (currentKpi.baseline !== undefined) vals.push(Number(currentKpi.baseline));
    trendData.forEach((d) => {
      if (d.Government !== null) vals.push(d.Government);
      if (d.Startup !== null) vals.push(d.Startup);
    });

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const lower = Math.max(0, Math.floor(min - range * 0.15));
    const upper = Math.ceil(max + range * 0.15);
    return [lower, upper];
  };

  // 2. Build Portfolio Comparative Achievement data for all locked KPIs
  const portfolioData = activePilot.lockedKPIs.map((kpi) => {
    const kpiObs = pilotObs.filter((o) => o.kpiId === kpi.id);
    const latestGov = kpiObs
      .filter((o) => o.submittedByRole === "government")
      .sort((a, b) => b.month - a.month)[0];
    const latestStartup = kpiObs
      .filter((o) => o.submittedByRole === "startup")
      .sort((a, b) => b.month - a.month)[0];

    const currentVal = latestGov
      ? Number(latestGov.value)
      : latestStartup
      ? Number(latestStartup.value)
      : Number(kpi.baseline ?? 0);

    const base = kpi.baseline !== undefined ? Number(kpi.baseline) : 0;
    const tgt = Number(kpi.target);

    let progressPct = 0;
    if (kpi.direction === "lower") {
      // Lower is better (e.g. false alarm rate: baseline 32%, target 4%, current 3.2%)
      if (base !== tgt) {
        progressPct = Math.round(((base - currentVal) / (base - tgt)) * 100);
      }
    } else {
      // Higher is better (e.g. lead time: baseline 0.5, target 3.5, current 4.1)
      if (tgt !== base) {
        progressPct = Math.round(((currentVal - base) / (tgt - base)) * 100);
      }
    }

    const isMet = kpi.direction === "lower" ? currentVal <= tgt : currentVal >= tgt;

    return {
      kpiId: kpi.id,
      title: kpi.title,
      shortTitle: kpi.title.length > 20 ? kpi.title.slice(0, 18) + "…" : kpi.title,
      unit: kpi.unit,
      baseline: base,
      target: tgt,
      current: currentVal,
      achievementPct: Math.max(0, Math.min(160, progressPct)),
      rawPct: progressPct,
      isMet,
    };
  });

  // Latest observation stats for current KPI
  const currentKpiObs = pilotObs.filter((o) => o.kpiId === currentKpi?.id);
  const latestGovObs = currentKpiObs
    .filter((o) => o.submittedByRole === "government")
    .sort((a, b) => b.month - a.month)[0];
  const latestStartupObs = currentKpiObs
    .filter((o) => o.submittedByRole === "startup")
    .sort((a, b) => b.month - a.month)[0];

  const latestGovValue = latestGovObs ? Number(latestGovObs.value) : null;
  const latestStartupValue = latestStartupObs ? Number(latestStartupObs.value) : null;
  const currentVariance =
    latestGovValue !== null && latestStartupValue !== null
      ? Math.abs(latestGovValue - latestStartupValue)
      : null;

  const handleGenerateFinalReport = async () => {
    try {
      const report = await generateFinalReport(activePilot.id);
      setActiveReportData(report);
      setFinalReportModalOpen(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Custom Recharts Tooltip for Trend Curve
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dataPoint = payload[0]?.payload;
    if (!dataPoint) return null;

    return (
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-3 text-xs shadow-md text-left min-w-[240px]">
        <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-1.5 mb-2">
          <span className="font-bold text-[#173B32]">{label} Telemetry</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              dataPoint.discrepancy !== null && dataPoint.discrepancy <= 0.3
                ? "bg-[#E8F3ED] text-[#3F7658] border border-[#C2DEC8]"
                : dataPoint.discrepancy !== null
                ? "bg-[#FAF3EB] text-[#B7793E] border border-[#ECD8C3]"
                : "bg-[#F5F1E8] text-[#6B6A63]"
            }`}
          >
            {dataPoint.status}
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-[#173B32] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#173B32]" />
              Government Verified:
            </span>
            <span className="font-bold text-[#173B32]">
              {dataPoint.Government !== null ? `${dataPoint.Government} ${currentKpi?.unit}` : "Pending"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#C96B4B] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C96B4B]" />
              Startup Sensor Log:
            </span>
            <span className="font-bold text-[#C96B4B]">
              {dataPoint.Startup !== null ? `${dataPoint.Startup} ${currentKpi?.unit}` : "Pending"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#DDD7CA]/60">
            <span className="text-[#3F7658] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-[#3F7658]" />
              Contract Target:
            </span>
            <span className="font-bold text-[#3F7658]">
              {dataPoint.Target} {currentKpi?.unit}
            </span>
          </div>

          {currentKpi?.baseline !== undefined && (
            <div className="flex items-center justify-between text-[#6B6A63]">
              <span>Starting Baseline:</span>
              <span>
                {currentKpi.baseline} {currentKpi.unit}
              </span>
            </div>
          )}

          {dataPoint.discrepancy !== null && (
            <div className="pt-1 text-[10px] text-[#6B6A63] border-t border-[#DDD7CA]/60 flex items-center justify-between">
              <span>Dual-Party Variance:</span>
              <span className="font-semibold text-[#252525]">
                ±{dataPoint.discrepancy} {currentKpi?.unit}
              </span>
            </div>
          )}
        </div>

        {(dataPoint.govNotes || dataPoint.startupNotes) && (
          <div className="mt-2 pt-2 border-t border-[#DDD7CA] text-[10px] text-[#6B6A63] space-y-1">
            {dataPoint.govNotes && (
              <p className="line-clamp-2">
                <strong className="text-[#173B32]">Gov Note:</strong> {dataPoint.govNotes}
              </p>
            )}
            {dataPoint.startupNotes && (
              <p className="line-clamp-2">
                <strong className="text-[#C96B4B]">Vendor Note:</strong> {dataPoint.startupNotes}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Custom Tooltip for Portfolio Bar Chart
  const CustomPortfolioTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0]?.payload;
    if (!item) return null;

    return (
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-3 text-xs shadow-md text-left min-w-[220px]">
        <div className="font-bold text-[#173B32] border-b border-[#DDD7CA] pb-1 mb-1.5">
          {item.title}
        </div>
        <div className="space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6A63]">Baseline:</span>
            <span>
              {item.baseline} {item.unit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6A63]">Contract Target:</span>
            <span className="text-[#3F7658] font-bold">
              {item.target} {item.unit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6A63]">Latest Verified:</span>
            <span className="text-[#173B32] font-bold">
              {item.current} {item.unit}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#DDD7CA] font-sans">
            <span className="font-semibold text-[#252525]">Target Achievement:</span>
            <span
              className={`font-bold ${
                item.isMet ? "text-[#3F7658]" : "text-[#B7793E]"
              }`}
            >
              {item.rawPct}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left text-[#252525]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD7CA]">
        <div>
          <h1 className="text-xl font-bold text-[#173B32] tracking-tight">
            Field Pilot Telemetry & KPI Verification
          </h1>
          <p className="text-xs text-[#6B6A63] mt-0.5 font-medium">
            Dual-party performance auditing between Government Officers and Startup Engineers.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {pilots.length > 1 && (
            <select
              value={selectedPilotId}
              onChange={(e) => {
                setSelectedPilotId(e.target.value);
                const p = pilots.find((pl) => pl.id === e.target.value);
                if (p?.lockedKPIs[0]) setSelectedKpiId(p.lockedKPIs[0].id);
              }}
              className="px-2.5 py-1.5 text-xs rounded border border-[#DDD7CA] bg-[#FBF9F4] text-[#173B32] font-semibold outline-none cursor-pointer"
            >
              {pilots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.startupName} — {p.challengeTitle.slice(0, 32)}…
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setSelectedKpiForObs(currentKpi);
              setObsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded border border-[#DDD7CA] bg-[#FBF9F4] hover:bg-[#F5F1E8] text-[#173B32] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F7658]" />
            <span>Log Observation</span>
          </button>

          <button
            onClick={handleGenerateFinalReport}
            className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#C5A24A]" />
            <span>Generate Final Report</span>
          </button>

          {matchingProcurement && (
            <button
              onClick={() => setShowProcurementView(true)}
              className="px-3.5 py-1.5 rounded bg-[#3F7658] hover:bg-[#346248] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Sanction</span>
            </button>
          )}
        </div>
      </div>

      {/* Pilot Metadata Institutional Strip */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div>
            <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">
              Selected Startup
            </p>
            <p className="font-bold text-[#173B32] mt-0.5">{activePilot.startupName}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">
              Procuring Department
            </p>
            <p className="font-semibold text-[#252525] mt-0.5">{activePilot.department}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">
              Pilot Jurisdiction
            </p>
            <p className="font-semibold text-[#252525] mt-0.5">{activePilot.location}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">
              Audit Status
            </p>
            <p className="font-semibold text-[#173B32] mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3F7658]" />
              <span>
                {activePilot.status} (Month {activePilot.currentMonth} of {activePilot.durationMonths})
              </span>
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">
              Contract Period
            </p>
            <p className="font-semibold text-[#252525] mt-0.5 font-mono text-[11px]">
              {activePilot.startDate} → {activePilot.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Performance Table */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded overflow-hidden">
        <div className="px-4 py-3 border-b border-[#DDD7CA] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#173B32] uppercase tracking-wider">
              Contractual KPI Registry & Dual-Party Telemetry
            </h3>
            <p className="text-[11px] text-[#6B6A63] mt-0.5">
              Click any row to display its time-series convergence trajectory in the Recharts viewer below.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#3F7658] bg-[#E8F3ED] border border-[#C2DEC8] px-2 py-0.5 rounded">
            {activePilot.lockedKPIs.length} Legally Locked KPIs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F5F1E8] text-[#6B6A63] font-semibold border-b border-[#DDD7CA] text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Locked KPI & Description</th>
                <th className="py-2.5 px-3 text-center">Direction</th>
                <th className="py-2.5 px-3 text-center">Baseline</th>
                <th className="py-2.5 px-3 text-center">Target</th>
                <th className="py-2.5 px-3 text-center">Gov Verified</th>
                <th className="py-2.5 px-3 text-center">Startup Log</th>
                <th className="py-2.5 px-3 text-center">Audit Delta</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7CA]/70">
              {activePilot.lockedKPIs.map((kpi) => {
                const isSelected = kpi.id === selectedKpiId;
                const kpiObs = pilotObs.filter((o) => o.kpiId === kpi.id);
                const govObs = kpiObs
                  .filter((o) => o.submittedByRole === "government")
                  .sort((a, b) => b.month - a.month)[0];
                const startupObs = kpiObs
                  .filter((o) => o.submittedByRole === "startup")
                  .sort((a, b) => b.month - a.month)[0];

                const govVal = govObs ? `${govObs.value} ${kpi.unit}` : "—";
                const startupVal = startupObs ? `${startupObs.value} ${kpi.unit}` : "—";

                const deltaNum =
                  govObs && startupObs ? Math.abs(govObs.value - startupObs.value) : null;
                const deltaStr =
                  deltaNum !== null ? `±${deltaNum.toFixed(2)} ${kpi.unit}` : "—";

                const isTargetMet = govObs
                  ? kpi.direction === "lower"
                    ? govObs.value <= kpi.target
                    : govObs.value >= kpi.target
                  : false;

                return (
                  <tr
                    key={kpi.id}
                    onClick={() => setSelectedKpiId(kpi.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#EAF0EC] border-l-3 border-l-[#173B32]"
                        : "hover:bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-[#252525]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#173B32]">{kpi.title}</span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-[#173B32] bg-[#F5F1E8] border border-[#DDD7CA] px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B6A63] line-clamp-1 mt-0.5">
                        {kpi.description}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-[11px] text-[#6B6A63]">
                      {kpi.direction === "lower" ? "Lower (↓)" : "Higher (↑)"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[#6B6A63]">
                      {kpi.baseline !== undefined ? `${kpi.baseline} ${kpi.unit}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#173B32]">
                      {kpi.target} {kpi.unit}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[#173B32] font-semibold">
                      {govVal}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[#C96B4B] font-semibold">
                      {startupVal}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-[#6B6A63]">
                      {deltaStr}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          isTargetMet
                            ? "bg-[#E8F3ED] text-[#3F7658] border-[#C2DEC8]"
                            : govObs
                            ? "bg-[#FAF3EB] text-[#B7793E] border-[#ECD8C3]"
                            : "bg-[#F5F1E8] text-[#6B6A63] border-[#DDD7CA]"
                        }`}
                      >
                        {isTargetMet ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#3F7658]" />
                            <span>Target Exceeded</span>
                          </>
                        ) : govObs ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-[#B7793E]" />
                            <span>In Progress</span>
                          </>
                        ) : (
                          <span>Pending Input</span>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharts KPI Progress Trends Visualizer */}
      <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-4 sm:p-5 space-y-4">
        {/* Visualizer Top Bar: View Mode Switcher + KPI Selector Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DDD7CA]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#173B32]" />
            <div>
              <h3 className="text-xs font-bold text-[#173B32] uppercase tracking-wider">
                Telemetry Trend Visualizer
              </h3>
              <p className="text-[11px] text-[#6B6A63]">
                Visualizing empirical verification progress using Recharts
              </p>
            </div>
          </div>

          {/* Mode switch & Actions */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded border border-[#DDD7CA] bg-[#F5F1E8] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setChartMode("trend")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  chartMode === "trend"
                    ? "bg-[#173B32] text-white shadow-xs"
                    : "text-[#6B6A63] hover:text-[#173B32]"
                }`}
              >
                <LineChartIcon className="w-3 h-3" />
                <span>Dual-Party Trajectory</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode("portfolio")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  chartMode === "portfolio"
                    ? "bg-[#173B32] text-white shadow-xs"
                    : "text-[#6B6A63] hover:text-[#173B32]"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Portfolio Progress %</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Selector Tabs (when in Trend mode) */}
        {chartMode === "trend" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-[#6B6A63] whitespace-nowrap">
              Select KPI:
            </span>
            {activePilot.lockedKPIs.map((kpi) => {
              const isSelected = kpi.id === selectedKpiId;
              return (
                <button
                  key={kpi.id}
                  type="button"
                  onClick={() => setSelectedKpiId(kpi.id)}
                  className={`px-3 py-1 text-xs rounded border transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#173B32] text-white border-[#173B32] font-semibold"
                      : "bg-[#F5F1E8] text-[#252525] border-[#DDD7CA] hover:bg-[#EAF0EC]"
                  }`}
                >
                  <span>{kpi.title}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#DDD7CA]/50 text-[#6B6A63]"
                    }`}
                  >
                    Target: {kpi.target} {kpi.unit}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Telemetry Metric Cards Strip (for selected KPI in Trend Mode) */}
        {chartMode === "trend" && currentKpi && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-[#F5F1E8] border border-[#DDD7CA] rounded text-xs">
            <div>
              <div className="text-[10px] font-semibold uppercase text-[#6B6A63] tracking-wider">
                Pre-Pilot Baseline
              </div>
              <div className="text-base font-bold font-mono text-[#252525] mt-0.5">
                {currentKpi.baseline !== undefined ? `${currentKpi.baseline} ${currentKpi.unit}` : "—"}
              </div>
              <div className="text-[10px] text-[#6B6A63] truncate">
                {currentKpi.direction === "lower" ? "Objective: Reduce below target" : "Objective: Exceed target"}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase text-[#3F7658] tracking-wider">
                Contractual Target
              </div>
              <div className="text-base font-bold font-mono text-[#3F7658] mt-0.5">
                {currentKpi.target} {currentKpi.unit}
              </div>
              <div className="text-[10px] text-[#6B6A63]">
                Weight: {currentKpi.weight}% of final procurement score
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase text-[#173B32] tracking-wider">
                Latest Gov Verified
              </div>
              <div className="text-base font-bold font-mono text-[#173B32] mt-0.5">
                {latestGovValue !== null ? `${latestGovValue} ${currentKpi.unit}` : "Pending input"}
              </div>
              <div className="text-[10px] text-[#3F7658] font-medium flex items-center gap-0.5">
                {latestGovValue !== null && currentKpi.baseline !== undefined ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-[#3F7658]" />
                    <span>
                      {Math.abs(latestGovValue - Number(currentKpi.baseline)).toFixed(1)} {currentKpi.unit} shift from baseline
                    </span>
                  </>
                ) : (
                  <span>Awaiting Month verification</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase text-[#C96B4B] tracking-wider">
                Dual-Party Convergence
              </div>
              <div className="text-base font-bold font-mono text-[#252525] mt-0.5">
                {currentVariance !== null ? `±${currentVariance.toFixed(2)} ${currentKpi.unit}` : "—"}
              </div>
              <div className="text-[10px] font-medium text-[#3F7658]">
                {currentVariance !== null && currentVariance <= 0.3
                  ? "✓ Within statutory audit tolerance (≤ 5%)"
                  : "Field discrepancy monitoring active"}
              </div>
            </div>
          </div>
        )}

        {/* 1. DUAL-PARTY TREND CHART (ComposedChart / LineChart with Warm Institutional GovTech Styling) */}
        {chartMode === "trend" && currentKpi && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#173B32]">
                {currentKpi.title} — Progress Trajectory ({currentKpi.unit})
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 font-medium text-[#173B32]">
                  <span className="w-3 h-0.5 bg-[#173B32]" />
                  <span>Gov Telemetry</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#C96B4B]">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-[#C96B4B]" />
                  <span>Startup Sensor</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#3F7658]">
                  <span className="w-3 h-0.5 border-t border-dashed border-[#3F7658]" />
                  <span>Target Benchmark</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full bg-white border border-[#DDD7CA] rounded p-2 sm:p-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={trendData}
                  margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
                >
                  {/* Institutional Warm Grid */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD7CA" vertical={false} />

                  <XAxis
                    dataKey="stage"
                    stroke="#6B6A63"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#DDD7CA" }}
                  />

                  <YAxis
                    domain={calculateYDomain()}
                    stroke="#6B6A63"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#DDD7CA" }}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: currentKpi.unit,
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 10,
                      fill: "#6B6A63",
                    }}
                  />

                  {/* Contractual Target Reference Line */}
                  <ReferenceLine
                    y={Number(currentKpi.target)}
                    stroke="#3F7658"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{
                      value: `Target: ${currentKpi.target} ${currentKpi.unit}`,
                      position: "right",
                      fontSize: 10,
                      fill: "#3F7658",
                      fontWeight: 600,
                    }}
                  />

                  {/* Baseline Reference Line if available */}
                  {currentKpi.baseline !== undefined && (
                    <ReferenceLine
                      y={Number(currentKpi.baseline)}
                      stroke="#8C8275"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                      label={{
                        value: `Baseline: ${currentKpi.baseline}`,
                        position: "left",
                        fontSize: 10,
                        fill: "#8C8275",
                      }}
                    />
                  )}

                  <Tooltip content={<CustomTrendTooltip />} />

                  {/* Government Verified Telemetry Line */}
                  <Line
                    type="monotone"
                    dataKey="Government"
                    name="Government Verified"
                    stroke="#173B32"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#173B32", stroke: "#FBF9F4", strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: "#173B32", stroke: "#FBF9F4", strokeWidth: 2 }}
                    connectNulls
                  />

                  {/* Startup Field Submission Line */}
                  <Line
                    type="monotone"
                    dataKey="Startup"
                    name="Startup Submission"
                    stroke="#C96B4B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: "#C96B4B", stroke: "#FBF9F4", strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: "#C96B4B", stroke: "#FBF9F4", strokeWidth: 2 }}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B6A63] px-1">
              <span>
                Audited against Government baseline ({currentKpi.baseline} {currentKpi.unit}).
              </span>
              <span className="font-medium text-[#173B32]">
                Target: {currentKpi.target} {currentKpi.unit} ({currentKpi.direction === "lower" ? "Maximum Ceiling" : "Minimum Requirement"})
              </span>
            </div>
          </div>
        )}

        {/* 2. PORTFOLIO VIEW: Comparative Target Achievement % across all locked KPIs */}
        {chartMode === "portfolio" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#173B32]">
                Portfolio Target Achievement (% of Contractual Goal Reached)
              </span>
              <span className="text-[11px] text-[#3F7658] font-semibold">
                100% = Contractual Benchmark Met
              </span>
            </div>

            <div className="h-72 w-full bg-white border border-[#DDD7CA] rounded p-2 sm:p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={portfolioData}
                  margin={{ top: 15, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD7CA" vertical={false} />
                  <XAxis
                    dataKey="shortTitle"
                    stroke="#6B6A63"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#DDD7CA" }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[0, 150]}
                    stroke="#6B6A63"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#DDD7CA" }}
                    tickFormatter={(v) => `${v}%`}
                  />

                  {/* 100% Target Met Benchmark Line */}
                  <ReferenceLine
                    y={100}
                    stroke="#173B32"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: "100% Benchmark (Target Met)",
                      position: "top",
                      fontSize: 10,
                      fill: "#173B32",
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip content={<CustomPortfolioTooltip />} />

                  <Bar dataKey="achievementPct" radius={[4, 4, 0, 0]} maxBarSize={55}>
                    {portfolioData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isMet ? "#173B32" : "#C96B4B"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
              {portfolioData.map((item) => (
                <div
                  key={item.kpiId}
                  className={`p-2.5 rounded border text-xs ${
                    item.isMet
                      ? "bg-[#E8F3ED] border-[#C2DEC8]"
                      : "bg-[#FAF3EB] border-[#ECD8C3]"
                  }`}
                >
                  <div className="font-semibold text-[#173B32] truncate">{item.title}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-[#6B6A63]">Target: {item.target} {item.unit}</span>
                    <span className="font-bold font-mono text-[#173B32]">
                      {item.current} {item.unit}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-semibold">
                    <span className={item.isMet ? "text-[#3F7658]" : "text-[#B7793E]"}>
                      {item.isMet ? "✓ Benchmark Exceeded" : "In Progress"}
                    </span>
                    <span className="font-mono text-[#173B32]">{item.rawPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Observation Modal */}
      {obsModalOpen && (
        <SubmitObservationModal
          pilot={activePilot}
          kpi={selectedKpiForObs || currentKpi}
          onClose={() => setObsModalOpen(false)}
          onSuccess={() => setObsModalOpen(false)}
        />
      )}

      {/* Final Report Modal */}
      {finalReportModalOpen && activeReportData && (
        <FinalReportModal
          report={activeReportData}
          onClose={() => setFinalReportModalOpen(false)}
        />
      )}
    </div>
  );
};
