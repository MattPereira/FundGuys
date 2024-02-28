"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { CreateCampaign, SkeletonLoader } from "~~/components/fundguys/";
import { useFetchNFTs } from "~~/hooks/fundguys/useFetchNFTs";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/";

const Home: NextPage = () => {
  const { data: mycologuysContract } = useDeployedContractInfo("MycoloGuys");

  const { nfts, isLoading, error } = useFetchNFTs(mycologuysContract?.address || "");

  if (error) {
    console.log("nftsError", error);
  }

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <h1 className="text-center text-6xl font-chewy mb-10">
            <span className="mr-1">🍄</span>
            <span className="text-7xl">FundGuys</span>
            <span className="ml-1">🍄‍🟫</span>
          </h1>

          <p className="text-center text-2xl mb-10">
            A public goods funding platform on Base that rewards funders with Mycologuys NFTs
          </p>
        </div>
        <div className="flex justify-center gap-8 mb-5">
          <Link href="/campaigns" className="btn btn-lg btn-primary w-48 text-2xl font-normal font-cubano">
            Fund
          </Link>
          <CreateCampaign />
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonLoader numberOfItems={3} />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Funders</h3>
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
      </div>
    </>
  );
};

export default Home;
