// import Link from "next/link";
import type { NextPage } from "next";

const Profile: NextPage = () => {
  return (
    <>
      <div className="px-5 sm:px-7 md:px-20 my-10">
        <h3 className="text-6xl text-center font-bold">Your Profile</h3>

        <p className="text-center text-2xl my-10">View and manage your public goods campaigns</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from(Array(3).keys()).map((_, idx) => (
            <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
