import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInternetIdentity } from "ic-use-internet-identity";
import { useActor } from "./useICRCActor";
import { Principal } from "@dfinity/principal";
import { Account } from "@dfinity/ledger-icp";

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
}

// Mint NFT
export function useMintNFT() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      to,
      name,
      description,
      tokenUri,
    }: MintNFTInterface) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.mint(to, name, description, tokenUri);
      if ("err" in result) {
        throw new Error(`Mint failed: ${result.err}`);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownedNFTs"] });
      console.log("NFT minted successfully!");
    },
    onError: (error) => {
      console.error(`Failed to mint NFT: ${error.message}`);
    },
  });
}

// Owned NFTs
export function useOwnedNFTs() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["ownedNFTs", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];

      const tokenIds = await actor.icrc7_tokens_of(
        { owner: identity.getPrincipal(), subaccount: [] },
        [],
        []
      );

      // Get metadata for all tokens in one call
      const metadataArray = await actor.icrc7_token_metadata(tokenIds);

      // Map token IDs to their corresponding metadata (same order)
      const nftsWithMetadata = tokenIds.map((tokenId, index) => ({
        tokenId,
        metadata: metadataArray[index] || [],
      }));

      return nftsWithMetadata;
    },
    enabled: !!actor && !!identity && !isFetching,
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
