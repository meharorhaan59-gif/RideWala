import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  ///////////////////////////
  // ACCESS CONTROL
  ///////////////////////////

  // Persistent actor data block for shared state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  ///////////////////////////
  // TYPES
  ///////////////////////////

  type UserRole = { #passenger; #driver; #admin };
  type RideStatus = { #searching; #confirmed; #inProgress; #completed; #cancelled };
  type RideId = Nat;
  type OfferId = Nat;

  type UserProfile = {
    name : Text;
    rating : Float;
    carInfo : ?Text;
  };

  module UserProfile {
    public func compare(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      Text.compare(user1.name, user2.name);
    };
  };

  type RideRequest = {
    id : RideId;
    passenger : Principal;
    pickupLocation : Text;
    destination : Text;
    proposedFare : Nat;
    status : RideStatus;
    acceptedOffer : ?OfferId;
  };

  type Offer = {
    id : OfferId;
    rideId : RideId;
    driver : Principal;
    fare : Nat;
    accepted : Bool;
  };

  type RideHistory = {
    rideId : Nat;
    passenger : Principal;
    driver : Principal;
    pickupLocation : Text;
    destination : Text;
    fare : Nat;
    rating : Float;
  };

  ///////////////////////////
  // DATA STORES
  ///////////////////////////

  let userProfiles = Map.empty<Principal, UserProfile>();
  let rideRequests = Map.empty<RideId, RideRequest>();
  let offers = Map.empty<OfferId, Offer>();
  let rideHistory = Map.empty<Nat, RideHistory>();
  var nextRideId = 0;
  var nextOfferId = 0;

  module RideRequest {
    public func compareByProposedFare(request1 : RideRequest, request2 : RideRequest) : Order.Order {
      Nat.compare(request1.proposedFare, request2.proposedFare);
    };
  };

  ///////////////////////////
  // USER MANAGEMENT
  ///////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    let hasAdminAccess = AccessControl.hasPermission(accessControlState, caller, #admin);
    if (not hasAdminAccess) {
      Runtime.trap("Unauthorized: Only admins can fetch all user profiles");
    };
    userProfiles.values().toArray().sort();
  };

  ///////////////////////////
  // RIDE MANAGEMENT
  ///////////////////////////

  public shared ({ caller }) func createRideRequest(pickupLocation : Text, destination : Text, proposedFare : Nat) : async RideId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered passengers can create ride requests");
    };
    let rideId = nextRideId;
    let ride : RideRequest = {
      id = rideId;
      passenger = caller;
      pickupLocation;
      destination;
      proposedFare;
      status = #searching;
      acceptedOffer = null;
    };
    rideRequests.add(rideId, ride);
    nextRideId += 1;
    rideId;
  };

  public query ({ caller }) func getAllRideRequests() : async [RideRequest] {
    rideRequests.values().toArray();
  };

  public query ({ caller }) func getAllRideRequestsByProposedFare() : async [RideRequest] {
    rideRequests.values().toArray().sort(RideRequest.compareByProposedFare);
  };

  public query ({ caller }) func getAllOffers() : async [Offer] {
    offers.values().toArray();
  };

  public query ({ caller }) func getOffersForRide(rideId : Nat) : async [Offer] {
    let rideOffers = List.empty<Offer>();
    for (offer in offers.values()) {
      if (offer.rideId == rideId) {
        rideOffers.add(offer);
      };
    };
    rideOffers.toArray();
  };

  public shared ({ caller }) func createOffer(rideId : RideId, fare : Nat) : async OfferId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only drivers can create offers");
    };
    switch (rideRequests.get(rideId)) {
      case (null) { Runtime.trap("Ride request not found") };
      case (?ride) {
        let offerId = nextOfferId;
        let offer : Offer = {
          id = offerId;
          rideId;
          driver = caller;
          fare;
          accepted = false;
        };
        offers.add(offerId, offer);
        nextOfferId += 1;
        offerId;
      };
    };
  };
};
