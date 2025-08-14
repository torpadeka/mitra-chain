type Franchise = {
  id: number;
  owner: string;
  name: string;
  categoryIds: number[];
  description: string;
  startingPrice: number;
  foundedIn: number; // ✅ matches getTime()
  totalOutlets: number;
  legalEntity: string;
  minGrossProfit?: number;
  maxGrossProfit?: number;
  minNetProfit?: number;
  maxNetProfit?: number;
  isDepositRequired: boolean;
  royaltyFee?: string;
  licenseDuration: { years: number; months: number };
  coverImageUrl: string;
  productGallery: string[];
  contactNumber?: string;
  contactEmail?: string;
  locations: string[];
  status: "Active" | "Inactive";
  isVerified: boolean;
  reviewsCount: number;
};
