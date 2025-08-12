import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import List "mo:base/List";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Blob "mo:base/Blob";

module {
  public type Role = {
    #Franchisor; // Owners who provide franchises
    #Franchisee; // People who want to buy/operate franchises
    #Admin; // Handles verification and administrative tasks
  };

  public type ApplicationStatus = {
    #Submitted;
    #InReview;
    #Approved;
    #Rejected;
  };

  public type LicenseDuration = {
    #OneTime; // Lifetime/one-time payment
    #Years : Nat; // Duration in years
  };

  public type Value = {
    #Nat : Nat;
    #Int : Int;
    #Text : Text;
    #Blob : Blob;
  };

  public type Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  public type MetadataEntry = (Text, Value);

  public type User = {
    principal : Principal;
    name : Text;
    email : Text;
    bio : Text;
    role : Role;
    createdAt : Time.Time;
    profilePicUrl : ?Text;
  };

  public type Franchise = {
    id : Nat;
    owner : Principal;
    name : Text;
    categoryIds : List.List<Nat>;
    description : Text;
    startingPrice : Float;
    foundedIn : Time.Time;
    totalOutlets : Nat;
    legalEntity : Text;
    minGrossProfit : ?Float;
    maxGrossProfit : ?Float;
    minNetProfit : ?Float;
    maxNetProfit : ?Float;
    isDepositRequired : Bool;
    royaltyFee : ?Text;
    licenseDuration : LicenseDuration;
    coverImageUrl : Text;
    productGallery : List.List<Text>;
    contactNumber : ?Text;
    contactEmail : ?Text;
    locations : List.List<Text>;
    status : { #Active; #Inactive };
    isVerified : Bool;
    reviewsCount : Nat;
  };

  public type Category = {
    id : Nat;
    name : Text;
    description : Text;
  };

  public type Application = {
    id : Nat;
    franchiseId : Nat;
    applicantPrincipal : Principal;
    status : ApplicationStatus;
    coverLetter : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    rejectionReason : ?Text;
  };

  public type NFTLicense = {
    tokenId : Nat;
    franchiseId : Nat;
    owner : Account;
    issuer : Account;
    issueDate : Time.Time;
    expiryDate : ?Time.Time;
    metadata : [MetadataEntry];
    transferHistory : List.List<{ from: Account; to: Account; timestamp: Time.Time }>;
  };

  public type Transaction = {
    id : Nat;
    from : Principal;
    to : Principal;
    amount : Nat;
    timestamp : Time.Time;
    purpose : Text;
    relatedNftId : ?Nat;
    relatedApplicationId : ?Nat;
  };
};