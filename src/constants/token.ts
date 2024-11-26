import { abi } from "./abi";

export const KHUDDITE_TOKEN_ADDRESS =
  "0xBB64FaaAc99B6d0ec3C3Af7BdA3431668Bc65758"; // Replace with your token's Sepolia address

export const khudditeTokenContract = {
  address: KHUDDITE_TOKEN_ADDRESS,
  abi,
} as const;
