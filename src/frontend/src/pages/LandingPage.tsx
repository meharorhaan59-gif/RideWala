import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import SimulatedMap from "../components/SimulatedMap";

const SAMPLE_DRIVERS = [
  {
    id: 1,
    name: "Marcus Rivera",
    rating: 4.9,
    trips: 1240,
    car: "Toyota Camry 2023",
    offerFare: 12,
    eta: "3 min",
    avatar: "MR",
  },
  {
    id: 2,
    name: "Sofia Chen",
    rating: 4.8,
    trips: 876,
    car: "Honda Accord 2022",
    offerFare: 11,
    eta: "5 min",
    avatar: "SC",
  },
  {
    id: 3,
    name: "James O'Brien",
    rating: 4.7,
    trips: 2103,
    car: "Hyundai Sonata 2023",
    offerFare: 13,
    eta: "4 min",
    avatar: "JO",
  },
];

const STEPS = [
  {
    icon: MapPin,
    title: "Set Your Route",
    desc: "Enter your pickup and destination, then propose the fare you're comfortable paying.",
  },
  {
    icon: Star,
    title: "Choose Your Driver",
    desc: "Drivers send you offers. Compare ratings, car info, and fares — then accept the best match.",
  },
  {
    icon: Navigation,
    title: "Ride & Arrive",
    desc: "Track your driver in real time as they navigate to you and to your destination.",
  },
];

interface LandingPageProps {
  onSignUp: () => void;
}

export default function LandingPage({ onSignUp }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section id="hero" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Map */}
          <motion.div
            className="relative lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SimulatedMap className="h-[340px] w-full lg:h-[420px]" />
          </motion.div>

          {/* Booking widget */}
          <motion.div
            className="flex flex-col justify-center lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                  BOOK YOUR RIDE
                </span>
              </div>
              <h1 className="mb-1 mt-3 text-3xl font-bold leading-tight text-foreground">
                Negotiate Your
                <br />
                <span className="text-brand">Perfect Fare</span>
              </h1>
              <p className="mb-5 text-sm text-muted-foreground">
                You set the price. Drivers compete for your trip.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" />
                  <Input
                    placeholder="Pickup location"
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                  <Navigation className="h-4 w-4 shrink-0 text-brand-teal" />
                  <Input
                    placeholder="Destination"
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                  <span className="text-sm font-bold text-brand">$</span>
                  <Input
                    placeholder="Your offer (e.g. 12)"
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    readOnly
                  />
                </div>
                <Button
                  onClick={onSignUp}
                  className="w-full rounded-full bg-brand py-5 text-sm font-semibold text-primary-foreground hover:bg-brand/90 shadow-glow"
                  data-ocid="landing.primary_button"
                >
                  Find Drivers <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Driver Offer Cards */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
            Negotiate Your Fare &amp; Choose Your Driver
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Real drivers send you competing offers — you pick the best one.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SAMPLE_DRIVERS.map((driver, i) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
              data-ocid={`drivers.item.${i + 1}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
                  {driver.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {driver.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                    {driver.rating} · {driver.trips.toLocaleString()} trips
                  </div>
                </div>
              </div>
              <img
                src="/assets/generated/car-sedan-dark.dim_400x220.png"
                alt="Car"
                className="mb-4 h-28 w-full rounded-xl object-cover"
              />
              <div className="mb-1 text-xs text-muted-foreground">
                {driver.car}
              </div>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-brand">
                  ${driver.offerFare}
                </span>
                <span className="text-xs text-muted-foreground">
                  driver offer
                </span>
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {driver.eta}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full border-border bg-secondary text-muted-foreground hover:text-foreground"
                  onClick={onSignUp}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-brand text-primary-foreground hover:bg-brand/90"
                  onClick={onSignUp}
                >
                  Accept
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
              How RideDrive Works
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Three simple steps to your next ride
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10">
                  <step.icon className="h-6 w-6 text-brand" />
                </div>
                <div className="mb-1 text-sm font-semibold text-brand">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Tracking */}
      <section id="tracking" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          className="grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-border bg-card p-8 md:grid-cols-2"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-teal/15 px-3 py-1.5 text-xs font-semibold text-brand-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
              Live Tracking Active
            </div>
            <h2 className="mb-3 text-3xl font-bold text-foreground">
              Live Ride Tracking
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Follow your driver on the map in real time. Know exactly when
              they'll arrive and track every mile of your journey.
            </p>
            <div className="space-y-3">
              {[
                { icon: Shield, label: "Verified drivers only" },
                { icon: Zap, label: "Sub-second location updates" },
                { icon: Clock, label: "Precise ETA calculations" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={onSignUp}
              className="mt-8 w-fit rounded-full bg-brand px-6 text-primary-foreground hover:bg-brand/90"
              data-ocid="landing.secondary_button"
            >
              Try RideDrive Free
            </Button>
          </div>
          <SimulatedMap compact className="h-52 md:h-auto" />
        </motion.div>
      </section>
    </main>
  );
}
