import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { erc20ABI, useAccount, useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";
import { TokenSymbol } from "~~/components/fundguys/";

const SUPPORTED_TOKENS = [
  {
    symbol: "LINK",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    decimals: 18,
  },
  {
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
  },
  {
    symbol: "WETH",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
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

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? (
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
      />
    </>
  ) : (
    "loading client..."
  );
};

const DonateModal = ({ projectTokenAddress, projectAddress, projectName }: IDonateToCampaign) => {
  const [tokenToDonate, setTokenToDonate] = useState();
  const [amount, setAmount] = useState();
  const { address } = useAccount();
  const [quote, setQuote] = useState();
  const isSendingEth = projectTokenAddress === "0x0000000000000000000000000000000000000000";
  const [buttonText, setButtonText] = useState("Submit");

  const parsedAmount = BigInt(parseUnits(amount || "", tokensByAddress[tokenToDonate]?.decimals));

  const { data: allowance = 0n } = useContractRead({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address || "0x", projectTokenAddress],
  });

  console.log("allowance", allowance);

  const { writeAsync: approve } = useContractWrite({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "approve",
    args: [projectAddress, parsedAmount],
  });

  const args = [parsedAmount, tokenToDonate, projectTokenAddress, quote?.allowanceTarget, quote?.to, quote?.data];
  const { writeAsync: sendTokenDonation } = useContractWrite({
    address: projectAddress,
    abi: ProjectABI,
    functionName: "donateToken",
    args,
  });

  useEffect(() => {
    const getQuote = async () => {
      const res = await fetch(
        `/api/swap?buyToken=${projectTokenAddress}&sellToken=${tokenToDonate}&sellAmount=${parsedAmount}`,
      );
      const quoteData = await res.json();
      setQuote(quoteData);
    };
    if (tokenToDonate) getQuote();
  }, [tokenToDonate, projectTokenAddress, parsedAmount]);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // I think allowance not working as in it never gets set or read from allowance useContractRead
    if (allowance < parsedAmount) {
      setButtonText("Approving...");
      await approve();
    }
    setButtonText("Donating...");
    await sendTokenDonation();
    const modal = document.getElementById("campaign_modal");
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  return (
    <dialog id={projectAddress} className="modal">
      <div className="modal-box bg-base-200 p-8 w-full">
        <h3 className="font-normal font-cubano text-4xl text-center mb-7">Donate</h3>
        <div className="text-xl px-2 mb-5">
          <div className="flex justify-between">
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
        <form method="dialog" onSubmit={e => handleSubmit(e)} noValidate autoComplete="off">
          {isSendingEth ? (
            <h1>Send eth</h1>
          ) : (
            <div>
              <select
                onChange={e => setTokenToDonate(e.target.value)}
                value={tokenToDonate}
                className="w-full bg-base-300 mb-5 p-5 rounded-2xl cursor-pointer text-xl "
              >
                <option disabled selected>
                  Select token
                </option>
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
          )}
          <button className="btn btn-lg btn-accent font-cubano text-2xl font-normal w-full">{buttonText}</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
