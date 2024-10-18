/* eslint-disable @next/next/no-img-element */
import { Tables } from "@/supabase/database.types";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Image from "next/image";
import Link from "next/link";
import ApplyButton from "./ApplyButton";
import RecruitCount from "./RecruitCount";
import UpdateRecruitButton from "./UpdateRecruitButton";

interface RecruitDetailsProps {
  recruit: Tables<"recruits"> & { userProfiles: Tables<"userProfiles"> };
}

function RecruitDetails({ recruit }: RecruitDetailsProps) {
  let createdAt =
    Math.abs(dayjs(recruit.createdAt).diff(dayjs(), "days")) + "일 전";
  if (+createdAt.split("일 전")[0] === 0)
    createdAt =
      Math.abs(dayjs(recruit.createdAt).diff(dayjs(), "hours")) + "시간 전";
  if (
    +createdAt.split("시간 전")[0] === 0 ||
    +createdAt.split("일 전")[0] === 0
  )
    createdAt =
      Math.abs(dayjs(recruit.createdAt).diff(dayjs(), "minutes")) + "분 전";

  return (
    <>
      <UpdateRecruitButton
        authorId={recruit.authorId}
        recruitId={recruit.recruitId}
      />
      <div className="flex items-center justify-between mt-4">
        <Link
          href={`/profiles?userId=${recruit.authorId}`}
          className="flex items-center gap-x-5 "
        >
          <Image
            width={300}
            height={300}
            src={
              recruit.userProfiles.profileImageUrl ||
              "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/BigDefaultProfile.png?t=2024-10-17T21%3A23%3A00.314Z"
            }
            alt="profile image"
            className="w-16 rounded-full aspect-square object-cover"
          />
          <div className="flex flex-col">
            <span className="font-extrabold">
              {recruit.userProfiles.nickname}
            </span>
            <span className="font-light text-xs">
              {recruit.userProfiles.email}
            </span>
          </div>
        </Link>
        <span className="font-normal text-xs">{createdAt}</span>
      </div>
      <article className="flex flex-col gap-y-3">
        <ApplyButton
          recruitId={recruit.recruitId}
          authorId={recruit.authorId}
        />
        <h2 className="font-bold text-lg">{recruit.title}</h2>
        <p className="font-normal text-sm mb-5">{recruit.content}</p>
        <div className="flex gap-x-4">
          <div className="flex gap-x-2 items-center group relative">
            <Image
              width={150}
              height={150}
              className="w-4 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Location.png?t=2024-10-15T19%3A39%3A08.745Z"
              alt="location icon"
            />
            <span className="font-light text-xs">{recruit.region}</span>
            <span className="whitespace-nowrap absolute top-6 left-3 font-normal text-xs invisible group-hover:visible">
              집합 장소
            </span>
          </div>
          <div className="flex gap-x-2 items-center group relative">
            <Image
              width={150}
              height={150}
              className="w-4 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Date.png"
              alt="date icon"
            />
            <span className="font-light text-xs">
              {dayjs(recruit.volunteeringDate)
                .locale("ko")
                .format("YYYY-MM-DD (ddd) HH:mm")}
            </span>
            <span className="whitespace-nowrap absolute top-6 left-1/3 font-normal text-xs invisible group-hover:visible">
              봉사활동 일시
            </span>
          </div>
          <RecruitCount recruit={recruit} />
        </div>
      </article>
    </>
  );
}

export default RecruitDetails;
