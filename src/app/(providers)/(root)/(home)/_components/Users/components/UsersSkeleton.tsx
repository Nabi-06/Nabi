function UsersSkeleton() {
  return (
    <article className="bg-white h-[360px] px-6 pt-5 flex flex-col rounded-lg shadow-sm">
      <div className="w-44 h-6 mx-[32.5px] mb-4 mt-[8px] bg-gray-200" />
      <ul className=" grid grid-cols-1 mt-2 grid-rows-5 gap-y-2">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <li key={index} className="flex gap-x-4 items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-40 h-6 bg-gray-200"></div>
            </li>
          ))}
      </ul>
    </article>
  );
}

export default UsersSkeleton;
