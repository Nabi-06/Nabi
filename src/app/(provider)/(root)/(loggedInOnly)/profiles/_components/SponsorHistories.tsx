"use client";
import clientApi from "@/api/clientSide/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useEffect, useRef } from "react";
import CreateRecruitsReply from "../../../_components/CreateRecruitsReply";
import Replies from "../../../_components/Replies";

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

interface SponsorHistoriesProps {
  userId: string;
}

function SponsorHistories({ userId }: SponsorHistoriesProps) {
  const observerRef = useRef(null);

  //sponsorMeets에 userId 넣어서 recruitId들 가져오기
  const { data: recruitIds } = useQuery({
    queryKey: ["sponsorMeets", { userId }],
    queryFn: () => clientApi.sponsorMeets.getRecruitIdByUserId(userId!),
  });

  // recruitId로 게시글 3개씩 가져오기(인피니트 스크롤)
  const {
    data: recruitsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recruits", { recruitIds }],
    queryFn: ({ pageParam }) => {
      if (!recruitIds) return;
      return clientApi.recruits.getPaginatedRecruits(recruitIds, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return;
      if (!pages) return;
      return pages.length;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // 클린업
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, fetchNextPage, hasNextPage]);

  return (
    <div>
      <ul className="flex flex-col gap-y-3">
        {recruitsData?.pages.map((recruits) =>
          recruits?.map((recruit) => (
            <li key={recruit.recruitId}>
              <div className="w-full h-96 bg-indigo-300 border rounded-md p-5">
                <strong>{recruit.title}</strong>
                <p>{recruit.content}</p>
                <p className="mb-4">{dayjs(recruit.createdAt).fromNow()}</p>

                <CreateRecruitsReply recruitId={recruit.recruitId} />
                <Replies recruitId={recruit.recruitId} />
              </div>
            </li>
          ))
        )}
        <p ref={observerRef} className="text-transparent">
          3개 더 보여주기
        </p>
      </ul>
    </div>
  );
}

export default SponsorHistories;
