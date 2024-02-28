// hooks/useNFTs.js
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFetchNFTs(contractAddress: string) {
  const getNftsForContractUrl = contractAddress ? `/api/get-nfts-for-contract?address=${contractAddress}` : null;

  const { data, error, isLoading } = useSWR(getNftsForContractUrl, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    nfts: data?.nfts,
    error,
    isLoading,
  };
}
