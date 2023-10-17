import { encodeAbiParameters } from "viem";

export const signMessage = (address: `0x${string}`) => {
  if (!address) return "";

  return encodeAbiParameters(
    [{ type: "address", name: "memberAddress" }],
    [address as `0x${string}`]
  );
};
