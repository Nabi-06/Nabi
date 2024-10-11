"use client";
import clientApi from "@/api/clientSide/api";
import { RecruitsType } from "@/types/tables.type";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Link from "next/link";

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

function MyRecruits() {
  const userId = useAuthStore((state) => state.currentUserId);

  const { data: myRecruitsData } = useQuery({
    queryKey: ["recruits", { userId }],
    queryFn: () => clientApi.recruits.getSortedMyRecruits(userId!),
  });

  const myRecruits = myRecruitsData?.data as RecruitsType["Row"][];

  return (
    <article className="grow bg-gray-300 rounded-lg">
      <p className="mx-4 my-4 text-indigo-400 text-center ">최근 모집글</p>
      <ul className="flex flex-col gap-y-4 mx-4 my-4">
        {myRecruits?.map((recruit) => (
          <Link
            href={`/recruits/details?recruitId=${recruit.recruitId}`}
            className="px-2 py-1 flex flex-col bg-indigo-300 rounded-sm"
            key={recruit.recruitId}
          >
            <strong>{recruit.title}</strong>
            <p>{dayjs(recruit.createdAt).fromNow()}</p>
          </Link>
        ))}
      </ul>
    </article>
  );
}

export default MyRecruits;
