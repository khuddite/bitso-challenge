import { useReadContract } from "wagmi";
import { abi } from "../constants/abi";
import { KHUDDITE_TOKEN_ADDRESS } from "../constants/token";
import { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";

type useReadKhudditeTokenProps = {
  functionName: ContractFunctionName<Abi, "pure" | "view">;
  args?: ContractFunctionArgs<
    Abi,
    "pure" | "view",
    ContractFunctionName<Abi, "pure" | "view">
  >;
};

export default function useReadKhudditeToken({
  functionName,
  args = [],
  ...rest
}: useReadKhudditeTokenProps) {
  return useReadContract({
    address: KHUDDITE_TOKEN_ADDRESS,
    abi,
    functionName,
    args,
    ...rest,
  });
}
