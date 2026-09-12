import React from "react";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStartDemo?: (role?: "government" | "startup" | "admin") => void;
  onOpenAuth?: () => void;
  onEnterPortal?: () => void;
  onSelectRole?: (role?: "government" | "startup" | "admin") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onOpenAuth,
  onEnterPortal,
  onSelectRole,
}) => {
  const handleExplore = (role: "government" | "startup" | "admin" = "government") => {
    if (typeof onStartDemo === "function") {
      onStartDemo(role);
    } else if (typeof onSelectRole === "function") {
      onSelectRole(role);
    } else if (typeof onEnterPortal === "function") {
      onEnterPortal();
    }
  };

  const steps = [
    {
      num: "01",
      title: "Define the problem",
      desc: "Convert administrative civic challenges into structured tenders with explicit KPI baselines."
    },
    {
      num: "02",
      title: "Find the right startup",
      desc: "Evaluate technical capability, cost credibility, and claim consistency using weighted criteria."
    },
    {
      num: "03",
      title: "Run a measurable pilot",
      desc: "Sanction 3 to 6-month field trials with contractually locked performance targets."
    },
    {
      num: "04",
      title: "Verify performance",
      desc: "Cross-examine independent field officer observations against vendor telemetry data."
    },
    {
      num: "05",
      title: "Procure with confidence",
      desc: "Issue procurement sanctions backed by empirical field verification and audit trails."
    }
  ];

  return (
    <div className="bg-[#F5F7FA] text-[#172033]">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-20 text-center relative">
        {/* Subtle top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#163A5F] via-[#2563EB] to-[#0F766E] opacity-70"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF4FF] border border-blue-100 text-[11px] font-semibold text-[#163A5F] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
            <span>National GovTech Procurement Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172033] tracking-tight leading-tight max-w-2xl mx-auto">
            From Government Problems to Proven Solutions.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-4 max-w-xl mx-auto leading-relaxed">
            A government procurement system that turns unformed public problems into measurable challenges, evaluates startup proposals, verifies field pilot telemetry, and enables evidence-based procurement.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => handleExplore("government")}
              className="px-4.5 py-2 rounded bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore the Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleExplore("startup")}
              className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50 text-[#172033] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Startup Vendor View
            </button>
          </div>

          {/* Simple Clean Product Mockup */}
          <div className="mt-12 border border-slate-200/90 rounded bg-white text-left shadow-xs overflow-hidden">
            {/* Window chrome header */}
            <div className="px-4 py-2.5 bg-[#F5F7FA] border-b border-slate-200 flex items-center justify-between text-[11px] text-[#64748B] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                <span className="ml-2 font-sans font-medium text-[#163A5F]">Procurement Record #MH-2026-DM-01</span>
              </div>
              <span className="text-slate-600">Contract Status: ACTIVE_PILOT • Month 3 of 4</span>
            </div>

            {/* Content mockup table */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-[#0F766E] uppercase font-semibold tracking-wider">Field Trial Contract</p>
                  <p className="text-sm font-bold text-[#172033]">Kolhapur District Disaster Management • AquaSense Technologies</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-medium text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Dual Telemetry Verified
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="text-[#64748B] border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="py-2">Metric</th>
                      <th className="py-2 text-center">Baseline</th>
                      <th className="py-2 text-center">Locked Target</th>
                      <th className="py-2 text-center">Gov Verified</th>
                      <th className="py-2 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#172033] text-[11px]">
                    <tr>
                      <td className="py-2.5 font-sans font-medium">Early Warning Lead Time</td>
                      <td className="py-2.5 text-center text-[#64748B]">0.75 Hours</td>
                      <td className="py-2.5 text-center font-semibold text-[#163A5F]">4.0 Hours</td>
                      <td className="py-2.5 text-center text-[#172033] font-semibold">4.1 Hours</td>
                      <td className="py-2.5 text-right font-semibold text-[#15803D]">Target Met</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium">Telemetry Sensor Uptime</td>
                      <td className="py-2.5 text-center text-[#64748B]">85.0 %</td>
                      <td className="py-2.5 text-center font-semibold text-[#163A5F]">98.0 %</td>
                      <td className="py-2.5 text-center text-[#172033] font-semibold">99.4 %</td>
                      <td className="py-2.5 text-right font-semibold text-[#15803D]">Target Met</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium">False Positive Alarm Rate</td>
                      <td className="py-2.5 text-center text-[#64748B]">12.0 %</td>
                      <td className="py-2.5 text-center font-semibold text-[#163A5F]">&lt; 2.0 %</td>
                      <td className="py-2.5 text-center text-[#172033] font-semibold">0.0 %</td>
                      <td className="py-2.5 text-right font-semibold text-[#15803D]">Target Met</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ProcureAI Works Section */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-left">
            <p className="text-xs uppercase font-semibold text-[#0F766E] tracking-wider">Methodology</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight mt-1">
              How ProcureAI Works
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white rounded border px-5">
            {steps.map((step) => (
              <div key={step.num} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-left">
                <div className="flex items-baseline gap-3 sm:w-1/3">
                  <span className="font-mono text-xs text-[#2563EB] font-bold">{step.num}</span>
                  <span className="text-sm font-semibold text-[#172033]">{step.title}</span>
                </div>
                <div className="sm:w-2/3 text-xs text-[#64748B] leading-relaxed">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Row with Restrained Colors */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="border-l-2 border-[#163A5F] pl-3">
              <p className="text-2xl font-bold text-[#163A5F] font-mono tracking-tight">₹12.4 Cr</p>
              <p className="text-xs text-[#64748B] mt-0.5">Procurement Sanctioned</p>
            </div>

            <div className="border-l-2 border-[#15803D] pl-3">
              <p className="text-2xl font-bold text-[#15803D] font-mono tracking-tight">48</p>
              <p className="text-xs text-[#64748B] mt-0.5">Field Pilots Verified</p>
            </div>

            <div className="border-l-2 border-[#2563EB] pl-3">
              <p className="text-2xl font-bold text-[#2563EB] font-mono tracking-tight">84%</p>
              <p className="text-xs text-[#64748B] mt-0.5">Faster Evaluation Cycle</p>
            </div>

            <div className="border-l-2 border-[#0F766E] pl-3">
              <p className="text-2xl font-bold text-[#0F766E] font-mono tracking-tight">0</p>
              <p className="text-xs text-[#64748B] mt-0.5">Discrepancy Inconsistencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-xs text-[#64748B] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#163A5F]">Procure<span className="text-[#2563EB]">AI</span></span>
            <span>• Institutional Public Procurement Architecture</span>
          </div>
          <span>Conforms to National Public Procurement & DPIIT Norms</span>
        </div>
      </footer>
    </div>
  );
};
