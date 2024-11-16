import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "next-themes";
import { RecoilRoot } from "recoil";
import TRPCProvider from "./utils/trpc-provider.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider attribute="class">
        <TRPCProvider>
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </TRPCProvider>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
