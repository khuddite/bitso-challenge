import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mock } from "wagmi/connectors";
export const mockConfig = createConfig({
  chains: [sepolia],
  connectors: [
    mock({
      accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

export default function () {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: React.PropsWithChildren) => (
    <WagmiProvider config={mockConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
