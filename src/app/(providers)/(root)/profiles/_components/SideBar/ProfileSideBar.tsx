"use client";
import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import RecentlyRecipientsSkeleton from "./RecentlyRecipientsSkeleton";
import StoreSkeleton from "./StoreSkeleton";

interface ProfileSideBarProps {
  profile: Tables<"userProfiles">;
}

function ProfileSideBar({ profile }: ProfileSideBarProps) {
  const user = useAuthStore((state) => state.currentUser);

  // 다른 유저 프로필 봤을 때 최근 후원아동 불러오기
  const { data: recentlyRecipients } = useQuery({
    queryKey: ["sponsorMeets", { profile }],
    queryFn: () => clientApi.sponsorMeets.getRecentlyRecipients(profile.userId),
    enabled: profile.role === "sponsor",
  });

  // 후원자의 후원매장 불러오기
  const { data: ownerData } = useQuery({
    queryKey: ["storeOwners", { profile }],
    queryFn: () => {
      if (!profile.userId) return;
      return clientApi.storeOwners.getStoreByUserId(profile.userId);
    },
    enabled: profile.role === "sponsor",
  });

  // 다른 유저 프로필 봤을 때 최근 후원자 불러오기
  const { data: recentlySponsors } = useQuery({
    queryKey: ["recipientMeets", { profile }],
    queryFn: () => clientApi.recipientMeets.getRecentlySponsors(profile.userId),
    enabled: profile.role === "recipient",
  });

  const { data: regularSpons } = useQuery({
    queryKey: ["regularSponsorShips", { profile }],
    queryFn: () => {
      if (profile.role === "sponsor")
        return clientApi.regularSponsorShip.getSponsorshipBySponsorIdReturnRecipient(
          profile.userId
        );

      if (profile.role === "recipient")
        return clientApi.regularSponsorShip.getSponsorshipByRecipientIdReturnSponsor(
          profile.userId
        );
    },
    enabled: !!profile.role,
  });

  return (
    <div className="flex flex-col grow gap-y-4 peer">
      {regularSpons && regularSpons.length !== 0 && (
        <article className="text-center bg-white rounded-lg shadow-md py-4 px-7">
          <h3 className="font-bold">
            {profile.role === "sponsor"
              ? "후원 중인 아동 목록"
              : "후원 중인 후원자"}
          </h3>
          <ul className="flex flex-col gap-y-2 pl-6 mt-4">
            {regularSpons?.map((user) => {
              return (
                <li key={user.userId}>
                  <ProfileItem
                    nickname={user.nickname}
                    userId={user.userId}
                    profileImageUrl={user.profileImageUrl}
                  />
                </li>
              );
            })}
          </ul>
        </article>
      )}
      {profile.role === "sponsor" && (
        <article className="text-center bg-white rounded-lg shadow-md py-4 px-7">
          <h3 className="font-bold">후원 매장</h3>
          <span className="text-xs text-gray-400">
            매장 이름 클릭 시 매장 위치로 이동합니다
          </span>
          {!ownerData ? (
            <StoreSkeleton />
          ) : ownerData?.length >= 0 ? (
            <ul className="mt-4">
              {ownerData?.map((store, idx) => {
                const storeData = store.storeDatas;
                return (
                  <li key={idx}>
                    <Link
                      href={`/free-meals/map?lat=${storeData.lat}&lng=${storeData.lng}&brandName=${storeData.brandName}`}
                    >
                      {storeData.brandName.length < 15
                        ? storeData.brandName
                        : storeData.brandName.slice(0, 15) + "..."}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="block mt-2 text-sm">
              점주로 등록된 매장이 없습니다
            </span>
          )}
        </article>
      )}
      <article className="rounded-lg text-center">
        {profile.role === "sponsor" ? (
          user?.userId !== profile.userId ? (
            // 다른 후원자의 프로필
            <div className="bg-white rounded-lg shadow-md py-4 px-5">
              <h3 className="mb-4 font-bold">
                이 후원자가 최근에 후원한 아이들
              </h3>
              <ul className="flex flex-col gap-y-2 pl-9">
                {recentlyRecipients &&
                  recentlyRecipients?.map((recentlyRecipient, idx) => {
                    const recipientProfiles = recentlyRecipient.userProfiles;
                    return (
                      <li key={idx} className="">
                        <ProfileItem
                          className="m-auto"
                          nickname={recipientProfiles.nickname}
                          userId={recipientProfiles.userId}
                          profileImageUrl={recipientProfiles.profileImageUrl}
                        />
                      </li>
                    );
                  })
                ) : (
                  <RecentlyRecipientsSkeleton />
                )}
              </ul>
            </div>
          ) : null
        ) : (
          // 다른 후원아동의 프로필
          <div className="bg-white rounded-lg shadow-md py-4 px-5">
            <h3 className="mb-4 font-bold">최근 후원자</h3>
            <ul>
              {recentlySponsors?.length !== 0 ? (
                recentlySponsors?.map((recentlySponsor, idx) => {
                  const sponsorProfiles = recentlySponsor.userProfiles;
                  return (
                    <li key={idx} className="">
                      <ProfileItem
                        className="m-auto"
                        nickname={sponsorProfiles.nickname}
                        userId={sponsorProfiles.userId}
                        profileImageUrl={sponsorProfiles.profileImageUrl}
                      />
                    </li>
                  );
                })
              ) : (
                <li>최근 후원자가 없습니다.</li>
              )}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}

export default ProfileSideBar;
