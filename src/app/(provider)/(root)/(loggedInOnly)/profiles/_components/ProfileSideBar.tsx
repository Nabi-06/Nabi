"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import { UserProfiles } from "@/types/customDatabase";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProfileSideBarProps {
  profile: UserProfiles["Row"];
}

function ProfileSideBar({ profile }: ProfileSideBarProps) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  // 후원자가 본인 프로필을 봤을 때 모집글 불러오기
  const { data: myRecruits } = useQuery({
    queryKey: ["recruits", { userId: profile.userId }],
    queryFn: () => clientApi.recruits.getSortedMyRecruits(profile.userId),
    enabled: profile.role === "sponsor" && currentUserId === profile.userId,
  });

  const { mutate: approved } = useMutation({
    mutationFn: (userId: string) => clientApi.sponsorMeets.approvedUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recruits", { userId: profile.userId }],
      });
    },
  });

  // 다른 유저 프로필 봤을 때 최근 후원자|후원아동 불러오기
  const { data: recentlySponsorships } = useQuery({
    queryKey: ["recruits", { profile }],
    queryFn: () =>
      clientApi.sponsorMeets.getRecentlySponsorship(
        profile.userId,
        profile.role
      ),
  });

  const handleClickApproved = (userId: string) => {
    approved(userId);
  };

  return (
    <article className="grow bg-gray-300 h-full rounded-lg text-center">
      {profile.role === "sponsor" ? (
        currentUserId === profile.userId ? (
          // 후원자 본인 프로필
          <>
            <strong>모집글 목록</strong>
            <ul className="flex flex-col gap-y-4 text-start items-center ">
              {myRecruits?.map((recruit) => (
                <li className="w-56 bg-yellow-300 " key={recruit.recruitId}>
                  <p>{recruit.title}</p>
                  <p>{recruit.content}</p>
                  <br />
                  {recruit.sponsorMeets.some((user) => user.isSponsor) &&
                    recruit.maxSponsorRecruits >=
                      recruit.sponsorMeets.filter(
                        (user) => user.isSponsor && user.isApproved
                      ).length && (
                      <div className="text-center">
                        <strong>
                          모집된 후원자 목록 (
                          {
                            recruit.sponsorMeets.filter(
                              (user) => user.isSponsor && user.isApproved
                            ).length
                          }
                          /{recruit.maxSponsorRecruits})
                        </strong>
                        <ul>
                          {recruit.maxSponsorRecruits >
                            recruit.sponsorMeets.filter(
                              (user) => user.isSponsor && user.isApproved
                            ).length &&
                            recruit.sponsorMeets
                              .filter(
                                (user) => user.isSponsor && !user.isApproved
                              )
                              .map((user) => (
                                <li
                                  className="grid grid-cols-2"
                                  key={user.userId}
                                >
                                  <p>{user.userProfiles?.nickname}</p>
                                  <Button
                                    className="px-0 py-0 border-none bg-black rounded-sm text-white text-sm"
                                    onClick={() =>
                                      handleClickApproved(user.userId)
                                    }
                                  >
                                    수락하기
                                  </Button>
                                </li>
                              ))}
                        </ul>
                      </div>
                    )}
                  <br />
                  {recruit.sponsorMeets.some((user) => !user.isSponsor) &&
                    recruit.maxRecipientRecruits >=
                      recruit.sponsorMeets.filter(
                        (user) => !user.isSponsor && user.isApproved
                      ).length && (
                      <div className="text-center">
                        <strong>
                          모집된 아동 목록(
                          {
                            recruit.sponsorMeets.filter(
                              (user) => !user.isSponsor && user.isApproved
                            ).length
                          }
                          /{recruit.maxSponsorRecruits})
                        </strong>
                        <ul>
                          {recruit.maxSponsorRecruits >
                            recruit.sponsorMeets.filter(
                              (user) => !user.isSponsor && user.isApproved
                            ).length &&
                            recruit.sponsorMeets
                              .filter(
                                (user) => !user.isSponsor && !user.isApproved
                              )
                              .map((user) => (
                                <li
                                  className="grid grid-cols-2"
                                  key={user.userId}
                                >
                                  <p>{user.userProfiles?.nickname}</p>
                                  <Button
                                    className="px-0 py-0 border-none bg-black rounded-sm text-white text-sm"
                                    onClick={() =>
                                      handleClickApproved(user.userId)
                                    }
                                  >
                                    수락하기
                                  </Button>
                                </li>
                              ))}
                        </ul>
                      </div>
                    )}
                </li>
              ))}
            </ul>

            <ul></ul>
          </>
        ) : (
          // 다른 후원자의 프로필
          <>
            <strong>이 후원자가 최근에 후원한 아이들</strong>
            <ul>
              {recentlySponsorships?.map((recentlySponsorship) => (
                <li key={recentlySponsorship.userId}>
                  {recentlySponsorship.userProfiles?.nickname}
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
            {recentlySponsorships?.map((recentlySponsorship) => (
              <li key={recentlySponsorship.userId}>
                {recentlySponsorship.userProfiles?.nickname}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default ProfileSideBar;
