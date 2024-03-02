"use client";

import Link from "next/link";
import { Address, formatUnits } from "viem";
import { useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";
import { DonateToCampaign, TokenSymbol } from "~~/components/fundguys/";

interface ICampaignCard {
  contractAddress: undefined | Address;
  isProfilePage: boolean;
}

export const CampaignCard = ({ contractAddress, isProfilePage }: ICampaignCard) => {
  const { data: projectData = [], isLoading } = useContractRead({
    address: contractAddress,
    abi: ProjectABI,
    functionName: "getProject",
  });

  const { write } = useContractWrite({
    address: contractAddress ?? "",
    abi: ProjectABI,
    functionName: "withdrawFunds",
  });

  // const { data: events, isLoading: isLoadingEvents } = useScaffoldEventHistory({
  //   contractName: "PublicGoodsFunding",
  //   eventName: "ProjectCreated",
  //   fromBlock: 0n, // 43030910n,
  // filters: {
  //   projectOwner: connectedAddress,
  // },
  //   transactionData: true,
  //   receiptData: true,
  // });

  if (isLoading || !contractAddress)
    return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;

  const [title, description, image, projectTokenAddress, targetAmount, amountRaised, deadline] = projectData as any;
  console.log("projectData", projectData);

  // calculate percentage funded
  const percentageBigInt = (amountRaised || 0n * BigInt(100)) / (targetAmount || 1n);
  const percentage = Number(percentageBigInt);

  // calculate days remaining until deadline
  const deadlineDate = new Date(Number(deadline) * 1000);
  const currentDate = new Date();
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-base-200 rounded-xl transition-transform transform hover:scale-102 hover:shadow-lg hover:shadow-base-200">
      <div className="flex justify-center">
        <img src={image} alt={title} className="w-full h-60 overflow-hidden object-cover rounded-lg" />
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="text-xl mb-3">{description}</div>
        <div className="mb-5">
          <progress className="progress progress-primary w-full" value={percentage} max="100"></progress>
          <div className="flex justify-between">
            <div>{daysRemaining} days left</div>
            <div className="flex gap-2">
              {Number(formatUnits(amountRaised || "", 18)).toFixed(2)} / {formatUnits(targetAmount || "", 18)}{" "}
              <TokenSymbol tokenAddress={projectTokenAddress} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Link
            href={`/campaigns/${contractAddress}`}
            className="btn btn-primary w-full font-cubano font-normal text-xl"
          >
            Details
          </Link>
          {isProfilePage ? (
            <button onClick={() => write({})} className="btn btn-primary  w-full font-cubano font-normal text-xl">
              Withdraw
            </button>
          ) : (
            <DonateToCampaign
              projectName={title}
              projectTokenAddress={projectTokenAddress}
              projectAddress={contractAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
};
