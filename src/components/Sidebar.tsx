import React from "react";
import { useAuth } from "../context/AuthContext.js";
import { useData } from "../context/DataContext.js";
import {
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  Award,
  BarChart3,
  User,
  LogOut
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { role, logout } = useAuth();
  const { applications } = useData();

  // Government navigation items strictly: Dashboard, Challenges, Applications, Pilots, Reports
  const govNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-challenges", label: "Challenges", icon: FolderKanban },
    { id: "applications", label: "Applications", icon: FileSpreadsheet, count: applications.length },
    { id: "pilots", label: "Pilots", icon: Award },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  // Startup navigation items
  const startupNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "discover-challenges", label: "Challenges", icon: FolderKanban },
    { id: "my-applications", label: "Applications", icon: FileSpreadsheet, count: applications.length },
    { id: "my-pilots", label: "Pilots", icon: Award },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  // Admin navigation items
  const adminNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "challenges", label: "Challenges", icon: FolderKanban },
    { id: "applications", label: "Applications", icon: FileSpreadsheet },
    { id: "pilots", label: "Pilots", icon: Award },
    { id: "analytics", label: "Reports", icon: BarChart3 },
  ];

  const navItems = role === "government" ? govNav : role === "startup" ? startupNav : adminNav;

  const isItemActive = (id: string) => {
    if (id === "dashboard") {
      return (
        currentView === "dashboard" ||
        currentView === "gov-dashboard" ||
        currentView === "startup-dashboard"
      );
    }
    if (id === "my-challenges" || id === "discover-challenges" || id === "challenges") {
      return (
        currentView === id ||
        currentView === "my-challenges" ||
        currentView === "discover-challenges" ||
        currentView === "challenge-detail" ||
        currentView === "challenges" ||
        currentView === "create-challenge" ||
        currentView === "apply-challenge"
      );
    }
    if (id === "applications" || id === "my-applications") {
      return currentView === "applications" || currentView === "my-applications";
    }
    if (id === "pilots" || id === "my-pilots") {
      return currentView === "pilots" || currentView === "my-pilots" || currentView === "kpi-tracking";
    }
    if (id === "reports" || id === "analytics") {
      return currentView === "reports" || currentView === "analytics";
    }
    return currentView === id;
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between text-[#252525] bg-[#FBF9F4] border-r border-[#DDD7CA]">
      <div>
        {/* Brand & Portal Type */}
        <div className="px-5 py-4 border-b border-[#DDD7CA]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-[#173B32] tracking-tight">ProcureAI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C96B4B] inline-block"></span>
          </div>
          <p className="text-[11px] text-[#6B6A63] font-medium capitalize mt-0.5">
            {role === "government" ? "Institutional Portal" : role === "startup" ? "Vendor & Startup Portal" : "Administrator Portal"}
          </p>
        </div>

        {/* Main Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer text-left ${
                  active
                    ? "bg-[#F5F1E8] text-[#173B32] font-bold border border-[#DDD7CA]"
                    : "text-[#6B6A63] hover:text-[#252525] hover:bg-[#F5F1E8]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? "text-[#173B32]" : "text-[#6B6A63]"}`} />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === "number" && item.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded ${
                      active ? "bg-[#173B32] text-white" : "bg-[#F5F1E8] text-[#6B6A63] border border-[#DDD7CA]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Logout */}
      <div className="p-3 border-t border-[#DDD7CA] space-y-1">
        <button
          onClick={() => onNavigate("profile")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer text-left ${
            currentView === "profile"
              ? "bg-[#F5F1E8] text-[#173B32] font-bold border border-[#DDD7CA]"
              : "text-[#6B6A63] hover:text-[#252525] hover:bg-[#F5F1E8]/60"
          }`}
        >
          <User className={`w-4 h-4 ${currentView === "profile" ? "text-[#173B32]" : "text-[#6B6A63]"}`} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate("landing");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-[#6B6A63] hover:text-[#A65345] hover:bg-[#F5F1E8] transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-[#6B6A63]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
