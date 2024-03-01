"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { SkeletonLoader } from "~~/components/fundguys/SkeletonLoader";
import { useFetchNFTs } from "~~/hooks/fundguys/useFetchNFTs";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/";

const Funders: NextPage = () => {
  const { data: mycologuysContract } = useDeployedContractInfo("Mycologuys");

  const { nfts, isLoading, error } = useFetchNFTs(mycologuysContract?.address || "");

  if (error) {
    console.log("nftsError", error);
  }

  // console.log("data", data);
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <h3 className="text-7xl text-center font-madimi">Funders</h3>

        <p className="text-center text-2xl mt-10 mb-14">
          Check out all the funders who have contributed to public goods campaigns on FundGuys
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {isLoading || !nfts ? (
            <SkeletonLoader numberOfItems={4} />
          ) : (
            <>
              {nfts.map((nft: any) => (
                <Image
                  key={nft.tokenId}
                  width={1000}
                  height={1000}
                  src={nft.image.originalUrl}
                  alt={nft.name}
                  className="rounded-xl"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Funders;
