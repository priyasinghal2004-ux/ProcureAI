import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { UserRole } from "../../types.js";
import {
  X,
  Shield,
  Building2,
  Rocket,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  Sparkles
} from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { login, register, demoUsers } = useAuth();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [role, setRole] = useState<UserRole>("government");

  const [email, setEmail] = useState("rajesh.sharma@maharashtra.gov.in");
  const [password, setPassword] = useState("demo123");

  // Registration state
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [dpiitNumber, setDpiitNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handle1ClickDemo = async (targetRole: UserRole) => {
    setIsSubmitting(true);
    try {
      const demoUser = demoUsers.find((u) => u.role === targetRole) || demoUsers[0];
      await login(demoUser.email, targetRole);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, role);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        role,
        organization,
        dpiitNumber: role === "startup" ? dpiitNumber : undefined,
      });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 text-slate-900">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">ProcureAI Sign In</h2>
              <p className="text-xs text-slate-400">GovTech Innovation & Procurement Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Section (Ideal for Evaluators & SIH Judges) */}
        <div className="p-5 bg-blue-50/70 border-b border-blue-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Access (1-Click Login)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handle1ClickDemo("government")}
              disabled={isSubmitting}
              className="p-2.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 text-blue-950 text-xs font-bold shadow-sm text-center flex flex-col items-center gap-1 transition-all"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Government</span>
            </button>

            <button
              onClick={() => handle1ClickDemo("startup")}
              disabled={isSubmitting}
              className="p-2.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-950 text-xs font-bold shadow-sm text-center flex flex-col items-center gap-1 transition-all"
            >
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>Startup</span>
            </button>

            <button
              onClick={() => handle1ClickDemo("admin")}
              disabled={isSubmitting}
              className="p-2.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 text-purple-950 text-xs font-bold shadow-sm text-center flex flex-col items-center gap-1 transition-all"
            >
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Tabs: Sign In / Register */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTab("signin")}
              className={`py-2 rounded-lg transition-all ${
                tab === "signin" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`py-2 rounded-lg transition-all ${
                tab === "register" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register New Account
            </button>
          </div>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["government", "startup", "admin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        if (r === "government") setEmail("rajesh.sharma@maharashtra.gov.in");
                        if (r === "startup") setEmail("amit@aquasense.ai");
                        if (r === "admin") setEmail("admin@procureai.gov.in");
                      }}
                      className={`py-2 rounded-lg font-bold capitalize transition-all border ${
                        role === r
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Email Address</label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300 bg-white">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Password</label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300 bg-white">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign In to ProcureAI"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="government">Government Department / Authority</option>
                  <option value="startup">Startup Innovator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Organization / Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Municipal Corporation"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {role === "startup" && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    DPIIT Recognition Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIPP-99210-MH"
                    value={dpiitNumber}
                    onChange={(e) => setDpiitNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? "Registering..." : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
