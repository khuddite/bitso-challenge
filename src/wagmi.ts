import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Bitso Token Manager",
  projectId: "ebff1ea013246fdbe301cc46c35c314c",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.public.blastapi.io"),
  },
  ssr: true,
});
