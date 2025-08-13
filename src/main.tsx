import { ActorProvider, AgentProvider } from "@ic-reactor/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <App />
    </AgentProvider>
  </React.StrictMode>
);
