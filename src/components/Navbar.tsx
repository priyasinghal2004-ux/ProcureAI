import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useData } from "../context/DataContext.js";
import {
  ChevronDown,
  RotateCcw,
  LogOut,
  User,
  SlidersHorizontal
} from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuthModal }) => {
  const { currentUser, role, quickSwitchRole, logout } = useAuth();
  const { resetAllData } = useData();
  const [profileOpen, setProfileOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Derive breadcrumb text
  const getBreadcrumb = () => {
    if (currentView === "landing") return "System Overview";
    if (currentView === "gov-dashboard" || currentView === "dashboard") return "Government / Dashboard";
    if (currentView === "create-challenge") return "Government / Create Challenge";
    if (currentView === "my-challenges" || currentView === "challenges") return "Government / Challenges";
    if (currentView === "applications") return "Government / Startup Evaluation";
    if (currentView === "pilots" || currentView === "my-pilots" || currentView === "kpi-tracking") return "Field Trials / Telemetry";
    if (currentView === "reports") return "Audit Reports";
    if (currentView === "startup-dashboard") return "Vendor Portal / Dashboard";
    if (currentView === "discover-challenges") return "Vendor Portal / Challenges";
    if (currentView === "challenge-detail") return "Vendor Portal / Challenge Details";
    if (currentView === "apply-challenge") return "Vendor Portal / Submit Proposal";
    if (currentView === "my-applications") return "Vendor Portal / Applications";
    if (currentView === "profile") return "Account Profile";
    if (currentView === "admin") return "System Administration";
    return "Portal";
  };

  return (
    <header className="bg-[#FBF9F4] border-b border-[#DDD7CA] text-[#252525] sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          {/* Left: Brand & Quiet Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate(currentUser ? "dashboard" : "landing")}
              className="font-bold text-base tracking-tight font-sans cursor-pointer flex items-center gap-1"
            >
              <span className="text-[#173B32]">ProcureAI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C96B4B] ml-0.5"></span>
            </button>

            <span className="text-[#DDD7CA]">/</span>

            <span className="text-xs text-[#6B6A63] font-medium truncate max-w-[200px] sm:max-w-none">
              {getBreadcrumb()}
            </span>
          </div>

          {/* Right: Demo Controls (discrete) & User Profile */}
          <div className="flex items-center gap-3">
            {/* Discreet Demo Controls Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setDemoMenuOpen(!demoMenuOpen);
                  setProfileOpen(false);
                }}
                className="px-2.5 py-1 rounded text-[11px] font-medium text-[#6B6A63] hover:text-[#252525] hover:bg-[#F5F1E8] border border-[#DDD7CA] bg-[#FBF9F4] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Demo environment settings"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#6B6A63]" />
                <span className="hidden sm:inline">Demo Controls</span>
                <ChevronDown className="w-3 h-3 text-[#6B6A63]" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-[#FBF9F4] rounded border border-[#DDD7CA] shadow-md p-2 z-50 text-xs">
                  <div className="px-2 py-1 border-b border-[#DDD7CA]/70 mb-1">
                    <p className="text-[10px] uppercase font-semibold text-[#6B6A63] tracking-wider">Switch Persona</p>
                  </div>
                  <div className="space-y-0.5 mb-2">
                    <button
                      onClick={() => {
                        quickSwitchRole("government");
                        setDemoMenuOpen(false);
                        onNavigate("gov-dashboard");
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        role === "government" ? "bg-[#F5F1E8] font-bold text-[#173B32] border border-[#DDD7CA]" : "text-[#6B6A63] hover:bg-[#F5F1E8]/70"
                      }`}
                    >
                      <span>Government Officer</span>
                      {role === "government" && <span className="text-[10px] text-[#173B32]">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        quickSwitchRole("startup");
                        setDemoMenuOpen(false);
                        onNavigate("startup-dashboard");
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        role === "startup" ? "bg-[#F5F1E8] font-bold text-[#173B32] border border-[#DDD7CA]" : "text-[#6B6A63] hover:bg-[#F5F1E8]/70"
                      }`}
                    >
                      <span>Startup / Vendor</span>
                      {role === "startup" && <span className="text-[10px] text-[#173B32]">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        quickSwitchRole("admin");
                        setDemoMenuOpen(false);
                        onNavigate("admin");
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        role === "admin" ? "bg-[#F5F1E8] font-bold text-[#173B32] border border-[#DDD7CA]" : "text-[#6B6A63] hover:bg-[#F5F1E8]/70"
                      }`}
                    >
                      <span>Administrator</span>
                      {role === "admin" && <span className="text-[10px] text-[#173B32]">Active</span>}
                    </button>
                  </div>

                  <div className="pt-1.5 border-t border-[#DDD7CA]/70">
                    <button
                      onClick={() => {
                        setDemoMenuOpen(false);
                        setResetConfirmOpen(true);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-xs text-[#252525] hover:bg-[#F5F1E8] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#6B6A63]" />
                      <span>Reset Demo Seed Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setDemoMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 bg-[#FBF9F4] hover:bg-[#F5F1E8] rounded border border-[#DDD7CA] transition-colors text-left cursor-pointer"
                >
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-[#173B32] leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-[#6B6A63] leading-none">
                      {currentUser.organization}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#6B6A63]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-[#FBF9F4] rounded border border-[#DDD7CA] shadow-md p-1.5 z-50 text-xs">
                    <div className="px-2 py-1.5 border-b border-[#DDD7CA]/70 mb-1">
                      <p className="font-semibold text-[#173B32]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#6B6A63] truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-[#6B6A63] mt-0.5 capitalize">{currentUser.role} Account</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate("profile");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#252525] hover:bg-[#F5F1E8] rounded transition-colors text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#6B6A63]" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        onNavigate("landing");
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#A65345] hover:bg-[#F5F1E8] rounded transition-colors text-left mt-0.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#A65345]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuthModal) onOpenAuthModal();
                  else onNavigate("auth");
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[#173B32] hover:bg-[#112D26] text-white rounded transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#FBF9F4] border border-[#DDD7CA] rounded p-5 max-w-sm w-full shadow-lg text-left">
            <h3 className="text-sm font-bold text-[#173B32] mb-1">Reset Demo Data?</h3>
            <p className="text-xs text-[#6B6A63] leading-relaxed mb-4">
              This will re-initialize all challenge records, the Kolhapur flood pilot, startup proposals, and telemetry logs to default demonstration states.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#252525] hover:bg-[#F5F1E8] rounded border border-[#DDD7CA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await resetAllData();
                  setResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#173B32] hover:bg-[#112D26] rounded transition-colors cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
