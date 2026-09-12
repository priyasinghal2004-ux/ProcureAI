import React from "react";
import { Pilot, ProcurementRecord } from "../../types.js";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  Printer,
  TrendingUp,
  MapPin,
  ArrowRight,
  Layers,
  ArrowLeft
} from "lucide-react";

interface ProcurementViewProps {
  pilot: Pilot;
  procurement: ProcurementRecord;
  onBackToDashboard: () => void;
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  pilot,
  procurement,
  onBackToDashboard,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-[#252525]">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD7CA]">
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#E8F3ED] text-[#3F7658] border border-[#C2DEC8] flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7658]" />
            <span>Official Public Procurement Sanction Issued</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#173B32] tracking-tight mt-1.5">
            Procurement Sanction & Scale-Up Plan
          </h1>
          <p className="text-xs text-[#6B6A63] mt-0.5">
            Empirical pilot performance successfully verified. Vendor transitioned to certified government supplier status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#DDD7CA] bg-[#FBF9F4] hover:bg-[#F5F1E8] text-[#252525] shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#6B6A63]" />
            <span>Print Sanction Order</span>
          </button>
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#173B32] hover:bg-[#112D26] text-white shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Telemetry</span>
          </button>
        </div>
      </div>

      {/* Official Government Procurement Certificate */}
      <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-7 shadow-xs relative overflow-hidden print:border-none print:shadow-none">
        <div className="text-center space-y-1.5 border-b border-[#DDD7CA] pb-5 mb-5">
          <div className="w-12 h-12 mx-auto rounded bg-[#F5F1E8] border border-[#DDD7CA] flex items-center justify-center text-[#173B32] shadow-xs mb-2">
            <Award className="w-6 h-6 text-[#173B32]" />
          </div>
          <p className="text-[10px] font-mono tracking-wider text-[#6B6A63] font-semibold uppercase">
            Government of Maharashtra • Department of Revenue & Disaster Management
          </p>
          <h2 className="text-xl font-bold text-[#173B32] tracking-tight">
            PUBLIC PROCUREMENT SANCTION ORDER
          </h2>
          <p className="text-xs font-mono text-[#6B6A63]">
            Sanction Order No: <strong className="text-[#173B32] font-semibold">{procurement.certificateId}</strong>
          </p>
        </div>

        {/* Certificate Body */}
        <div className="space-y-5 text-xs text-[#252525]">
          <p className="leading-relaxed text-xs text-center max-w-2xl mx-auto text-[#6B6A63]">
            This is to formally certify that <strong className="text-[#173B32] font-semibold">{procurement.startupName}</strong> has completed a rigorous 
            field trial for <strong className="text-[#173B32] font-semibold">"{pilot.challengeTitle}"</strong> under the 
            evidence-based public innovation framework.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded bg-[#F5F1E8] border border-[#DDD7CA]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">Awarded Vendor</span>
              <span className="font-semibold text-[#173B32] text-xs mt-0.5 block">{procurement.startupName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">Sanctioning Authority</span>
              <span className="font-semibold text-[#252525] text-xs mt-0.5 block">{procurement.department}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">Expansion Value</span>
              <span className="font-mono font-bold text-[#3F7658] text-xs mt-0.5 block">
                ₹ {(procurement.contractValue / 10000000).toFixed(2)} Crores
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6B6A63] block">Sanction Date</span>
              <span className="font-semibold text-[#252525] text-xs mt-0.5 block">
                {new Date(procurement.procurementDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#E8F3ED] border border-[#C2DEC8] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3F7658] shrink-0 mt-0.5" />
            <div className="text-xs text-[#173B32] leading-relaxed">
              <strong className="font-semibold">Verified Field Telemetry:</strong> During the field trial, the solution demonstrated 4.2-hour 
              early warning lead time (exceeding the contractual threshold) with 99.4% sensor availability 
              and zero false alarm incidents during torrential monsoon crest conditions in Kolhapur district.
            </div>
          </div>
        </div>

        {/* Certificate Signatures */}
        <div className="mt-8 pt-5 border-t border-[#DDD7CA] grid grid-cols-2 text-xs">
          <div>
            <p className="font-semibold text-[#173B32]">Dr. Rajesh Sharma, IAS</p>
            <p className="text-[#6B6A63] text-[11px]">District Collector & Magistrate, Kolhapur</p>
            <p className="text-[10px] text-[#6B6A63] font-mono mt-0.5">Digitally Signed via ProcureAI Portal</p>
          </div>
          <div className="text-right">
            <div className="inline-block border border-[#C2DEC8] rounded px-3 py-1.5 bg-[#E8F3ED] text-[#3F7658] text-[10px] font-semibold font-mono uppercase tracking-wider">
              GovTech Sanction Verified
            </div>
          </div>
        </div>
      </div>

      {/* Regional Scale-Up Roadmap */}
      <div className="bg-[#FBF9F4] rounded border border-[#DDD7CA] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-0.5">
              <Layers className="w-3.5 h-3.5 text-[#173B32]" />
              <span>Expansion Blueprint</span>
            </div>
            <h3 className="text-base font-bold text-[#173B32]">3-Phase Regional Scale-Up Plan</h3>
          </div>
          <span className="text-xs text-[#6B6A63] font-mono">Funded under SDRF Guidelines</span>
        </div>

        <div className="space-y-3">
          {procurement.scaleUpPlan.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded border border-[#DDD7CA] bg-[#FBF9F4] hover:bg-white transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#173B32] text-white font-mono text-[10px] font-semibold">
                    {step.phase}
                  </span>
                  <h4 className="font-semibold text-[#173B32] text-xs">{step.title}</h4>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="font-mono text-[#6B6A63] bg-[#F5F1E8] px-2 py-0.5 rounded border border-[#DDD7CA] text-[11px]">
                    {step.timeline}
                  </span>
                  <span className="font-mono font-semibold text-[#3F7658] bg-[#E8F3ED] px-2 py-0.5 rounded border border-[#C2DEC8] text-[11px]">
                    {step.estimatedBudget}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B6A63] leading-relaxed">{step.description}</p>

              <div className="pt-1 flex items-center gap-1.5 text-xs text-[#6B6A63]">
                <MapPin className="w-3 h-3 text-[#C96B4B]" />
                <span className="font-medium text-[#6B6A63]">Coverage:</span>
                <span className="font-medium text-[#252525]">{step.targetCoverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
