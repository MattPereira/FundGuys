// import Link from "next/link";
import type { NextPage } from "next";
import { CreateCampaign } from "~~/components/fundguys/CreateCampaign";

const Campaigns: NextPage = () => {
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <h3 className="text-6xl text-center font-bold">Campaigns</h3>
        <div className="flex justify-center my-10">
          <CreateCampaign />
        </div>

        <div>this is the campaign list page</div>
      </div>
    </>
  );
};

export default Campaigns;
