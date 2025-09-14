import { ActorProvider, AgentProvider } from "@ic-reactor/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { canisterId, idlFactory } from "./declarations/backend";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InternetIdentityProvider } from "ic-use-internet-identity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on authentication errors
        if (
          error?.message?.includes("Unauthorized") ||
          error?.message?.includes("identity")
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AgentProvider withProcessEnv>
          <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
            <App />
          </ActorProvider>
        </AgentProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
