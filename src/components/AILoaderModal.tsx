import React from "react";
import { Loader2, ShieldCheck, FileCheck2 } from "lucide-react";
import { useData } from "../context/DataContext.js";

export const AILoaderModal: React.FC = () => {
  const { aiLoadingMessage } = useData();

  if (!aiLoadingMessage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-6 max-w-sm w-full mx-4 text-center">
        {/* Minimal Spinner */}
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-slate-800 animate-spin" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 uppercase tracking-wider mb-2">
          <span>Automated Evaluation</span>
        </div>

        <h3 className="text-sm font-bold text-slate-950 mb-1">Processing Assessment</h3>
        <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
          {aiLoadingMessage}
        </p>

        {/* Audit footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            Empirical Scoring
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-slate-400" />
            Audit Logged
          </span>
        </div>
      </div>
    </div>
  );
};
