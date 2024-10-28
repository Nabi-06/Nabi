"use client";

import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import UsersSkeleton from "../components/UsersSkeleton";

function Sponsors() {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["userProfiles", { role: "sponsor" }],
    queryFn: () =>
      clientApi.profiles.getProfilesFilterByRoleAndSponsorShipCount("sponsor"),
  });

  if (isLoading) return <UsersSkeleton />;

  return (
    <article className="bg-white px-5 py-7 flex flex-col gap-y-6 rounded-lg border">
      <h2 className="flex items-center gap-x-2 font-semibold">
        <Image
          width={100}
          height={100}
          className="w-5 aspect-square"
          src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Crown.png?t=2024-10-15T23%3A41%3A11.949Z"
          alt="hot icon"
        />
        후원 활동이 활발한 후원자들
      </h2>

      <ul className="grid grid-cols-1 gap-y-3">
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
