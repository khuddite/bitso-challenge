import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatEther, parseGwei, parseUnits } from "viem";
import { sepolia } from "viem/chains";
import {
  useChainId,
  useGasPrice,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { UNAVAILABLE } from "../../../constants/strings";
import { khudditeTokenContract } from "../../../constants/token";
import useContractGas from "../../../hooks/useContractGas";
import useEthPrice from "../../../hooks/useEthPrice";
import { TransactionDetail } from "../../../pages/dashboard";
import formatGasFee from "../../../utils/formatGasFee";

type ConfirmTransactionFormProps = {
  onCancel: () => void;
  transactionDetails: TransactionDetail;
};

export default function ConfirmTransactionForm({
  onCancel,
  transactionDetails,
}: ConfirmTransactionFormProps) {
  const { to, value } = transactionDetails;
  const chainId = useChainId();
  const { writeContract, status, error: transactionError } = useWriteContract();

  const [gasFee, setGasFee] = useState(UNAVAILABLE);

  // fetch base fee per gass
  const {
    data: gasPrice,
    isLoading: isLoadingGasPrice,
    error: gasPriceError,
  } = useGasPrice({
    chainId,
  });

  // fetch decimals for custom token
  const {
    data: decimals,
    isLoading: isLoadingDecimals,
    error: decimalsError,
  } = useReadContract({
    ...khudditeTokenContract,
    functionName: "decimals",
  });

  const isSubmittingTransaction = status === "pending";
  // fetch ETH price in USD
  const {
    data: ethPrice,
    isLoading: isLoadingEthPrice,
    error: ethPriceError,
  } = useEthPrice();

  // estimate contract gas for token transfer
  const {
    data: contractGas,
    isLoading: isLoadingContractGas,
    error: contractGasError,
  } = useContractGas({ to, value, decimals });

  const isLoading =
    isLoadingGasPrice ||
    isLoadingDecimals ||
    isLoadingEthPrice ||
    isLoadingContractGas;

  const errors = [
    gasPriceError,
    decimalsError,
    ethPriceError,
    contractGasError,
  ].filter((err) => err instanceof Error);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    // display error toasts if any
    if (errors.length > 0) {
      errors.map((err) => toast.error(err.message));
      return;
    }

    if (typeof contractGas === "bigint" && typeof gasPrice === "bigint") {
      // hard-code max priority fee per gas (1.5 gwei)
      setGasFee(
        formatEther(
          (contractGas as bigint) * ((gasPrice as bigint) + parseGwei("1.5"))
        )
      );
    }
  }, [isLoading, errors]);

  const handleConfirmTransaction = () => {
    writeContract({
      ...khudditeTokenContract,
      functionName: "transfer",
      args: [to, parseUnits(value, decimals as number)],
    });
  };

  useEffect(() => {
    if (status === "pending" || status === "idle") {
      return;
    }

    if (status === "success") {
      toast.success(`Sent ${value}KT successfully!`);
      onCancel();
    } else if (status === "error") {
      toast.error(transactionError.message);
    }
  }, [status]);

  return (
    <div className="flex flex-col justify-center w-full h-full gap-3">
      <span className="self-center font-sans text-xl font-semibold leading-4 text-gray-600">
        Are you sure you want to
      </span>
      <p className="self-center mb-4 font-sans text-2xl font-bold leading-12">
        Send {value} KT?
      </p>
      <div className="flex flex-col items-center gap-4 p-8 mb-8 rounded-xl bg-slate-200">
        <p className="self-center font-mono text-xl font-semibold text-center text-fuchsia-600">
          {value} KT
        </p>
        <div className="flex flex-col items-center">
          <p className="font-sans text-sm font-bold">
            To address on Ethereum (ETH) network
          </p>
          <Link
            className="text-tiny"
            underline="always"
            target="_blank"
            href={`${sepolia.blockExplorers.default.url}/address/${to}`}
          >
            {to}
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-sans text-sm font-bold">Estimated Network Fee</p>
          <Skeleton isLoaded={!isLoading}>
            <p className="font-semibold text-tiny">
              {gasFee === UNAVAILABLE || !ethPrice
                ? UNAVAILABLE
                : formatGasFee(gasFee, ethPrice)}
            </p>
          </Skeleton>
        </div>
      </div>
      <div className="flex flex-row w-full gap-2">
        <Button
          variant="ghost"
          color="secondary"
          onClick={onCancel}
          disabled={isSubmittingTransaction}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={handleConfirmTransaction}
          isLoading={isSubmittingTransaction}
          className="flex-1"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
