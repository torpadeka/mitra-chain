import Types "Types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import LLM "mo:llm";
import ICRC7 "mo:icrc7-mo";

persistent actor {
  private func natHash(n : Nat) : Hash.Hash {
    Text.hash(Nat.toText(n));
  };

  // Stable counters
  var nextFranchiseId : Nat = 0;
  var nextCategoryId : Nat = 0;
  var nextApplicationId : Nat = 0;
  var nextConversationId : Nat = 0;
  var nextMessageId : Nat = 0;
  var nextEventId : Nat = 0;

  // Stable storage arrays for upgrades
  var usersEntries : [(Principal, Types.User)] = [];
  var franchisesEntries : [(Nat, Types.Franchise)] = [];
  var categoriesEntries : [(Nat, Types.Category)] = [];
  var applicationsEntries : [(Nat, Types.Application)] = [];
  var nftsEntries : [(Nat, Types.NFTLicense)] = [];
  var transactionsEntries : [(Nat, Types.Transaction)] = [];
  var conversationsEntries : [(Nat, Types.Conversation)] = [];
  var messagesEntries : [(Nat, Types.Message)] = [];
  var eventsEntries : [(Nat, Types.Event)] = [];
  var franchisorRatingsEntries : [(Principal, [(Principal, Nat)])] = [];
  var franchisorCommentsEntries : [(Principal, [Types.Comment])] = [];

  // HashMaps for data
  transient var users = HashMap.HashMap<Principal, Types.User>(0, Principal.equal, Principal.hash);
  transient var franchises = HashMap.HashMap<Nat, Types.Franchise>(0, Nat.equal, natHash);
  transient var categories = HashMap.HashMap<Nat, Types.Category>(0, Nat.equal, natHash);
  transient var applications = HashMap.HashMap<Nat, Types.Application>(0, Nat.equal, natHash);
  transient var nfts = HashMap.HashMap<Nat, Types.NFTLicense>(0, Nat.equal, natHash);
  transient var transactions = HashMap.HashMap<Nat, Types.Transaction>(0, Nat.equal, natHash);
  transient var conversations = HashMap.HashMap<Nat, Types.Conversation>(0, Nat.equal, natHash);
  transient var messages = HashMap.HashMap<Nat, Types.Message>(0, Nat.equal, natHash);
  transient var events = HashMap.HashMap<Nat, Types.Event>(0, Nat.equal, natHash);
  transient var franchisorRatings = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(0, Principal.equal, Principal.hash);
  transient var franchisorComments = HashMap.HashMap<Principal, List.List<Types.Comment>>(0, Principal.equal, Principal.hash);

  // Upgrade hooks
  system func preupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), usersEntries.size(), Principal.equal, Principal.hash);
    franchisesEntries := Iter.toArray(franchises.entries());
    categoriesEntries := Iter.toArray(categories.entries());
    applicationsEntries := Iter.toArray(applications.entries());
    nftsEntries := Iter.toArray(nfts.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
    conversationsEntries := Iter.toArray(conversations.entries());
    messagesEntries := Iter.toArray(messages.entries());
    eventsEntries := Iter.toArray(events.entries());
    franchisorRatingsEntries := Iter.toArray(
      Iter.map<(Principal, HashMap.HashMap<Principal, Nat>), (Principal, [(Principal, Nat)])>(
        franchisorRatings.entries(),
        func(tuple) {
          let (f, r) = tuple;
          (f, Iter.toArray(r.entries()));
        },
      )
    );
    franchisorCommentsEntries := Iter.toArray(
      Iter.map<(Principal, List.List<Types.Comment>), (Principal, [Types.Comment])>(
        franchisorComments.entries(),
        func(tuple) {
          let (f, c) = tuple;
          (f, List.toArray(c));
        },
      )
    );
  };

  system func postupgrade() {
    Debug.print("Starting postupgrade...");
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), usersEntries.size(), Principal.equal, Principal.hash);
    franchises := HashMap.fromIter<Nat, Types.Franchise>(franchisesEntries.vals(), franchisesEntries.size(), Nat.equal, natHash);
    categories := HashMap.fromIter<Nat, Types.Category>(categoriesEntries.vals(), categoriesEntries.size(), Nat.equal, natHash);
    applications := HashMap.fromIter<Nat, Types.Application>(applicationsEntries.vals(), applicationsEntries.size(), Nat.equal, natHash);
    nfts := HashMap.fromIter<Nat, Types.NFTLicense>(nftsEntries.vals(), nftsEntries.size(), Nat.equal, natHash);
    transactions := HashMap.fromIter<Nat, Types.Transaction>(transactionsEntries.vals(), transactionsEntries.size(), Nat.equal, natHash);
    conversations := HashMap.fromIter<Nat, Types.Conversation>(conversationsEntries.vals(), conversationsEntries.size(), Nat.equal, natHash);
    messages := HashMap.fromIter<Nat, Types.Message>(messagesEntries.vals(), messagesEntries.size(), Nat.equal, natHash);
    events := HashMap.fromIter<Nat, Types.Event>(eventsEntries.vals(), eventsEntries.size(), Nat.equal, natHash);
    franchisorRatings := HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(franchisorRatingsEntries.size(), Principal.equal, Principal.hash);
    for ((f, innerEntries) in Iter.fromArray(franchisorRatingsEntries)) {
      let innerMap = HashMap.fromIter<Principal, Nat>(Iter.fromArray(innerEntries), innerEntries.size(), Principal.equal, Principal.hash);
      franchisorRatings.put(f, innerMap);
    };
    franchisorComments := HashMap.HashMap<Principal, List.List<Types.Comment>>(franchisorCommentsEntries.size(), Principal.equal, Principal.hash);
    for ((f, innerArray) in Iter.fromArray(franchisorCommentsEntries)) {
      franchisorComments.put(f, List.fromArray(innerArray));
    };
    // Seed categories if empty
    Debug.print("Check category size: " # Nat.toText(categories.size()));
    Debug.print("Seeding categories...");
    var id : Nat = nextCategoryId;
    categories.put(id, { id; name = "Barber & Salon"; description = "Offers hair cutting, styling, and other personal grooming services." });
    id += 1;
    categories.put(id, { id; name = "Beverage"; description = "Includes places that sell drinks, like coffee shops, juice bars, or bubble tea stores." });
    id += 1;
    categories.put(id, { id; name = "Expedition & Delivery"; description = "Covers courier and logistics services for shipping packages and goods." });
    id += 1;
    categories.put(id, { id; name = "Entertainment"; description = "Features venues and services for leisure activities, such as movie theaters, arcades, or event organizers." });
    id += 1;
    categories.put(id, { id; name = "Restaurant"; description = "Describes establishments that serve meals, from casual diners to fine dining." });
    id += 1;
    categories.put(id, { id; name = "Food (Express)"; description = "Refers to businesses providing fast food or quick-service meals for takeout or delivery." });
    nextCategoryId := id + 1;
    Debug.print("Postupgrade completed.");
  };

  // User functions
  public shared (msg) func registerUser(
    name : Text,
    email : Text,
    bio : Text,
    role : Types.Role,
    profilePicUrl : Text,
    linkedin : ?Text,
    instagram : ?Text,
    twitter : ?Text,
    address : ?Text,
    phoneNumber : ?Text,
  ) : async ?Types.User {
    let caller = msg.caller;

    switch (users.get(caller)) {
      case (?existingUser) {
        return ?existingUser;
      };
      case null {
        if (role == #Franchisor) {
          if (address == null or phoneNumber == null) {
            throw Error.reject("Address and phone number are required for franchisors");
          };
        };
        let newUser : Types.User = {
          principal = caller;
          name;
          email;
          bio;
          role;
          createdAt = Time.now();
          profilePicUrl;
          linkedin;
          instagram;
          twitter;
          address;
          phoneNumber;
        };
        users.put(caller, newUser);
        return ?newUser;
      };
    };
  };

  public shared (msg) func updateFranchisorProfile(
    bio : ?Text,
    profilePicUrl : ?Text,
    linkedin : ?Text,
    instagram : ?Text,
    twitter : ?Text,
    address : ?Text,
    phoneNumber : ?Text,
  ) : async ?Types.User {
    let caller = msg.caller;
    switch (users.get(caller)) {
      case (?user) {
        if (user.role != #Franchisor) {
          throw Error.reject("Only franchisors can use this update method");
        };
        let updatedUser : Types.User = {
          user with
          bio = switch (bio) { case null user.bio; case (?b) b };
          profilePicUrl = switch (profilePicUrl) {
            case null user.profilePicUrl;
            case (?p) p;
          };
          linkedin = switch (linkedin) { case null user.linkedin; case (?l) ?l };
          instagram = switch (instagram) {
            case null user.instagram;
            case (?i) ?i;
          };
          twitter = switch (twitter) { case null user.twitter; case (?t) ?t };
          address = switch (address) { case null user.address; case (?a) ?a };
          phoneNumber = switch (phoneNumber) {
            case null user.phoneNumber;
            case (?ph) ?ph;
          };
        };
        users.put(caller, updatedUser);
        ?updatedUser;
      };
      case null {
        throw Error.reject("User not found");
      };
    };
  };

  public shared (msg) func updateFranchiseeProfile(
    bio : ?Text,
    profilePicUrl : ?Text,
  ) : async ?Types.User {
    let caller = msg.caller;
    switch (users.get(caller)) {
      case (?user) {
        if (user.role != #Franchisee and user.role != #Admin) {
          throw Error.reject("Only franchisees can use this update method");
        };
        let updatedUser : Types.User = {
          user with
          bio = switch (bio) { case null user.bio; case (?b) b };
          profilePicUrl = switch (profilePicUrl) {
            case null user.profilePicUrl;
            case (?p) p;
          };
        };
        users.put(caller, updatedUser);
        ?updatedUser;
      };
      case null {
        throw Error.reject("User not found");
      };
    };
  };

  public query func getUser(principal : Principal) : async ?Types.User {
    users.get(principal);
  };

  public query (message) func whoami() : async Principal {
    message.caller;
  };

  public query (msg) func listUsers() : async [Types.User] {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin) {
      throw Error.reject("Only admins can list all users");
    };
    Iter.toArray(users.vals());
  };

  // Franchise functions (only franchisors can create)
  public shared (msg) func createFranchise(
    name : Text,
    categoryIds : [Nat],
    description : Text,
    startingPrice : Float,
    foundedIn : Time.Time,
    totalOutlets : Nat,
    legalEntity : Text,
    minGrossProfit : ?Float,
    maxGrossProfit : ?Float,
    minNetProfit : ?Float,
    maxNetProfit : ?Float,
    isDepositRequired : Bool,
    royaltyFee : ?Text,
    licenseDuration : Types.LicenseDuration,
    coverImageUrl : Text,
    productGallery : [Text],
    contactNumber : ?Text,
    contactEmail : ?Text,
    locations : [Text],
  ) : async Nat {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisor) {
      throw Error.reject("Only franchisors can create franchises");
    };
    let id = nextFranchiseId;
    nextFranchiseId += 1;
    let franchise : Types.Franchise = {
      id;
      owner = caller;
      name;
      categoryIds = List.fromArray(categoryIds);
      description;
      startingPrice;
      foundedIn;
      totalOutlets;
      legalEntity;
      minGrossProfit;
      maxGrossProfit;
      minNetProfit;
      maxNetProfit;
      isDepositRequired;
      royaltyFee;
      licenseDuration;
      coverImageUrl;
      productGallery = List.fromArray(productGallery);
      contactNumber;
      contactEmail;
      locations = List.fromArray(locations);
      status = #Active;
      isVerified = false; // Admin verifies later
      reviewsCount = 0;
    };
    franchises.put(id, franchise);
    id;
  };

  public shared (msg) func updateFranchise(
    id : Nat,
    name : Text,
    categoryIds : [Nat],
    description : Text,
    startingPrice : Float,
    foundedIn : Time.Time,
    totalOutlets : Nat,
    legalEntity : Text,
    minGrossProfit : ?Float,
    maxGrossProfit : ?Float,
    minNetProfit : ?Float,
    maxNetProfit : ?Float,
    isDepositRequired : Bool,
    royaltyFee : ?Text,
    licenseDuration : Types.LicenseDuration,
    coverImageUrl : Text,
    productGallery : [Text],
    contactNumber : ?Text,
    contactEmail : ?Text,
    locations : [Text],
    status : { #Active; #Inactive },
    isVerified : Bool,
  ) : async Result.Result<Nat, Text> {
    let caller = msg.caller;
    let ?user = users.get(caller) else return #err("User not registered");
    let ?franchise = franchises.get(id) else return #err("Franchise not found");

    if (user.role != #Franchisor or franchise.owner != caller) {
      return #err("Only the franchise owner can update this franchise");
    };

    let updatedFranchise : Types.Franchise = {
      id = franchise.id;
      owner = franchise.owner;
      name;
      categoryIds = List.fromArray(categoryIds);
      description;
      startingPrice;
      foundedIn;
      totalOutlets;
      legalEntity;
      minGrossProfit;
      maxGrossProfit;
      minNetProfit;
      maxNetProfit;
      isDepositRequired;
      royaltyFee;
      licenseDuration;
      coverImageUrl;
      productGallery = List.fromArray(productGallery);
      contactNumber;
      contactEmail;
      locations = List.fromArray(locations);
      status;
      isVerified;
      reviewsCount = franchise.reviewsCount;
    };

    franchises.put(id, updatedFranchise);
    #ok(id);
  };

  public query func getFranchise(id : Nat) : async ?Types.Franchise {
    franchises.get(id);
  };

  public query func getFranchisesByOwner(owner : Principal) : async [Types.Franchise] {
    let entries = Iter.toArray(franchises.entries());
    let ownedFranchises = Iter.toArray(
      Iter.filter<Types.Franchise>(
        Iter.map<(Nat, Types.Franchise), Types.Franchise>(
          Iter.fromArray(entries),
          func((id, franchise)) { franchise },
        ),
        func(franchise) { franchise.owner == owner },
      )
    );
    ownedFranchises;
  };

  public query func listFranchises() : async [Types.Franchise] {
    Iter.toArray(franchises.vals());
  };

  public query func listFranchisesByCategoryIds(categoryIds : [Nat]) : async [Types.Franchise] {
    let results = Buffer.Buffer<Types.Franchise>(0);

    for ((franchiseKey, franchiseValue) in franchises.entries()) {
      for (categoryId in categoryIds.vals()) {
        if (List.some(franchiseValue.categoryIds, func(id : Nat) : Bool { id == categoryId })) {
          results.add(franchiseValue);
        };
      };
    };
    Buffer.toArray(results);
  };

  public query func listCategories() : async [Types.Category] {
    Iter.toArray(categories.vals());
  };

  public shared func createCategory(name : Text, description : Text) : async Nat {
    // let ?user = users.get(caller) else throw Error.reject("User not registered");
    // if (user.role != #Admin) {
    //   throw Error.reject("Only admins can create categories");
    // };
    let id = nextCategoryId;
    nextCategoryId += 1;
    let category : Types.Category = { id; name; description };
    categories.put(id, category);
    id;
  };

  public query func getCategory(id : Nat) : async ?Types.Category {
    categories.get(id);
  };

  // Application functions
  public shared (msg) func applyForFranchise(franchiseId : Nat, coverLetter : Text) : async Nat {
    let caller = msg.caller;

    // Check user exists
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisee) {
      throw Error.reject("Only franchisees can apply");
    };

    // Check franchise exists
    let ?_ = franchises.get(franchiseId) else throw Error.reject("Franchise not found");

    // Check if caller already applied to this franchise
    for ((_, app) in applications.entries()) {
      if (app.franchiseId == franchiseId and app.applicantPrincipal == caller) {
        throw Error.reject("You have already submitted an application for this franchise");
      };
    };

    // Create new application
    let id = nextApplicationId;
    nextApplicationId += 1;

    let application : Types.Application = {
      id;
      franchiseId;
      applicantPrincipal = caller;
      status = #Submitted;
      coverLetter;
      createdAt = Time.now();
      updatedAt = Time.now();
      rejectionReason = null;
      price = 0;
      completedAt = null;
    };

    applications.put(id, application);
    id;
  };

  public query func getApplication(id : Nat) : async ?Types.Application {
    applications.get(id);
  };

  public query func getApplicationsByOwner(owner : Principal) : async [Types.Application] {
    let results = Buffer.Buffer<Types.Application>(0);

    // First, find all franchises owned by the specified principal
    let ownerFranchises = Buffer.Buffer<Types.Franchise>(0);
    for (franchise in franchises.vals()) {
      if (Principal.equal(franchise.owner, owner)) {
        ownerFranchises.add(franchise);
      };
    };

    for ((k, v) in applications.entries()) {
      for (franchise in ownerFranchises.vals()) {
        if (v.franchiseId == franchise.id) {
          results.add(v);
        };
      };
    };

    Buffer.toArray(results);
  };

  public query func getApplicationsByApplicant(applicant : Principal) : async [Types.Application] {
    let results = Buffer.Buffer<Types.Application>(0);
    for (application in applications.vals()) {
      if (Principal.equal(application.applicantPrincipal, applicant)) {
        results.add(application);
      };
    };
    Buffer.toArray(results);
  };

  public shared (msg) func approveApplication(applicationId : Nat, priceh : Nat) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin and user.role != #Franchisor) {
      throw Error.reject("Only admins and franchisors can approve");
    };
    let ?app = applications.get(applicationId) else throw Error.reject("Application not found");
    let ?franchise = franchises.get(app.franchiseId) else throw Error.reject("Franchise not found");
    if (franchise.owner != caller) {
      throw Error.reject("Not the franchise owner");
    };
    if (app.status != #Submitted) { throw Error.reject("Invalid status") };
    let updatedApp = {
      app with status = #PendingPayment;
      price = priceh;
      updatedAt = Time.now();
    };
    applications.put(applicationId, updatedApp);
  };

  public shared (msg) func payApplication(applicationId : Nat) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin and user.role != #Franchisee) {
      throw Error.reject("Only admins and franchisee can pay");
    };
    let ?app = applications.get(applicationId) else throw Error.reject("Application not found");
    let ?franchise = franchises.get(app.franchiseId) else throw Error.reject("Franchise not found");
    if (app.status != #PendingPayment) { throw Error.reject("Invalid status") };
    let updatedApp = {
      app with status = #PendingNFT;
      updatedAt = Time.now();
    };
    applications.put(applicationId, updatedApp);
  };

  public shared (msg) func completeApplication(applicationId : Nat) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin) {
      throw Error.reject("Only admins can complete applications");
    };
    let ?app = applications.get(applicationId) else throw Error.reject("Application not found");
    let ?franchise = franchises.get(app.franchiseId) else throw Error.reject("Franchise not found");
    if (app.status != #PendingNFT) { throw Error.reject("Invalid status") };
    let updatedApp = {
      app with status = #Completed;
      completedAt = ?Time.now();
      updatedAt = Time.now();
    };
    applications.put(applicationId, updatedApp);
  };

  public query func listPendingNFTApplications() : async [Types.Application] {
    let results = Buffer.Buffer<Types.Application>(0);
    for (application in applications.vals()) {
      if (application.status == #PendingNFT) {
        results.add(application);
      };
    };
    Buffer.toArray(results);
  };

  public shared (msg) func rejectApplication(applicationId : Nat, reason : Text) : async Bool {
    let caller = msg.caller;
    let ?user = users.get(caller) else return false;
    if (user.role != #Franchisor) { return false };
    let ?app = applications.get(applicationId) else return false;
    let ?franchise = franchises.get(app.franchiseId) else return false;
    if (franchise.owner != caller) { return false };
    if (app.status != #Submitted) { return false };
    let updatedApp = {
      app with status = #Rejected;
      updatedAt = Time.now();
      rejectionReason = ?reason;
    };
    applications.put(applicationId, updatedApp);
    true;
  };

  public query func getTransaction(id : Nat) : async ?Types.Transaction {
    transactions.get(id);
  };

  public query func listTransactions() : async [Types.Transaction] {
    Iter.toArray(transactions.vals());
  };

  // Chat functions
  public shared (msg) func createConversation(participants : [Principal]) : async Nat {
    let caller = msg.caller;
    let ?_ = users.get(caller) else throw Error.reject("User not registered");

    // Ensure exactly two participants
    if (participants.size() != 2) {
      throw Error.reject("Conversation must have exactly two participants");
    };

    // Ensure both participants are registered and distinct
    for (p in participants.vals()) {
      let ?_ = users.get(p) else throw Error.reject("All participants must be registered users");
    };
    if (Principal.equal(participants[0], participants[1])) {
      throw Error.reject("Participants must be distinct users");
    };

    let id = nextConversationId;
    nextConversationId += 1;
    let conversation : Types.Conversation = {
      conversationId = id;
      participants = List.fromArray(participants);
    };
    conversations.put(id, conversation);
    id;
  };

  public query func getAllConversationsByPrincipal(principal : Principal) : async [Types.Conversation] {
    let results = Buffer.Buffer<Types.Conversation>(0);
    for (conversation in conversations.vals()) {
      if (List.some(conversation.participants, func(p : Principal) : Bool { Principal.equal(p, principal) })) {
        results.add(conversation);
      };
    };
    Buffer.toArray(results);
  };

  public query func getAllMessagesByConversation(conversationId : Nat) : async [Types.Message] {
    let ?_ = conversations.get(conversationId) else return [];
    let results = Buffer.Buffer<Types.Message>(0);
    for (message in messages.vals()) {
      if (message.conversationId == conversationId) {
        results.add(message);
      };
    };
    Buffer.toArray(results);
  };

  public shared (msg) func sendMessage(conversationId : Nat, recipientPrincipal : Principal, text : Text) : async Nat {
    let caller = msg.caller;
    let ?_ = users.get(caller) else throw Error.reject("User not registered");
    let ?conversation = conversations.get(conversationId) else throw Error.reject("Conversation not found");

    // Verify sender and recipient are in the conversation
    if (not List.some(conversation.participants, func(p : Principal) : Bool { Principal.equal(p, caller) })) {
      throw Error.reject("Sender not a participant in this conversation");
    };
    if (not List.some(conversation.participants, func(p : Principal) : Bool { Principal.equal(p, recipientPrincipal) })) {
      throw Error.reject("Recipient not a participant in this conversation");
    };

    let messageId = nextMessageId;
    nextMessageId += 1;
    let message : Types.Message = {
      messageId;
      senderPrincipal = caller;
      recipientPrincipal;
      text;
      timestamp = Time.now();
      conversationId;
    };
    messages.put(messageId, message);
    messageId;
  };

  // Event functions
  public shared (msg) func createNewEvent(
    title : Text,
    category : Types.EventCategory,
    description : Text,
    startTime : Nat,
    endTime : Nat,
    location : Types.EventLocation,
    imageUrl : Text,
    featuredFranchises : [Nat],
    registrationMode : Types.RegistrationMode,
  ) : async Nat {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisor and user.role != #Franchisee) {
      throw Error.reject("Only franchisors and franchisees can create events");
    };

    // Validate featured franchises exist
    for (franchiseId in featuredFranchises.vals()) {
      let ?_ = franchises.get(franchiseId) else throw Error.reject("Invalid franchise ID: " # Nat.toText(franchiseId));
    };

    let id = nextEventId;
    nextEventId += 1;
    let event : Types.Event = {
      id;
      organizerPrincipal = caller;
      title;
      category;
      description;
      startTime;
      endTime;
      location;
      imageUrl;
      featuredFranchises;
      attendees = [];
      registrationMode;
      createdAt = Time.now();
    };
    events.put(id, event);
    id;
  };

  public query func getAllEvents() : async [Types.Event] {
    Iter.toArray(events.vals());
  };

  public query func getEventDetails(id : Nat) : async ?Types.Event {
    events.get(id);
  };

  public shared (msg) func registerInEvents(eventId : Nat) : async Bool {
    let caller = msg.caller;
    let ?_ = users.get(caller) else return false;
    let ?event = events.get(eventId) else return false;

    // Check if user is already registered
    for (attendee in event.attendees.vals()) {
      if (Principal.equal(attendee, caller)) {
        return false; // Already registered
      };
    };

    // Check registration mode and permissions
    switch (event.registrationMode) {
      case (#InviteOnly) {
        if (event.organizerPrincipal != caller) {
          return false; // Only organizer can invite for invite-only events
        };
      };
      case (#Open) {
        // Allow registration for open events
      };
    };

    // Add user to attendees
    let updatedAttendees = Array.append(event.attendees, [caller]);
    let updatedEvent = { event with attendees = updatedAttendees };
    events.put(eventId, updatedEvent);
    true;
  };

  public query func isAttendee(eventId : Nat, principal : Principal) : async Bool {
    switch (events.get(eventId)) {
      case (?event) {
        for (attendee in event.attendees.vals()) {
          if (Principal.equal(attendee, principal)) {
            return true;
          };
        };
        false;
      };
      case null { false };
    };
  };

  public query func isOrganizer(eventId : Nat, principal : Principal) : async Bool {
    switch (events.get(eventId)) {
      case (?event) {
        Principal.equal(event.organizerPrincipal, principal);
      };
      case null { false };
    };
  };

  // Rating and Comment functions
  public query func getFranchisorRating(franchisor : Principal) : async ?Float {
    switch (franchisorRatings.get(franchisor)) {
      case (?raters) {
        if (raters.size() == 0) {
          ?0.0;
        } else {
          var sum : Nat = 0;
          for (score in raters.vals()) {
            sum += score;
          };
          ?(Float.fromInt(sum) / Float.fromInt(raters.size()));
        };
      };
      case null {
        null;
      };
    };
  };

  public query (msg) func checkRateState(franchisor : Principal) : async Bool {
    let caller = msg.caller;
    switch (franchisorRatings.get(franchisor)) {
      case (?raters) {
        switch (raters.get(caller)) {
          case null false;
          case _ true;
        };
      };
      case null false;
    };
  };

  public shared (msg) func rateFranchisor(franchisor : Principal, score : Nat) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisee) {
      throw Error.reject("Only franchisees can rate franchisors");
    };
    let ?franchisorUser = users.get(franchisor) else throw Error.reject("Franchisor not found");
    if (franchisorUser.role != #Franchisor) {
      throw Error.reject("Target is not a franchisor");
    };
    if (score > 5 or score < 0) {
      throw Error.reject("Score must be between 0 and 5");
    };
    var raters = switch (franchisorRatings.get(franchisor)) {
      case (?r) r;
      case null {
        let newRaters = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
        franchisorRatings.put(franchisor, newRaters);
        newRaters;
      };
    };
    if (raters.get(caller) != null) {
      throw Error.reject("You have already rated this franchisor. Use updateRate instead.");
    };
    raters.put(caller, score);
  };

  public shared (msg) func updateRate(franchisor : Principal, score : Nat) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisee) {
      throw Error.reject("Only franchisees can update ratings");
    };
    let ?franchisorUser = users.get(franchisor) else throw Error.reject("Franchisor not found");
    if (franchisorUser.role != #Franchisor) {
      throw Error.reject("Target is not a franchisor");
    };
    if (score > 5 or score < 0) {
      throw Error.reject("Score must be between 0 and 5");
    };
    switch (franchisorRatings.get(franchisor)) {
      case (?raters) {
        if (raters.get(caller) == null) {
          throw Error.reject("You have not rated this franchisor yet. Use rateFranchisor instead.");
        };
        raters.put(caller, score);
      };
      case null {
        throw Error.reject("No ratings exist for this franchisor");
      };
    };
  };

  public shared (msg) func sendComments(franchisor : Principal, text : Text) : async () {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisee) {
      throw Error.reject("Only franchisees can send comments to franchisors");
    };
    let ?franchisorUser = users.get(franchisor) else throw Error.reject("Franchisor not found");
    if (franchisorUser.role != #Franchisor) {
      throw Error.reject("Target is not a franchisor");
    };
    var comments = switch (franchisorComments.get(franchisor)) {
      case (?c) c;
      case null List.nil<Types.Comment>();
    };
    let newComment : Types.Comment = {
      commenter = caller;
      text;
      timestamp = Time.now();
    };
    comments := List.push(newComment, comments);
    franchisorComments.put(franchisor, comments);
  };

  public query func getAllComments(franchisor : Principal) : async [Types.Comment] {
    switch (franchisorComments.get(franchisor)) {
      case (?comments) List.toArray(comments);
      case null [];
    };
  };

  public func askAI(question : Text) : async Text {
    let response = await LLM.prompt(#Llama3_1_8B, question);
    response;
  };

  public func analyzeFranchise(userMessage : Text, franchise : Types.Franchise) : async Text {
    // Serialize franchise data to Text for the tool
    let franchiseText = serializeFranchise(franchise);

    let response = await LLM.chat(#Llama3_1_8B).withMessages([
      #system_ {
        content = "You are a helpful assistant for analyzing franchise opportunities.";
      },
      #user {
        content = userMessage # "\nFranchise data: " # franchiseText;
      },
    ]).withTools([
      LLM.tool("analyze_franchise").withDescription("Analyze the score and potential of a franchise based on its attributes").withParameter(
        LLM.parameter("franchise", #String).withDescription("Serialized franchise data as text").isRequired()
      ).build()
    ]).send();

    switch (response.message.tool_calls.size()) {
      case (0) {
        switch (response.message.content) {
          case (?content) { content };
          case null { "No response received" };
        };
      };
      case (_) {
        var toolResults : [LLM.ChatMessage] = [];

        for (toolCall in response.message.tool_calls.vals()) {
          let result = switch (toolCall.function.name) {
            case ("analyze_franchise") {
              await analyzeFranchiseData(franchise);
            };
            case (_) {
              "Unknown tool: " # toolCall.function.name;
            };
          };

          toolResults := Array.append(
            toolResults,
            [
              #tool {
                content = result;
                tool_call_id = toolCall.id;
              }
            ],
          );
        };

        let finalResponse = await LLM.chat(#Llama3_1_8B).withMessages(
          Array.append(
            [
              #system_ {
                content = "You are a helpful assistant for analyzing franchise opportunities.";
              },
              #user {
                content = userMessage # "\nFranchise data: " # franchiseText;
              },
              #assistant(response.message),
            ],
            toolResults,
          )
        ).send();

        switch (finalResponse.message.content) {
          case (?content) { content };
          case null { "No final response received" };
        };
      };
    };
  };

  private func serializeFranchise(franchise : Types.Franchise) : Text {
    let categoryIdsText = Text.join(", ", List.toIter(List.map(franchise.categoryIds, Nat.toText)));
    let productGalleryText = Text.join(", ", List.toIter(franchise.productGallery));
    let locationsText = Text.join(", ", List.toIter(franchise.locations));
    let profitSummary = switch (franchise.minNetProfit, franchise.maxNetProfit) {
      case (?min, ?max) { Float.toText(min) # " - " # Float.toText(max) };
      case _ { "unavailable" };
    };
    let licenseDurationText = switch (franchise.licenseDuration) {
      case (#OneTime) { "OneTime" };
      case (#Years n) { Nat.toText(n) # " years" };
    };
    "ID: " # Nat.toText(franchise.id) # ", " #
    "Owner: " # Principal.toText(franchise.owner) # ", " #
    "Name: " # franchise.name # ", " #
    "Categories: [" # categoryIdsText # "], " #
    "Description: " # franchise.description # ", " #
    "Starting Price: $" # Float.toText(franchise.startingPrice) # ", " #
    "Founded: " # Nat.toText(timeToYear(franchise.foundedIn)) # ", " #
    "Outlets: " # Nat.toText(franchise.totalOutlets) # ", " #
    "Legal Entity: " # franchise.legalEntity # ", " #
    "Net Profit: " # profitSummary # ", " #
    "Deposit Required: " # (if (franchise.isDepositRequired) "Yes" else "No") # ", " #
    "Royalty Fee: " # (switch (franchise.royaltyFee) { case (?fee) fee; case null "None" }) # ", " #
    "License Duration: " # licenseDurationText # ", " #
    "Cover Image: " # franchise.coverImageUrl # ", " #
    "Gallery: [" # productGalleryText # "], " #
    "Contact Number: " # (switch (franchise.contactNumber) { case (?num) num; case null "None" }) # ", " #
    "Contact Email: " # (switch (franchise.contactEmail) { case (?email) email; case null "None" }) # ", " #
    "Locations: [" # locationsText # "], " #
    "Status: " # (switch (franchise.status) { case (#Active) "Active"; case (#Inactive) "Inactive" }) # ", " #
    "Verified: " # (if (franchise.isVerified) "Yes" else "No") # ", " #
    "Reviews: " # Nat.toText(franchise.reviewsCount);
  };

  private func timeToYear(time : Time.Time) : Nat {
    let nanosPerYear : Int = 365 * 24 * 60 * 60 * 1_000_000_000;
    let year : Int = time / nanosPerYear + 1970;
    Int.abs(year);
  };

  private func analyzeFranchiseData(franchise : Types.Franchise) : async Text {
    let nanosPerYear : Int = 365 * 24 * 60 * 60 * 1_000_000_000;
    let currentYear : Int = Time.now() / nanosPerYear + 1970;
    let foundedYear : Int = franchise.foundedIn / nanosPerYear + 1970;
    let yearsInOperation : Nat = if (currentYear >= foundedYear) {
      Int.abs(currentYear - foundedYear);
    } else {
      0;
    };

    let profitSummary = switch (franchise.minNetProfit, franchise.maxNetProfit) {
      case (?min, ?max) {
        "Net profit range: $" # Float.toText(min) # " - $" # Float.toText(max);
      };
      case _ { "Profit data unavailable" };
    };

    let licenseDurationText = switch (franchise.licenseDuration) {
      case (#OneTime) { "One-time license" };
      case (#Years n) { Nat.toText(n) # " years" };
    };

    "Analysis of " # franchise.name # ":\n" #
    "- Years in operation: " # Nat.toText(yearsInOperation) # "\n" #
    "- Total outlets: " # Nat.toText(franchise.totalOutlets) # "\n" #
    "- Starting price: $" # Float.toText(franchise.startingPrice) # "\n" #
    "- " # profitSummary # "\n" #
    "- Status: " # (switch (franchise.status) { case (#Active) "Active"; case (#Inactive) "Inactive" }) # "\n" #
    "- Verified: " # (if (franchise.isVerified) "Yes" else "No") # "\n" #
    "This franchise appears " # (if (franchise.isVerified and franchise.status == #Active) "promising" else "risky") # ".";
  };
};
