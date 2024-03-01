"use client";

import Link from "next/link";
import { DonateModal } from "./DonateModal";
import { Address, formatUnits } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";
import { TokenSymbol } from "~~/components/fundguys/TokenSymbol";

interface ICampaignCard {
  contractAddress: undefined | Address;
  isProfilePage: boolean;
}

export const CampaignCard = ({ contractAddress, isProfilePage }: ICampaignCard) => {
  const connectedAddress = useAccount();
  const openModal = () => document.getElementById("donate_modal")?.showModal();

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

  if (isLoading) return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;

  console.log({ projectData });
  const [title, description, image, projectTokenAddress, targetAmount, amountRaised, deadline] = projectData as any;

  const percentageBigInt = (amountRaised || 0n * BigInt(100)) / (targetAmount || 1n);
  const percentage = Number(percentageBigInt);

  const deadlineDate = new Date(Number(deadline) * 1000);
  const currentDate = new Date();
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  const handleShare = () => {
    // if (events && events.length > 0) {
    // const projectOwnerAddress = events[0].args.projectOwner;
    // const truncatedOwner = `${projectOwnerAddress?.slice(0, 2)}...${projectOwnerAddress?.slice(-4)}`;
    // const text = `Owner (${truncatedOwner}) would like your help with their campaign: ${title}. Take a moment to hear their story.`;
    const text = `Take a moment to hear about the stories from the Fund Guys Community 🍄`;
    const url = "https://fund-guys.vercel.app/campaigns"; // Replace with your campaign link
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(
      url,
    )}`;

    window.open(warpcastUrl, "_blank");
    // } else {
    //   console.log("No events found")
    // }
  };

  return (
    <Link
      href={`/campaigns/${contractAddress}`}
      className="bg-base-200 rounded-xl cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-base-200"
    >
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
          <button onClick={handleShare} className="btn btn-accent w-full font-cubano font-normal text-xl">
            Share
          </button>
          {isProfilePage ? (
            <button onClick={() => write({})} className="btn btn-primary  w-full font-cubano font-normal text-xl">
              Withdraw
            </button>
          ) : (
            <button className="btn btn-primary  w-full font-cubano font-normal text-xl" onClick={openModal}>
              Donate
            </button>
          )}
        </div>
      </div>
      <DonateModal projectTokenAddress={projectTokenAddress} projectAddress={contractAddress} />
    </Link>
  );
};
