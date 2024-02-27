"use client";

import Link from "next/link";
import type { NextPage } from "next";

import DonateOrSwap from "~~/components/fundguys/DonateOrSwap";
import { CreateCampaign } from "~~/components/fundguys/CreateCampaign";


const Home: NextPage = () => {

  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <h1 className="text-center text-6xl font-chewy mb-10">
            <span className="mr-1">🍄</span>
            <span className="text-7xl">FundGuys</span>
            <span className="ml-1">🍄‍🟫</span>
          </h1>

          <DonateOrSwap 
            btnType="button"
            title="Donate"
            styles="btn btn-primary"
          />

          <p className="text-center text-2xl mb-10">
            A public goods funding platform on Base that rewards funders with Mycologuys NFTs
          </p>
        </div>
        <div className="flex justify-center gap-8 mb-5">
          <Link href="/campaigns" className="btn btn-lg btn-primary w-60 text-2xl font-normal font-cubano">
            Fund
          </Link>
          <CreateCampaign />
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from(Array(3).keys()).map((_, idx) => (
              <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl mb-5 font-bold">Recent Funders</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from(Array(4).keys()).map((_, idx) => (
              <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
