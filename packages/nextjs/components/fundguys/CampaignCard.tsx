"use client";

import { useState } from "react";
// import { DonateModal } from "./DonateModal";
import { Address, formatUnits, parseAbi } from "viem";
import { useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";

interface ICampaignCard {
  contractAddress: undefined | Address;
  isProfilePage: boolean;
}

export const CampaignCard = ({ contractAddress, isProfilePage }: ICampaignCard) => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  const { data: projectData = {}, isLoading } = useContractRead({
    address: contractAddress,
    abi: ProjectABI,
    functionName: "getProject",
  });

  const { write } = useContractWrite({
    address: contractAddress ?? "",
    abi: ProjectABI,
    functionName: "withdrawFunds",
  });

  if (isLoading) return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;

  const [title, description, image, projectTokenAddress, targetAmount, amountRaised, deadline] = projectData as any;

  const percentageBigInt = (amountRaised * BigInt(100)) / (targetAmount || 1n);
  const percentage = Number(percentageBigInt);

  const deadlineDate = new Date(Number(deadline) * 1000);
  const currentDate = new Date();
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-base-200 rounded-xl">
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
              {Number(formatUnits(amountRaised, 18)).toFixed(2)} / {formatUnits(targetAmount, 18)}{" "}
              <TokenSymbol tokenAddress={projectTokenAddress} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <button className="btn btn-accent rounded-lg w-full font-cubano font-normal text-xl">Share</button>
          {isProfilePage ? (
            <button
              onClick={() => write({})}
              className="btn btn-primary rounded-lg w-full font-cubano font-normal text-xl"
            >
              Withdraw
            </button>
          ) : (
            <button
              className="btn btn-primary rounded-lg w-full font-cubano font-normal text-xl"
              onClick={() => setDonateModalOpen(true)}
            >
              Donate
            </button>
          )}
        </div>
      </div>
      {/* <DonateModal
      {/* <DonateModal
        projectTokenAddress={projectTokenAddress}
        open={donateModalOpen}
        setClosed={() => setDonateModalOpen(false)}
      /> */}
    </div>
  );
};

const TokenSymbol = ({ tokenAddress }: { tokenAddress: any }) => {
  const { data: symbol, isLoading } = useContractRead({
    address: tokenAddress,
    abi: parseAbi(["function symbol() view returns (string)"]),
    functionName: "symbol",
  });

  if (isLoading) return "...";
  return <div>{symbol}</div>;
};
