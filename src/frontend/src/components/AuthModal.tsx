import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Loader2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useSaveProfile } from "../hooks/useQueries";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (role: "passenger" | "driver") => void;
}

type Step = "login" | "profile";

export default function AuthModal({
  open,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [step, setStep] = useState<Step>("login");
  const [role, setRole] = useState<"passenger" | "driver">("passenger");
  const [name, setName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const { data: existingProfile } = useCallerProfile();
  const saveProfile = useSaveProfile();

  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    await login();
    setStep("profile");
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (role === "driver" && (!carModel.trim() || !carPlate.trim())) {
      toast.error("Please enter car model and plate");
      return;
    }
    const carInfo =
      role === "driver" ? `${carModel.trim()} | ${carPlate.trim()}` : undefined;
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        carInfo,
        rating: existingProfile?.rating ?? 0,
      });
      toast.success("Profile saved!");
      onSuccess(role);
      onClose();
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleSkipToExisting = () => {
    if (existingProfile) {
      const detectedRole = existingProfile.carInfo ? "driver" : "passenger";
      onSuccess(detectedRole);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md border-border bg-card"
        data-ocid="auth.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "login" ? "Welcome to RideDrive" : "Set Up Your Profile"}
          </DialogTitle>
        </DialogHeader>

        {step === "login" ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Connect securely with Internet Identity to get started.
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
              data-ocid="auth.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Continue with Internet Identity"
              )}
            </Button>
            {identity && (
              <Button
                variant="outline"
                onClick={() => setStep("profile")}
                className="w-full border-border bg-secondary text-foreground"
              >
                Already logged in — Set up profile
              </Button>
            )}
            {identity && existingProfile && (
              <Button
                variant="ghost"
                onClick={handleSkipToExisting}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Use existing profile
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Role selection */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                I want to
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("passenger")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    role === "passenger"
                      ? "border-brand bg-brand/10 text-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:border-muted"
                  }`}
                  data-ocid="auth.toggle"
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-semibold">Ride</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    role === "driver"
                      ? "border-brand bg-brand/10 text-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:border-muted"
                  }`}
                  data-ocid="auth.toggle"
                >
                  <Car className="h-6 w-6" />
                  <span className="text-sm font-semibold">Drive</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-sm text-muted-foreground">
                  Display Name
                </Label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="auth.input"
                />
              </div>

              {role === "driver" && (
                <>
                  <div>
                    <Label className="mb-1.5 block text-sm text-muted-foreground">
                      Car Model
                    </Label>
                    <Input
                      placeholder="e.g. Toyota Camry 2022"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                      data-ocid="auth.input"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm text-muted-foreground">
                      License Plate
                    </Label>
                    <Input
                      placeholder="e.g. ABC-1234"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                      data-ocid="auth.input"
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending}
              className="w-full rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
              data-ocid="auth.submit_button"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                `Continue as ${role === "passenger" ? "Passenger" : "Driver"}`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
