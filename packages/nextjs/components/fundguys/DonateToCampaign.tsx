import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { erc20ABI, useAccount, useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";
import { TokenSymbol } from "~~/components/fundguys/";

const SUPPORTED_TOKENS = [
  {
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    symbol: "DAI",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
  },
  {
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
];

const tokensByAddress = SUPPORTED_TOKENS.reduce((tokenMap, token) => ({ ...tokenMap, [token.address]: token }), {});

interface IDonateToCampaign {
  projectName: string;
  projectTokenAddress: string;
  projectAddress: string;
}

export const DonateToCampaign = ({ projectTokenAddress, projectAddress, projectName }: IDonateToCampaign) => {
  const [isClient, setIsClient] = useState(false);

  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient
    ? connectedAddress && (
        <>
          <button
            className="btn btn-accent  w-full font-cubano font-normal text-xl"
            onClick={() => {
              const modal = document.getElementById(projectAddress);
              if (modal instanceof HTMLDialogElement) {
                modal.showModal();
              }
            }}
          >
            Donate
          </button>
          <DonateModal
            projectName={projectName}
            projectTokenAddress={projectTokenAddress}
            projectAddress={projectAddress}
            connectedAddress={connectedAddress}
          />
        </>
      )
    : "loading client...";
};

const DonateModal = ({
  projectTokenAddress,
  projectAddress,
  projectName,
  connectedAddress,
}: {
  projectName: string;
  projectTokenAddress: string;
  projectAddress: string;
  connectedAddress: string;
}) => {
  const [donationApproved, setDonationApproved] = useState(false);
  const [tokenToDonate, setTokenToDonate] = useState(projectTokenAddress);
  const [amount, setAmount] = useState("0");
  const [quote, setQuote] = useState();
  const [approveButtonText, setApproveButtonText] = useState("Approve");

  const parsedAmount = BigInt(parseUnits(amount, tokensByAddress[tokenToDonate]?.decimals));

  const { data: allowance } = useContractRead({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "allowance",
    args: [connectedAddress, projectAddress],
  });
  console.log("allowance", allowance);

  const { writeAsync: approve, isSuccess: approveIsSuccess } = useContractWrite({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "approve",
    args: [projectAddress, parsedAmount],
  });

  /**
   * Kinda works if the token being donated is different from the project's desired token
   * But if the token being donated is the same as the project's desired token, the 0x api returns error
   */
  const args = [parsedAmount, tokenToDonate, projectTokenAddress, quote?.allowanceTarget, quote?.to, quote?.data];
  const { writeAsync: sendTokenDonation, isSuccess: donateIsSuccess } = useContractWrite({
    address: projectAddress,
    abi: ProjectABI,
    functionName: "donateToken",
    args,
  });

  const { writeAsync: donateSameToken} = useContractWrite({
    address: projectAddress,
    abi: ProjectABI,
    functionName: "donateSameToken",
    args: ["0xfff9976782d46cc05630d1f6ebab18b2324d6b14"],
  });

  useEffect(() => {
    if (approveIsSuccess) {
      setDonationApproved(true); // Update state when approval transaction is successful
    }
  }, [approveIsSuccess]);

  useEffect(() => {
    if (donateIsSuccess) {
      const modal = document.getElementById("campaign_modal");
      if (modal instanceof HTMLDialogElement) {
        modal.close();
      }
    }
  }, [donateIsSuccess]);

  useEffect(() => {
    const getQuote = async () => {
      const res = await fetch(
        `/api/swap?buyToken=${projectTokenAddress}&sellToken=${tokenToDonate}&sellAmount=${parsedAmount}`,
      );
      const quoteData = await res.json();
      console.log("quoteData", quoteData);
      setQuote(quoteData);
    };
    if (tokenToDonate) getQuote();
  }, [tokenToDonate, projectTokenAddress, parsedAmount]);

  const handleApprove = async (e: any) => {
    e.preventDefault(); // dont close modal on click of approve button
    try {
      setApproveButtonText("Approving...");
      await approve();
    } catch (e) {
      console.log(e);
      setApproveButtonText("Approve");
    }
  };

  const handleDonate = async (e: any) => {
    e.preventDefault(); // dont immediately close modal on click of donate button
    if (projectTokenAddress === tokenToDonate) {
      await donateSameToken();
    } else {
    await sendTokenDonation();
  }
  };

  return (
    <dialog id={projectAddress} className="modal">
      <div className="modal-box bg-base-200 p-8 w-full">
        <h3 className="font-bold text-4xl text-center mb-7">Donate</h3>
        <div className="text-xl px-2 mb-5">
          <div className="flex justify-between mb-3">
            <div>Project Name</div>
            <div>{projectName}</div>
          </div>
          <div className="flex justify-between">
            <div>Desired Asset </div>
            <div>
              <TokenSymbol tokenAddress={projectTokenAddress} />
            </div>
          </div>
        </div>
        <form method="dialog" noValidate autoComplete="off">
          <div>
            <select
              onChange={e => setTokenToDonate(e.target.value)}
              value={tokenToDonate}
              className="w-full bg-base-300 mb-5 p-5 rounded-2xl cursor-pointer text-xl "
            >
              {SUPPORTED_TOKENS.map(tokenData => (
                <option key={tokenData.address} value={tokenData.address}>
                  {tokenData.symbol}
                </option>
              ))}
            </select>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              placeholder="Amount"
              className="w-full bg-base-300 mb-5 p-5 rounded-2xl text-xl"
            />
          </div>

          {allowance || 0n > parsedAmount || donationApproved ? (
            <button
              onClick={e => handleDonate(e)}
              className="btn btn-lg btn-accent font-cubano text-2xl font-normal w-full"
            >
              Submit
            </button>
          ) : (
            <button
              disabled={approveButtonText === "Approving..."}
              onClick={e => handleApprove(e)}
              className="btn btn-lg btn-accent font-cubano text-2xl font-normal w-full"
            >
              {approveButtonText}
            </button>
          )}
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
