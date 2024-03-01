"use client";

import { useState } from "react";
import { DonateModal } from "./DonateModal";
import { Address } from "viem";
import { formatUnits } from "viem";
import { useContractRead } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";

interface Props {
  contractAddress: undefined | Address;
}

export const CampaignCard = ({ contractAddress }: Props) => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  const { data: projectData = {}, isLoading } = useContractRead({
    address: contractAddress,
    abi: ProjectABI,
    functionName: "getProject",
  });

  const [title, description, image, projectTokenAddress, targetAmount, amountRaised, deadline, completed] =
    projectData as any;

  if (isLoading) return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;

  const percentageBigInt = (amountRaised * BigInt(100)) / (targetAmount || 1n);
  const percentage = Number(percentageBigInt);
  return (
    <div className="bg-base-200 rounded-xl">
      <div className="flex justify-center">
        <img src={image} alt={title} className="w-full h-48 overflow-hidden object-cover" />
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div>{description}</div>
        <progress className="progress progress-primary w-full" value={percentage} max="100"></progress>
        <div>
          {formatUnits(amountRaised, 18)} / {formatUnits(targetAmount, 18)}
        </div>
        <p>{deadline}</p>
        <p>{completed}</p>
        <button onClick={() => setDonateModalOpen(true)} className="donate">
          Donate
        </button>
      </div>
      <DonateModal
        projectTokenAddress={projectTokenAddress}
        open={donateModalOpen}
        setClosed={() => setDonateModalOpen(false)}
      />
    </div>
  );
};
