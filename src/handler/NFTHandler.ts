import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE, NFTLicense } from "@/declarations/icrc/icrc.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";
import { Account } from "@dfinity/ledger-icp";

export interface FrontendNFTLicense {
  tokenId: number;
  franchiseId: number;
  owner: Account;
  issuer: Account;
  issueDate: Date;
  expiryDate?: Date;
  name?: string;
  description?: string;
  tokenUri?: string;
}

export class NFTHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapNFTLicense(nft: NFTLicense): FrontendNFTLicense {
    return {
      tokenId: Number(nft.tokenId),
      franchiseId: Number(nft.franchiseId),
      owner: {
        owner: nft.owner.owner,
        subaccount: optionalToUndefined(nft.owner.subaccount)
          ? [new Uint8Array(optionalToUndefined(nft.owner.subaccount)!)]
          : [],
      },
      issuer: {
        owner: nft.issuer.owner,
        subaccount: optionalToUndefined(nft.issuer.subaccount)
          ? [new Uint8Array(optionalToUndefined(nft.issuer.subaccount)!)]
          : [],
      },
      issueDate: timeToDate(nft.issueDate),
      expiryDate: optionalToUndefined(nft.expiryDate)
        ? timeToDate(optionalToUndefined(nft.expiryDate)!)
        : undefined,
      name: optionalToUndefined(nft.name),
      description: optionalToUndefined(nft.description),
      tokenUri: optionalToUndefined(nft.tokenUri),
    };
  }

  async getNFTLicense(tokenId: number): Promise<FrontendNFTLicense | null> {
    const result = await this.actor.getNFTLicense(BigInt(tokenId));
    return optionalToUndefined(result)
      ? this.mapNFTLicense(optionalToUndefined(result)!)
      : null;
  }

  async getTokensByFranchise(franchiseId: number): Promise<number[]> {
    const result = await this.actor.getTokensByFranchise(BigInt(franchiseId));
    return result.map(Number);
  }
}
