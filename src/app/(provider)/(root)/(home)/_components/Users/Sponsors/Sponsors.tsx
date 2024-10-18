"use client";

import clientApi from "@/api/clientSide/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import User from "../User";

function Sponsors() {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["userProfiles", { role: "sponsor" }],
    queryFn: () =>
      clientApi.profiles.getProfilesFilterByRoleAndSponsorShipCount("sponsor"),
  });

  if (isLoading) return <span>데이터 불러오는 중 ...</span>;

  return (
    <article className="bg-white h-[320px] px-6 pt-5 flex flex-col gap-y-5 rounded-lg shadow-sm">
      <h2 className="flex items-center gap-x-2 text-center mx-auto font-semibold">
        <Image
          width={100}
          height={100}
          className="w-5 aspect-square"
          src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Crown.png?t=2024-10-15T23%3A41%3A11.949Z"
          alt="hot icon"
        />
        활동률이 높은 후원자
      </h2>
      <ul className="grid grid-cols-1 grid-rows-5 gap-y-2">
        {sponsors!.slice(0, 5).map((sponsor) => {
          return (
            <li key={sponsor.userId}>
              <User user={sponsor} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default Sponsors;
