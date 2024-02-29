export const CampaignCard = ({ contractAddress }: { contractAddress: string }) => {
  console.log("contractAddress", contractAddress);

  return Array.from(Array(1).keys()).map((_, idx) => (
    <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
  ));
};
