import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Challenge, StartupApplication, Pilot, KPIObservation, Evaluation, ProcurementRecord } from "../types.js";

export interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

interface DataContextType {
  challenges: Challenge[];
  applications: StartupApplication[];
  evaluations: Evaluation[];
  pilots: Pilot[];
  observations: KPIObservation[];
  procurements: ProcurementRecord[];
  isLoading: boolean;
  aiLoadingMessage: string | null;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  
  // AI Operations
  generateAIChallenge: (problemText: string) => Promise<any>;
  evaluateApplications: (challengeId: string) => Promise<Evaluation[]>;
  detectConflict: (pilotId: string, kpiId: string, month: number) => Promise<any>;
  generateFinalReport: (pilotId: string) => Promise<any>;
  approveProcurement: (pilotId: string, notes?: string) => Promise<ProcurementRecord>;

  // Data mutations
  publishChallenge: (challenge: Partial<Challenge>) => Promise<Challenge>;
  submitApplication: (app: Partial<StartupApplication>) => Promise<StartupApplication>;
  createPilot: (pilot: Partial<Pilot>) => Promise<Pilot>;
  submitObservation: (obs: Partial<KPIObservation>) => Promise<KPIObservation>;
  resetAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [applications, setApplications] = useState<StartupApplication[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [observations, setObservations] = useState<KPIObservation[]>([]);
  const [procurements, setProcurements] = useState<ProcurementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoadingMessage, setAiLoadingMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [chRes, appRes, pltRes, obsRes] = await Promise.all([
        fetch("/api/challenges"),
        fetch("/api/applications"),
        fetch("/api/pilots"),
        fetch("/api/observations"),
      ]);

      if (chRes.ok) setChallenges(await chRes.json());
      if (appRes.ok) {
        const appsData: StartupApplication[] = await appRes.json();
        setApplications(appsData);
        // gather evaluations from apps
        const evals: Evaluation[] = [];
        appsData.forEach((a) => {
          if (a.evaluation) evals.push(a.evaluation);
        });
        setEvaluations(evals);
      }
      if (pltRes.ok) setPilots(await pltRes.json());
      if (obsRes.ok) setObservations(await obsRes.json());
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // AI Challenge Generation
  const generateAIChallenge = async (problemText: string) => {
    setAiLoadingMessage("AI is analyzing the problem and converting to structured government challenge...");
    try {
      const res = await fetch("/api/ai/generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemText }),
      });
      if (!res.ok) {
        throw new Error("Failed to generate challenge");
      }
      addToast({
        type: "success",
        title: "AI Challenge Generated",
        message: "Successfully generated 4 measurable KPIs, budget range, and requirements.",
      });
      return await res.json();
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Generation Error",
        message: err.message || "Could not generate challenge",
      });
      throw err;
    } finally {
      setAiLoadingMessage(null);
    }
  };

  // AI Startup Evaluation
  const evaluateApplications = async (challengeId: string) => {
    setAiLoadingMessage("Evaluating startup applications & cross-referencing KPI claims against evidence...");
    try {
      const res = await fetch("/api/ai/evaluate-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();
      await refreshData();
      addToast({
        type: "success",
        title: "AI Evaluation Complete",
        message: "Ranked leaderboard and credibility reports are now ready.",
      });
      return data.evaluations;
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Evaluation Error",
        message: err.message || "Could not evaluate applications",
      });
      throw err;
    } finally {
      setAiLoadingMessage(null);
    }
  };

  // AI Conflict Detection
  const detectConflict = async (pilotId: string, kpiId: string, month: number) => {
    setAiLoadingMessage("Comparing dual-party observations & checking for metric divergence...");
    try {
      const res = await fetch("/api/ai/detect-conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pilotId, kpiId, month }),
      });
      if (!res.ok) throw new Error("Conflict detection failed");
      const data = await res.json();
      return data;
    } finally {
      setAiLoadingMessage(null);
    }
  };

  // AI Final Pilot Report
  const generateFinalReport = async (pilotId: string) => {
    setAiLoadingMessage("Auditing pilot telemetry & generating final AI performance verification report...");
    try {
      const res = await fetch("/api/ai/final-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pilotId }),
      });
      if (!res.ok) throw new Error("Final report generation failed");
      const report = await res.json();
      await refreshData();
      addToast({
        type: "success",
        title: "Final AI Report Ready",
        message: "Performance verification generated with contractual recommendation.",
      });
      return report;
    } finally {
      setAiLoadingMessage(null);
    }
  };

  // Approve Procurement
  const approveProcurement = async (pilotId: string, notes?: string) => {
    try {
      const res = await fetch("/api/procurement/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pilotId, decisionNotes: notes }),
      });
      if (!res.ok) throw new Error("Approval failed");
      const record = await res.json();
      await refreshData();
      addToast({
        type: "success",
        title: "Procurement Approved!",
        message: "Startup status is now PROCURED. Scale-up plan is ready.",
      });
      return record;
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Procurement Error",
        message: err.message,
      });
      throw err;
    }
  };

  // Publish Challenge
  const publishChallenge = async (challengeData: Partial<Challenge>) => {
    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(challengeData),
    });
    if (!res.ok) throw new Error("Failed to publish challenge");
    const created = await res.json();
    await refreshData();
    addToast({
      type: "success",
      title: "Challenge Published",
      message: "The challenge is now discoverable by qualified startups.",
    });
    return created;
  };

  // Submit Application
  const submitApplication = async (appData: Partial<StartupApplication>) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appData),
    });
    if (!res.ok) throw new Error("Failed to submit application");
    const created = await res.json();
    await refreshData();
    addToast({
      type: "success",
      title: "Application Submitted",
      message: "Your proposal and KPI claims have been recorded for AI evaluation.",
    });
    return created;
  };

  // Create Pilot
  const createPilot = async (pilotData: Partial<Pilot>) => {
    const res = await fetch("/api/pilots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pilotData),
    });
    if (!res.ok) throw new Error("Failed to create pilot");
    const created = await res.json();
    await refreshData();
    addToast({
      type: "success",
      title: "Pilot Contract Created",
      message: "Contractual KPI targets are now locked.",
    });
    return created;
  };

  // Submit Observation
  const submitObservation = async (obsData: Partial<KPIObservation>) => {
    const res = await fetch("/api/observations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obsData),
    });
    if (!res.ok) throw new Error("Failed to submit observation");
    const created = await res.json();
    await refreshData();
    addToast({
      type: "success",
      title: "KPI Observation Submitted",
      message: "Your independent monthly observation has been logged.",
    });
    return created;
  };

  // Reset demo data
  const resetAllData = async () => {
    try {
      await fetch("/api/admin/reset", { method: "POST" });
      await refreshData();
      addToast({
        type: "info",
        title: "Demo Reset",
        message: "Application state restored to default demo configuration.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        challenges,
        applications,
        evaluations,
        pilots,
        observations,
        procurements,
        isLoading,
        aiLoadingMessage,
        toasts,
        addToast,
        removeToast,
        refreshData,
        generateAIChallenge,
        evaluateApplications,
        detectConflict,
        generateFinalReport,
        approveProcurement,
        publishChallenge,
        submitApplication,
        createPilot,
        submitObservation,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
