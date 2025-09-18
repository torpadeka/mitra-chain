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
import { Calendar, User, Building, Hash, Clock, Shield } from "lucide-react";

interface NFTCardProps {
  nft: FrontendNFTLicense;
}

export function NFTCard({ nft }: NFTCardProps) {
  const [franchise, setFranchise] = useState<FrontendFranchise | null>(null);
  const [imageError, setImageError] = useState(false);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncatePrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 6)}...${principal.slice(-6)}`;
  };

  const isExpired = nft.expiryDate && new Date() > nft.expiryDate;
  const isExpiringSoon =
    nft.expiryDate &&
    new Date() > new Date(nft.expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 border-primary hover:border-brand-300 bg-gradient-to-br from-surface-primary to-surface-secondary">
      {/* Image Section with Overlay */}
      <div className="relative overflow-hidden">
        <div className="aspect-square relative">
          {!imageError ? (
            <img
              src={nft.tokenUri}
              alt={nft.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
              <Shield className="w-16 h-16 text-neutral-400" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isExpired ? (
              <div className="bg-error/90 text-error-foreground px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                Expired
              </div>
            ) : isExpiringSoon ? (
              <div className="bg-warning/90 text-warning-foreground px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                Expires Soon
              </div>
            ) : (
              <div className="bg-success/90 text-success-foreground px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                Active
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Header Section */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-primary truncate group-hover:text-brand-600 transition-colors duration-200">
              {nft.name}
            </CardTitle>
            <CardDescription className="text-sm text-secondary mt-1 line-clamp-2">
              {nft.description}
            </CardDescription>
          </div>
          <div className="ml-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
              <Hash className="w-4 h-4 text-brand-600" />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="pt-0 space-y-3">
        {/* Token ID */}
        <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
          <Hash className="w-4 h-4 text-brand-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
              Token ID
            </p>
            <p className="text-sm font-mono text-primary truncate">
              {nft.tokenId}
            </p>
          </div>
        </div>

        {/* Owner & Issuer */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
            <User className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
                Owner
              </p>
              <p
                className="text-sm font-mono text-primary"
                title={principalToString(nft.owner.owner)}
              >
                {truncatePrincipal(principalToString(nft.owner.owner))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
            <Shield className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
                Issuer
              </p>
              <p
                className="text-sm font-mono text-primary"
                title={principalToString(nft.issuer.owner)}
              >
                {truncatePrincipal(principalToString(nft.issuer.owner))}
              </p>
            </div>
          </div>
        </div>

        {/* Franchise */}
        {franchise && (
          <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
            <Building className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
                Franchise
              </p>
              <p className="text-sm text-primary font-medium truncate">
                {franchise.name}
              </p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
            <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
                Issue Date
              </p>
              <p className="text-sm text-primary">
                {formatDate(nft.issueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg">
            <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-tertiary font-medium uppercase tracking-wide">
                Expiry Date
              </p>
              <p
                className={`text-sm font-medium ${
                  isExpired
                    ? "text-error"
                    : isExpiringSoon
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {nft.expiryDate ? formatDate(nft.expiryDate) : "Permanent"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {/* <div className="pt-2">
          <button className="w-full btn-primary text-center hover:shadow-md hover:shadow-brand-500/20 transition-all duration-200">
            View Details
          </button>
        </div> */}
      </CardContent>
    </Card>
  );
}
