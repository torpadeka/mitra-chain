import { Coins } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useOisyWallet } from "@/hooks/useOisyWallet";
import { stringToPrincipal } from "@/lib/utils";
import { ApplicationHandler } from "@/handler/ApplicationHandler";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";

interface PaymentModalProps {
  ownerPrincipal: string;
  amount: number;
  id: number;
}

export default function PaymentModal({
  ownerPrincipal,
  amount,
  id,
}: PaymentModalProps) {
  const { connect, disconnect, isConnected, transferIcp } = useOisyWallet();
  const { actor } = useUser();
  const navigate = useNavigate();
  const handleTransfer = async () => {
    if (!actor) {
      alert("Transfer failed: Actor is not initialized");
      return;
    }
    const applicationHandler = new ApplicationHandler(actor);
    const result = await transferIcp(stringToPrincipal(ownerPrincipal), amount);
    if (result.success && result.blockIndex !== undefined) {
      try {
        await applicationHandler.payApplication(id);
        alert("Payment successful!");
        navigate("/dashboard/franchisee");
      } catch (err) {
        console.error("Payment error:", err);
        alert("Failed to process payment. Please try again later.");
      }
    } else {
      alert("Transfer failed");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Coins className="w-4 h-4 mr-1" />
        Pay
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>License Payment</DialogTitle>
          <DialogDescription>
            Connect to OISY Wallet, then complete the payment (in ICP)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col px-4">
          {isConnected ? (
            <div>You are connected to OISY Wallet</div>
          ) : (
            <div>Please connect to OISY Wallet to complete the payment</div>
          )}
          <Button
            className={`font-medium px-4 py-2.5 rounded-lg transition-all duration-300 ${
              isConnected
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
            onClick={isConnected ? disconnect : connect}
          >
            {isConnected ? "Disconnect OISY" : "Connect OISY"}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          {isConnected && (
            <Button onClick={handleTransfer}>Transfer ${amount} ICP</Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
