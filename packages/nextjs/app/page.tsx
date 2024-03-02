"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { CampaignCard, SkeletonLoader } from "~~/components/fundguys/";
import { useFetchNFTs } from "~~/hooks/fundguys/useFetchNFTs";
import { useDeployedContractInfo, useScaffoldEventHistory } from "~~/hooks/scaffold-eth/";

const Home: NextPage = () => {
  const { data: mycologuysContract } = useDeployedContractInfo("Mycologuys");

  const { nfts, isLoading, error } = useFetchNFTs(mycologuysContract?.address || "");

  if (error) {
    console.log("nftsError", error);
  }

  const { data: events, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "PublicGoodsFunding",
    eventName: "ProjectCreated",
    fromBlock: 0n, // update with the block number of the contract deployment
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  console.log("events", events);
  // filter out 0xB094a3CA0183aC648C2aE0672732f653c8651688

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <h1 className="text-center text-6xl font-madimi mb-7 flex justify-center items-center">
            <span className="mr-1">🍄</span>
            <span className="text-7xl">FundGuys</span>
          </h1>

          <p className="text-center text-2xl mb-7">
            A public goods funding platform on Base that rewards funders with Mycologuys NFTs
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Campaigns</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {isLoadingEvents || !events ? (
              <SkeletonLoader numberOfItems={3} />
            ) : (
              events
                .filter(
                  (event: any) =>
                    event.args.projectAddress.toLowerCase() !==
                    "0xb094a3ca0183ac648c2ae0672732f653c8651688".toLowerCase(),
                )
                .slice(0, 3)
                .map((event: any, idx: number) => (
                  <CampaignCard key={idx} contractAddress={event.args.projectAddress} isProfilePage={false} />
                ))
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Funders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {isLoading || !nfts ? (
              <SkeletonLoader numberOfItems={4} />
            ) : (
              <>
                {nfts.slice(0, 4).map((nft: any) => (
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
