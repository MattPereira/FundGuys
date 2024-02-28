export const SkeletonLoader = ({ numberOfItems }: { numberOfItems: number }) => {
  return Array.from(Array(numberOfItems).keys()).map((_, idx) => (
    <div key={idx} className="skeleton animate-pulse bg-base-100 rounded-xl w-full h-72"></div>
  ));
};
