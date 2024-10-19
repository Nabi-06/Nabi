"use client";
import clientApi from "@/api/clientSide/api";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import ApplicantList from "./ApplicantList";

interface ProfileSideBarProps {
  profile: Tables<"userProfiles">;
}

function ProfileSideBar({ profile }: ProfileSideBarProps) {
  const user = useAuthStore((state) => state.currentUser);

  // 후원자가 본인 프로필을 봤을 때 모집글 불러오기
  const { data: myRecruits } = useQuery({
    queryKey: ["myRecruits", { userId: profile.userId }],
    queryFn: () => clientApi.recruits.getSortedMyRecruits(profile.userId),
    enabled: profile.role === "sponsor" && user?.userId === profile.userId,
  });

  // 다른 유저 프로필 봤을 때 최근 후원아동 불러오기
  const { data: recentlyRecipients, isLoading } = useQuery({
    queryKey: ["sponsorMeets", { profile }],
    queryFn: () => clientApi.sponsorMeets.getRecentlyRecipients(profile.userId),
    enabled: profile.role === "sponsor",
  });

  // 다른 유저 프로필 봤을 때 최근 후원자 불러오기
  const { data: recentlySponsors } = useQuery({
    queryKey: ["recipientMeets", { profile }],
    queryFn: () => clientApi.recipientMeets.getRecentlySponsors(profile.userId),
    enabled: profile.role === "recipient",
  });

  if (isLoading) return <span>데이터 로딩 중 ..</span>;

  return (
    <article className="grow h-full rounded-lg text-center">
      {profile.role === "sponsor" ? (
        user?.userId === profile.userId ? (
          // 후원자 본인 프로필
          <ul className="flex flex-col gap-y-8 h-full text-start">
            {myRecruits?.map((recruit) => (
              <li
                className="flex flex-col gap-y-2 h-full bg-white py-3 px-2 shadow-md rounded-lg"
                key={recruit.recruitId}
              >
                <ApplicantList recruit={recruit} profile={profile} />
              </li>
            ))}
          </ul>
        ) : (
          // 다른 후원자의 프로필
          <>
            <strong>이 후원자가 최근에 후원한 아이들</strong>
            <ul>
              {recentlyRecipients?.map((recipient) => (
                <li key={recipient?.userId}>
                  {recipient.userProfiles[0].nickname}
                </li>
              ))}
            </ul>
          </>
        )
      ) : (
        // 다른 후원아동의 프로필
        <>
          <strong>이 아동에게 최근 후원한 후원자</strong>
          <ul>
            {recentlySponsors?.map((sponsor) => (
              <li key={sponsor.userId}>{sponsor.userProfiles[0].nickname}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default ProfileSideBar;
