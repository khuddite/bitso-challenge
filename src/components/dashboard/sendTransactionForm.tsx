import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import React, { useEffect, useMemo } from "react";
import { formatUnits } from "viem";
import { KHUDDITE_TOKEN_ADDRESS } from "../../constants/token";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../../constants/abi";
import useReadKhudditeToken from "../../hooks/useReadKhudditeToken";
import { useForm } from "react-hook-form";
import transactionSchema from "./transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import BitsoInput from "../shared/BitsoInput";
import { z } from "zod";
import { isAddress } from "viem";
import { TransactionDetail } from "../../pages/dashboard";
import { toast } from "react-toastify";

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
    data: decimals,
    isLoading: isLoadingDecimals,
    isError: isErrorDecimals,
  } = useReadKhudditeToken({
    functionName: "decimals",
  });

  const {
    data: tokenSymbol,
    isLoading: isLoadingSymbol,
    isError: isErrorSymbol,
  } = useReadKhudditeToken({
    functionName: "symbol",
  });

  const {
    data: totalRawSupply,
    isLoading: isLoadingTotalSupply,
    isError: isErrorTotalSupply,
  } = useReadKhudditeToken({
    functionName: "totalSupply",
  });

  const {
    data: rawBalance,
    isLoading: isLoadingRawBalance,
    isError: isErrorRawBalance,
  } = useReadKhudditeToken({
    functionName: "balanceOf",
    args: [address],
  });

  const currentBalance = useMemo(() => {
    if (typeof rawBalance !== "bigint" || typeof decimals !== "number") {
      return "0";
    }
    return formatUnits(rawBalance as bigint, decimals as number);
  }, [rawBalance, decimals]);

  const totalSupply = useMemo(() => {
    if (typeof totalRawSupply !== "bigint" || typeof decimals !== "number") {
      return "0";
    }
    return formatUnits(totalRawSupply as bigint, decimals as number);
  }, [totalRawSupply, decimals]);

  const isLoading =
    isLoadingDecimals ||
    isLoadingRawBalance ||
    isLoadingSymbol ||
    isLoadingTotalSupply;

  const isError =
    isErrorDecimals || isErrorRawBalance || isErrorSymbol || isErrorTotalSupply;

  useEffect(() => {
    if (isLoading) return;
    if (!isError) {
      reset({
        totalSupply,
        currentBalance,
        address,
        to: "",
        value: "",
      });
    }
  }, [isError, isLoading]);

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
    if (amountNum > Number(currentBalance)) {
      setError("value", {
        message: "Amount can not exceed your current balance.",
      });
      return;
    }
    if (!isAddress(to)) {
      setError("to", {
        message: "Recipient address must be a valid ERC20 address.",
      });
      return;
    }
    if (to === address) {
      setError("to", {
        message: "Recipient address can not be same as your own address.",
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
          value={`${totalSupply} ${tokenSymbol}`}
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
        variant="shadow"
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
