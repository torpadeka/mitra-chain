// import { ActorSubclass } from "@dfinity/agent";
// import { Principal } from "@dfinity/principal";
// import { _SERVICE, NFTLicense, Value } from "@/declarations/backend/backend.did";
// import { optionalToUndefined, principalToString, timeToDate } from "@/lib/utils";

// export interface FrontendNFTLicense {
//   tokenId: number;
//   franchiseId: number;
//   owner: string;
//   issuer: string;
//   issueDate: Date;
//   expiryDate?: Date;
//   name?: string;
//   description?: string;
//   tokenUri?: string;
// }

// export interface FrontendNFTMetadata {
//   name?: string;
//   description?: string;
//   tokenUri?: string;
//   expires_at?: number;
//   franchiseId?: number;
// }

// export class NFTHandler {
//   private actor: ActorSubclass<_SERVICE>;

//   constructor(actor: ActorSubclass<_SERVICE>) {
//     this.actor = actor;
//   }

//   private mapNFTLicense(nft: NFTLicense): FrontendNFTLicense {
//     return {
//       tokenId: Number(nft.tokenId),
//       franchiseId: Number(nft.franchiseId),
//       owner: principalToString(nft.owner.owner),
//       issuer: principalToString(nft.issuer.owner),
//       issueDate: timeToDate(nft.issueDate),
//       expiryDate: optionalToUndefined(nft.expiryDate)
//         ? timeToDate(optionalToUndefined(nft.expiryDate)!)
//         : undefined,
//       name: optionalToUndefined(nft.name),
//       description: optionalToUndefined(nft.description),
//       tokenUri: optionalToUndefined(nft.tokenUri),
//     };
//   }

//   private mapNFTMetadata(metadata: [(string, Value)]): FrontendNFTMetadata {
//     const result: FrontendNFTMetadata = {};
//     for (const [key, value] of metadata) {
//       if (key === "name" && "Text" in value) {
//         result.name = value.Text;
//       } else if (key === "description" && "Text" in value) {
//         result.description = value.Text;
//       } else if (key === "tokenUri" && "Text" in value) {
//         result.tokenUri = value.Text;
//       } else if (key === "expires_at" && "Nat" in value) {
//         result.expires_at = Number(value.Nat);
//       } else if (key === "franchiseId" && "Nat" in value) {
//         result.franchiseId = Number(value.Nat);
//       }
//     }
//     return result;
//   }

//   async getNFTLicense(tokenId: number): Promise<FrontendNFTLicense | null> {
//     const result = await this.actor.getNFTLicense(BigInt(tokenId));
//     return optionalToUndefined(result)
//       ? this.mapNFTLicense(optionalToUndefined(result)!)
//       : null;
//   }

//   async getNFTLicensesByOwner(owner: string): Promise<FrontendNFTLicense[]> {
//     const principal = Principal.fromText(owner);
//     const result = await this.actor.getNFTLicensesByOwner(principal);
//     return result.map(this.mapNFTLicense);
//   }

//   async getNFTLicensesByFranchise(franchiseId: number): Promise<FrontendNFTLicense[]> {
//     const result = await this.actor.getNFTLicensesByFranchise(BigInt(franchiseId));
//     return result.map(this.mapNFTLicense);
//   }

//   async getNFTLicenseByOwnerAndFranchise(
//     owner: string,
//     franchiseId: number
//   ): Promise<FrontendNFTLicense | null> {
//     const principal = Principal.fromText(owner);
//     const result = await this.actor.getNFTLicenseByOwnerAndFranchise(
//       principal,
//       BigInt(franchiseId)
//     );
//     return optionalToUndefined(result)
//       ? this.mapNFTLicense(optionalToUndefined(result)!)
//       : null;
//   }

//   async isNFTLicenseValid(tokenId: number): Promise<boolean> {
//     return await this.actor.isNFTLicenseValid(BigInt(tokenId));
//   }

//   async icrc7_symbol(): Promise<string> {
//     return await this.actor.icrc7_symbol();
//   }

//   async icrc7_name(): Promise<string> {
//     return await this.actor.icrc7_name();
//   }

//   async icrc7_description(): Promise<string | null> {
//     return optionalToUndefined(await this.actor.icrc7_description());
//   }

//   async icrc7_logo(): Promise<string | null> {
//     return optionalToUndefined(await this.actor.icrc7_logo());
//   }

//   async icrc7_max_memo_size(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_max_memo_size())
//       ? Number(optionalToUndefined(await this.actor.icrc7_max_memo_size())!)
//       : null;
//   }

//   async icrc7_tx_window(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_tx_window())
//       ? Number(optionalToUndefined(await this.actor.icrc7_tx_window())!)
//       : null;
//   }

//   async icrc7_permitted_drift(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_permitted_drift())
//       ? Number(optionalToUndefined(await this.actor.icrc7_permitted_drift())!)
//       : null;
//   }

//   async icrc7_total_supply(): Promise<number> {
//     return Number(await this.actor.icrc7_total_supply());
//   }

//   async icrc7_supply_cap(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_supply_cap())
//       ? Number(optionalToUndefined(await this.actor.icrc7_supply_cap())!)
//       : null;
//   }

//   async icrc7_max_query_batch_size(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_max_query_batch_size())
//       ? Number(optionalToUndefined(await this.actor.icrc7_max_query_batch_size())!)
//       : null;
//   }

//   async icrc7_max_update_batch_size(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_max_update_batch_size())
//       ? Number(optionalToUndefined(await this.actor.icrc7_max_update_batch_size())!)
//       : null;
//   }

//   async icrc7_default_take_value(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_default_take_value())
//       ? Number(optionalToUndefined(await this.actor.icrc7_default_take_value())!)
//       : null;
//   }

//   async icrc7_max_take_value(): Promise<number | null> {
//     return optionalToUndefined(await this.actor.icrc7_max_take_value())
//       ? Number(optionalToUndefined(await this.actor.icrc7_max_take_value())!)
//       : null;
//   }

//   async icrc7_atomic_batch_transfers(): Promise<boolean | null> {
//     return optionalToUndefined(await this.actor.icrc7_atomic_batch_transfers());
//   }

//   async icrc7_collection_metadata(): Promise<FrontendNFTMetadata> {
//     const result = await this.actor.icrc7_collection_metadata();
//     return this.mapNFTMetadata(result);
//   }

//   async icrc7_token_metadata(tokenIds: number[]): Promise<(FrontendNFTMetadata | null)[]> {
//     const result = await this.actor.icrc7_token_metadata(tokenIds.map(BigInt));
//     return result.map((metadata) =>
//       optionalToUndefined(metadata) ? this.mapNFTMetadata(optionalToUndefined(metadata)!) : null
//     );
//   }

//   async icrc7_owner_of(tokenIds: number[]): Promise<[number, { owner: string; subaccount?: number[] } | null][]> {
//     const result = await this.actor.icrc7_owner_of(tokenIds.map(BigInt));
//     return result.map(([tokenId, account]) => [
//       Number(tokenId),
//       optionalToUndefined(account)
//         ? {
//             owner: principalToString(optionalToUndefined(account)!.owner),
//             subaccount: optionalToUndefined(account)!.subaccount
//               ? Array.from(optionalToUndefined(account)!.subaccount!)
//               : undefined,
//           }
//         : null,
//     ]);
//   }

//   async icrc7_balance_of(accounts: { owner: string; subaccount?: number[] }[]): Promise<number[]> {
//     const result = await this.actor.icrc7_balance_of(
//       accounts.map((account) => ({
//         owner: Principal.fromText(account.owner),
//         subaccount: account.subaccount ? [new Uint8Array(account.subaccount)] : [],
//       }))
//     );
//     return result.map(Number);
//   }

//   async icrc7_tokens(prev?: number, take?: number): Promise<number[]> {
//     const result = await this.actor.icrc7_tokens(
//       prev ? [BigInt(prev)] : [],
//       take ? [BigInt(take)] : []
//     );
//     return result.map(Number);
//   }

//   async icrc7_tokens_of(
//     account: { owner: string; subaccount?: number[] },
//     prev?: number,
//     take?: number
//   ): Promise<number[]> {
//     const result = await this.actor.icrc7_tokens_of(
//       { owner: Principal.fromText(account.owner), subaccount: account.subaccount ? [new Uint8Array(account.subaccount)] : [] },
//       prev ? [BigInt(prev)] : [],
//       take ? [BigInt(take)] : []
//     );
//     return result.map(Number);
//   }

//   async icrc10_supported_standards(): Promise<{ name: string; url: string }[]> {
//     return await this.actor.icrc10_supported_standards();
//   }

//   async icrc7_transfer(
//     transfers: { token_id: number; to: { owner: string; subaccount?: number[] }; memo?: number[]; created_at_time?: number }[]
//   ): Promise<({ Ok: number } | { Err: string })[]> {
//     const result = await this.actor.icrc7_transfer(
//       transfers.map((transfer) => ({
//         token_id: BigInt(transfer.token_id),
//         to: {
//           owner: Principal.fromText(transfer.to.owner),
//           subaccount: transfer.to.subaccount ? [new Uint8Array(transfer.to.subaccount)] : [],
//         },
//         memo: transfer.memo ? [new Uint8Array(transfer.memo)] : [],
//         created_at_time: transfer.created_at_time ? [BigInt(transfer.created_at_time)] : [],
//       }))
//     );
//     return result.map((res) =>
//       res ? ("Ok" in res ? { Ok: Number(res.Ok) } : { Err: res.Err }) : { Err: "Unknown error" }
//     );
//   }
// }
