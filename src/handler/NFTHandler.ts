import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  _SERVICE,
  NFTLicense,
  Account,
  MetadataEntry,
  Time,
} from "@/declarations/backend/backend.did";
import {
  listToArray,
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendNFTLicense {
  tokenId: number;
  franchiseId: number;
  owner: { owner: string; subaccount?: string };
  issuer: { owner: string; subaccount?: string };
  issueDate: Date;
  expiryDate?: Date;
  metadata: [string, string | number][];
  transferHistory: {
    from: { owner: string; subaccount?: string };
    to: { owner: string; subaccount?: string };
    timestamp: Date;
  }[];
}

export class NFTHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapAccount(account: Account): { owner: string; subaccount?: string } {
    return {
      owner: principalToString(account.owner),
      subaccount: optionalToUndefined(account.subaccount)?.toString(),
    };
  }

  private mapMetadataEntry(entry: MetadataEntry): [string, string | number] {
    const [key, value] = entry;
    if ("Nat" in value) return [key, Number(value.Nat)];
    if ("Int" in value) return [key, Number(value.Int)];
    if ("Text" in value) return [key, value.Text];
    if ("Blob" in value) return [key, value.Blob.toString()];
    return [key, ""];
  }

  private mapNFT(nft: NFTLicense): FrontendNFTLicense {
    return {
      tokenId: Number(nft.tokenId),
      franchiseId: Number(nft.franchiseId),
      owner: this.mapAccount(nft.owner),
      issuer: this.mapAccount(nft.issuer),
      issueDate: timeToDate(nft.issueDate),
      expiryDate: optionalToUndefined(nft.expiryDate)
        ? timeToDate(optionalToUndefined(nft.expiryDate)!)
        : undefined,
      metadata: nft.metadata.map(this.mapMetadataEntry),
      transferHistory: listToArray<{
        to: Account;
        from: Account;
        timestamp: Time;
      }>(nft.transferHistory).map((entry) => ({
        from: this.mapAccount(entry.from),
        to: this.mapAccount(entry.to),
        timestamp: timeToDate(entry.timestamp),
      })),
    };
  }

  async getNFT(tokenId: number): Promise<FrontendNFTLicense | null> {
    const result = await this.actor.getNFT(BigInt(tokenId));
    return optionalToUndefined(result)
      ? this.mapNFT(optionalToUndefined(result)!)
      : null;
  }

  async transferNFT(
    tokenIds: number[],
    to: { owner: string; subaccount?: string },
    memo?: string,
    createdAtTime?: Date
  ): Promise<(number | null)[]> {
    const account: Account = {
      owner: Principal.fromText(to.owner),
      subaccount: to.subaccount
        ? [new Uint8Array(Buffer.from(to.subaccount, "hex"))]
        : [],
    };
    const result = await this.actor.icrc7_transfer(
      tokenIds.map(BigInt),
      account,
      memo ? [new Uint8Array(Buffer.from(memo, "hex"))] : [],
      createdAtTime ? [BigInt(createdAtTime.getTime() * 1_000_000)] : []
    );
    return result.map((res) =>
      optionalToUndefined(res) ? Number(optionalToUndefined(res)!) : null
    );
  }

  async balanceOf(account: {
    owner: string;
    subaccount?: string;
  }): Promise<number> {
    const acc: Account = {
      owner: Principal.fromText(account.owner),
      subaccount: account.subaccount
        ? [new Uint8Array(Buffer.from(account.subaccount, "hex"))]
        : [],
    };
    const result = await this.actor.icrc7_balance_of(acc);
    return Number(result);
  }

  async ownerOf(
    tokenId: number
  ): Promise<{ owner: string; subaccount?: string } | null> {
    const result = await this.actor.icrc7_owner_of(BigInt(tokenId));
    return optionalToUndefined(result)
      ? this.mapAccount(optionalToUndefined(result)!)
      : null;
  }

  async tokenMetadata(
    tokenIds: number[]
  ): Promise<(FrontendNFTLicense["metadata"] | null)[]> {
    const result = await this.actor.icrc7_token_metadata(tokenIds.map(BigInt));
    return result.map((res) =>
      optionalToUndefined(res) ? res[0]!.map(this.mapMetadataEntry) : null
    );
  }

  async totalSupply(): Promise<number> {
    const result = await this.actor.icrc7_total_supply();
    return Number(result);
  }
}
