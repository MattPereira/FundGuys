import React, { useState } from "react";
import Modal from "react-modal";
import QuoteView from "./Quote";
import SwapView from "./Swap";
import type { PriceResponse, QuoteResponse } from "../../app/api/types";
import { useAccount } from "wagmi";

interface DonateOrSwapProps {
  btnType: string;
  title: string;
  styles: string;
}

const DonateOrSwap: React.FC<DonateOrSwapProps> = ({ btnType, title, styles }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [price, setPrice] = useState<PriceResponse >();
  const [quote, setQuote] = useState<QuoteResponse>();
  const [finalize, setFinalize] = useState<boolean>(false);
  const { address: connectedAddress } = useAccount(); 

  return (
    <div className="flex items-center justify-center">
      <button type={btnType as "submit" | "button"} className="bg-black text-white px-10 py-10 mt-[15px] rounded-[10px] group-hover:opacity-75 flex text-4xl items-center text-center justify-center" onClick={() => setModalIsOpen(true)}>
        Donate
      </button>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}ariaHideApp={false}>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
            {finalize && price ? (
              <SwapView
                takerAddress={connectedAddress}
                price={price}
                quote={quote}
                setQuote={setQuote}
              />
            ) : (
              <QuoteView
                takerAddress={connectedAddress}
                price={price}
                setPrice={setPrice}
                setFinalize={setFinalize}
              />
            )}
          </div>
      </Modal>
    </div>
  );
};

export default DonateOrSwap;
