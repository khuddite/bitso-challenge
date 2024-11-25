import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { abi } from "../../constants/abi";
import React, { useMemo } from "react";
import {
  useAccount,
  usePrepareTransactionRequest,
  useReadContract,
} from "wagmi";
import { KHUDDITE_TOKEN_ADDRESS } from "../../constants/token";
import { formatUnits } from "viem";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function BitsoWidget() {
  const { address } = useAccount();
  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract({
    abi,
    address: KHUDDITE_TOKEN_ADDRESS,
    functionName: "decimals",
  });

  const { data: tokenSymbol, isLoading: isLoadingSymbol } = useReadContract({
    abi,
    address: KHUDDITE_TOKEN_ADDRESS,
    functionName: "symbol",
  });

  const { data: totalRawSupply, isLoading: isLoadingTotalSupply } =
    useReadContract({
      abi,
      address: KHUDDITE_TOKEN_ADDRESS,
      functionName: "totalSupply",
    });

  const { data: rawBalance, isLoading: isLoadingRawBalance } = useReadContract({
    abi,
    address: KHUDDITE_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const isLoading =
    isLoadingDecimals ||
    isLoadingRawBalance ||
    isLoadingSymbol ||
    isLoadingTotalSupply;

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

  return (
    <Card
      className="w-[400px] h-[680px] align-middle p-2"
      radius="lg"
      isFooterBlurred
    >
      <CardHeader className="flex flex-col items-end p-0 gap-2">
        <ConnectButton showBalance={false} />
        <a
          href="https://bitso.com/"
          target="_blank"
          className="block self-center"
        >
          <Image
            src="/bitso.png"
            alt="Next.js logo"
            width={100}
            height={100}
            priority
          />
        </a>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 ">
        <Skeleton isLoaded={!isLoading} className="rounded-xl">
          <Input
            variant="faded"
            label="Total Supply"
            value={`${totalSupply} ${tokenSymbol}`}
            readOnly
            color="primary"
            labelPlacement="outside"
          />
        </Skeleton>
        <Skeleton isLoaded={!isLoading} className="rounded-xl">
          <Input
            variant="faded"
            label="Current Balance"
            value={`${currentBalance} ${tokenSymbol}`}
            readOnly
            color="primary"
            labelPlacement="outside"
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} className="rounded-xl">
          <Input
            variant="faded"
            label="From"
            value={address}
            readOnly
            color="primary"
            labelPlacement="outside"
          />
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
          <Input
            variant="faded"
            label="Amount"
            type="number"
            isRequired
            placeholder="Enter public address(0x) or domain name"
            color="primary"
            labelPlacement="outside"
          />
        </Skeleton>
        <Button variant="shadow" color="primary" isLoading={isLoading}>
          Send
        </Button>
      </CardBody>
      <CardFooter className="bottom-1 justify-center border-1 rounded-full shadow-sm py-1">
        <p className="text-tiny">
          Made with ❤️ by{" "}
          <Link
            className="text-tiny text-blue-500"
            href="https://github.com/khuddite"
            target="_blank"
            underline="hover"
          >
            Jason Stroud
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
