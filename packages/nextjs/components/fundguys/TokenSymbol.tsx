import { parseAbi } from "viem";
import { useContractRead } from "wagmi";

export const TokenSymbol = ({ tokenAddress }: { tokenAddress: any }) => {
  const { data: symbol, isLoading } = useContractRead({
    address: tokenAddress,
    abi: parseAbi(["function symbol() view returns (string)"]),
    functionName: "symbol",
  });

  if (isLoading) return "...";
  return <>{symbol}</>;
};
