import useSWR from "swr";
import {
  SEPOLIA_TOKENS_BY_SYMBOL,
  SEPOLIA_TOKENS_BY_ADDRESS,
} from "../../utils/scaffold-eth/sepoliaConstants";
import { fetcher } from "./Quote";
import type { PriceResponse, QuoteResponse } from "../../app/api/types";
import { formatUnits } from "viem";
import {
  useAccount,
  useSendTransaction,
  usePrepareSendTransaction,
  type Address,
} from "wagmi";

export default function SwapView({
  price,
  quote,
  setQuote,
  takerAddress,
}: {
  price: PriceResponse;
  quote: QuoteResponse | undefined;
  setQuote: (price: any) => void;
  takerAddress: Address | undefined;
}) {
    const sellTokenInfo = price.sellTokenAddress.toLowerCase();
    const buyTokenInfo = price.buyTokenAddress.toLowerCase();

    console.log(sellTokenInfo, buyTokenInfo);

  // fetch quote here
  const { address } = useAccount();

  const { isLoading: isLoadingPrice } = useSWR(
    [
      "/api/swap",
      {
        sellToken: price.sellTokenAddress,
        buyToken: price.buyTokenAddress,
        sellAmount: price.sellAmount,
        // buyAmount: TODO if we want to support buys,
        takerAddress,
      },
    ],
    fetcher,
    {
        onSuccess: (data) => {
            setQuote(data);
            console.log("quote", data);
            console.log(formatUnits(data.buyAmount, SEPOLIA_TOKENS_BY_ADDRESS[buyTokenInfo].decimals), data);
        },
    }
  );

  const {config} = usePrepareSendTransaction({
    to: quote?.to,
    data: quote?.data ? `0x${quote.data.slice(2)}` : undefined,
  });


  const { sendTransaction } = useSendTransaction(config);

  if (!quote ) {
    return <div>Getting best quote...</div>;
  }

  console.log("sellAmount", quote?.sellAmount);
  console.log(formatUnits(BigInt(quote?.sellAmount), SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.decimals));

  console.log('HERE',SEPOLIA_TOKENS_BY_ADDRESS["0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"]?.decimals)
  console.log(`Test`, sellTokenInfo);
  console.log(`LogoURI`, SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.logoURI);

  return (
    <div className="p-3 mx-auto max-w-screen-sm ">
      <form>
        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
            <div className="text-xl mb-2 text-white">You pay</div>
            <div className="flex items-center text-lg sm:text-3xl text-white">
                <img
                    alt={SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.symbol}
                    className="h-9 w-9 mr-2 rounded-md"
                    src={SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.logoURI}
                />
                <span>{formatUnits(BigInt(quote.sellAmount), SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.decimals)}</span>
                <div className="ml-2">{SEPOLIA_TOKENS_BY_ADDRESS[sellTokenInfo]?.symbol}</div>
            </div>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-xl mb-2 text-white">You receive</div>
            <div className="flex items-center text-lg sm:text-3xl text-white">
                <img
                    alt={
                      SEPOLIA_TOKENS_BY_ADDRESS[buyTokenInfo]?.symbol
                    }
                    className="h-9 w-9 mr-2 rounded-md"
                    src={
                        SEPOLIA_TOKENS_BY_ADDRESS[buyTokenInfo]?.logoURI
                    }
                />
                <span>{formatUnits(BigInt(quote.buyAmount), SEPOLIA_TOKENS_BY_ADDRESS[buyTokenInfo]?.decimals)}</span>
                <div className="ml-2">{SEPOLIA_TOKENS_BY_ADDRESS[buyTokenInfo]?.symbol}</div>
            </div>
        </div>    
      </form>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => {
          console.log("submitting quote to blockchain");
          sendTransaction && sendTransaction();
        }}
      >
        Place Order
      </button>
    </div>
  );
}