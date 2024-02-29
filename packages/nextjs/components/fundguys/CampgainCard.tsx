"use client";

import { Address } from "viem";
import { useContractRead } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";

interface Props {
  contractAddress: Address;
}

export const CampaignCard = ({ contractAddress }: Props) => {
  const {
    data: projectData,
    isLoading,
    isError,
  } = useContractRead({
    address: contractAddress,
    abi: ProjectABI,
    functionName: "getProject",
  });
  if (isLoading) return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;
  if (isError) return <h1>Failed to fetch Campaign data</h1>;
  const [title, description, image, targetAmount, amountRaised, deadline, completed] = projectData as any;
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{image}</p>
      <p>{targetAmount}</p>
      <p>{amountRaised}</p>
      <p>{deadline}</p>
      <p>{completed}</p>
    </div>
  );
};
