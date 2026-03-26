import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Offer {
    id: OfferId;
    fare: bigint;
    rideId: RideId;
    accepted: boolean;
    driver: Principal;
}
export interface RideRequest {
    id: RideId;
    status: RideStatus;
    passenger: Principal;
    destination: string;
    proposedFare: bigint;
    acceptedOffer?: OfferId;
    pickupLocation: string;
}
export type RideId = bigint;
export type OfferId = bigint;
export interface UserProfile {
    name: string;
    carInfo?: string;
    rating: number;
}
export enum RideStatus {
    cancelled = "cancelled",
    completed = "completed",
    confirmed = "confirmed",
    inProgress = "inProgress",
    searching = "searching"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOffer(rideId: RideId, fare: bigint): Promise<OfferId>;
    createRideRequest(pickupLocation: string, destination: string, proposedFare: bigint): Promise<RideId>;
    getAllOffers(): Promise<Array<Offer>>;
    getAllRideRequests(): Promise<Array<RideRequest>>;
    getAllRideRequestsByProposedFare(): Promise<Array<RideRequest>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOffersForRide(rideId: bigint): Promise<Array<Offer>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
