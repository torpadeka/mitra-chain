import Types "Types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";

persistent actor {
  private func natHash(n : Nat) : Hash.Hash {
    Text.hash(Nat.toText(n));
  };

  // Stable counters
  var nextFranchiseId : Nat = 0;
  var nextCategoryId : Nat = 0;
  var nextApplicationId : Nat = 0;
  var nextTokenId : Nat = 0;
  var nextTransactionId : Nat = 0;
  var nextConversationId : Nat = 0;
  var nextMessageId : Nat = 0;

  // Stable storage arrays for upgrades
  var usersEntries : [(Principal, Types.User)] = [];
  var franchisesEntries : [(Nat, Types.Franchise)] = [];
  var categoriesEntries : [(Nat, Types.Category)] = [];
  var applicationsEntries : [(Nat, Types.Application)] = [];
  var nftsEntries : [(Nat, Types.NFTLicense)] = [];
  var transactionsEntries : [(Nat, Types.Transaction)] = [];
  var conversationsEntries : [(Nat, Types.Conversation)] = [];
  var messagesEntries : [(Nat, Types.Message)] = [];

  // HashMaps for data
  transient var users = HashMap.HashMap<Principal, Types.User>(0, Principal.equal, Principal.hash);
  transient var franchises = HashMap.HashMap<Nat, Types.Franchise>(0, Nat.equal, natHash);
  transient var categories = HashMap.HashMap<Nat, Types.Category>(0, Nat.equal, natHash);
  transient var applications = HashMap.HashMap<Nat, Types.Application>(0, Nat.equal, natHash);
  transient var nfts = HashMap.HashMap<Nat, Types.NFTLicense>(0, Nat.equal, natHash);
  transient var transactions = HashMap.HashMap<Nat, Types.Transaction>(0, Nat.equal, natHash);
  transient var conversations = HashMap.HashMap<Nat, Types.Conversation>(0, Nat.equal, natHash);
  transient var messages = HashMap.HashMap<Nat, Types.Message>(0, Nat.equal, natHash);

  // Upgrade hooks
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    franchisesEntries := Iter.toArray(franchises.entries());
    categoriesEntries := Iter.toArray(categories.entries());
    applicationsEntries := Iter.toArray(applications.entries());
    nftsEntries := Iter.toArray(nfts.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
    conversationsEntries := Iter.toArray(conversations.entries());
    messagesEntries := Iter.toArray(messages.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), usersEntries.size(), Principal.equal, Principal.hash);
    franchises := HashMap.fromIter<Nat, Types.Franchise>(franchisesEntries.vals(), franchisesEntries.size(), Nat.equal, natHash);
    categories := HashMap.fromIter<Nat, Types.Category>(categoriesEntries.vals(), categoriesEntries.size(), Nat.equal, natHash);
    applications := HashMap.fromIter<Nat, Types.Application>(applicationsEntries.vals(), applicationsEntries.size(), Nat.equal, natHash);
    nfts := HashMap.fromIter<Nat, Types.NFTLicense>(nftsEntries.vals(), nftsEntries.size(), Nat.equal, natHash);
    transactions := HashMap.fromIter<Nat, Types.Transaction>(transactionsEntries.vals(), transactionsEntries.size(), Nat.equal, natHash);
    conversations := HashMap.fromIter<Nat, Types.Conversation>(conversationsEntries.vals(), conversationsEntries.size(), Nat.equal, natHash);
    messages := HashMap.fromIter<Nat, Types.Message>(messagesEntries.vals(), messagesEntries.size(), Nat.equal, natHash);
  };

  // User functions
  public shared (msg) func registerUser(
    name : Text,
    email : Text,
    bio : Text,
    role : Types.Role,
    profilePicUrl : Text,
  ) : async ?Types.User {
    let caller = msg.caller;

    switch (users.get(caller)) {
      case (?existingUser) {
        return ?existingUser;
      };
      case null {
        let newUser : Types.User = {
          principal = caller;
          name;
          email;
          bio;
          role;
          createdAt = Time.now();
          profilePicUrl;
        };
        users.put(caller, newUser);
        return ?newUser;
      };
    };
  };

  public query func getUser(principal : Principal) : async ?Types.User {
    users.get(principal);
  };

  public query (message) func whoami() : async Principal {
    message.caller;
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

  // Category functions (admin only, for simplicity)
  public query func listCategories() : async [Types.Category] {
    Iter.toArray(categories.vals());
  };
  
  public shared (msg) func createCategory(name : Text, description : Text) : async Nat {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin) {
      throw Error.reject("Only admins can create categories");
    };
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
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Franchisee) {
      throw Error.reject("Only franchisees can apply");
    };
    let ?_ = franchises.get(franchiseId) else throw Error.reject("Franchise not found");
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

  // Admin approves application and mints NFT license
  public shared (msg) func approveApplication(applicationId : Nat) : async Nat {
    let caller = msg.caller;
    let ?user = users.get(caller) else throw Error.reject("User not registered");
    if (user.role != #Admin) { throw Error.reject("Only admins can approve") };
    let ?app = applications.get(applicationId) else throw Error.reject("Application not found");
    if (app.status != #Submitted) {
      throw Error.reject("Application not submittable");
    };
    let updatedApp = { app with status = #Approved; updatedAt = Time.now() };
    applications.put(applicationId, updatedApp);

    // Mint NFT
    let tokenId = nextTokenId;
    nextTokenId += 1;
    let ?franchise = franchises.get(app.franchiseId) else throw Error.reject("Franchise not found");
    let issuer : Types.Account = { owner = franchise.owner; subaccount = null };
    let owner : Types.Account = {
      owner = app.applicantPrincipal;
      subaccount = null;
    };
    let expiry : ?Time.Time = switch (franchise.licenseDuration) {
      case (#OneTime) null;
      case (#Years years) ?(Time.now() + (years * 365 * 24 * 60 * 60 * 1_000_000_000)); // Rough ns calculation
    };
    let metadata : [Types.MetadataEntry] = [
      ("franchise_name", #Text(franchise.name)),
      ("franchise_id", #Nat(app.franchiseId)),
      ("license_type", #Text("Franchise License")),
    ];
    let nft : Types.NFTLicense = {
      tokenId;
      franchiseId = app.franchiseId;
      owner;
      issuer;
      issueDate = Time.now();
      expiryDate = expiry;
      metadata;
      transferHistory = List.nil();
    };
    nfts.put(tokenId, nft);

    // Record transaction (e.g., mint)
    let txId = nextTransactionId;
    nextTransactionId += 1;
    let tx : Types.Transaction = {
      id = txId;
      from = franchise.owner;
      to = app.applicantPrincipal;
      amount = 0; // NFT, so no amount; adjust if payments added
      timestamp = Time.now();
      purpose = "NFT Mint for Franchise License";
      relatedNftId = ?tokenId;
      relatedApplicationId = ?applicationId;
    };
    transactions.put(txId, tx);

    tokenId;
  };

  public shared (msg) func rejectApplication(applicationId : Nat, reason : Text) : async Bool {
    let caller = msg.caller;
    let ?user = users.get(caller) else return false;
    if (user.role != #Admin) { return false };
    let ?app = applications.get(applicationId) else return false;
    if (app.status != #Submitted) { return false };
    let updatedApp = {
      app with status = #Rejected;
      updatedAt = Time.now();
      rejectionReason = ?reason;
    };
    applications.put(applicationId, updatedApp);
    true;
  };

  // Basic NFT functions (extend for full ICRC-7)
  public query func getNFT(tokenId : Nat) : async ?Types.NFTLicense {
    nfts.get(tokenId);
  };

  // ICRC-7 compliant transfer (basic; add approvals/memos/created_at_time for full spec)
  public shared (msg) func icrc7_transfer(tokenIds : [Nat], to : Types.Account, memo : ?Blob, createdAtTime : ?Time.Time) : async [?Nat] {
    let caller = msg.caller;
    var results : [var ?Nat] = Array.init(tokenIds.size(), null);
    for (i in Iter.range(0, tokenIds.size() - 1)) {
      let tokenId = tokenIds[i];
      switch (nfts.get(tokenId)) {
        case (?nft) {
          // Assume transfers are from default subaccount (null)
          if (nft.owner.owner != caller or not Option.isNull(nft.owner.subaccount)) {
            results[i] := null; // Not owner
          } else {
            let from = nft.owner;
            let updatedNft = {
              nft with
              owner = to;
              transferHistory = List.push({ from; to; timestamp = Time.now() }, nft.transferHistory);
            };
            nfts.put(tokenId, updatedNft);
            results[i] := ?tokenId; // Success
          };
        };
        case null { results[i] := null };
      };
    };
    Array.freeze(results);
  };

  public query func icrc7_balance_of(account : Types.Account) : async Nat {
    var count : Nat = 0;
    for (nft in nfts.vals()) {
      if (Principal.equal(nft.owner.owner, account.owner) and subaccountsEqual(nft.owner.subaccount, account.subaccount)) {
        count += 1;
      };
    };
    count;
  };

  // Helper function to compare optional subaccounts
  private func subaccountsEqual(sub1 : ?Blob, sub2 : ?Blob) : Bool {
    switch (sub1, sub2) {
      case (null, null) { true }; // Both are null
      case (?b1, ?b2) { Blob.equal(b1, b2) }; // Both are blobs, compare them
      case _ { false }; // One is null, the other is not
    };
  };

  public query func icrc7_owner_of(tokenId : Nat) : async ?Types.Account {
    switch (nfts.get(tokenId)) {
      case (?nft) ?nft.owner;
      case null null;
    };
  };

  public query func icrc7_token_metadata(tokenIds : [Nat]) : async [?[(Text, Types.Value)]] {
    var results : [var ?[(Text, Types.Value)]] = Array.init(tokenIds.size(), null);
    for (i in Iter.range(0, tokenIds.size() - 1)) {
      switch (nfts.get(tokenIds[i])) {
        case (?nft) { results[i] := ?nft.metadata };
        case null {};
      };
    };
    Array.freeze(results);
  };

  public query func icrc7_total_supply() : async Nat {
    nfts.size();
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
    let ?user = users.get(caller) else throw Error.reject("User not registered");

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
    let ?user = users.get(caller) else throw Error.reject("User not registered");
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
};