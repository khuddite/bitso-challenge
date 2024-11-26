import { useQuery } from "@tanstack/react-query";
import { Address, parseGwei, parseUnits } from "viem";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { khudditeTokenContract } from "../constants/token";

const ESTIMATE_CONTRACT_GAS = "estimateContractGas";

type useContractGasProps = {
  to: Address;
  value: string;
  decimals: unknown;
};

const useContractGas = ({ to, value, decimals }: useContractGasProps) => {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const { address } = useAccount();

  return useQuery({
    queryKey: [ESTIMATE_CONTRACT_GAS, to, value, decimals, address],
    queryFn: async () => {
      const gas = await client?.estimateContractGas({
        ...khudditeTokenContract,
        account: address,
        functionName: "transfer",
        args: [to, parseUnits(value, decimals as number)],
        // hard-code max priority fee per gas (1.5 gwei)
        maxPriorityFeePerGas: parseGwei("1.5"),
      });
      return gas;
    },
    enabled: !!client && !!address && typeof decimals === "number",
  });
};

export default useContractGas;
