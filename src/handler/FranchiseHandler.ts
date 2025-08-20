import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Franchise } from "@/declarations/backend/backend.did";
import {
  List,
  List_1,
  listToArray,
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";
import { Principal } from "@ic-reactor/react/dist/types";

export interface FrontendFranchise {
  id: number;
  owner: string;
  name: string;
  categoryIds: number[];
  description: string;
  startingPrice: number;
  foundedIn: Date;
  totalOutlets: number;
  legalEntity: string;
  minGrossProfit?: number;
  maxGrossProfit?: number;
  minNetProfit?: number;
  maxNetProfit?: number;
  isDepositRequired: boolean;
  royaltyFee?: string;
  licenseDuration: { OneTime?: true; Years?: number };
  coverImageUrl: string;
  productGallery: string[];
  contactNumber?: string;
  contactEmail?: string;
  locations: string[];
  status: "Active" | "Inactive";
  isVerified: boolean;
  reviewsCount: number;
}

export class FranchiseHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapFranchise(franchise: Franchise): FrontendFranchise {
    return {
      id: Number(franchise.id),
      owner: principalToString(franchise.owner),
      name: franchise.name,
      categoryIds: listToArray<bigint>(franchise.categoryIds).map(Number),
      description: franchise.description,
      startingPrice: Number(franchise.startingPrice),
      foundedIn: timeToDate(franchise.foundedIn),
      totalOutlets: Number(franchise.totalOutlets),
      legalEntity: franchise.legalEntity,
      minGrossProfit: optionalToUndefined(franchise.minGrossProfit)?.valueOf(),
      maxGrossProfit: optionalToUndefined(franchise.maxGrossProfit)?.valueOf(),
      minNetProfit: optionalToUndefined(franchise.minNetProfit)?.valueOf(),
      maxNetProfit: optionalToUndefined(franchise.maxNetProfit)?.valueOf(),
      isDepositRequired: franchise.isDepositRequired,
      royaltyFee: optionalToUndefined(franchise.royaltyFee),
      licenseDuration:
        "OneTime" in franchise.licenseDuration
          ? { OneTime: true }
          : { Years: Number(franchise.licenseDuration.Years) },
      coverImageUrl: franchise.coverImageUrl,
      productGallery: listToArray<string>(franchise.productGallery),
      contactNumber: optionalToUndefined(franchise.contactNumber),
      contactEmail: optionalToUndefined(franchise.contactEmail),
      locations: listToArray<string>(franchise.locations),
      status: "Active" in franchise.status ? "Active" : "Inactive",
      isVerified: franchise.isVerified,
      reviewsCount: Number(franchise.reviewsCount),
    };
  }

  async createFranchise(
    name: string,
    categoryIds: number[],
    description: string,
    startingPrice: number,
    foundedIn: Date,
    totalOutlets: number,
    legalEntity: string,
    minGrossProfit: number | undefined,
    maxGrossProfit: number | undefined,
    minNetProfit: number | undefined,
    maxNetProfit: number | undefined,
    isDepositRequired: boolean,
    royaltyFee: string | undefined,
    licenseDuration: { OneTime?: true; Years?: number },
    coverImageUrl: string,
    productGallery: string[],
    contactNumber: string | undefined,
    contactEmail: string | undefined,
    locations: string[]
  ): Promise<number> {
    const result = await this.actor.createFranchise(
      name,
      categoryIds.map(BigInt),
      description,
      startingPrice,
      BigInt(foundedIn.getTime() * 1_000_000), // Convert to nanoseconds
      BigInt(totalOutlets),
      legalEntity,
      minGrossProfit ? [minGrossProfit] : [],
      maxGrossProfit ? [maxGrossProfit] : [],
      minNetProfit ? [minNetProfit] : [],
      maxNetProfit ? [maxNetProfit] : [],
      isDepositRequired,
      royaltyFee ? [royaltyFee] : [],
      licenseDuration.OneTime
        ? { OneTime: null }
        : { Years: BigInt(licenseDuration.Years!) },
      coverImageUrl,
      productGallery,
      contactNumber ? [contactNumber] : [],
      contactEmail ? [contactEmail] : [],
      locations
    );
    return Number(result);
  }

  async updateFranchise(
    id: number,
    name: string,
    categoryIds: number[],
    description: string,
    startingPrice: number,
    foundedIn: Date,
    totalOutlets: number,
    legalEntity: string,
    minGrossProfit: number | undefined,
    maxGrossProfit: number | undefined,
    minNetProfit: number | undefined,
    maxNetProfit: number | undefined,
    isDepositRequired: boolean,
    royaltyFee: string | undefined,
    licenseDuration: { OneTime?: true; Years?: number },
    coverImageUrl: string,
    productGallery: string[],
    contactNumber: string | undefined,
    contactEmail: string | undefined,
    locations: string[],
    status: "Active" | "Inactive",
    isVerified: boolean
  ): Promise<number> {
    console.log("YEAR", BigInt(licenseDuration.Years!));
    const result = await this.actor.updateFranchise(
      BigInt(id),
      name,
      categoryIds.map(BigInt),
      description,
      startingPrice,
      BigInt(foundedIn.getTime() * 1_000_000), // Convert to nanoseconds
      BigInt(totalOutlets),
      legalEntity,
      minGrossProfit ? [minGrossProfit] : [],
      maxGrossProfit ? [maxGrossProfit] : [],
      minNetProfit ? [minNetProfit] : [],
      maxNetProfit ? [maxNetProfit] : [],
      isDepositRequired,
      royaltyFee ? [royaltyFee] : [],
      licenseDuration.OneTime
        ? { OneTime: null }
        : { Years: BigInt(licenseDuration.Years!) },
      coverImageUrl,
      productGallery,
      contactNumber ? [contactNumber] : [],
      contactEmail ? [contactEmail] : [],
      locations,
      status === "Active" ? { Active: null } : { Inactive: null },
      isVerified
    );

    if ("ok" in result) {
      return Number(result.ok);
    } else {
      throw new Error(result.err);
    }
  }

  async getFranchise(id: number): Promise<FrontendFranchise | null> {
    const result = await this.actor.getFranchise(BigInt(id));
    return optionalToUndefined(result)
      ? this.mapFranchise(optionalToUndefined(result)!)
      : null;
  }

  async listFranchises(): Promise<FrontendFranchise[]> {
    const result = await this.actor.listFranchises();
    return result.map(this.mapFranchise);
  }
  async getFranchiseByOwner(
    principle: Principal
  ): Promise<FrontendFranchise[]> {
    const result = await this.actor.getFranchisesByOwner(principle);
    return result.map(this.mapFranchise);
  }

  async listFranchisesByCategoryIds(
    categoryIds: number[]
  ): Promise<FrontendFranchise[]> {
    const result = await this.actor.listFranchisesByCategoryIds(
      categoryIds.map(BigInt)
    );
    return result.map(this.mapFranchise);
  }
}
