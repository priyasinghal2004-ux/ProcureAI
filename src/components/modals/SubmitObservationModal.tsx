import React, { useState } from "react";
import { Pilot, KPI, UserRole } from "../../types.js";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { X, Send, Activity, ShieldCheck, FileText, Info } from "lucide-react";

interface SubmitObservationModalProps {
  pilot: Pilot;
  kpi?: KPI;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitObservationModal: React.FC<SubmitObservationModalProps> = ({
  pilot,
  kpi,
  onClose,
  onSuccess,
}) => {
  const { currentUser, role } = useAuth();
  const { submitObservation, addToast } = useData();

  const [selectedKpiId, setSelectedKpiId] = useState<string>(kpi ? kpi.id : pilot.lockedKPIs[0]?.id || "");
  const [month, setMonth] = useState<number>(pilot.currentMonth || 3);
  const [value, setValue] = useState<number>(4.2);
  const [notes, setNotes] = useState(
    role === "government"
      ? "Observed during peak high-flow event at Shirol telemetry station. Automated siren triggered ahead of crest."
      : "Sensor node S-04 logged flood wave crest at 14:15. LoRa packet dispatched to gram panchayat sirens."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeKpi = pilot.lockedKPIs.find((k) => k.id === selectedKpiId) || pilot.lockedKPIs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitObservation({
        pilotId: pilot.id,
        kpiId: activeKpi.id,
        month: Number(month),
        submittedByRole: role === "government" ? "government" : "startup",
        submittedByName: currentUser?.name || (role === "government" ? "Gov Officer" : "Startup Engineer"),
        value: Number(value),
        unit: activeKpi.unit,
        notes,
      });
      onSuccess();
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Submission Error",
        message: err.message || "Failed to log observation",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              <Activity className="w-3.5 h-3.5 text-slate-600" />
              <span>Independent Monthly Telemetry</span>
            </div>
            <h3 className="text-base font-bold text-slate-950">Log Field Telemetry Record</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitting as: <strong className="text-slate-800 capitalize">{role}</strong> ({currentUser?.organization})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-800">
          <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-xs">
              <strong className="text-slate-900">Dual-Audit Principle:</strong> Government officers and vendor telemetry feeds record monthly metrics independently to prevent claim fabrication.
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">Select Locked KPI</label>
            <select
              value={selectedKpiId}
              onChange={(e) => setSelectedKpiId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded outline-none text-xs text-slate-800 bg-white cursor-pointer"
            >
              {pilot.lockedKPIs.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.title} (Target: {k.target} {k.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">Trial Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded outline-none text-xs text-slate-800 bg-white cursor-pointer"
              >
                <option value={1}>Month 1</option>
                <option value={2}>Month 2</option>
                <option value={3}>Month 3 (Final)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Observed Value ({activeKpi?.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded outline-none font-mono font-semibold text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 uppercase text-[10px] tracking-wider mb-1">
              Field Telemetry Context & Verification Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded outline-none text-xs text-slate-800 leading-relaxed"
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Logging..." : "Submit Record"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
