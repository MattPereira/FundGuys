"use client";

import qs from "qs";
import useSWR from "swr";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, ChangeEvent } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  type Address,
  useAccount,
} from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import {
  SEPOLIA_TOKENS,
  SEPOLIA_TOKENS_BY_SYMBOL,
  SEPOLIA_TOKENS_BY_ADDRESS,
  MAX_ALLOWANCE,
  exchangeProxy,
} from "../../utils/scaffold-eth/sepoliaConstants";
import { set } from "nprogress";

interface PriceRequestParams {
  projectId: bigint;
  donorToken: string; //changed
  projectToken: string; //changed
  buyAmount?: string; // recipient receive amount
  sellAmount?: string; // donor donation amount
  takerAddress?: string;
}

export const fetcher = ([endpoint, params]: [string, PriceRequestParams]) => {
    const {sellAmount, buyAmount} = params;
    if (!sellAmount && !buyAmount) return;
    const query = qs.stringify(params);
    // console.log(`HERE ${endpoint}?${query}`);
    return fetch(`${endpoint}?${query}`).then((res) => res.json());
  };
  
export default function QuoteView({
    price,
    setPrice,
    setFinalize,
    takerAddress,
    projectId,
  }: {
    price: any;
    setPrice: (price: any) => void;
    setFinalize: (finalize: boolean) => void;
    takerAddress: Address | undefined;
    projectId?: bigint;
  }) {
    // fetch price here
    const [sellAmount, setSellAmount] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [tradeDirection, setTradeDirection] = useState("sell");
    const [donorToken, setDonorToken] = useState("weth");
    const [projectToken, setProjectToken] = useState("uni");
    const [isSwap, setIsSwap] = useState(true);
  
    const handleDonorTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setDonorToken(e.target.value);
      setIsSwap(e.target.value !== projectToken);
    };

    const toggleSwap = () => {
      setIsSwap(!isSwap);
    }
  
    function handleProjectTokenChange(e: ChangeEvent<HTMLSelectElement>) {
      setProjectToken(e.target.value);
    }

    const donorTokenDecimals = SEPOLIA_TOKENS_BY_SYMBOL[donorToken]?.decimals;  
    const { writeAsync } = useScaffoldContractWrite({
      contractName: "PublicGoodsFunding",
      functionName: "donateFunds",
      args: [projectId, donorToken],
      value: parseUnits(sellAmount, donorTokenDecimals),
    });
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      await writeAsync();
      setSellAmount("");
    };
  
    console.log(sellAmount, donorTokenDecimals, "<-");
    const parsedSellAmount =
      sellAmount && tradeDirection === "sell"
        ? parseUnits(sellAmount, donorTokenDecimals).toString()
        : undefined;
  
    const projectTokenDecimals = SEPOLIA_TOKENS_BY_SYMBOL[projectToken]?.decimals;
  
    const parsedBuyAmount =
      buyAmount && tradeDirection === "buy"
        ? parseUnits(buyAmount, projectTokenDecimals).toString()
        : undefined;
  
    const { isLoading: isLoadingPrice } = useSWR(
      [
        "/api/quote",
        {
          sellToken: SEPOLIA_TOKENS_BY_SYMBOL[donorToken]?.address,
          buyToken: SEPOLIA_TOKENS_BY_SYMBOL[projectToken]?.address,
          sellAmount: parsedSellAmount,
          buyAmount: parsedBuyAmount,
          takerAddress,
        },
      ],
      fetcher,
      {
        onSuccess: (data) => {
          setPrice(data);
          if (tradeDirection === "sell") {
            console.log(formatUnits(data.buyAmount, projectTokenDecimals), data);
            setBuyAmount(formatUnits(data.buyAmount, projectTokenDecimals));
          } else {

            setSellAmount(formatUnits(data.sellAmount, donorTokenDecimals));
          }
        },
      }
    );

  
    const { data, isError, isLoading } = useBalance({
      address: takerAddress,
      token: SEPOLIA_TOKENS_BY_SYMBOL[donorToken]?.address,
    });

  
    const disabled =
      data && sellAmount
        ? parseUnits(sellAmount, donorTokenDecimals) > data.value
        : true;
  
    console.log(data, isError, isLoading);
  
    return (
      <form>
        <h1 className="text-3xl font-bold mb-4">Fund Guys</h1>
        <p className="text-md font-bold mb-2">SEPOLIA Network</p>

        <div>
           {isSwap ? (
                    <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-md mb-3">
                    <section className="mt-4 flex items-start justify-center">
                      <label htmlFor="sell-select" className="sr-only"></label>
                      <img
                        alt={donorToken}
                        className="h-9 w-9 mr-2 rounded-md"
                        src={SEPOLIA_TOKENS_BY_SYMBOL[donorToken]?.logoURI}
                      />
                      <div className="h-14 sm:w-full sm:mr-2">
                        <select
                          value={donorToken}
                          name="sell-token-select"
                          id="sell-token-select"
                          className="mr-2 w-50 sm:w-full h-9 rounded-md"
                          onChange={handleDonorTokenChange}
                        >
                          {/* <option value="">--Choose a token--</option> */}
                          {SEPOLIA_TOKENS.map((token) => {
                            return (
                              <option
                                key={token.address}
                                value={token.symbol.toLowerCase()}
                              >
                                {token.symbol}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <label htmlFor="sell-amount" className="sr-only"></label>
                      <input
                        id="sell-amount"
                        value={sellAmount}
                        className="h-9 rounded-md"
                        style={{ border: "1px solid black" }}
                        onChange={(e) => {
                          setTradeDirection("sell");
                          setSellAmount(e.target.value);
                        }}
                      />
                    </section>
                    <section className="flex mb-6 mt-4 items-start justify-center">
                      <label htmlFor="buy-token" className="sr-only"></label>
                      <img
                        alt={projectToken}
                        className="h-9 w-9 mr-2 rounded-md"
                        src={SEPOLIA_TOKENS_BY_SYMBOL[projectToken]?.logoURI}
                      />
                      <select
                        name="buy-token-select"
                        id="buy-token-select"
                        value={projectToken}
                        className="mr-2 w-50 sm:w-full h-9 rounded-md cursor-not-allowed"
                        onChange={(e) => handleProjectTokenChange(e)}
                      >
                        {/* <option value="">--Choose a token--</option> */}
                        {SEPOLIA_TOKENS.map((token) => {
                          return (
                            <option key={token.address} value={token.symbol.toLowerCase()}>
                              {token.symbol}
                            </option>
                          );
                        })}
                      </select>
                      <label htmlFor="buy-amount" className="sr-only"></label>
                      <input
                        id="buy-amount"
                        value={buyAmount}
                        className="h-9 rounded-md bg-grey cursor-not-allowed"
                        style={{ border: "1px solid black" }}
                        disabled
                        onChange={(e) => {
                          setTradeDirection("buy");
                          setBuyAmount(e.target.value);
                        }}
                      />
                    </section>
                    <div className="flex justify-center items-center text-center">
                      <button onClick={toggleSwap} className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 text-sm rounded mt-2">
                        {isSwap ? "Switch to Project Currency" : "Switch to Other Currency"}
                      </button>
                    </div>
                  </div>
           ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input
                type="text"
                value={sellAmount}
                onChange={e => setSellAmount(e.target.value)}
                placeholder="Amount in ETH"
                className="text-black focus:text-white h-8 mb-2 mt-2 rounded-[10px] text-center bg-[#6b7280]"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white mb-2 mt-2 font-bold py-2 px-4 rounded w-full disabled:opacity-25"
              >
                Donate
              </button>
              <button onClick={toggleSwap} className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 text-sm rounded mt-2">
                {isSwap ? "Switch to Project Currency" : "Switch to Other Currency"}
              </button>
            </form>
           )}
        </div>
  
        {takerAddress && isSwap ? (
          <ApproveOrReviewButton
            sellTokenAddress={SEPOLIA_TOKENS_BY_SYMBOL[donorToken]?.address}
            takerAddress={takerAddress}
            onClick={() => {
              setFinalize(true);
            }}
            disabled={disabled}
          />
        ) : !takerAddress ? (
          <ConnectButton.Custom>
            {({
                account, chain, openConnectModal, mounted
            }) => {
                    const connected = mounted && account && chain;
                    const { address } = useAccount();
                return ( 
                    <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        {connected ? address : "Connect Wallet"}
                    </button> 
                );
            }}
          </ConnectButton.Custom>
        ): (null)
        }
  
        {isLoadingPrice && (
          <div className="text-center mt-2">Fetching the best price...</div>
        )}
      </form>
    );
  }
  
  function ApproveOrReviewButton({
    takerAddress,
    onClick,
    sellTokenAddress,
    disabled,
  }: {
    takerAddress: Address;
    onClick: () => void;
    sellTokenAddress: Address;
    disabled?: boolean;
  }) {
    // 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
    const { data: allowance, refetch } = useContractRead({
      address: sellTokenAddress,
      abi: erc20ABI,
      functionName: "allowance",
      args: [takerAddress, exchangeProxy],
    });
  
    // 2. (only if no allowance): write to erc20, approve 0x Exchange Proxy to spend max integer
    const { config } = usePrepareContractWrite({
      address: sellTokenAddress,
      abi: erc20ABI,
      functionName: "approve",
      args: [exchangeProxy, MAX_ALLOWANCE],
    });
  
    const {
      data: writeContractResult,
      writeAsync: approveAsync,
      error,
    } = useContractWrite(config);
  
    const { isLoading: isApproving } = useWaitForTransaction({
      hash: writeContractResult ? writeContractResult.hash : undefined,
      onSuccess(data) {
        refetch();
      },
    });
  
    if (error) {
      return <div>Something went wrong: {error.message}</div>;
    }
  
    if (allowance === 0n && approveAsync) {
      return (
        <>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={async () => {
              const writtenValue = await approveAsync();
            }}
          >
            {isApproving ? "Approving…" : "Approve"}
          </button>
        </>
      );
    }
  
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-25"
      >
        {disabled ? "Insufficient Balance" : "Review Trade"}
      </button>
    );
  }