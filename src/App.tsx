import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { DataProvider, useData } from "./context/DataContext.js";
import { Navbar } from "./components/Navbar.js";
import { Sidebar } from "./components/Sidebar.js";
import { LandingPage } from "./components/LandingPage.js";
import { GovDashboard } from "./components/government/GovDashboard.js";
import { CreateChallenge } from "./components/government/CreateChallenge.js";
import { MyChallenges } from "./components/government/MyChallenges.js";
import { GovApplications } from "./components/government/GovApplications.js";
import { StartupDashboard } from "./components/startup/StartupDashboard.js";
import { DiscoverChallenges } from "./components/startup/DiscoverChallenges.js";
import { ChallengeDetailPage } from "./components/startup/ChallengeDetailPage.js";
import { ChallengeDetailApply } from "./components/startup/ChallengeDetailApply.js";
import { MyApplications } from "./components/startup/MyApplications.js";
import { PilotDashboard } from "./components/pilot/PilotDashboard.js";
import { AdminDashboard } from "./components/admin/AdminDashboard.js";
import { ProfileView } from "./components/profile/ProfileView.js";
import { ToastContainer } from "./components/ToastContainer.js";
import { AILoaderModal } from "./components/AILoaderModal.js";
import { AuthModal } from "./components/auth/AuthModal.js";
import { Challenge } from "./types.js";

const AppContent: React.FC = () => {
  const { role, quickSwitchRole } = useAuth();
  const { challenges } = useData();

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>("landing");
  const [selectedChallengeForApply, setSelectedChallengeForApply] = useState<Challenge | null>(null);
  const [selectedChallengeForDetail, setSelectedChallengeForDetail] = useState<Challenge | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync default view when role switches while inside portal
  useEffect(() => {
    if (currentView !== "landing") {
      if (role === "government" && (currentView.startsWith("startup") || currentView === "admin")) {
        setCurrentView("gov-dashboard");
      } else if (role === "startup" && (currentView.startsWith("gov") || currentView === "admin" || currentView === "create-challenge")) {
        setCurrentView("startup-dashboard");
      } else if (role === "admin" && currentView !== "admin") {
        setCurrentView("admin");
      }
    }
  }, [role]);

  const handleSelectChallengeForDetail = (challenge: Challenge) => {
    setSelectedChallengeForDetail(challenge);
    setSelectedChallengeForApply(challenge);
    setCurrentView("challenge-detail");
  };

  const handleApplyToChallenge = (challenge: Challenge) => {
    setSelectedChallengeForApply(challenge);
    setCurrentView("apply-challenge");
  };

  const handleApplicationSuccess = (appId: string) => {
    setCurrentView("my-applications");
  };

  const handleEnterPortal = () => {
    if (role === "government") setCurrentView("gov-dashboard");
    else if (role === "startup") setCurrentView("startup-dashboard");
    else setCurrentView("admin");
  };

  const handleStartDemo = (demoRole: "government" | "startup" | "admin" = "government") => {
    quickSwitchRole(demoRole);
    if (demoRole === "government") {
      setCurrentView("gov-dashboard");
    } else if (demoRole === "startup") {
      setCurrentView("startup-dashboard");
    } else {
      setCurrentView("admin");
    }
  };

  const handleNavigate = (view: string) => {
    if (view === "auth") {
      setAuthModalOpen(true);
      return;
    }
    if (view === "dashboard") {
      if (role === "government") setCurrentView("gov-dashboard");
      else if (role === "startup") setCurrentView("startup-dashboard");
      else setCurrentView("admin");
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#252525] font-sans flex flex-col selection:bg-[#173B32] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      {currentView === "landing" ? (
        <LandingPage
          onStartDemo={handleStartDemo}
          onOpenAuth={() => setAuthModalOpen(true)}
          onEnterPortal={handleEnterPortal}
          onSelectRole={handleStartDemo}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-3.25rem)]">
          {/* Full-Height Responsive Application Sidebar */}
          <div className="w-full md:w-56 lg:w-60 flex-shrink-0 bg-[#FBF9F4] border-r border-[#DDD7CA]">
            <Sidebar currentView={currentView} onNavigate={handleNavigate} />
          </div>

          {/* Main Dashboard Screen View */}
          <main className="flex-1 min-w-0 bg-[#F5F1E8] px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Government Views */}
              {(currentView === "gov-dashboard" || (currentView === "dashboard" && role === "government")) && (
                <GovDashboard onNavigate={handleNavigate} />
              )}

              {currentView === "create-challenge" && (
                <CreateChallenge
                  onSuccess={(newChallenge) => {
                    setCurrentView("my-challenges");
                  }}
                />
              )}

              {(currentView === "my-challenges" || (currentView === "challenges" && role === "government")) && (
                <MyChallenges
                  onNavigate={handleNavigate}
                  onSelectChallenge={(chl) => {
                    setCurrentView("applications");
                  }}
                />
              )}

              {currentView === "applications" && (
                <GovApplications
                  onNavigate={handleNavigate}
                  onAwardPilot={(pilot) => {
                    setCurrentView("pilots");
                  }}
                />
              )}

              {/* Startup Views */}
              {(currentView === "startup-dashboard" || (currentView === "dashboard" && role === "startup")) && (
                <StartupDashboard
                  onNavigate={handleNavigate}
                  onSelectChallenge={handleSelectChallengeForDetail}
                />
              )}

              {currentView === "discover-challenges" && (
                <DiscoverChallenges
                  onSelectChallenge={handleSelectChallengeForDetail}
                  onApply={handleApplyToChallenge}
                />
              )}

              {currentView === "challenge-detail" && (
                <ChallengeDetailPage
                  challenge={selectedChallengeForDetail || selectedChallengeForApply || challenges[0]}
                  onBack={() => setCurrentView("discover-challenges")}
                  onApply={(chl) => {
                    setSelectedChallengeForApply(chl);
                    setCurrentView("apply-challenge");
                  }}
                  onViewApplication={(appId) => {
                    setCurrentView("my-applications");
                  }}
                />
              )}

              {currentView === "apply-challenge" && (
                <ChallengeDetailApply
                  challenge={selectedChallengeForApply || selectedChallengeForDetail || challenges[0]}
                  onBack={() => {
                    if (selectedChallengeForDetail) {
                      setCurrentView("challenge-detail");
                    } else {
                      setCurrentView("discover-challenges");
                    }
                  }}
                  onSuccess={handleApplicationSuccess}
                  onViewApplication={(appId) => {
                    setCurrentView("my-applications");
                  }}
                />
              )}

              {currentView === "my-applications" && (
                <MyApplications onNavigate={handleNavigate} />
              )}

              {/* Common / Pilot Views */}
              {(currentView === "pilots" || currentView === "my-pilots" || currentView === "kpi-tracking" || currentView === "reports") && (
                <PilotDashboard />
              )}

              {/* Admin View */}
              {(currentView === "admin" || (currentView === "dashboard" && role === "admin") || currentView === "users" || currentView === "analytics" || (currentView === "challenges" && role === "admin")) && (
                <AdminDashboard />
              )}

              {/* Profile View */}
              {currentView === "profile" && <ProfileView />}
            </div>
          </main>
        </div>
      )}

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <AILoaderModal />
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setAuthModalOpen(false);
            handleEnterPortal();
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
