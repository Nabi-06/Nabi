"use client";

import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

function Sponsors() {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["userProfiles", { role: "sponsor" }],
    queryFn: () =>
      clientApi.profiles.getProfilesFilterByRoleAndSponsorShipCount("sponsor"),
  });

  if (isLoading)
    return (
      <ul className="grid grid-cols-1 grid-rows-5 gap-y-2">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <li key={index} className="flex gap-x-4 items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-40 h-6 bg-gray-200"></div>
            </li>
          ))}
      </ul>
    );

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
              <ProfileItem
                className="m-auto"
                nickname={sponsor.nickname}
                userId={sponsor.userId}
                profileImageUrl={sponsor.profileImageUrl}
              />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default Sponsors;
