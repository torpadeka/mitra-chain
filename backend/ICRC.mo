// backend/app.mo
// NFT Canister implementing ICRC-7 standard with minting functionality

// --- Standard Library Imports ---
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import D "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Int "mo:base/Int";

// --- Third-Party/External Imports ---
import Vec "mo:vector";
import ICRC7 "mo:icrc7-mo";
import ClassPlus "mo:class-plus";

// --- Local Imports ---
import DefaultConfig "DefaultConfig";
import Types "Types";

// --- Actor Definition ---
shared (init_msg) persistent actor class NftCanister() : async (ICRC7.Service.Service) = this {
  private func natHash(n : Nat) : Hash.Hash {
    Text.hash(Nat.toText(n));
  };

  // --- Initialization ---
  transient let initManager = ClassPlus.ClassPlusInitializationManager(
    init_msg.caller,
    Principal.fromActor(this),
    true,
  );

  var icrc7_migration_state = ICRC7.initialState();

  private func get_icrc7_environment() : ICRC7.Environment {
    {
      add_ledger_transaction = null;
      can_mint = null;
      can_burn = null;
      can_transfer = null;
      can_update = null;
    };
  };

  transient let icrc7 = ICRC7.Init<system>({
    manager = initManager;
    initialState = icrc7_migration_state;
    args = DefaultConfig.defaultConfig(init_msg.caller);
    pullEnvironment = ?get_icrc7_environment;
    onInitialize = null;
    onStorageChange = func(new_state : ICRC7.State) {
      icrc7_migration_state := new_state;
    };
  });

  // --- Query Calls ---

  public query func icrc7_symbol() : async Text {
    switch (icrc7().get_ledger_info().symbol) {
      case (?val) val;
      case (null) "";
    };
  };

  public query func icrc7_name() : async Text {
    switch (icrc7().get_ledger_info().name) {
      case (?val) val;
      case (null) "";
    };
  };

  public query func icrc7_description() : async ?Text {
    icrc7().get_ledger_info().description;
  };

  public query func icrc7_logo() : async ?Text {
    icrc7().get_ledger_info().logo;
  };

  public query func icrc7_max_memo_size() : async ?Nat {
    ?icrc7().get_ledger_info().max_memo_size;
  };

  public query func icrc7_tx_window() : async ?Nat {
    ?icrc7().get_ledger_info().tx_window;
  };

  public query func icrc7_permitted_drift() : async ?Nat {
    ?icrc7().get_ledger_info().permitted_drift;
  };

  public query func icrc7_total_supply() : async Nat {
    icrc7().get_stats().nft_count;
  };

  public query func icrc7_supply_cap() : async ?Nat {
    icrc7().get_ledger_info().supply_cap;
  };

  public query func icrc7_max_query_batch_size() : async ?Nat {
    icrc7().max_query_batch_size();
  };

  public query func icrc7_max_update_batch_size() : async ?Nat {
    icrc7().max_update_batch_size();
  };

  public query func icrc7_default_take_value() : async ?Nat {
    icrc7().default_take_value();
  };

  public query func icrc7_max_take_value() : async ?Nat {
    icrc7().max_take_value();
  };

  public query func icrc7_atomic_batch_transfers() : async ?Bool {
    icrc7().atomic_batch_transfers();
  };

  public query func icrc7_collection_metadata() : async [(Text, ICRC7.Value)] {
    let ledger_info = icrc7().collection_metadata();
    let results = Vec.new<(Text, ICRC7.Value)>();
    Vec.addFromIter(results, ledger_info.vals());
    Vec.toArray(results);
  };

  public query func icrc7_token_metadata(token_ids : [Nat]) : async [?[(Text, ICRC7.Value)]] {
    icrc7().token_metadata(token_ids);
  };

  public query func icrc7_owner_of(token_ids : ICRC7.Service.OwnerOfRequest) : async ICRC7.Service.OwnerOfResponse {
    switch (icrc7().get_token_owners(token_ids)) {
      case (#ok(val)) val;
      case (#err(err)) D.trap(err);
    };
  };

  public query func icrc7_balance_of(accounts : ICRC7.Service.BalanceOfRequest) : async ICRC7.Service.BalanceOfResponse {
    icrc7().balance_of(accounts);
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    icrc7().get_tokens_paginated(prev, take);
  };

  public query func icrc7_tokens_of(account : ICRC7.Account, prev : ?Nat, take : ?Nat) : async [Nat] {
    icrc7().get_tokens_of_paginated(account, prev, take);
  };

  public query func icrc10_supported_standards() : async ICRC7.SupportedStandards {
    [
      { name = "ICRC-7"; url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-7" },
      {
        name = "ICRC-10";
        url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-10";
      },
    ];
  };

  public query func collectionHasBeenClaimed() : async Bool {
    hasBeenClaimed;
  };

  public query func getCollectionOwner() : async Principal {
    icrc7().get_collection_owner();
  };

  // --- Update Calls ---

  public shared (msg) func icrc7_transfer<system>(args : [ICRC7.Service.TransferArg]) : async [?ICRC7.Service.TransferResult] {
    icrc7().transfer<system>(msg.caller, args);
  };

  var hasBeenClaimed = false;

  public shared (msg) func claimCollection() : async () {
    if (hasBeenClaimed) {
      return;
    };
    ignore icrc7().update_ledger_info([#UpdateOwner(msg.caller)]);
    hasBeenClaimed := true;
  };

  // --- Custom NFT Minting Example ---

  var nextTokenId = 0;
  var franchiseToTokensEntries : [(Nat, [Nat])] = [];
  transient var franchiseToTokens = HashMap.HashMap<Nat, Vec.Vector<Nat>>(0, Nat.equal, natHash);

  system func preupgrade() {
    franchiseToTokensEntries := Iter.toArray(
      Iter.map<(Nat, Vec.Vector<Nat>), (Nat, [Nat])>(
        franchiseToTokens.entries(),
        func ((k, v)) { (k, Vec.toArray(v)) }
      )
    );
  };

  system func postupgrade() {
    franchiseToTokens := HashMap.HashMap<Nat, Vec.Vector<Nat>>(franchiseToTokensEntries.size(), Nat.equal, natHash);
    for ((k, arr) in Iter.fromArray(franchiseToTokensEntries)) {
      let vec = Vec.fromArray<Nat>(arr);
      franchiseToTokens.put(k, vec);
    };
  };

  public shared (msg) func mint(
    to : ICRC7.Account,
    name : Text,
    description : Text,
    tokenUri : Text,
    franchiseId : Nat,
    licenseDuration : Types.LicenseDuration, // New parameter
    issueDate : Time.Time             // Base for expiry calculation
  ) : async [ICRC7.SetNFTResult] {
    // Calculate expiryDate based on licenseDuration
    let expiryDate : ?Time.Time = switch (licenseDuration) {
      case (#OneTime) { null }; // No expiry for one-time license
      case (#Years(n)) {
        let nanosPerYear : Int = 365 * 24 * 60 * 60 * 1_000_000_000;
        let yearsInNanos : Int = Int.abs(n) * nanosPerYear;
        ?(issueDate + yearsInNanos); // Add years to issueDate
      };
    };

    let setNftRequest : ICRC7.SetNFTItemRequest = {
      token_id = nextTokenId;
      metadata = #Map([
        ("name", #Text(name)),
        ("description", #Text(description)),
        ("tokenUri", #Text(tokenUri)),
        ("franchiseId", #Nat(franchiseId)),
        ("expiryDate", switch (expiryDate) { case (?d) #Int(d); case null #Option(null) }),
        ("issueDate", #Int(issueDate)),
        ("issuer", #Text(Principal.toText(msg.caller))),
        ("licenseDuration", switch (licenseDuration) {
          case (#OneTime) #Text("OneTime");
          case (#Years(n)) #Text(Nat.toText(n) # " years");
        })
      ]);
      owner = ?to;
      override = false;
      memo = null;
      created_at_time = null;
    };

    switch (icrc7().set_nfts<system>(msg.caller, [setNftRequest], true)) {
      case (#ok(val)) {
        // Index by franchiseId
        let tokens = switch (franchiseToTokens.get(franchiseId)) {
          case (?v) v;
          case null {
            let newVec = Vec.new<Nat>();
            franchiseToTokens.put(franchiseId, newVec);
            newVec;
          };
        };
        Vec.add(tokens, nextTokenId);
        nextTokenId += 1;
        val;
      };
      case (#err(err)) D.trap(err);
    };
  };

  // Get tokens by franchiseId
  public query func getTokensByFranchise(franchiseId : Nat) : async [Nat] {
    switch (franchiseToTokens.get(franchiseId)) {
      case (?tokens) Vec.toArray(tokens);
      case null [];
    };
  };

  // Get full NFTLicense-like data for a token (build from metadata and owner)
  public query func getNFTLicense(tokenId : Nat) : async ?Types.NFTLicense {
    let metadataArray = icrc7().token_metadata([tokenId]);
    if (metadataArray.size() == 0 or metadataArray[0] == null) {
      return null;
    };
    let metadataMap : [(Text, ICRC7.Value)] = switch (metadataArray[0]) {
      case (?m) m;
      case null return null;
    };

    let franchiseId = switch (findInMap(metadataMap, "franchiseId")) {
      case (#Nat(n)) n;
      case _ return null;
    };
    let expiryDate = switch (findInMap(metadataMap, "expiryDate")) {
      case (#Int(i)) ?i;
      case (#Text("")) null;
      case _ return null;
    };
    let issueDate = switch (findInMap(metadataMap, "issueDate")) {
      case (#Int(i)) i;
      case _ return null;
    };
    let issuerText = switch (findInMap(metadataMap, "issuer")) {
      case (#Text(t)) t;
      case _ return null;
    };
    let issuer = if (issuerText == "") {
      return null;
    } else {
      { owner = Principal.fromText(issuerText); subaccount = null };
    };
    let name = switch (findInMap(metadataMap, "name")) {
      case (#Text(t)) ?t;
      case _ null;
    };
    let description = switch (findInMap(metadataMap, "description")) {
      case (#Text(t)) ?t;
      case _ null;
    };
    let tokenUri = switch (findInMap(metadataMap, "tokenUri")) {
      case (#Text(t)) ?t;
      case _ null;
    };

    let owners = icrc7().get_token_owners([tokenId]);
    let owner = switch (owners) {
      case (#ok(arr)) {
        if (arr.size() > 0 and arr[0] != null) {
          switch (arr[0]) {
            case (?o) o;
            case null return null;
          };
        } else {
          return null;
        };
      };
      case (#err(_)) return null;
    };

    ?{
      tokenId;
      franchiseId;
      owner;
      issuer;
      issueDate;
      expiryDate;
      name;
      description;
      tokenUri;
    };
  };

  private func findInMap(map : [(Text, ICRC7.Value)], key : Text) : ICRC7.Value {
    for ((k, v) in map.vals()) {
      if (Text.equal(k, key)) return v;
    };
    #Text("");
  };

};
