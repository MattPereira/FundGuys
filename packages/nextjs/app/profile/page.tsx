"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { SkeletonLoader } from "~~/components/fundguys/";
import { CampaignCard } from "~~/components/fundguys/";
import { CreateCampaign } from "~~/components/fundguys/CreateCampaign";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/";

const Profile: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  const { data: events, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "PublicGoodsFunding",
    eventName: "ProjectCreated",
    fromBlock: 0n, // 43030910n,
    filters: {
      projectOwner: connectedAddress,
    },
    transactionData: true,
    receiptData: true,
    enabled: true,
  });

  useEffect(() => {
    if (!connectedAddress) {
      router.push("/");
    }
  }, [connectedAddress, router]);

  console.log("events", events);

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <div className="flex justify-center items-center">
            <h3 className="text-7xl text-center font-madimi">Your Profile</h3>
          </div>

          <div className="text-center text-2xl mt-10 mb-14">
            Manage all of your existing campaigns or <CreateCampaign />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">My Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingEvents || !events ? (
              <SkeletonLoader numberOfItems={3} />
            ) : (
              events.map((event: any, idx: number) => (
                <CampaignCard key={idx} contractAddress={event.args.projectAddress} isProfilePage={true} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
