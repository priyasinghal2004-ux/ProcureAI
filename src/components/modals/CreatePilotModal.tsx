import React, { useState } from "react";
import { Challenge, StartupApplication, Pilot, KPI } from "../../types.js";
import { useData } from "../../context/DataContext.js";
import {
  X,
  Award,
  Lock,
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Target
} from "lucide-react";

interface CreatePilotModalProps {
  challenge: Challenge;
  application: StartupApplication;
  onClose: () => void;
  onSuccess: (pilot: Pilot) => void;
}

export const CreatePilotModal: React.FC<CreatePilotModalProps> = ({
  challenge,
  application,
  onClose,
  onSuccess,
}) => {
  const { createPilot, addToast } = useData();
  const [durationMonths, setDurationMonths] = useState(3);
  const [location, setLocation] = useState(challenge.location || "District Vulnerability Zones");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  
  // End date calculated from duration
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      const pilotPayload: Partial<Pilot> = {
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        startupId: application.startupId,
        startupName: application.startupName,
        department: challenge.department,
        location,
        startDate,
        endDate,
        durationMonths,
        currentMonth: 1,
        status: "ACTIVE",
        lockedKPIs: challenge.kpis,
        milestones: [
          {
            title: "Equipment Installation & Sensor Synchronization",
            month: 1,
            description: "Deployment of IoT telemetry stations and baseline calibration.",
            status: "in_progress",
          },
          {
            title: "Mid-Term Dual Observation & Discrepancy Audit",
            month: 2,
            description: "Independent submission of flood event warnings by District Cell & Startup.",
            status: "pending",
          },
          {
            title: "Final Performance Audit & Procurement Review",
            month: 3,
            description: "AI generation of comprehensive achievement report and scale-up plan.",
            status: "pending",
          },
        ],
      };

      const created = await createPilot(pilotPayload);
      addToast({
        type: "success",
        title: "Pilot Contract Activated",
        message: `${application.startupName} is now in active pilot trial. KPIs are locked.`,
      });
      onSuccess(created);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error Creating Pilot",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
              <Award className="w-3.5 h-3.5 text-slate-600" />
              <span>Pilot Contract Formulation</span>
            </div>
            <h2 className="text-base font-bold text-slate-950">Initiate Pilot Contract: {application.startupName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Challenge: <span className="text-slate-700 font-medium">{challenge.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-800 text-xs max-h-[75vh] overflow-y-auto">
          {/* Important Lock Notice */}
          <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-slate-900">Contractual KPI Target Locking</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Upon confirmation, these KPI targets will be locked as the pilot's performance criteria. During the pilot period, both the Government Department and the Vendor will independently log monthly telemetry data.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Field Deployment Location
              </label>
              <div className="flex items-center gap-2 p-2 rounded border border-slate-300 bg-white">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs font-normal outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Trial Duration (Months)
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full p-2 rounded border border-slate-300 bg-white text-xs text-slate-800 outline-none cursor-pointer"
              >
                <option value={1}>1 Month (Fast Track)</option>
                <option value={3}>3 Months (Standard Pilot)</option>
                <option value={6}>6 Months (Extended Field Trial)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded border border-slate-300 bg-white text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded border border-slate-300 bg-white text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Locked KPIs List */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span>Contractually Locked KPIs ({challenge.kpis.length})</span>
            </h4>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden bg-white">
              {challenge.kpis.map((kpi: KPI, idx: number) => (
                <div key={kpi.id || idx} className="p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-slate-900">{kpi.title}</span>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Baseline: {kpi.baseline !== undefined ? `${kpi.baseline} ${kpi.unit}` : "Not set"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                      Target: {kpi.target} {kpi.unit}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Weight: {kpi.weight}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Locking Terms..." : "Lock Terms & Launch Pilot"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
