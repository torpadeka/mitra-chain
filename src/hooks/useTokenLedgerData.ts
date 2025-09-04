import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { IcrcLedgerCanister, IcrcTokenMetadata, mapTokenMetadata } from '@dfinity/ledger-icrc';
import { type Agent } from '@dfinity/agent';
import { CKUSDC_LEDGER_ID, ICP_LEDGER_ID } from '@/lib/constants';

// Define interface for the hook's return value
interface TokenLedgerData {
  icpBalance: bigint | null;
  usdcBalance: bigint | null;
  icpMetadata: IcrcTokenMetadata | undefined;
  usdcMetadata: IcrcTokenMetadata | undefined;
  isLoading: boolean;
  load: (principal: Principal, agent: Agent) => Promise<void>;
}

export function useTokenLedgerData(): TokenLedgerData {
  const [icpBalance, setIcpBalance] = useState<bigint | null>(null);
  const [ckUsdcBalance, setCkUsdcBalance] = useState<bigint | null>(null);
  const [icpMetadata, setIcpMetadata] = useState<IcrcTokenMetadata | undefined>(undefined);
  const [ckUsdcMetadata, setCkUsdcMetadata] = useState<IcrcTokenMetadata | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = async (principal: Principal, agent: Agent): Promise<void> => {
    setIsLoading(true);
    const icpLedgerAgent = IcrcLedgerCanister.create({
      agent,
      canisterId: Principal.fromText(ICP_LEDGER_ID),
    });
    const ckUsdcLedgerAgent = IcrcLedgerCanister.create({
      agent,
      canisterId: Principal.fromText(CKUSDC_LEDGER_ID),
    });

    try {
      const [icpMeta, ckUsdcMeta] = await Promise.all([
        icpLedgerAgent.metadata({ certified: true }),
        ckUsdcLedgerAgent.metadata({ certified: true }),
      ]);
      setIcpMetadata(mapTokenMetadata(icpMeta));
      setCkUsdcMetadata(mapTokenMetadata(ckUsdcMeta));

      const [icpBal, usdcBal] = await Promise.all([
        icpLedgerAgent.balance({ owner: principal }),
        ckUsdcLedgerAgent.balance({ owner: principal }),
      ]);
      setIcpBalance(icpBal);
      setCkUsdcBalance(usdcBal);
    } catch (err: unknown) {
      console.error('Error loading token metadata/balance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    icpBalance,
    usdcBalance: ckUsdcBalance,
    icpMetadata,
    usdcMetadata: ckUsdcMetadata,
    isLoading,
    load,
  };
}