import { FrontendNFTLicense } from "@/handler/NFTHandler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { principalToString } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";
import { useUser } from "@/context/AuthContext";

interface NFTCardProps {
  nft: FrontendNFTLicense;
}

export function NFTCard({ nft }: NFTCardProps) {
  const [franchise, setFranchise] = useState<FrontendFranchise | null>(null);
  const { actor } = useUser();

  useEffect(() => {
    const fetchFranchise = async () => {
      if (!actor) {
        console.error("Actor null");
        return;
      }
      const franchiseHandler = new FranchiseHandler(actor);
      setFranchise(await franchiseHandler.getFranchise(nft.franchiseId));
    };

    fetchFranchise();
  }, [nft, actor]);
  return (
    <Card>
      <CardHeader>
        <img
          src={nft.tokenUri}
          alt={nft.name}
          className="w-full h-full object-cover"
        />
        <CardTitle>{nft.name}</CardTitle>
        <CardDescription>{nft.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Token Id: {nft.tokenId}</p>
        <p>Owner: {principalToString(nft.owner.owner)}</p>
        <p>Issuer: {principalToString(nft.issuer.owner)}</p>
        <p>Issue Date: {nft.issueDate.toLocaleDateString()}</p>
        <p>Franchise: {franchise?.name || ""}</p>
        <p>
          Expiry Date: {nft.expiryDate?.toLocaleDateString() || "Permanent"}
        </p>
      </CardContent>
    </Card>
  );
}
