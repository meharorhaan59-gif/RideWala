import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Offer, RideRequest, UserProfile } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useAllRideRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<RideRequest[]>({
    queryKey: ["allRideRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRideRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useCreateRideRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pickup,
      destination,
      fare,
    }: { pickup: string; destination: string; fare: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRideRequest(pickup, destination, fare);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allRideRequests"] });
    },
  });
}

export function useOffersForRide(rideId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["offersForRide", rideId?.toString()],
    queryFn: async () => {
      if (!actor || rideId === null) return [];
      return actor.getOffersForRide(rideId);
    },
    enabled: !!actor && !isFetching && rideId !== null,
    refetchInterval: 5000,
  });
}

export function useAllOffers() {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["allOffers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOffers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useCreateOffer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rideId, fare }: { rideId: bigint; fare: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOffer(rideId, fare);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOffers"] });
      qc.invalidateQueries({ queryKey: ["allRideRequests"] });
    },
  });
}
