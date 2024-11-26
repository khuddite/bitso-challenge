import { useQuery } from "@tanstack/react-query";
import { Address, parseUnits } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { abi } from "../constants/abi";
import { KHUDDITE_TOKEN_ADDRESS } from "../constants/token";

const ESTIMATE_CONTRACT_GAS = "estimateContractGas";

type useContractGasProps = {
  to: Address;
  value: string;
  decimals: unknown;
};

const useContractGas = ({ to, value, decimals }: useContractGasProps) => {
  const client = usePublicClient();
  const { address } = useAccount();

  return useQuery({
    queryKey: [ESTIMATE_CONTRACT_GAS, to, value, decimals, address],
    queryFn: async () => {
      const gas = await client?.estimateContractGas({
        abi,
        address: KHUDDITE_TOKEN_ADDRESS,
        account: address,
        functionName: "transfer",
        args: [to, parseUnits(value, decimals as number)],
      });

      return gas;
    },
    enabled: !!client && !!address && typeof decimals === "number",
  });
};

export default useContractGas;
