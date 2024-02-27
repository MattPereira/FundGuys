// import Link from "next/link";
import type { NextPage } from "next";

const Funders: NextPage = () => {
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <h3 className="text-6xl text-center font-bold">Funders</h3>

        <p className="text-center text-2xl my-10">
          Check out all the funders who have contributed to public goods campaigns on FundGuys
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {Array.from(Array(8).keys()).map((_, idx) => (
            <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Funders;
