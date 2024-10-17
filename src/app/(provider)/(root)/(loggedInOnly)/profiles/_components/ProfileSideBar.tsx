"use client";
import clientApi from "@/api/clientSide/api";
import { UserProfiles } from "@/types/customDatabase";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import ApprovedUser from "./ApprovedUser";
import NotApprovedUser from "./NotApprovedUser";

interface ProfileSideBarProps {
  profile: UserProfiles["Row"];
}

function ProfileSideBar({ profile }: ProfileSideBarProps) {
  const currentUserId = useAuthStore((state) => state.currentUserId);

  // 후원자가 본인 프로필을 봤을 때 모집글 불러오기
  const { data: myRecruits } = useQuery({
    queryKey: ["recruits", { userId: profile.userId }],
    queryFn: () => clientApi.recruits.getSortedMyRecruits(profile.userId),
    enabled: profile.role === "sponsor" && currentUserId === profile.userId,
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

  return (
    <article className="grow h-full rounded-lg text-center">
      {profile.role === "sponsor" ? (
        currentUserId === profile.userId ? (
          // 후원자 본인 프로필
          <ul className="flex flex-col gap-y-8 h-full text-start">
            {myRecruits?.map((recruit) => (
              <li
                className="flex flex-col gap-y-2 h-full bg-white py-3 px-2 shadow-md rounded-lg"
                key={recruit.recruitId}
              >
                <h3 className="font-light mx-auto text-center">
                  <span className="font-bold">
                    {recruit.title.length > 5
                      ? recruit.title.slice(0, 5) + "..."
                      : recruit.title}
                  </span>{" "}
                  글의 신청자 목록
                </h3>
                <br />
                <div className="text-center">
                  <section>
                    <strong className="font-medium">
                      신청한 후원자 목록 (
                      {
                        recruit.sponsorMeets.filter(
                          (user) => user.isSponsor && user.isApproved
                        ).length
                      }
                      /{recruit.maxSponsorRecruits})
                    </strong>

                    <ul className="flex flex-col gap-y-3 ">
                      {/* 승인된 유저는 언제나 보여주기 */}
                      <ApprovedUser recruit={recruit} isSponsor />

                      {/* 인원이 다 차지 않았으면 신청자 보여주기 */}
                      {recruit.maxSponsorRecruits >
                        recruit.sponsorMeets.filter(
                          (user) => user.isSponsor && user.isApproved
                        ).length && (
                        <NotApprovedUser
                          recruit={recruit}
                          profile={profile}
                          isSponsor
                        ></NotApprovedUser>
                      )}
                    </ul>
                  </section>

                  <br />

                  <section>
                    <strong className="font-medium">
                      신청한 아동 목록(
                      {
                        recruit.sponsorMeets.filter(
                          (user) => !user.isSponsor && user.isApproved
                        ).length
                      }
                      /{recruit.maxRecipientRecruits})
                    </strong>

                    <ul className="mt-2 flex flex-col gap-y-3">
                      {/* 승인된 유저는 언제나 보여주기 */}
                      <ApprovedUser recruit={recruit} isSponsor={false} />

                      {/* 인원이 다 차지 않았으면 신청자 보여주기 */}
                      {recruit.maxRecipientRecruits >
                        recruit.sponsorMeets.filter(
                          (user) => !user.isSponsor && user.isApproved
                        ).length && (
                        <NotApprovedUser
                          recruit={recruit}
                          profile={profile}
                          isSponsor={false}
                        ></NotApprovedUser>
                      )}
                    </ul>
                  </section>
                </div>
              </li>
            ))}
          </ul>
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
