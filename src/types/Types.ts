export type Role = "Franchisor" | "Franchisee" | "Admin";

export type ApplicationStatus =
  | "Submitted"
  | "InReview"
  | "Approved"
  | "Rejected";

export type LicenseDuration = { OneTime: null } | { Years: bigint };

export type Value =
  | { Nat: bigint }
  | { Int: bigint }
  | { Text: string }
  | { Blob: Uint8Array };

export interface Account {
  owner: string; // Principal as string
  subaccount: Uint8Array | null;
}

export interface MetadataEntry {
  [0]: string;
  [1]: Value;
}

export interface User {
  principal: string; // Principal as string
  name: string;
  email: string;
  bio: string;
  role: Role;
  createdAt: bigint; // Time as bigint (nanoseconds)
  profilePicUrl: string | null;
}

export interface Franchise {
  id: bigint;
  owner: string; // Principal as string
  name: string;
  categoryIds: bigint[];
  description: string;
  startingPrice: number; // Float
  foundedIn: bigint; // Time as bigint
  totalOutlets: bigint;
  legalEntity: string;
  minGrossProfit: number | null;
  maxGrossProfit: number | null;
  minNetProfit: number | null;
  maxNetProfit: number | null;
  isDepositRequired: boolean;
  royaltyFee: string | null;
  licenseDuration: LicenseDuration;
  coverImageUrl: string;
  productGallery: string[];
  contactNumber: string | null;
  contactEmail: string | null;
  locations: string[];
  status: "Active" | "Inactive";
  isVerified: boolean;
  reviewsCount: bigint;
}

export interface Category {
  id: bigint;
  name: string;
  description: string;
}

export interface Application {
  id: bigint;
  franchiseId: bigint;
  applicantPrincipal: string; // Principal as string
  status: ApplicationStatus;
  coverLetter: string;
  createdAt: bigint;
  updatedAt: bigint;
  rejectionReason: string | null;
}

export interface NFTLicense {
  tokenId: bigint;
  franchiseId: bigint;
  owner: Account;
  issuer: Account;
  issueDate: bigint;
  expiryDate: bigint | null;
  metadata: MetadataEntry[];
  transferHistory: { from: Account; to: Account; timestamp: bigint }[];
}

export interface Transaction {
  id: bigint;
  from: string; // Principal as string
  to: string; // Principal as string
  amount: bigint;
  timestamp: bigint;
  purpose: string;
  relatedNftId: bigint | null;
  relatedApplicationId: bigint | null;
}
