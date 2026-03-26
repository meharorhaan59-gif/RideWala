import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface HeaderProps {
  onLogin: () => void;
  onSignUp: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onGoHome: () => void;
  userName?: string;
  view: "landing" | "passenger" | "driver";
  onSwitchMode: () => void;
}

export default function Header({
  onLogin,
  onSignUp,
  isLoggedIn,
  onLogout,
  onGoHome,
  userName,
  view,
  onSwitchMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 focus:outline-none"
          onClick={onGoHome}
          data-ocid="nav.link"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-glow">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            RideDrive
          </span>
        </button>

        {/* Nav Links */}
        {!isLoggedIn && (
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#hero"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.link"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.link"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.link"
            >
              Features
            </a>
            <a
              href="#tracking"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.link"
            >
              Live Tracking
            </a>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {view !== "landing" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSwitchMode}
                  className="border-border bg-secondary text-foreground hover:bg-muted"
                  data-ocid="nav.toggle"
                >
                  {view === "passenger" ? "Driver Mode" : "Passenger Mode"}
                </Button>
              )}
              <span className="hidden text-sm text-muted-foreground sm:block">
                {userName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="rounded-full border-border bg-secondary text-foreground hover:bg-muted"
                data-ocid="nav.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogin}
                className="rounded-full border-border bg-secondary text-foreground hover:bg-muted"
                data-ocid="nav.button"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={onSignUp}
                className="rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
                data-ocid="nav.primary_button"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
