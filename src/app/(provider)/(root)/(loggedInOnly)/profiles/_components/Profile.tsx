"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import { useAuthStore } from "@/zustand/auth.store";
import { useProfileEditModalStore } from "@/zustand/profileEditModal.store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProfileSideBar from "./ProfileSideBar";
import SponsorHistories from "./SponsorHistories";

interface ProfileProps {
  userId: string;
}

function Profile({ userId: showUserId }: ProfileProps) {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const roleType = useAuthStore((state) => state.roleType);

  const setIsShowProfileEditModal = useProfileEditModalStore(
    (state) => state.setIsShowProfileEditModal
  );

  // 선택한 유저의 프로필
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfiles", { showUserId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(showUserId!),
  });

  const handleClickProfileEdit = () => {
    setIsShowProfileEditModal(true);
  };

  if (isLoading || !profile) return <span>프로필 로딩 중 ..</span>;

  return (
    <>
      <div className="flex gap-x-7">
        <div className="flex flex-col gap-y-5">
          <section className="border border-gray-100 w-[900px] h-[400px] bg-white rounded-lg overflow-hidden">
            {profile.bgImageUrl ? (
              <img
                src={profile.bgImageUrl}
                className="w-full h-64 border border-gray-100 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-yellow-200 border border-gray-100" />
            )}
            <div className="flex flex-row justify-between mx-10">
              <article className="h-full flex items-center gap-x-7">
                {profile.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    className="w-36 h-36 rounded-full -mt-12 object-cover"
                  />
                ) : (
                  <div className="w-36 aspect-square bg-white -mt-12  rounded-full overflow-hidden relative border-2 border-white">
                    <div className="w-10 bg-gray-300 aspect-square rounded-full absolute top-8 left-1/2 -translate-x-1/2" />
                    <div className="w-24 bg-gray-300 aspect-square rounded-full absolute top-20 left-1/2 -translate-x-1/2" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{profile.nickname}</span>
                  <span>
                    {profile.role === "sponsor" ? "후원자" : "후원아동"}
                  </span>
                </div>
              </article>
              <article className="flex gap-x-10 self-center -mt-5">
                {currentUserId === profile.userId ? (
                  <Button
                    size="md"
                    className="px-5 py-1.5"
                    intent="primary"
                    textIntent="primary"
                    onClick={handleClickProfileEdit}
                  >
                    프로필 수정
                  </Button>
                ) : (
                  <Link
                    href={`chats?showChatUserId=${profile.userId}`}
                    className="px-5 py-1.5 bg-yellow-300 rounded-sm text-black text-base font-bold"
                  >
                    채팅하기
                  </Link>
                )}
                {roleType === "sponsor" && profile.role === "recipient" ? (
                  <Link
                    href={`/regular-sponsorship?recipientId=${profile.userId}`}
                    className="px-5 py-1.5 bg-yellow-300 rounded-sm text-black text-base font-bold"
                  >
                    정기 후원
                  </Link>
                ) : null}
              </article>
            </div>
          </section>

          <SponsorHistories userId={showUserId!} />
        </div>

        <ProfileSideBar profile={profile!} />
      </div>

      <Link
        className="border border-black bg-gray-300"
        href="?userId=aabb8f18-c37f-4165-8a79-0ec527a88319"
      >
        (임시) 후원아동 프로필 이동
      </Link>
    </>
  );
}

export default Profile;
