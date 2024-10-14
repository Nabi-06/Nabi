import clientApi from "@/api/clientSide/api";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";

interface RecruitDetailsProps {
  recruit: Tables<"recruits">;
}

function RecruitDetails({ recruit }: RecruitDetailsProps) {
  const authorId = useAuthStore((state) => state.currentUserId);

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { authorId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(authorId!),
    enabled: !!authorId,
  });

  return (
    <div>
      {authorId === recruit.authorId && (
        <Link
          href={`recruits/edit/${recruit.recruitId}`}
          className="border border-black text-sm absolute rounded-md py-1 px-2 right-5 top-5 bg-white"
        >
          수정하기
        </Link>
      )}

      <p className="font-bold text-lg mb-5">{recruit.title}</p>
      <p className="mb-5 text-base">{recruit.content}</p>
      <div className="grid grid-cols-2 gap-y-1 text-sm text-black/50">
        {profile?.role?.trim() === "sponsor" && (
          <span>봉사자 모집 인원 : {recruit.maxSponsorRecruits}</span>
        )}
        {profile?.role?.trim() === "recipient" && (
          <span>후원 아동 모집 인원 : {recruit.maxRecipientRecruits}</span>
        )}

        <span>
          모집 마감 날짜 : {dayjs(recruit.deadLineDate).format("YYYY-MM-DD")}
        </span>
        <span>
          자원 봉사 날짜 :{" "}
          {dayjs(recruit.volunteeringDate).format("YYYY-MM-DD")}
        </span>
        <span>지역 : {recruit.region}</span>
      </div>
    </div>
  );
}

export default RecruitDetails;
