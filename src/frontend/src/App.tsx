import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";
import DriverDashboard from "./pages/DriverDashboard";
import LandingPage from "./pages/LandingPage";
import PassengerDashboard from "./pages/PassengerDashboard";

type View = "landing" | "passenger" | "driver";

export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const [view, setView] = useState<View>("landing");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Ensure dark mode always applied
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Auto-navigate when logged in + profile loaded
  useEffect(() => {
    if (identity && profile) {
      setView((current) => {
        if (current === "landing") {
          return profile.carInfo ? "driver" : "passenger";
        }
        return current;
      });
    }
  }, [identity, profile]);

  const handleLogin = () => {
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (role: "passenger" | "driver") => {
    setView(role);
  };

  const handleLogout = () => {
    clear();
    setView("landing");
  };

  const handleSwitchMode = () => {
    setView((v) => (v === "passenger" ? "driver" : "passenger"));
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading RideDrive...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        isLoggedIn={!!identity}
        onLogout={handleLogout}
        onGoHome={() => setView("landing")}
        userName={profile?.name}
        view={view}
        onSwitchMode={handleSwitchMode}
      />

      {view === "landing" && <LandingPage onSignUp={handleSignUp} />}
      {view === "passenger" && <PassengerDashboard />}
      {view === "driver" && <DriverDashboard />}

      {view === "landing" && <Footer />}

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
}
