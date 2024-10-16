import clientApi from "@/api/clientSide/api";
import alertCircleIcon from "@/public/icons/alertCircleIcon.png";
import calendarIcon from "@/public/icons/calendarIcon.png";
import mapPinIcon from "@/public/icons/mapPinIcon.png";
import messageIcon from "@/public/icons/messageIcon.png";
import userIcon from "@/public/icons/userIcon.png";
import usersIcon from "@/public/icons/usersIcon.png";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Image from "next/image";
import CreateRecruitsReply from "../../CreateRecruitsReply";
import Replies from "../../Replies";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s초",
    past: "%s 전",
    s: "방금",
    m: "1분",
    mm: "%d분",
    h: "1시간",
    hh: "%d시간",
    d: "하루",
    dd: "%d일",
    M: "1달",
    MM: "%d달",
    y: "1년",
    yy: "%d년",
  },
});

interface RecruitDetailsProps {
  recruit: Tables<"recruits">;
}

function RecruitDetails({ recruit }: RecruitDetailsProps) {
  const authorId = recruit.authorId;
  const recruitId = recruit.recruitId;
  const userId = useAuthStore((state) => state.currentUserId);

  const { data: userProfile } = useQuery({
    queryKey: ["userProfiles", { userId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(userId!),
  });

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { authorId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(authorId!),
  });

  const { data: replies } = useQuery({
    queryKey: ["replies", { recruitId }],
    queryFn: () => clientApi.replies.getRepliesByRecruitId(recruitId),
  });

  return (
    <div className="bg-white rounded-md p-7">
      <div className="flex justify-between gap-x-3">
        <div className="flex items-center gap-x-3 flex-shrink-0">
          {profile?.profileImageUrl ? (
            <>
              <img
                src={profile?.profileImageUrl}
                className="bg-[#F7F7F7] p-2 rounded-full w-16 h-16 object-cover"
              />
            </>
          ) : (
            <>
              <Image
                alt="userIcon"
                src={userIcon}
                className="bg-[#F7F7F7] p-2 rounded-full w-16 h-16 object-cover"
              />
            </>
          )}

          <div>
            <p className="font-bold text-lg">{profile?.nickname}</p>
            <p className="text-[16px] text-black/50">{profile?.email}</p>
          </div>
        </div>
        <div className="text-sm">{dayjs(recruit.createdAt).fromNow()}</div>
      </div>

      <p className="font-bold text-xl mt-10">{recruit.title}</p>
      <p className="mb-10 mt-10 text-base">{recruit.content}</p>

      <div className="flex gap-x-6 text-[13px] mb-10">
        <div className="flex gap-x-3 items-center">
          <Image
            alt="mapPinIcon"
            src={mapPinIcon}
            className="object-cover w-5"
          />
          <p>{recruit.region}</p>
        </div>
        <div className="flex gap-x-3 items-center">
          <Image
            alt="calendarIcon"
            src={calendarIcon}
            className="object-cover w-5"
          />
          <p>{dayjs(recruit.volunteeringDate).format("YYYY-DD-MM")}</p>
        </div>
        <div className="flex gap-x-3 items-center">
          <Image alt="usersIcon" src={usersIcon} className="object-cover w-5" />
          <p>
            {userProfile?.role === "recipient" ? (
              <>{recruit.maxSponsorRecruits}</>
            ) : (
              <>{recruit.maxRecipientRecruits}</>
            )}
            명
          </p>
        </div>
        <div className="rounded-md shadow-black/15 shadow-md flex p-2 ml-auto text-[13ps]">
          <Image
            alt="alertCircleIcon"
            src={alertCircleIcon}
            className="object-contain w-5"
          />

          <p> {} 후 모집이 마감됩니다</p>
        </div>
      </div>

      <div className="flex gap-x-6 text-[13px] mb-5">
        <div className="flex gap-x-3 items-center">
          <Image
            alt="messageIcon"
            src={messageIcon}
            className="object-cover w-5"
          />
          <p>댓글 ({replies?.length})</p>
        </div>
      </div>

      <CreateRecruitsReply recruitId={recruit.recruitId} />
      <Replies recruitId={recruit.recruitId} />
    </div>
  );
}

export default RecruitDetails;
