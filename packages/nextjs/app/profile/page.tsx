"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import { ProfileCard } from "~~/components/fundguys/ProfileCard";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Profile: NextPage = () => {
  const { data, isLoading } = useScaffoldEventHistory({
    contractName: "PublicGoodsFunding",
    eventName: "ProjectCreated",
    fromBlock: 0n, // can be set to the block in which we deploy on Base
  });
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <h3 className="text-6xl text-center font-bold">Profile</h3>
        <p className="text-center text-2xl my-10">
          Browse all active Profile to find a cause you want to support or create your own campaign.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading &&
            Array.from(Array(6).keys()).map((_, idx) => (
              <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
            ))}
          {data &&
            data?.map(({ args: { projectAddress } }) => (
              <ProfileCard key={projectAddress} contractAddress={projectAddress} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
