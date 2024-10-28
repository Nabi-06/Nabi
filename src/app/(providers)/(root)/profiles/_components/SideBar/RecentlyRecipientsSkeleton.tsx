function RecentlyRecipientsSkeleton() {
  return Array(5)
    .fill(null)
    .map((_, index) => (
      <li className="flex items-center gap-x-4" key={index}>
        <div className="w-10 h-10 rounded-lg bg-gray-200 " />
        <div className="w-[100px] h-6 rounded-md bg-gray-200"></div>
      </li>
    ));
}

export default RecentlyRecipientsSkeleton;
