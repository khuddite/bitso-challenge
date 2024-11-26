import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatUnits, isAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { z } from "zod";
import { UNAVAILABLE } from "../../../constants/strings";
import { khudditeTokenContract } from "../../../constants/token";
import { TransactionDetail } from "../../../pages/dashboard";
import BitsoInput from "../../shared/bitsoInput";
import transactionSchema from "./sendTransactionSchema";

type TransactionoData = z.infer<typeof transactionSchema>;

type SendTransactionFormProps = {
  onSubmit: (data: TransactionDetail) => void;
};

export default function SendTransactionForm({
  onSubmit,
}: SendTransactionFormProps) {
  const {
    watch,
    control,
    reset,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TransactionoData>({
    resolver: zodResolver(transactionSchema),
  });

  const amount = watch("value");

  console.log("amount: ", amount);
  const { address } = useAccount();

  const {
    data: token,
    isLoading,
    error,
  } = useReadContracts({
    contracts: [
      {
        ...khudditeTokenContract,
        functionName: "decimals",
      },
      {
        ...khudditeTokenContract,
        functionName: "symbol",
      },
      {
        ...khudditeTokenContract,
        functionName: "totalSupply",
      },
      {
        ...khudditeTokenContract,
        functionName: "balanceOf",
        args: [address],
      },
    ],
  });

  const [curBalance, setCurBalance] = useState(UNAVAILABLE);
  const [tokenSymbol, setTokenSymbol] = useState(UNAVAILABLE);

  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(token)) {
      toast.error("Failed to fetch token information");
      return;
    }

    const errors = token
      .map((v) => v.error)
      .filter((err) => err instanceof Error);

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err.message));
      return;
    }

    const [decimals, tokenSymbol, totalRawSupply, rawBalance] = token.map(
      (v) => v.result
    );

    const currentBalance = formatUnits(
      rawBalance as bigint,
      decimals as number
    );
    const totalSupply = formatUnits(
      totalRawSupply as bigint,
      decimals as number
    );

    setTokenSymbol(tokenSymbol as string);

    setCurBalance(currentBalance);
    reset({
      totalSupply: `${totalSupply} ${tokenSymbol}`,
      currentBalance: `${currentBalance} ${tokenSymbol}`,
      address,
      to: "",
      value: "",
    });
  }, [isLoading, error]);

  const handleTransaction = (data: TransactionoData) => {
    const { to, value } = data;

    const amountNum = Number(value);

    // additional validations that can not be covered by zod
    if (isNaN(amountNum)) {
      setError("value", { message: "Amount must be a valid number." });
      return;
    }
    if (amountNum === 0) {
      setError("value", { message: "Amount must be greater than zero." });
      return;
    }
    if (amountNum > Number(curBalance)) {
      setError("value", {
        message: "Amount exceeds balance.",
      });
      return;
    }
    if (!isAddress(to)) {
      setError("to", {
        message: "Invalid ERC20 address.",
      });
      return;
    }
    if (to === address) {
      setError("to", {
        message: "Recipient address cannot be your own.",
      });
      return;
    }

    onSubmit({ to, value });
  };

  return (
    <form
      onSubmit={handleSubmit(handleTransaction)}
      className="flex flex-col justify-center h-full gap-3"
    >
      <Skeleton isLoaded={!isLoading} className="rounded-xl">
        <BitsoInput
          name="totalSupply"
          control={control}
          label="Total Supply"
          readOnly
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} className="rounded-xl">
        <BitsoInput
          name="currentBalance"
          control={control}
          label="Current Balance"
          readOnly
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} className="rounded-xl">
        <BitsoInput name="address" control={control} label="From" readOnly />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} className="rounded-xl">
        <BitsoInput
          name="to"
          control={control}
          label="To"
          isRequired
          placeholder="Enter public address(0x) or domain name"
          isClearable
          onClear={() => setValue("to", "")}
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} className="rounded-xl">
        <BitsoInput
          name="value"
          control={control}
          label="Amount"
          type="number"
          isRequired
          placeholder="0.00"
        />
      </Skeleton>
      <Button
        variant="solid"
        color="primary"
        isLoading={isLoading}
        size="md"
        type="submit"
        className="mt-4"
      >
        Send
      </Button>
      <p
        className={`self-center text-tiny font-semibold ${
          !amount && "invisible"
        }`}
      >
        You're sending{" "}
        <span className="text-green-700">
          {amount} {tokenSymbol as string}
        </span>
      </p>
    </form>
  );
}
