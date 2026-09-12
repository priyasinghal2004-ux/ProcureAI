import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import { Challenge, KPI } from "../../types.js";
import {
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Send,
  Target
} from "lucide-react";

interface CreateChallengeProps {
  onSuccess: (challengeId: string) => void;
}

export const CreateChallenge: React.FC<CreateChallengeProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const { generateAIChallenge, publishChallenge, addToast } = useData();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [problemText, setProblemText] = useState(
    "Every monsoon, the Panchganga river overflows in Kolhapur district, especially in Shirol and Kurundwad talukas. Rural roads get submerged within hours, cutting off 20+ villages. Currently, warning is done through manual river gauge readers who phone the tehsildar office, giving residents only 30-45 minutes to evacuate livestock and valuables. We need an automated early warning system that can detect upstream flood crests and alert both district disaster management and gram panchayats at least 4-6 hours in advance, even when mobile networks and power fail during severe rains."
  );

  const [generatedChallenge, setGeneratedChallenge] = useState<Partial<Challenge> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Quick preset sample buttons
  const samples = [
    {
      title: "Kolhapur Flood Detection",
      text: "Every monsoon, the Panchganga river overflows in Kolhapur district, especially in Shirol and Kurundwad talukas. Rural roads get submerged within hours, cutting off 20+ villages. Currently, warning is done through manual river gauge readers who phone the tehsildar office, giving residents only 30-45 minutes to evacuate livestock and valuables. We need an automated early warning system that can detect upstream flood crests and alert both district disaster management and gram panchayats at least 4-6 hours in advance, even when mobile networks and power fail during severe rains."
    },
    {
      title: "Urban Solid Waste Segregation",
      text: "Municipal collection trucks in Pune suffer from 70% mixed unsegregated waste arriving at processing plants, causing machinery jams and methane emissions. Manual door-to-door enforcement is inadequate across 450,000 households. We require an automated visual or sensor-based inspection system at collection points to measure segregation quality, detect commercial mixed waste dumping, and flag chronic violator wards within 24 hours."
    },
    {
      title: "Cold Chain Telemetry for Farmers",
      text: "Smallholder tomato and onion farmers in Nashik lose 28% of their harvest to post-harvest rot due to unmonitored temperature excursions in rural aggregation warehouses. Farmers have no visibility into humidity or power tripping. We need a tamper-proof IoT sensor system with solar backup that logs temperature/humidity and alerts both farmer collectives and warehouse operators when storage conditions degrade."
    }
  ];

  const handleGenerate = async () => {
    if (!problemText.trim()) {
      addToast({
        type: "warning",
        title: "Input Required",
        message: "Please describe the civic problem in simple words first."
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateAIChallenge(problemText);
      setGeneratedChallenge(result);
      setStep(1); // remain in step 1 to review & edit structured fields, or progress to 2
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKPIChange = (index: number, field: keyof KPI, val: any) => {
    if (!generatedChallenge || !generatedChallenge.kpis) return;
    const updated = [...generatedChallenge.kpis];
    updated[index] = { ...updated[index], [field]: val };
    setGeneratedChallenge({ ...generatedChallenge, kpis: updated });
  };

  const calculateWeightSum = () => {
    if (!generatedChallenge || !generatedChallenge.kpis) return 0;
    return generatedChallenge.kpis.reduce((acc, k) => acc + (Number(k.weight) || 0), 0);
  };

  const handlePublish = async () => {
    if (!generatedChallenge) return;
    const totalWeight = calculateWeightSum();
    if (totalWeight !== 100) {
      addToast({
        type: "error",
        title: "Weight Validation Error",
        message: `KPI weights must sum up to exactly 100%. Current sum: ${totalWeight}%.`
      });
      return;
    }

    setIsPublishing(true);
    try {
      const challengeToSave: Partial<Challenge> = {
        ...generatedChallenge,
        department: currentUser?.organization || "Disaster Management Authority",
        createdBy: currentUser?.name || "Officer",
        status: "published"
      };
      const created = await publishChallenge(challengeToSave);
      onSuccess(created.id);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Publish Failed",
        message: err.message
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Government Innovation Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create & Structure a New Challenge
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Describe any civic or administrative problem in natural language. Our AI converts it into a rigorous public procurement challenge with measurable KPIs and baseline telemetry.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setStep(1)}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 1
              ? "bg-white text-blue-600 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
          <span>1. Problem & AI Structuring</span>
        </button>
        <button
          onClick={() => generatedChallenge && setStep(2)}
          disabled={!generatedChallenge}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 2
              ? "bg-white text-blue-600 shadow-sm border border-slate-200"
              : generatedChallenge
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
          <span>2. Baseline KPI Entry</span>
        </button>
        <button
          onClick={() => generatedChallenge && setStep(3)}
          disabled={!generatedChallenge}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 3
              ? "bg-white text-blue-600 shadow-sm border border-slate-200"
              : generatedChallenge
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
          <span>3. Review & Publish</span>
        </button>
      </div>

      {/* STEP 1: Problem Intake & AI Generation */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm font-bold text-slate-900">
                Describe your problem in simple, everyday language:
              </label>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI will extract title, sector, KPIs & budget</span>
              </div>
            </div>

            {/* Quick samples */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Load sample challenge:</span>
              {samples.map((s, idx) => (
                <button
                  key={`sample-btn-${idx}`}
                  type="button"
                  onClick={() => setProblemText(s.text)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="e.g., We have regular water pipeline leakages in rural wards that go unnoticed for days, wasting 35% of potable water..."
              className="w-full p-4 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {problemText.length} characters • Mention current bottlenecks, location, or desired timelines if known
              </span>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 rounded bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Processing..." : "Generate Structured Challenge"}</span>
              </button>
            </div>
          </div>

          {/* AI Structured Results Preview & Editor */}
          {generatedChallenge && (
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Structured by AI
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Review and edit before setting baseline metrics</span>
                </div>
                <button
                  onClick={handleGenerate}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>

              {/* Title, Sector, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Challenge Title</label>
                  <input
                    type="text"
                    value={generatedChallenge.title || ""}
                    onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, title: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 font-semibold text-slate-900 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sector</label>
                  <input
                    type="text"
                    value={generatedChallenge.sector || ""}
                    onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, sector: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Location</label>
                  <input
                    type="text"
                    value={generatedChallenge.location || ""}
                    onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, location: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={generatedChallenge.budgetMin || 0}
                    onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, budgetMin: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={generatedChallenge.budgetMax || 0}
                    onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, budgetMax: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Formal Scope Description</label>
                <textarea
                  rows={3}
                  value={generatedChallenge.description || ""}
                  onChange={(e) => setGeneratedChallenge({ ...generatedChallenge, description: e.target.value })}
                  className="w-full p-3 text-sm rounded-lg border border-slate-300 text-slate-800 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>

              {/* 4 AI Suggested Measurable KPIs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Measurable KPIs Generated by AI ({generatedChallenge.kpis?.length || 0})</span>
                    </h3>
                    <p className="text-xs text-slate-500">Must sum to exactly 100% total evaluation weight</p>
                  </div>
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    calculateWeightSum() === 100 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    Total Weight: {calculateWeightSum()}%
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedChallenge.kpis?.map((kpi, idx) => (
                    <div key={kpi.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            KPI #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={kpi.title}
                            onChange={(e) => handleKPIChange(idx, "title", e.target.value)}
                            className="mt-1 w-full text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Weight (%)</label>
                            <input
                              type="number"
                              value={kpi.weight}
                              onChange={(e) => handleKPIChange(idx, "weight", Number(e.target.value))}
                              className="w-16 p-1 text-xs font-bold text-center border border-slate-300 rounded bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Unit of Measure</label>
                          <input
                            type="text"
                            value={kpi.unit}
                            onChange={(e) => handleKPIChange(idx, "unit", e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">AI Target Goal</label>
                          <input
                            type="number"
                            value={kpi.target}
                            onChange={(e) => handleKPIChange(idx, "target", Number(e.target.value))}
                            className="w-full p-2 border border-slate-200 rounded bg-white font-mono font-bold text-blue-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Direction</label>
                          <select
                            value={kpi.direction}
                            onChange={(e) => handleKPIChange(idx, "direction", e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded bg-white"
                          >
                            <option value="higher_is_better">Higher is better (Maximize)</option>
                            <option value="lower_is_better">Lower is better (Minimize)</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                        "{kpi.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Step CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
                >
                  <span>Continue to Baseline Entry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Baseline Entry */}
      {step === 2 && generatedChallenge && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in">
          {/* Prominent Educational Callout */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">Why Baseline Values are Mandatory</h4>
              <p className="text-xs text-amber-800 leading-relaxed mt-1">
                <strong>Baseline = Current performance before the startup solution is deployed.</strong><br />
                ProcureAI prevents government departments from evaluating technology on abstract hype. By specifying your existing operational numbers, the AI evaluation engine and field pilot telemetry can mathematically compute the true percentage improvement.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Enter Government Baseline Values for {generatedChallenge.title}
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {generatedChallenge.kpis?.map((kpi, idx) => (
                <div key={kpi.id || idx} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                        <h4 className="font-bold text-sm text-slate-900">{kpi.title}</h4>
                      </div>
                      <p className="text-xs text-blue-700 font-medium">
                        Baseline Question: {kpi.baselineQuestion || `What is the current ${kpi.unit} value in your department?`}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Target Goal: <strong>{kpi.target} {kpi.unit}</strong> ({kpi.direction.replace(/_/g, " ")})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                          Current Baseline
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="any"
                            value={kpi.baseline !== undefined ? kpi.baseline : ""}
                            onChange={(e) => handleKPIChange(idx, "baseline", Number(e.target.value))}
                            placeholder="e.g. 0.75"
                            className="w-24 p-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                          />
                          <span className="text-xs font-semibold text-slate-500">{kpi.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Back to Problem Structuring
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <span>Review Challenge Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Final Publish */}
      {step === 3 && generatedChallenge && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">Ready to Publish</span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{generatedChallenge.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Issued by: <strong>{currentUser?.organization}</strong> • Sector: <strong>{generatedChallenge.sector}</strong> • Location: <strong>{generatedChallenge.location}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
            {generatedChallenge.description}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pilot Budget Range</span>
              <p className="text-base font-bold text-slate-900">
                ₹ {(generatedChallenge.budgetMin! / 100000).toFixed(1)} Lakhs – ₹ {(generatedChallenge.budgetMax! / 100000).toFixed(1)} Lakhs
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contractual Pilot Duration</span>
              <p className="text-base font-bold text-slate-900">
                {generatedChallenge.timelineMonths || 3} Months Field Pilot
              </p>
            </div>
          </div>

          {/* KPI Summary Table */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3">Locked Evaluation KPIs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">KPI Name</th>
                    <th className="p-3">Current Baseline</th>
                    <th className="p-3">Target Goal</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {generatedChallenge.kpis?.map((kpi, idx) => (
                    <tr key={kpi.id || `review-kpi-${idx}`} className="bg-white">
                      <td className="p-3 font-semibold text-slate-900">{kpi.title}</td>
                      <td className="p-3 font-mono text-slate-700">{kpi.baseline} {kpi.unit}</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{kpi.target} {kpi.unit}</td>
                      <td className="p-3 font-bold text-slate-900">{kpi.weight}%</td>
                      <td className="p-3 capitalize text-slate-600">{kpi.direction.replace(/_/g, " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Back to Baselines
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4.5 py-2 rounded bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? "Publishing..." : "Publish Government Challenge"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
