import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { erc20ABI, useAccount, useContractRead, useContractWrite } from "wagmi";
import ProjectABI from "~~/app/campaigns/ProjectABI.json";

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

export const DonateModal = ({ projectTokenAddress, projectAddress }) => {
  const [tokenToDonate, setTokenToDonate] = useState();
  const [amount, setAmmount] = useState();
  const { address } = useAccount();
  const [quote, setQuote] = useState();
  const isSendingEth = projectTokenAddress === "0x0000000000000000000000000000000000000000";

  const parsedAmount = BigInt(parseUnits(amount || "", tokensByAddress[tokenToDonate]?.decimals));

  const { data: allowance } = useContractRead({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, projectAddress],
  });

  const { write: approve } = useContractWrite({
    address: tokenToDonate,
    abi: erc20ABI,
    functionName: "approve",
    args: [projectAddress, parsedAmount],
  });

  const args = [parsedAmount, tokenToDonate, projectTokenAddress, quote?.allowanceTarget, quote?.to, quote?.data];
  const { write: sendTokenDonation } = useContractWrite({
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

  const needsApproval = (allowance || 0n) < parsedAmount;
  const submitText = needsApproval ? "Approve" : "Send";
  const handleSubmit = () => {
    console.log({
      args,
    });
    needsApproval ? approve?.() : sendTokenDonation?.();
  };

  return (
    <dialog id="donate_modal" className="modal">
      <div className="modal-box">
        <div className="modal-action">
          <form method="dialog">
            {isSendingEth ? (
              <h1>Send eth</h1>
            ) : (
              <div>
                <h1>allowance: {allowance}</h1>
                <select
                  onChange={e => setTokenToDonate(e.target.value)}
                  value={tokenToDonate}
                  className="select select-bordered w-full max-w-xs"
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
                  onChange={e => setAmmount(e.target.value)}
                  type="number"
                  placeholder="Donation amount"
                  className="input w-full max-w-xs"
                />
              </div>
            )}
            <span onClick={handleSubmit} className="btn">
              {submitText}
            </span>
          </form>
        </div>
      </div>
    </dialog>
  );
};
