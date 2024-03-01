"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserIcon } from "@heroicons/react/24/outline";
import { SkeletonLoader } from "~~/components/fundguys/";
import { CampaignCard } from "~~/components/fundguys/";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/";

const Profile: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: events, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "PublicGoodsFunding",
    eventName: "ProjectCreated",
    fromBlock: 0n, // 43030910n,
    filters: {
      projectOwner: connectedAddress,
    },
    watch: true,
    enabled: true,
  });

  console.log("events", events);

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <div className="flex justify-center items-center">
            <UserIcon className="h-14 w-14 mr-1" />
            <h3 className="text-6xl text-center font-bold">Profile</h3>
          </div>

          <p className="text-center text-2xl mt-10 mb-14">Manage your existing campaigns and create new ones</p>
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
