import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Banknote,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { RideRequest } from "../backend";
import { RideStatus } from "../backend";
import SimulatedMap from "../components/SimulatedMap";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllRideRequests,
  useCreateRideRequest,
  useOffersForRide,
} from "../hooks/useQueries";

const STATUS_LABELS: Record<RideStatus, string> = {
  [RideStatus.searching]: "Searching for drivers",
  [RideStatus.confirmed]: "Driver confirmed",
  [RideStatus.inProgress]: "In progress",
  [RideStatus.completed]: "Completed",
  [RideStatus.cancelled]: "Cancelled",
};

const STATUS_COLORS: Record<RideStatus, string> = {
  [RideStatus.searching]: "bg-brand-yellow/20 text-brand-yellow",
  [RideStatus.confirmed]: "bg-brand/20 text-brand",
  [RideStatus.inProgress]: "bg-brand-teal/20 text-brand-teal",
  [RideStatus.completed]: "bg-muted text-muted-foreground",
  [RideStatus.cancelled]: "bg-destructive/20 text-destructive",
};

function OffersPanel({ rideId }: { rideId: bigint }) {
  const { data: offers = [], isLoading } = useOffersForRide(rideId);

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2 py-6 text-muted-foreground"
        data-ocid="offers.loading_state"
      >
        <Loader2 className="h-4 w-4 animate-spin" /> Loading offers...
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div
        className="rounded-xl border border-border bg-secondary py-8 text-center"
        data-ocid="offers.empty_state"
      >
        <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No offers yet. Drivers will respond shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((offer, i) => (
        <motion.div
          key={offer.id.toString()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between rounded-xl border border-border bg-secondary p-4"
          data-ocid={`offers.item.${i + 1}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-xs font-bold text-foreground">
              DRV
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Driver #{offer.driver.toString().slice(0, 8)}...
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                New driver
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-brand">
              PKR {offer.fare.toString()}
            </div>
            <div className="text-xs text-muted-foreground">offered fare</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RideCard({ ride }: { ride: RideRequest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
      data-ocid="rides.card"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              {ride.pickupLocation}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="h-3.5 w-3.5" />
            <span>{ride.destination}</span>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[ride.status]}`}
        >
          {STATUS_LABELS[ride.status]}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Banknote className="h-4 w-4 text-brand" />
          <span className="font-bold text-brand">
            PKR {ride.proposedFare.toString()}
          </span>
          <span className="text-xs text-muted-foreground">proposed</span>
        </div>
        {ride.status === RideStatus.searching && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide offers" : "View offers"}
          </Button>
        )}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-border pt-4">
              <OffersPanel rideId={ride.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PassengerDashboard() {
  const { identity } = useInternetIdentity();
  const {
    data: allRides = [],
    isLoading: ridesLoading,
    refetch,
  } = useAllRideRequests();
  const createRide = useCreateRideRequest();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");

  const myPrincipal = identity?.getPrincipal().toString();
  const myRides = allRides.filter(
    (r) => r.passenger.toString() === myPrincipal,
  );
  const activeRides = myRides.filter(
    (r) =>
      r.status !== RideStatus.completed && r.status !== RideStatus.cancelled,
  );
  const historyRides = myRides.filter(
    (r) =>
      r.status === RideStatus.completed || r.status === RideStatus.cancelled,
  );

  const handleBookRide = async () => {
    if (!pickup.trim() || !destination.trim() || !fare.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const fareNum = Number.parseInt(fare, 10);
    if (Number.isNaN(fareNum) || fareNum <= 0) {
      toast.error("Please enter a valid fare");
      return;
    }
    try {
      await createRide.mutateAsync({
        pickup: pickup.trim(),
        destination: destination.trim(),
        fare: BigInt(fareNum),
      });
      toast.success("Ride request created! Waiting for driver offers...");
      setPickup("");
      setDestination("");
      setFare("");
    } catch {
      toast.error("Failed to create ride request");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Passenger Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Book a ride and get offers from nearby drivers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Book a Ride
            </h2>
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Pickup Location
                </Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" />
                  <Input
                    placeholder="Where are you?"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    data-ocid="booking.input"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Destination
                </Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5">
                  <Navigation className="h-4 w-4 shrink-0 text-brand-teal" />
                  <Input
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    data-ocid="booking.input"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Your Fare Offer (PKR)
                </Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5">
                  <Banknote className="h-4 w-4 shrink-0 text-brand" />
                  <Input
                    type="number"
                    placeholder="e.g. 12"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    data-ocid="booking.input"
                  />
                </div>
              </div>
              <Button
                onClick={handleBookRide}
                disabled={createRide.isPending}
                className="w-full rounded-full bg-brand py-5 text-sm font-semibold text-primary-foreground hover:bg-brand/90 shadow-glow"
                data-ocid="booking.primary_button"
              >
                {createRide.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding
                    Drivers...
                  </>
                ) : (
                  "Find Drivers"
                )}
              </Button>
            </div>
          </div>

          {/* Mini map */}
          <SimulatedMap className="mt-4 h-40 w-full" compact />
        </div>

        {/* Rides Panel */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="active">
            <div className="mb-4 flex items-center justify-between">
              <TabsList className="bg-secondary">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-brand data-[state=active]:text-primary-foreground"
                  data-ocid="rides.tab"
                >
                  Active
                  {activeRides.length > 0 && (
                    <Badge className="ml-2 bg-brand/20 text-brand">
                      {activeRides.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-brand data-[state=active]:text-primary-foreground"
                  data-ocid="rides.tab"
                >
                  History
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="text-muted-foreground hover:text-foreground"
                data-ocid="rides.button"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="active">
              {ridesLoading ? (
                <div
                  className="flex items-center gap-2 py-8 text-muted-foreground"
                  data-ocid="rides.loading_state"
                >
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading rides...
                </div>
              ) : activeRides.length === 0 ? (
                <div
                  className="rounded-2xl border border-border bg-card py-12 text-center"
                  data-ocid="rides.empty_state"
                >
                  <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">No active rides</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Book a ride using the form to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4" data-ocid="rides.list">
                  {activeRides.map((ride) => (
                    <RideCard key={ride.id.toString()} ride={ride} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {historyRides.length === 0 ? (
                <div
                  className="rounded-2xl border border-border bg-card py-12 text-center"
                  data-ocid="history.empty_state"
                >
                  <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    No ride history yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4" data-ocid="history.list">
                  {historyRides.map((ride) => (
                    <RideCard key={ride.id.toString()} ride={ride} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
