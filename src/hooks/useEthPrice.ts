import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ETH_PRICE_IN_USD = "ethPriceInUsd";

const useEthPrice = () => {
  return useQuery({
    queryKey: [ETH_PRICE_IN_USD],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      return data.ethereum.usd as number;
    },
  });
};

export default useEthPrice;
