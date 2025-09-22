export {}; // This makes the file a module

declare global {
  interface Window {
    ic?: {
      plug?: {
        isConnected: () => Promise<boolean>;
        requestConnect: (params?: {
          whitelist?: string[];
          host?: string;
          timeout?: number;
        }) => Promise<any>;
        disconnect: () => Promise<void>;
        getPrincipal: () => Promise<any>;
        requestTransfer: (params: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: string;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
        agent: any;
        principalId: string;
        accountId: string;
        isWalletLocked: boolean;
        onExternalDisconnect: (callback: () => void) => void;
        createActor: (params: {
          canisterId: string;
          interfaceFactory: any;
        }) => Promise<any>;
        requestBurnXTC: (params: {
          amount: number;
          to: string;
        }) => Promise<any>;
        batchTransactions: (transactions: any[]) => Promise<any>;
      };
    };
  }
}