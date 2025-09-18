import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useICRCActor";
import { Account } from "@dfinity/ledger-icp";
import { FrontendNFTLicense } from "@/handler/NFTHandler";
import { Principal } from "@dfinity/principal";
import { useUser } from "@/context/AuthContext";
import { stringToPrincipal } from "@/lib/utils";

export function mapNFTLicenseToFrontend(nft: any): FrontendNFTLicense {
  console.log(
    "NFT:",
    JSON.stringify(nft, (k, v) => (typeof v === "bigint" ? v.toString() : v))
  );

  const getMetadataValue = (key: string) => {
    const entry = nft.metadata?.[0]?.find(([k]: [string, any]) => k === key);
    return entry ? entry[1] : null;
  };

  // Extract metadata
  const name = getMetadataValue("name")?.Text ?? "Unnamed NFT";
  const description = getMetadataValue("description")?.Text ?? "No description";
  const tokenUri = getMetadataValue("tokenUri")?.Text ?? "";
  const franchiseId = getMetadataValue("franchiseId")?.Nat ?? 0n;
  const issueDate =
    getMetadataValue("issueDate")?.Int ??
    getMetadataValue("issueDate")?.Nat ??
    0n;
  const expiryDate =
    getMetadataValue("expiryDate")?.Array?.length === 0 ? null : undefined;
  const issuerText = getMetadataValue("issuer")?.Text;

  // Owner comes from the hook response
  const ownerData = nft.owner;
  const ownerPrincipal =
    ownerData?.owner instanceof Principal
      ? ownerData.owner
      : Principal.fromText(ownerData?.owner?.__principal__ ?? "aaaaa-aa"); // fallback

  const ownerSubaccount = ownerData?.subaccount || [];

  // Validation
  if (!ownerPrincipal || !issuerText) {
    console.error("Missing owner or issuer in metadata:", {
      ownerPrincipal,
      issuerText,
    });
    throw new Error("Invalid NFT metadata: missing owner or issuer");
  }

  return {
    tokenId: nft.tokenId,
    franchiseId: Number(franchiseId),
    owner: {
      owner: ownerPrincipal,
      subaccount: ownerSubaccount,
    },
    issuer: {
      owner: Principal.fromText(issuerText),
      subaccount: [],
    },
    issueDate: new Date(Number(issueDate) / 1_000_000),
    expiryDate: expiryDate
      ? new Date(Number(expiryDate) / 1_000_000)
      : undefined,
    name,
    description,
    tokenUri,
  };
}

// Collection Status
export function useCollectionStatus() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["collectionStatus"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.collectionHasBeenClaimed();
    },
    enabled: !!actor && !isFetching,
  });
}

// Collection Owner
export function useCollectionOwner() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["collectionOwner"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCollectionOwner();
    },
    enabled: !!actor && !isFetching,
  });
}

// Claim Collection
export function useClaimCollection() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.claimCollection();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collectionStatus"] });
      queryClient.invalidateQueries({ queryKey: ["collectionOwner"] });
      console.log("Collection claimed successfully!");
    },
    onError: (error) => {
      console.error(`Failed to claim collection: ${error.message}`);
    },
  });
}

interface MintNFTInterface {
  to: Account;
  name: string;
  description: string;
  tokenUri: string;
  franchiseId: number;
  licenseDuration: { OneTime?: true; Years?: number };
  issueDate: Date;
}

export type SetNFTError = {
  GenericError: { message: string; error_code: bigint };
};
export type SetNFTResult = { Ok: [] | [bigint] } | { Err: SetNFTError };

export function useMintNFT() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      to,
      name,
      description,
      tokenUri,
      franchiseId,
      licenseDuration,
      issueDate,
    }: MintNFTInterface) => {
      if (!actor) throw new Error("Actor not available");
      const licenseDurationArg = licenseDuration.OneTime
        ? { OneTime: null }
        : { Years: BigInt(licenseDuration.Years!) };
      const result = await actor.mint(
        to,
        name,
        description,
        tokenUri,
        BigInt(franchiseId),
        licenseDurationArg,
        BigInt(issueDate.getTime() * 1_000_000)
      );
      // Check if any result contains an error
      for (const res of result) {
        if ("Err" in res) {
          throw new Error(`Mint failed: ${res})`);
        }
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownedNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["tokensByFranchise"] });
      console.log("NFT minted successfully!");
    },
    onError: (error) => {
      console.error(`Failed to mint NFT: ${error.message}`);
    },
  });
}

// Owned NFTs
export function useOwnedNFTs() {
  const { principal } = useUser();
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["ownedNFTs", principal],
    queryFn: async () => {
      console.log("ok");
      if (!actor || !principal) return [];

      console.log("ok2");
      console.log(actor);
      console.log(principal);

      let principalReal;

      if (typeof principal === "string")
        principalReal = stringToPrincipal(principal);
      else principalReal = principal;

      try {
        const tokenIds = await actor.icrc7_tokens_of(
          { owner: principalReal, subaccount: [] },
          [], // prev
          [] // take
        );
        console.log("Token IDs:", tokenIds);

        // Get metadata for all tokens in one call
        const metadataArray = await actor.icrc7_token_metadata(tokenIds);
        console.log("Metadata Array:", metadataArray);

        // Get owners for all tokens
        const ownerResponse = await actor.icrc7_owner_of(tokenIds);
        const owners = ownerResponse; // Array of [?ICRC7.Account] matching tokenIds order

        console.log("Owner Response:", owners);

        // Map token IDs to their corresponding metadata and owners
        const nftsWithMetadata = tokenIds.map((tokenId, index) => {
          const metadata = metadataArray[index] || [];
          const owner = owners[index]?.[0] || null; // First owner for the tokenId
          return { tokenId, metadata, owner };
        });

        console.log("NFTs with Metadata:", nftsWithMetadata);

        return nftsWithMetadata;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!actor && !!principal && !isFetching,
    retry: true,
  });
}

interface TransferNFTInterface {
  tokenId: bigint;
  to: Account;
}

// Transfer NFT
export function useTransferNFT() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ tokenId, to }: TransferNFTInterface) => {
      if (!actor) throw new Error("Actor not available");

      const transferArg = {
        token_id: tokenId,
        to,
        memo: [] as [],
        from_subaccount: [] as [],
        created_at_time: [] as [],
      };

      const result = await actor.icrc7_transfer([transferArg]);
      const transferResult = result[0];

      if (!transferResult || transferResult.length === 0) {
        throw new Error("Transfer failed: No result returned");
      }

      const actualResult = transferResult[0];
      if ("Err" in actualResult) {
        throw new Error(`Transfer failed: ${JSON.stringify(actualResult.Err)}`);
      }

      return actualResult.Ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownedNFTs"] });
      console.log("NFT transferred successfully!");
    },
    onError: (error) => {
      console.error(`Failed to transfer NFT: ${error.message}`);
    },
  });
}
