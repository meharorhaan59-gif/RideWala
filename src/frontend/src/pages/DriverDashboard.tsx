import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Banknote,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { RideRequest } from "../backend";
import { RideStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOffers,
  useAllRideRequests,
  useCreateOffer,
} from "../hooks/useQueries";

function OfferDialog({
  ride,
  open,
  onClose,
}: {
  ride: RideRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const [offerFare, setOfferFare] = useState("");
  const createOffer = useCreateOffer();

  const handleSubmit = async () => {
    if (!ride) return;
    const fareNum = Number.parseInt(offerFare, 10);
    if (Number.isNaN(fareNum) || fareNum <= 0) {
      toast.error("Please enter a valid fare");
      return;
    }
    try {
      await createOffer.mutateAsync({ rideId: ride.id, fare: BigInt(fareNum) });
      toast.success("Offer submitted!");
      setOfferFare("");
      onClose();
    } catch {
      toast.error("Failed to submit offer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm border-border bg-card"
        data-ocid="offer.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">Make an Offer</DialogTitle>
        </DialogHeader>
        {ride && (
          <div className="space-y-4 pt-1">
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-brand" />
                <span className="text-foreground">{ride.pickupLocation}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-muted-foreground">
                <Navigation className="h-3.5 w-3.5 text-brand-teal" />
                <span>{ride.destination}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                <Banknote className="h-3.5 w-3.5" />
                <span>Passenger proposes: </span>
                <span className="font-bold text-brand">
                  PKR {ride.proposedFare.toString()}
                </span>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Your Offer (PKR)
              </Label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5">
                <Banknote className="h-4 w-4 shrink-0 text-brand" />
                <Input
                  type="number"
                  placeholder={ride.proposedFare.toString()}
                  value={offerFare}
                  onChange={(e) => setOfferFare(e.target.value)}
                  className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  data-ocid="offer.input"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Tip: Offering close to the passenger's fare increases your
                acceptance chances.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-border bg-secondary text-foreground"
                onClick={onClose}
                data-ocid="offer.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-brand text-primary-foreground hover:bg-brand/90"
                onClick={handleSubmit}
                disabled={createOffer.isPending}
                data-ocid="offer.submit_button"
              >
                {createOffer.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Offer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function DriverDashboard() {
  const { identity } = useInternetIdentity();
  const {
    data: allRides = [],
    isLoading: ridesLoading,
    refetch: refetchRides,
  } = useAllRideRequests();
  const { data: allOffers = [], isLoading: offersLoading } = useAllOffers();
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString();

  const openRides = allRides.filter(
    (r) =>
      r.status === RideStatus.searching &&
      r.passenger.toString() !== myPrincipal,
  );
  const myOffers = allOffers.filter((o) => o.driver.toString() === myPrincipal);
  const myOfferRideIds = new Set(myOffers.map((o) => o.rideId.toString()));

  const handleMakeOffer = (ride: RideRequest) => {
    setSelectedRide(ride);
    setOfferDialogOpen(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Driver Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Browse ride requests and send offers to passengers
        </p>
      </div>

      <Tabs defaultValue="browse">
        <div className="mb-5 flex items-center justify-between">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-brand data-[state=active]:text-primary-foreground"
              data-ocid="driver.tab"
            >
              Browse Rides
              {openRides.length > 0 && (
                <Badge className="ml-2 bg-brand/20 text-brand">
                  {openRides.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="myoffers"
              className="data-[state=active]:bg-brand data-[state=active]:text-primary-foreground"
              data-ocid="driver.tab"
            >
              My Offers
              {myOffers.length > 0 && (
                <Badge className="ml-2 bg-brand/20 text-brand">
                  {myOffers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchRides()}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="driver.button"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="browse">
          {ridesLoading ? (
            <div
              className="flex items-center gap-2 py-8 text-muted-foreground"
              data-ocid="rides.loading_state"
            >
              <Loader2 className="h-4 w-4 animate-spin" /> Loading ride
              requests...
            </div>
          ) : openRides.length === 0 ? (
            <div
              className="rounded-2xl border border-border bg-card py-16 text-center"
              data-ocid="rides.empty_state"
            >
              <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">
                No open ride requests
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon — new requests appear here
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              data-ocid="rides.list"
            >
              {openRides.map((ride, i) => {
                const alreadyOffered = myOfferRideIds.has(ride.id.toString());
                return (
                  <motion.div
                    key={ride.id.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                    data-ocid={`rides.item.${i + 1}`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
                          <span className="font-medium text-foreground">
                            {ride.pickupLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="h-3.5 w-3.5 shrink-0 text-brand-teal" />
                          <span className="text-muted-foreground">
                            {ride.destination}
                          </span>
                        </div>
                      </div>
                      {alreadyOffered && (
                        <Badge className="shrink-0 bg-brand/20 text-brand text-xs">
                          Offered
                        </Badge>
                      )}
                    </div>

                    <div className="mb-4 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        Passenger proposes
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-brand">
                          PKR {ride.proposedFare.toString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleMakeOffer(ride)}
                      disabled={alreadyOffered}
                      className={`w-full rounded-full text-sm font-semibold ${
                        alreadyOffered
                          ? "bg-secondary text-muted-foreground cursor-default"
                          : "bg-brand text-primary-foreground hover:bg-brand/90"
                      }`}
                      data-ocid={`rides.primary_button.${i + 1}`}
                    >
                      {alreadyOffered ? "Offer Sent" : "Make Offer"}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="myoffers">
          {offersLoading ? (
            <div
              className="flex items-center gap-2 py-8 text-muted-foreground"
              data-ocid="offers.loading_state"
            >
              <Loader2 className="h-4 w-4 animate-spin" /> Loading offers...
            </div>
          ) : myOffers.length === 0 ? (
            <div
              className="rounded-2xl border border-border bg-card py-16 text-center"
              data-ocid="offers.empty_state"
            >
              <Send className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No offers sent yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse rides and make your first offer
              </p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="offers.list">
              {myOffers.map((offer, i) => {
                const ride = allRides.find(
                  (r) => r.id.toString() === offer.rideId.toString(),
                );
                return (
                  <motion.div
                    key={offer.id.toString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
                    data-ocid={`offers.item.${i + 1}`}
                  >
                    <div>
                      {ride ? (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-brand" />
                            <span className="font-medium text-foreground">
                              {ride.pickupLocation}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Navigation className="h-3 w-3" />
                            <span>{ride.destination}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Ride #{offer.rideId.toString()}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand">
                        PKR {offer.fare.toString()}
                      </div>
                      <Badge
                        className={`text-xs ${
                          offer.accepted
                            ? "bg-brand/20 text-brand"
                            : "bg-brand-yellow/20 text-brand-yellow"
                        }`}
                      >
                        {offer.accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <OfferDialog
        ride={selectedRide}
        open={offerDialogOpen}
        onClose={() => setOfferDialogOpen(false)}
      />
    </main>
  );
}
