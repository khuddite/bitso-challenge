import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Bitso Token Manager",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  ssr: true,
});
