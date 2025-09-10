import { useState, useEffect } from "react";
import { IcrcLedgerCanister, IcrcTokenMetadata } from "@dfinity/ledger-icrc";
import { HttpAgent, type Agent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Signer } from "@slide-computer/signer";
import { SignerAgent } from "@slide-computer/signer-agent";
import { PostMessageTransport } from "@slide-computer/signer-web";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { decodeIcrcAccount, mapTokenMetadata } from "@dfinity/ledger-icrc";
import { toBaseUnits } from "@/lib/utils";
import { CKUSDC_LEDGER_ID, ICP_LEDGER_ID } from "@/lib/constants";

// Define interface for the hook's return value
interface OisyWallet {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  principal: Principal | null;
  accountIdentifier: AccountIdentifier | null;
  isLoading: boolean;
  icpBalance: bigint | null;
  ckUsdcBalance: bigint | null;
  icpMetadata: IcrcTokenMetadata | undefined;
  ckUsdcMetadata: IcrcTokenMetadata | undefined;
  transferIcp: (
    ownerPrincipal: Principal,
    amount: number
  ) => Promise<{
    success: boolean;
    message: string;
    blockIndex?: bigint;
  }>;
  transferCkUsdc: (
    ownerPrincipal: Principal,
    amount: number
  ) => Promise<{
    success: boolean;
    message: string;
    blockIndex?: bigint;
  }>;
}

export function useOisyWallet(): OisyWallet {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [accountIdentifier, setAccountIdentifier] =
    useState<AccountIdentifier | null>(null);
  const [defaultAgent, setDefaultAgent] = useState<Agent | null>(null);
  const [oisySignerAgent, setOisySignerAgent] = useState<Agent | null>(null);
  const [oisyIcpActor, setOisyIcpActor] = useState<IcrcLedgerCanister | null>(
    null
  );
  const [oisyCkUsdcActor, setOisyCkUsdcActor] =
    useState<IcrcLedgerCanister | null>(null);

  const [icpMetadata, setIcpMetadata] = useState<IcrcTokenMetadata | undefined>(
    undefined
  );
  const [ckUsdcMetadata, setCkUsdcMetadata] = useState<
    IcrcTokenMetadata | undefined
  >(undefined);
  const [icpBalance, setIcpBalance] = useState<bigint | null>(null);
  const [ckUsdcBalance, setCkUsdcBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oisyTransport = new PostMessageTransport({
    url: "https://oisy.com/sign",
  });
  const oisySigner = new Signer({ transport: oisyTransport });

  useEffect(() => {
    if (oisySignerAgent && !oisyIcpActor && !oisyCkUsdcActor) {
      const oisyIcpActor = IcrcLedgerCanister.create({
        agent: oisySignerAgent,
        canisterId: Principal.fromText(ICP_LEDGER_ID),
      });
      const oisyCkUsdcActor = IcrcLedgerCanister.create({
        agent: oisySignerAgent,
        canisterId: Principal.fromText(CKUSDC_LEDGER_ID),
      });
      setOisyIcpActor(oisyIcpActor);
      setOisyCkUsdcActor(oisyCkUsdcActor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oisySignerAgent]);

  useEffect(() => {
    const fetchBalances = async (): Promise<void> => {
      if (!defaultAgent || !principal) return;
      setIsLoading(true);
      try {
        const defaultIcpLedgerAgent = IcrcLedgerCanister.create({
          agent: defaultAgent,
          canisterId: Principal.fromText(ICP_LEDGER_ID),
        });
        const defaultCkUsdcLedgerAgent = IcrcLedgerCanister.create({
          agent: defaultAgent,
          canisterId: Principal.fromText(CKUSDC_LEDGER_ID),
        });

        setIcpMetadata(
          mapTokenMetadata(
            await defaultIcpLedgerAgent.metadata({ certified: true })
          )
        );
        setCkUsdcMetadata(
          mapTokenMetadata(
            await defaultCkUsdcLedgerAgent.metadata({ certified: true })
          )
        );
        setIcpBalance(
          await defaultIcpLedgerAgent.balance({ owner: principal })
        );
        setCkUsdcBalance(
          await defaultCkUsdcLedgerAgent.balance({ owner: principal })
        );
      } catch (e: unknown) {
        console.error("Failed to fetch balances", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [defaultAgent, principal]);

  const connect = async (): Promise<void> => {
    const accounts = await oisySigner.accounts();
    const icrcAccount = decodeIcrcAccount(accounts[0].owner.toString());
    const principal = icrcAccount.owner;
    const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });

    const defaultAgent = await HttpAgent.create({ host: "https://icp0.io" });
    const signerAgent = await SignerAgent.create({
      agent: defaultAgent,
      signer: oisySigner,
      account: principal,
    });

    setDefaultAgent(defaultAgent);
    setOisySignerAgent(signerAgent as unknown as Agent);
    setPrincipal(principal);
    setAccountIdentifier(accountIdentifier);
    setIsConnected(true);
  };

  const disconnect = (): void => {
    setIsConnected(false);
    setPrincipal(null);
    setAccountIdentifier(null);
    setDefaultAgent(null);
    setOisySignerAgent(null);
    setOisyIcpActor(null);
    setOisyCkUsdcActor(null);
    setIcpBalance(null);
    setCkUsdcBalance(null);
    setIcpMetadata(undefined);
    setCkUsdcMetadata(undefined);
    setIsLoading(false);
  };

  const transfer = async (
    ledger: IcrcLedgerCanister | null,
    metadata: IcrcTokenMetadata | undefined,
    ownerPrincipal: Principal,
    amount: number
  ): Promise<{ success: boolean; message: string; blockIndex?: bigint }> => {
    if (!ledger || !ownerPrincipal || !metadata) {
      return { success: false, message: "Missing transfer prerequisites." };
    }

    try {
      const blockIndex = await ledger.transfer({
        to: { owner: ownerPrincipal, subaccount: [] },
        amount: toBaseUnits(amount, metadata.decimals),
      });

      return { success: true, message: "Transfer successful.", blockIndex };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transfer failed.";
      return { success: false, message };
    }
  };

  return {
    connect,
    disconnect,
    isConnected,
    principal,
    accountIdentifier,
    isLoading,
    icpBalance,
    ckUsdcBalance,
    icpMetadata,
    ckUsdcMetadata,
    transferIcp: (ownerPrincipal, amount) =>
      transfer(oisyIcpActor, icpMetadata, ownerPrincipal, amount),
    transferCkUsdc: (ownerPrincipal, amount) =>
      transfer(oisyCkUsdcActor, ckUsdcMetadata, ownerPrincipal, amount),
  };
}
