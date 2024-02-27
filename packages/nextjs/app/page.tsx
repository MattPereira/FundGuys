import Link from "next/link";
import type { NextPage } from "next";
import { CreateCampaign } from "~~/components/fundguys/CreateCampaign";

const Home: NextPage = () => {
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <div>
          <h1 className="text-center text-6xl font-bold mb-10">🍄FundGuys</h1>
          <p className="text-center text-2xl mb-10">
            A public goods funding platform on Base that rewards funders with Mycologuys NFTs
          </p>
        </div>
        <div className="flex justify-center gap-8 mb-5">
          <CreateCampaign />
          <Link href="/campaigns" className="btn btn-lg btn-primary w-60 text-xl">
            Fund Campaign
          </Link>
        </div>

        <div className="mb-10">
          <h3 className="text-3xl">Latest Campaigns</h3>
        </div>

        <div>
          <h3 className="text-3xl">Latest Funders</h3>
        </div>
      </div>
    </>
  );
};

export default Home;
