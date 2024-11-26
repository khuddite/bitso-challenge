import { Button } from "@nextui-org/button";
import { CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";
import React, { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { KHUDDITE_TOKEN_ADDRESS } from "../../../constants/token";
import { useAccount, useReadContract, UseReadContractParameters } from "wagmi";
import { abi } from "../../../constants/abi";
import useReadKhudditeToken from "../../../hooks/useReadKhudditeToken";
import { useForm } from "react-hook-form";
import transactionSchema from "./transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import BitsoInput from "../../shared/BitsoInput";
import { z } from "zod";

type TransactionoData = z.infer<typeof transactionSchema>;

export default function BitsoWidgetBody() {
  const { watch, control, reset, handleSubmit } = useForm<TransactionoData>({
    resolver: zodResolver(transactionSchema),
  });

  const amount = watch("value");

  console.log("amount: ", amount);
  const { address } = useAccount();

  const {
    data: decimals,
    isLoading: isLoadingDecimals,
    isError: isErrorDecimals,
  } = useReadContract({
    abi,
    address: KHUDDITE_TOKEN_ADDRESS,
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
      });
    }
  }, [isError, isLoading]);

  const handleTransaction = (data: TransactionoData) => {
    console.log("formData: ", data);
  };

  return (
    <form onSubmit={handleSubmit(handleTransaction)}>
      <CardBody className="flex flex-col gap-4">
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
          <Input
            variant="faded"
            label="To"
            isRequired
            placeholder="Enter public address(0x) or domain name"
            color="primary"
            isClearable
            labelPlacement="outside"
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
      </CardBody>
    </form>
  );
}
