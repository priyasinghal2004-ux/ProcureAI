import React, { useState, useEffect } from "react";
import { Challenge, StartupApplication, KPIClaim } from "../../types.js";
import { useAuth } from "../../context/AuthContext.js";
import { useData } from "../../context/DataContext.js";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Target,
  UploadCloud,
  Send,
  AlertCircle,
  Paperclip,
  Plus,
  Trash2,
  ArrowRight
} from "lucide-react";

interface ChallengeDetailApplyProps {
  challenge: Challenge;
  onBack: () => void;
  onSuccess: (appId: string) => void;
  onViewApplication?: (appId: string) => void;
}

export const ChallengeDetailApply: React.FC<ChallengeDetailApplyProps> = ({
  challenge,
  onBack,
  onSuccess,
  onViewApplication
}) => {
  const { currentUser } = useAuth();
  const { applications, submitApplication, addToast } = useData();

  // Check duplicate
  const existingApp = applications.find(
    (app) =>
      app.challengeId === challenge.id &&
      (app.startupId === currentUser?.id ||
        (currentUser?.organization &&
          app.startupName?.toLowerCase() === currentUser.organization.toLowerCase()))
  );

  // Derive initial values based on the specific challenge
  const getDefaultSolution = (chl: Challenge) => {
    const id = chl.id.toLowerCase();
    const title = chl.title.toLowerCase();

    if (id.includes("flood") || title.includes("flood")) {
      return {
        title: "HydroPulse: Real-Time Ultrasonic River Gauging & Mesh Siren Network",
        desc: "HydroPulse deploys solar-powered ultrasonic radar river stage gauges paired with a local LoRa mesh network. When river levels exceed critical thresholds, high-decibel solar sirens sound directly in flood-threatened habitations without relying on cellular networks.",
        tech: "Dual-frequency ultrasonic level sensing with edge hydrological flow modeling. Redundant LoRaWAN + Satellite uplink ensuring zero single points of failure during cyclonic storms.",
        stack: "IoT Sensors, LoRaWAN, Edge Hydrology AI, Solar Sirens, NIC SMS Gateway",
        cost: Math.min(chl.budgetMax, Math.max(chl.budgetMin, 2800000)),
        breakdown: "₹14L Sensor & Solar Nodes, ₹8L Edge AI Gateway, ₹6L Field Calibration & Deployment SLA",
        weeks: 8,
        projects: "Krishna River Basin Stage Sensing (Sangli 2024), Godavari Hydrological Monitoring",
        caseStudies: "Deployed 18 sensors along Krishna basin with zero hardware failures over 120 days of monsoon rains.",
        exp: "4+ years engineering ruggedized IP68 sensor telemetry for Indian public disaster authorities."
      };
    } else if (id.includes("waste") || title.includes("waste")) {
      return {
        title: "CleanRoute AI: Edge Computer Vision Bin Auditing & Dynamic Route Dispatch",
        desc: "CleanRoute AI equips municipal compactor trucks with edge computer vision cameras to automatically audit source segregation at pickup points, while dynamically re-routing collection vehicles based on real-time bin fill telemetry.",
        tech: "Embedded edge neural networks (YOLOv8-Nano) on truck cameras for contamination identification. Graph optimization heuristics on GIS road layers to minimize dead kilometers.",
        stack: "Edge AI Cameras, OpenCV, GPS Telemetry, Dynamic Vehicle Routing APIs, Ward SLA Dashboard",
        cost: Math.min(chl.budgetMax, Math.max(chl.budgetMin, 2400000)),
        breakdown: "₹10L AI On-Board Cameras, ₹8L Routing Software & Telematics, ₹6L Ward Inspector Mobile App & Training",
        weeks: 10,
        projects: "Nagpur Smart City Pilot (4 wards), Indore Sanitation Contamination Pilot",
        caseStudies: "Reduced dry/wet cross-contamination by 62% across 40 daily vehicle routes in urban municipal trials.",
        exp: "Team of 12 machine learning and GIS logistics engineers with 2 published IEEE patents."
      };
    } else if (id.includes("cold") || id.includes("agro") || title.includes("cold") || title.includes("storage")) {
      return {
        title: "SolarKisan Grid: Off-Grid Micro Cold Pods with Real-Time FPC Price Telemetry",
        desc: "SolarKisan deploys modular off-grid solar-powered cold storage pods (4°C continuous via PCM thermal storage) directly at farm-gate cluster locations, combined with IoT shelf-life sensors and a farmer pricing link.",
        tech: "Phase Change Material (PCM) thermal storage coupled with LiFePO4 solar inverters, ensuring 48h thermal buffer without grid or diesel backup. Real-time ethylene and temp/humidity telemetry.",
        stack: "PCM Thermal Battery, Micro Solar Inverters, LoRaWAN Gas & Temp Telemetry, FPC Market Linkage App",
        cost: Math.min(chl.budgetMax, Math.max(chl.budgetMin, 3200000)),
        breakdown: "₹18L PCM Thermal Pods & Solar Panels, ₹8L Telemetry & Sensor Mesh, ₹6L FPC Training & Maintenance",
        weeks: 12,
        projects: "Baramati Horticulture Pilot (Grape & Pomegranate), Jalgaon Banana Cold Mesh",
        caseStudies: "Prevented 24 metric tons of perishable tomato rotting during heatwaves across 3 FPC harvest clusters.",
        exp: "DPIIT AgriTech awardee with 5 patents in phase change thermal storage for rural off-grid micro-utilities."
      };
    } else {
      return {
        title: `${chl.title} - Integrated Public Tech Solution`,
        desc: `Targeted public sector technological prototype designed specifically to resolve ${chl.sector} challenges for ${chl.department}.`,
        tech: "Modular edge sensor telemetry, cloud-audited telemetry pipeline, and role-based administrative dashboards.",
        stack: "Edge Telemetry, IoT, Cloud API, Audit Trails",
        cost: Math.round((chl.budgetMin + chl.budgetMax) / 2),
        breakdown: "60% Hardware & Edge Infrastructure, 25% Software & Telemetry, 15% Field Operations & SLA",
        weeks: 8,
        projects: "State public sector innovation trials in Maharashtra and Karnataka.",
        caseStudies: "Delivered verified KPI improvements in 2 municipal pilot trials with certified compliance.",
        exp: "Specialized GovTech engineering firm registered under Startup India / DPIIT."
      };
    }
  };

  const defaults = getDefaultSolution(challenge);

  // Section 1: Company Information
  const [startupName, setStartupName] = useState(currentUser?.organization || "AquaSense Technologies Pvt Ltd");
  const [dpiitNumber, setDpiitNumber] = useState(currentUser?.dpiitNumber || "DPIIT-88219-MH");
  const [companyAgeYears, setCompanyAgeYears] = useState(3);
  const [teamSize, setTeamSize] = useState(14);
  const [founderName, setFounderName] = useState(currentUser?.name || "Dr. Amit Kulkarni");
  const [email, setEmail] = useState(currentUser?.email || "amit@aquasense.ai");
  const [phone, setPhone] = useState("+91 98201 44321");

  // Section 2: Proposed Solution
  const [solutionTitle, setSolutionTitle] = useState(defaults.title);
  const [description, setDescription] = useState(defaults.desc);
  const [technicalApproach, setTechnicalApproach] = useState(defaults.tech);
  const [technologiesUsed, setTechnologiesUsed] = useState(defaults.stack);

  // Section 3: Cost & Timeline
  const [costINR, setCostINR] = useState(defaults.cost);
  const [costBreakdown, setCostBreakdown] = useState(defaults.breakdown);
  const [timelineWeeks, setTimelineWeeks] = useState(defaults.weeks);

  // Section 4: Past Experience
  const [pastProjects, setPastProjects] = useState(defaults.projects);
  const [caseStudies, setCaseStudies] = useState(defaults.caseStudies);
  const [relevantExperience, setRelevantExperience] = useState(defaults.exp);

  // Section 5: KPI Claims (dynamically mapped from challenge.kpis)
  const [kpiClaims, setKpiClaims] = useState<KPIClaim[]>([]);

  // Section 6: Verification Documents
  const [documents, setDocuments] = useState<string[]>([
    "DPIIT_Recognition_Certificate.pdf",
    "Technical_Architecture_Diagram.pdf",
    "Third_Party_Lab_Test_Report.pdf",
    "Audited_Balance_Sheet_FY24.pdf"
  ]);
  const [newDocName, setNewDocName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Re-sync form state when challenge changes
  useEffect(() => {
    const d = getDefaultSolution(challenge);
    setSolutionTitle(d.title);
    setDescription(d.desc);
    setTechnicalApproach(d.tech);
    setTechnologiesUsed(d.stack);
    setCostINR(d.cost);
    setCostBreakdown(d.breakdown);
    setTimelineWeeks(d.weeks);
    setPastProjects(d.projects);
    setCaseStudies(d.caseStudies);
    setRelevantExperience(d.exp);

    // Initialize KPI claims strictly from challenge.kpis
    setKpiClaims(
      challenge.kpis.map((kpi) => {
        // Formulate a claimed value that beats or meets target
        let claimedVal: number | string = kpi.target;
        if (typeof kpi.target === "number") {
          if (kpi.direction === "higher") {
            claimedVal = Number((kpi.target * 1.08).toFixed(1));
          } else {
            claimedVal = Number((kpi.target * 0.85).toFixed(1));
          }
        }

        return {
          kpiId: kpi.id,
          kpiTitle: kpi.title,
          target: kpi.target,
          baseline: kpi.baseline,
          claimedValue: claimedVal,
          unit: kpi.unit,
          howAchieved: `Achieved using field-proven engineering methods and calibrated algorithms optimized for ${challenge.sector.toLowerCase()}.`,
          testedIn: "real_world",
          evidenceDocName: `${kpi.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_audit_report.pdf`,
          evidenceSummary: `Verified through field test runs with certified telemetry logs.`
        };
      })
    );
    setValidationError(null);
  }, [challenge.id]);

  const handleClaimChange = (index: number, field: keyof KPIClaim, val: any) => {
    const updated = [...kpiClaims];
    updated[index] = { ...updated[index], [field]: val };
    setKpiClaims(updated);
  };

  const handleAddDoc = () => {
    if (!newDocName.trim()) return;
    const clean = newDocName.trim().endsWith(".pdf") ? newDocName.trim() : `${newDocName.trim()}.pdf`;
    setDocuments([...documents, clean]);
    setNewDocName("");
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Duplicate check
    if (existingApp) {
      setValidationError("You have already applied to this challenge. Duplicate applications are not allowed.");
      addToast({
        type: "warning",
        title: "Duplicate Application",
        message: "You have already applied to this challenge."
      });
      return;
    }

    // Required fields validation
    if (!startupName.trim()) {
      setValidationError("Applicant entity legal name is required.");
      return;
    }
    if (!dpiitNumber.trim()) {
      setValidationError("DPIIT recognition number is required.");
      return;
    }
    if (!solutionTitle.trim()) {
      setValidationError("Solution title is required.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Solution executive overview is required.");
      return;
    }
    if (!technicalApproach.trim()) {
      setValidationError("Technical architecture description is required.");
      return;
    }
    if (Number(costINR) <= 0) {
      setValidationError("Proposed pilot budget must be greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<StartupApplication> = {
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        startupId: currentUser?.id || `strt-${Date.now()}`,
        startupName: startupName.trim(),
        dpiitNumber: dpiitNumber.trim(),
        founderName: founderName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyAgeYears: Number(companyAgeYears) || 3,
        teamSize: Number(teamSize) || 12,
        solutionTitle: solutionTitle.trim(),
        description: description.trim(),
        solutionDescription: description.trim(),
        technicalApproach: technicalApproach.trim(),
        technologiesUsed: typeof technologiesUsed === "string" ? technologiesUsed.split(",").map((s) => s.trim()).filter(Boolean) : technologiesUsed,
        costINR: Number(costINR),
        totalCost: Number(costINR),
        costBreakdown,
        timelineWeeks: Number(timelineWeeks),
        implementationTimelineWeeks: Number(timelineWeeks),
        pastProjects,
        caseStudies,
        relevantExperience,
        kpiClaims,
        documents,
        status: "submitted"
      };

      const created = await submitApplication(payload);
      addToast({
        type: "success",
        title: "Application Submitted Successfully",
        message: `Your proposal for "${challenge.title}" is now recorded under 'Submitted'.`
      });
      onSuccess(created.id);
    } catch (err: any) {
      const msg = err.message || "Failed to submit application";
      setValidationError(msg);
      addToast({
        type: "error",
        title: "Submission Error",
        message: msg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-left text-[#252525]">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6A63] hover:text-[#173B32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenge Details</span>
        </button>

        <span className="text-xs text-[#6B6A63] font-mono">
          Challenge ID: {challenge.id}
        </span>
      </div>

      {/* Duplicate Check Warning */}
      {existingApp && (
        <div className="bg-[#FBF9F4] border-2 border-[#B7793E] rounded p-4 text-xs space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#B7793E] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#252525] text-sm">
                  You have already applied to this challenge.
                </h4>
                <p className="text-[#6B6A63] mt-0.5">
                  An existing application <strong className="text-[#252525]">"{existingApp.solutionTitle}"</strong> was submitted on{" "}
                  {existingApp.submittedAt ? new Date(existingApp.submittedAt).toLocaleDateString("en-IN") : "Recent"}.
                  You cannot submit duplicate applications for the same challenge.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onViewApplication) {
                  onViewApplication(existingApp.id);
                }
              }}
              className="px-3.5 py-1.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View My Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Challenge Reference Card */}
      <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded bg-[#F5F1E8] text-[#173B32] text-[10px] font-semibold uppercase tracking-wider border border-[#DDD7CA]">
            {challenge.sector}
          </span>
          <span className="text-xs text-[#6B6A63] font-medium">
            Authority: <strong className="text-[#252525]">{challenge.department}</strong>
          </span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-[#173B32] leading-snug">
          Proposal Submission: {challenge.title}
        </h1>
        <p className="text-xs text-[#6B6A63] leading-relaxed line-clamp-2">
          {challenge.description}
        </p>

        <div className="flex flex-wrap gap-5 pt-3 border-t border-[#DDD7CA]/70 text-xs text-[#6B6A63]">
          <div>
            Location: <span className="text-[#252525] font-medium">{challenge.location}</span>
          </div>
          <div>
            Approved Budget Envelope:{" "}
            <span className="text-[#173B32] font-semibold font-mono">
              ₹{(challenge.budgetMin / 100000).toFixed(1)}L – ₹{(challenge.budgetMax / 100000).toFixed(1)}L
            </span>
          </div>
          <div>
            Contractual Targets:{" "}
            <span className="text-[#173B32] font-semibold">{challenge.kpis.length} Measurable KPIs</span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 rounded bg-[#FDF2F2] border border-[#A65345]/30 text-xs text-[#A65345] flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Company & Legal Information */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DDD7CA]/70 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-[#173B32] text-white flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            <h3 className="font-bold text-sm text-[#173B32]">Applicant Entity & Founder Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Applicant Legal Entity Name *
              </label>
              <input
                type="text"
                required
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                DPIIT Recognition Number *
              </label>
              <input
                type="text"
                required
                value={dpiitNumber}
                onChange={(e) => setDpiitNumber(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs outline-none focus:border-[#173B32] font-mono text-[#173B32] font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Company Age (Years)
              </label>
              <input
                type="number"
                min="0"
                value={companyAgeYears}
                onChange={(e) => setCompanyAgeYears(Number(e.target.value))}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Technical Core Team Size
              </label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Founder / Primary Lead
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Official Communication Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Proposed Technical Solution */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DDD7CA]/70 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-[#173B32] text-white flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            <h3 className="font-bold text-sm text-[#173B32]">Proposed Technical Solution</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Solution Title *
              </label>
              <input
                type="text"
                required
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                className="w-full p-2.5 font-medium border border-[#DDD7CA] rounded bg-white text-xs text-[#173B32] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Solution Executive Overview *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Technical Architecture & Deployment Method *
              </label>
              <textarea
                rows={3}
                required
                value={technicalApproach}
                onChange={(e) => setTechnicalApproach(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Core Technologies, Protocols & Standards
              </label>
              <input
                type="text"
                value={technologiesUsed}
                onChange={(e) => setTechnologiesUsed(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Cost & Timeline */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DDD7CA]/70 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-[#173B32] text-white flex items-center justify-center text-[11px] font-bold">
              3
            </span>
            <h3 className="font-bold text-sm text-[#173B32]">Trial Commercials & Timeline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Proposed Pilot Budget (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={costINR}
                onChange={(e) => setCostINR(Number(e.target.value))}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs outline-none focus:border-[#173B32] font-mono font-semibold text-[#173B32]"
              />
              <span className="text-[10px] text-[#6B6A63] mt-1 block">
                Challenge approved ceiling: ₹{(challenge.budgetMin / 100000).toFixed(1)}L – ₹{(challenge.budgetMax / 100000).toFixed(1)}L
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Deployment Lead Time (Weeks) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs outline-none focus:border-[#173B32] font-mono font-semibold text-[#252525]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Itemized Cost Breakdown
              </label>
              <input
                type="text"
                value={costBreakdown}
                onChange={(e) => setCostBreakdown(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Past Experience & Track Record */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DDD7CA]/70 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-[#173B32] text-white flex items-center justify-center text-[11px] font-bold">
              4
            </span>
            <h3 className="font-bold text-sm text-[#173B32]">Past Experience & Technical Reliability</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Relevant Past Deployments & Pilot Installations
              </label>
              <input
                type="text"
                value={pastProjects}
                onChange={(e) => setPastProjects(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Summary of Field Results & Reliability Proof
              </label>
              <textarea
                rows={2}
                value={caseStudies}
                onChange={(e) => setCaseStudies(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                Domain Experience & Certifications
              </label>
              <input
                type="text"
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                className="w-full p-2.5 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Contractual KPI Claims & Evidence */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-4">
          <div className="border-b border-[#DDD7CA]/70 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#173B32] text-white flex items-center justify-center text-[11px] font-bold">
                  5
                </span>
                <h3 className="font-bold text-sm text-[#173B32]">Contractual KPI Claims & Evidence</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#173B32] bg-[#F5F1E8] border border-[#DDD7CA]">
                40% Evaluation Weight
              </span>
            </div>
            <p className="text-xs text-[#6B6A63] mt-1">
              State your claimed metric for each public challenge target. Claims are cross-referenced with your technical proof files during evaluation.
            </p>
          </div>

          <div className="space-y-4">
            {kpiClaims.map((claim, idx) => {
              const matchingKpi = challenge.kpis.find((k) => k.id === claim.kpiId);
              return (
                <div
                  key={claim.kpiId || idx}
                  className="p-4 rounded border border-[#DDD7CA] bg-white space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6A63]">
                        Target Metric #{idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-[#173B32] mt-0.5">{claim.kpiTitle}</h4>
                      <p className="text-[11px] text-[#6B6A63] font-mono mt-0.5">
                        Government Target: <strong className="text-[#173B32]">{matchingKpi?.target} {claim.unit}</strong>{" "}
                        {matchingKpi?.baseline !== undefined && `(Current Baseline: ${matchingKpi.baseline} ${claim.unit})`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                        Claimed Performance Value ({claim.unit}) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={claim.claimedValue}
                        onChange={(e) => handleClaimChange(idx, "claimedValue", Number(e.target.value))}
                        className="w-full p-2 border border-[#DDD7CA] rounded bg-[#F5F1E8] font-mono font-bold text-[#173B32]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                        Verification Testing Environment
                      </label>
                      <select
                        value={claim.testedIn}
                        onChange={(e) => handleClaimChange(idx, "testedIn", e.target.value)}
                        className="w-full p-2 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] cursor-pointer"
                      >
                        <option value="real_world">Field Deployment / Real-World Trials</option>
                        <option value="lab">Controlled Laboratory Benchmark</option>
                        <option value="theoretical">Theoretical Simulation & Engineering Model</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                        Technical Method for Target Achievement *
                      </label>
                      <input
                        type="text"
                        required
                        value={claim.howAchieved}
                        onChange={(e) => handleClaimChange(idx, "howAchieved", e.target.value)}
                        className="w-full p-2 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#252525] uppercase text-[10px] tracking-wider mb-1">
                        Cited Evidence File Reference / Benchmark Data *
                      </label>
                      <input
                        type="text"
                        required
                        value={claim.evidenceSummary}
                        onChange={(e) => handleClaimChange(idx, "evidenceSummary", e.target.value)}
                        className="w-full p-2 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: Supporting Documents */}
        <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#173B32] flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#C96B4B]" />
              <span>Attached Verification Documentation</span>
            </h3>
            <span className="text-xs text-[#6B6A63] font-mono">{documents.length} Files Attached</span>
          </div>

          <div className="divide-y divide-[#DDD7CA]/70 border border-[#DDD7CA] rounded overflow-hidden bg-white text-xs">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#252525]">
                  <Paperclip className="w-3.5 h-3.5 text-[#6B6A63]" />
                  <span className="font-mono text-xs">{doc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[#3F7658] bg-[#F5F1E8] border border-[#DDD7CA] px-2 py-0.5 rounded">
                    Verified PDF
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(idx)}
                    className="p-1 text-[#6B6A63] hover:text-[#A65345] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom document */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="e.g. Field_Validation_Test_Result_2024.pdf"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="flex-1 p-2 border border-[#DDD7CA] rounded bg-white text-xs text-[#252525] outline-none focus:border-[#173B32]"
            />
            <button
              type="button"
              onClick={handleAddDoc}
              className="px-3 py-2 rounded bg-[#F5F1E8] hover:bg-[#E8E3D9] text-[#173B32] border border-[#DDD7CA] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DDD7CA]">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-medium text-[#252525] hover:bg-[#F5F1E8] bg-white rounded border border-[#DDD7CA] cursor-pointer transition-colors"
          >
            Cancel
          </button>

          {existingApp ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#B7793E] font-medium">
                Already submitted for this challenge.
              </span>
              <button
                type="button"
                onClick={() => onViewApplication && onViewApplication(existingApp.id)}
                className="px-4 py-2 rounded bg-[#173B32] hover:bg-[#112D26] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                View My Application
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded bg-[#173B32] hover:bg-[#112D26] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
