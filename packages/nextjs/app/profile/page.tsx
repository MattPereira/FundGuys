"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ProfileCard, SkeletonLoader } from "~~/components/fundguys/";
import { useFetchNFTs } from "~~/hooks/fundguys/useFetchNFTs";
import { useDeployedContractInfo, useScaffoldEventHistory } from "~~/hooks/scaffold-eth/";

const Profile: NextPage = () => {
  const { data: mycologuysContract } = useDeployedContractInfo("Mycologuys");
  const { address: connectedAddress } = useAccount();

  const { nfts, isLoading, error } = useFetchNFTs(mycologuysContract?.address || "");

  if (error) {
    console.log("nftsError", error);
  }

  const { data: events, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "PublicGoodsFunding",
    eventName: "ProjectCreated",
    fromBlock: 0n, // 43030910n,
    filters: {
      projectOwner: connectedAddress,
    },
    watch:true,
    enabled: true,
  });

  console.log("events", events);

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <h1 className="text-center text-6xl font-chewy mb-10">
            <span className="mr-1">🍄</span>
            <span className="text-7xl">FundGuys</span>
          </h1>

          <p className="text-center text-2xl mb-10">
            A public goods funding platform on Base for the Fund Guys community.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Personal Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingEvents || !events ? (
              <SkeletonLoader numberOfItems={3} />
            ) : (
              events.map((event: any, idx: number) => (
                <ProfileCard key={idx} contractAddress={event.args.projectAddress} />
              ))
            )}
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

export default Profile;
