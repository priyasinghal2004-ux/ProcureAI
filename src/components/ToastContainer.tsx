import React from "react";
import { useData } from "../context/DataContext.js";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        let borderClass = "border-blue-200 bg-blue-50/95";

        if (toast.type === "success") {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          borderClass = "border-emerald-200 bg-emerald-50/95 text-emerald-950";
        } else if (toast.type === "warning") {
          icon = <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          borderClass = "border-amber-200 bg-amber-50/95 text-amber-950";
        } else if (toast.type === "error") {
          icon = <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          borderClass = "border-rose-200 bg-rose-50/95 text-rose-950";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
