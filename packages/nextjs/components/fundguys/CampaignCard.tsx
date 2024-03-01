"use client";

import Link from "next/link";
import { DonateModal } from "./DonateModal";
import { Address, formatUnits, parseAbi } from "viem";
import { useContractRead, useContractWrite, useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";

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


  if (isLoading) return <div className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>;

  console.log({ projectData });
  const [title, description, image, projectTokenAddress, targetAmount, amountRaised, deadline] = projectData as any;

  const percentageBigInt = (amountRaised || 0n * BigInt(100)) / (targetAmount || 1n);
  const percentage = Number(percentageBigInt);

  const deadlineDate = new Date(Number(deadline) * 1000);
  const currentDate = new Date();
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  };

  return (
    <div className="bg-base-200 rounded-xl cursor-pointer transition-transform transform hover:scale-102 hover:shadow-lg hover:shadow-base-200">
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
            <button
              onClick={() => write({})}
              className="btn btn-primary rounded-lg w-full font-cubano font-normal text-xl"
            >
              Withdraw
            </button>
          ) : (
            <button className="btn btn-accent  w-full font-cubano font-normal text-xl" onClick={openModal}>
              Donate
            </button>
          )}
        </div>
      </div>
      <DonateModal projectTokenAddress={projectTokenAddress} projectAddress={contractAddress} />
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
