import { Car } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                RideDrive
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Negotiate your fare, choose your driver. The smarter way to ride.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  About Us
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Careers
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Press
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              Riders
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  How It Works
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Safety
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Pricing
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              Drivers
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Become a Driver
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Driver App
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  Earnings
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
